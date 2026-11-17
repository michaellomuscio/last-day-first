/* The observer. Reads a lesson, a unit or a course the way someone with a clipboard would, and returns a label:
   minutes by what students are doing, who is doing the thinking, and so on. Labels add, so a unit is the sum of its days. */

const blankLabel = () => ({ days: 0, time: 0, planned: 0, overhead: 0, total: 0, over: 0, learn: 0, byCode: {}, fam: {}, icap: { P: 0, A: 0, C: 0, I: 0, N: 0 }, thinker: {}, group: {}, purpose: {}, level: {},
  show: 0, fbNow: 0, fbLater: 0, talk: 0, retr: 0, orphan: 0, stretch: { min: 0, fam: 'take' }, goals: {} });

const dominantFam = (mix) => { const f = {}; for (const k in mix) f[CODES[k].fam] = (f[CODES[k].fam] || 0) + mix[k]; let best = 'take', bv = -1; for (const k in f) if (f[k] > bv) { bv = f[k]; best = k; } return best; };
/* Which of the four ways of engaging a code counts as, given how the block is run. */
function icapOf(code, e) {
  /* Listening, reading or watching with a task to do counts as working with it; without one it is receiving (after Chi and Wylie). */
  if ((code === 'listen' || code === 'read' || code === 'watch') && e.think) return { A: 1 };
  /* In a discussion a student is either adding to what others said or following it closely; counted half and half. */
  if (code === 'discuss') return { I: 0.5, A: 0.5 };
  if ((code === 'assess' || code === 'practice' || code === 'qa') && e.lv >= 3) return { C: 1 };
  const o = {}; o[CODES[code].icap] = 1; return o;
}

/* Minutes a plan forgets: settling at the bell, getting into groups, handing out materials, cleaning up, packing up.
   These are assumptions (no published figures exist for planned transitions) and scale with the teacher's pace setting. */
function lessonOverhead(c, lesson) {
  const pace = c.school.pace || 1, items = [], bl = lesson.blocks; let prev = null;
  const r = (x) => Math.round(x * pace * 2) / 2;
  if (bl.length && MOVE_BY[bl[0].move] && MOVE_BY[bl[0].move].grp !== 'routine') items.push({ before: 0, min: r(2), what: 'Settling in' });
  bl.forEach((b, i) => {
    const e = blockEff(b); let su = e.setup;
    if (prev && prev.arr === e.arr && su <= 1) su = 0;
    if (r(su) > 0) items.push({ before: i, min: r(su), what: 'Getting into ' + e.move.name.toLowerCase() });
    if (r(e.cleanup) > 0 && !bl.slice(i + 1).some((x) => x.move === 'cleanup')) items.push({ before: i + 1, min: r(e.cleanup), what: 'Cleaning up' });
    prev = e;
  });
  if (bl.length && bl[bl.length - 1].move !== 'cleanup') items.push({ before: bl.length, min: r(1), what: 'Packing up' });
  return items.filter((x) => x.min > 0);
}

function lessonLabel(c, lesson) {
  const L = blankLabel(), oh = lessonOverhead(c, lesson), segs = [], nStu = Math.max(2, c.school.classSize || 18); let t = 0, run = { fam: null, min: 0 };
  const bump = (fam, m) => { if (run.fam === fam) run.min += m; else run = { fam, min: m }; if (run.min > L.stretch.min && fam !== 'over') L.stretch = { min: run.min, fam }; };
  const over = (i) => oh.filter((x) => x.before === i).forEach((x) => { segs.push({ t0: t, t1: t + x.min, over: true, what: x.what, arr: null, mix: { admin: 1 } }); t += x.min; L.byCode.admin = (L.byCode.admin || 0) + x.min; L.icap.N += x.min; L.overhead += x.min; bump('over', x.min); });
  lesson.blocks.forEach((b, i) => {
    over(i);
    const e = blockEff(b), m = b.min; let learn = 0;
    for (const code in e.mix) {
      const v = m * e.mix[code]; L.byCode[code] = (L.byCode[code] || 0) + v;
      const ic = icapOf(code, e); for (const k in ic) L.icap[k] += v * ic[k];
      if (CODES[code].fam !== 'over') learn += v;
    }
    L.thinker[e.th] = (L.thinker[e.th] || 0) + learn; L.group[e.g] = (L.group[e.g] || 0) + learn;
    L.purpose[e.pu] = (L.purpose[e.pu] || 0) + learn; if (e.pu !== 'N') L.level[e.lv] = (L.level[e.lv] || 0) + learn;
    L.show += m * e.show; if (e.fb === 'now') L.fbNow += m * e.show; else if (e.fb === 'later') L.fbLater += m * e.show;
    /* A typical student's speaking time: their share of pair or group talk, plus an equal share of the time students hold the floor. A one-minute quiz is not counted as bringing learning back. */
    L.talk += m * (e.talk + e.floor / nStu); if (e.retr && m >= 3) L.retr++;
    L.planned += m;
    const gs = (b.goals || []).filter((g) => goalOf(c, g));
    if (e.pu !== 'N' && !gs.length) L.orphan += learn;
    for (const g of gs) { const G = L.goals[g] || (L.goals[g] = { min: 0, A: 0, M: 0, T: 0, retr: 0, show: 0, fb: 0, lv: 0 }), v = learn / gs.length; G.min += v; if (e.pu !== 'N') G[e.pu] += v; if (e.retr && m >= 3) G.retr++; G.show += m * e.show / gs.length; if (e.fb === 'now') G.fb += m * e.show / gs.length; G.lv = Math.max(G.lv, e.lv); }
    segs.push({ t0: t, t1: t + m, block: b.id, i, arr: e.arr, mix: e.mix, e }); t += m; bump(dominantFam(e.mix), m);
  });
  over(lesson.blocks.length);
  for (const code in L.byCode) L.fam[CODES[code].fam] = (L.fam[CODES[code].fam] || 0) + L.byCode[code];
  L.total = t; L.learn = t - (L.fam.over || 0); L.period = c.school.period; L.over = t - c.school.period; L.days = 1; L.time = c.school.period; L.segs = segs;
  return L;
}

/* Adds label b into a, k times over. */
function addLabel(a, b, k) {
  k = k == null ? 1 : k;
  for (const f of ['days', 'time', 'planned', 'overhead', 'total', 'learn', 'show', 'fbNow', 'fbLater', 'talk', 'retr', 'orphan']) a[f] += (b[f] || 0) * k;
  for (const f of ['byCode', 'fam', 'icap', 'thinker', 'group', 'purpose', 'level']) addInto(a[f], b[f], k);
  if (b.over > 0) a.over += b.over * k;
  if (b.stretch.min > a.stretch.min) a.stretch = b.stretch;
  for (const g in b.goals) { const G = a.goals[g] || (a.goals[g] = { min: 0, A: 0, M: 0, T: 0, retr: 0, show: 0, fb: 0, lv: 0 }), H = b.goals[g]; for (const f of ['min', 'A', 'M', 'T', 'retr', 'show', 'fb']) G[f] += H[f] * k; G.lv = Math.max(G.lv, H.lv); }
  return a;
}
/* The handful of shares the report and the intent sliders talk about. All are 0..1. */
function shares(L) {
  const t = L.total || 1, ln = L.learn || 1;
  return { active: (L.icap.A + L.icap.C + L.icap.I) / t, receive: L.icap.P / t, creating: (L.icap.C + L.icap.I) / t, overhead: (L.fam.over || 0) / t,
    together: ((L.group.pair || 0) + (L.group.group || 0)) / ln, alone: (L.group.alone || 0) / ln, whole: (L.group.class || 0) / ln,
    high: ((L.level[3] || 0) + (L.level[4] || 0)) / (sum(Object.values(L.level)) || 1), students: ((L.thinker.together || 0) + (L.thinker.alone || 0)) / ln,
    show: L.show / t, fed: L.show > 0 ? L.fbNow / L.show : 0 };
}

/* Homework across a set of lessons: minutes a night, what it is for, who can do it. */
function homeworkStats(c, lessons) {
  const H = { nights: 0, days: 0, total: 0, max: 0, purpose: {}, kind: {}, fb: {}, graded: {}, device: 0, list: [] };
  for (const l of lessons) {
    const d = l.days || 1; H.days += d;
    if (!l.hw || !(l.hw.min > 0)) { for (let k = 0; k < d; k++) H.list.push(0); continue; }
    const h = l.hw; H.nights += d; H.total += h.min * d; H.max = Math.max(H.max, h.min);
    H.purpose[h.purpose] = (H.purpose[h.purpose] || 0) + h.min * d; H.kind[h.kind] = (H.kind[h.kind] || 0) + h.min * d; H.fb[h.fb] = (H.fb[h.fb] || 0) + h.min * d; H.graded[h.graded] = (H.graded[h.graded] || 0) + h.min * d;
    if (h.device) H.device += h.min * d;
    for (let k = 0; k < d; k++) H.list.push(h.min);
  }
  H.avg = H.days ? H.total / H.days : 0; H.avgNight = H.nights ? H.total / H.nights : 0;
  return H;
}

function unitLabel(c, uid) {
  const L = blankLabel(), ls = unitLessons(c, uid), u = unitOf(c, uid);
  for (const l of ls) addLabel(L, lessonLabel(c, l), l.days || 1);
  L.unit = uid; L.budget = u ? u.days : 0; L.hw = homeworkStats(c, ls); L.period = c.school.period;
  L.overDays = sum(ls.map((l) => (lessonLabel(c, l).over > 0.5 ? l.days || 1 : 0)));
  return L;
}
function courseLabel(c) {
  const L = blankLabel(); L.overDays = 0;
  for (const u of c.units) { const U = unitLabel(c, u.id); addLabel(L, U, 1); L.overDays += U.overDays; }
  L.hw = homeworkStats(c, c.units.reduce((a, u) => a.concat(unitLessons(c, u.id)), [])); L.period = c.school.period;
  L.available = availableDays(c); L.budget = budgetedDays(c);
  return L;
}

/* The course as a sequence of class days, in unit order: what the simulation and the stress test walk through.
   A unit's unplanned days appear with lesson: null. */
function courseDays(c) {
  const out = [], dates = meetingDates(c); let i = 0;
  for (const u of c.units) {
    let used = 0;
    for (const l of unitLessons(c, u.id)) { const L = lessonLabel(c, l); for (let k = 0; k < (l.days || 1); k++) { out.push({ i, date: dates[i] || null, unit: u.id, lesson: l, label: L, hw: l.hw && l.hw.min > 0 ? l.hw : null }); i++; used++; } }
    for (; used < (u.days || 0); used++) { out.push({ i, date: dates[i] || null, unit: u.id, lesson: null, label: null, hw: null }); i++; }
  }
  return out;
}
/* For each goal: where it is taught, practised, assessed and sent home. Checks and the simulation both read this. */
function goalMap(c) {
  const M = {}; c.goals.forEach((g) => (M[g.id] = { goal: g, min: 0, A: 0, M: 0, T: 0, retr: 0, show: 0, fb: 0, lv: 0, days: [], hwMin: 0, hwDays: [], assess: [] }));
  courseDays(c).forEach((d) => {
    if (!d.lesson) return;
    for (const g in d.label.goals) { const G = M[g], H = d.label.goals[g]; if (!G) continue; for (const f of ['min', 'A', 'M', 'T', 'retr', 'show', 'fb']) G[f] += H[f]; G.lv = Math.max(G.lv, H.lv); G.days.push(d.i); }
    if (d.hw) for (const g of d.hw.goals || []) if (M[g]) { M[g].hwMin += d.hw.min / d.hw.goals.length; M[g].hwDays.push(d.i); }
  });
  c.assess.forEach((a) => (a.goals || []).forEach((g) => { if (M[g]) M[g].assess.push(a.id); }));
  return M;
}
/* How well a method can show a kind of learning (after Stiggins and Chappuis): 2 strong, 1 workable, 0 poor. */
const METHOD_FIT = { knowledge: { selected: 2, written: 2, performance: 0, personal: 1 }, reasoning: { selected: 1, written: 2, performance: 2, personal: 2 }, skill: { selected: 0, written: 0, performance: 2, personal: 2 }, product: { selected: 0, written: 1, performance: 2, personal: 0 } };
const methodFit = (a) => (a.targets && a.targets.length ? Math.min.apply(null, a.targets.map((t) => (METHOD_FIT[t] || {})[a.method])) : 1);
