/* The course: one plain object that holds everything a teacher builds. It is what gets saved, exported and analyzed. */
const COURSE_V = 1;
const newId = (c, p) => p + (c.seq++);

/* Usual US days off for a school year starting in `y`. Editable in the Calendar; a starting point, not a district calendar. */
function defaultDaysOff(y) {
  const out = [], add = (iso) => out.push(iso), range = (a, b) => { for (let d = dateOf(a), e = dateOf(b); d <= e; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) if (d.getDay() % 6) add(isoOf(d)); };
  const nth = (yr, mo, dow, n) => { const d = new Date(yr, mo, 1); let k = 0; while (true) { if (d.getDay() === dow && ++k === n) return isoOf(d); d.setDate(d.getDate() + 1); } };
  const lastMon = (yr, mo) => { const d = new Date(yr, mo + 1, 0); while (d.getDay() !== 1) d.setDate(d.getDate() - 1); return isoOf(d); };
  add(nth(y, 8, 1, 1));                                  // Labor Day
  const tg = dateOf(nth(y, 10, 4, 4)); range(isoOf(new Date(tg.getFullYear(), tg.getMonth(), tg.getDate() - 1)), isoOf(new Date(tg.getFullYear(), tg.getMonth(), tg.getDate() + 1)));
  range(y + '-12-21', (y + 1) + '-01-01');               // winter break
  add(nth(y + 1, 0, 1, 3)); add(nth(y + 1, 1, 1, 3));    // MLK Day, Presidents Day
  const sb = dateOf(nth(y + 1, 3, 1, 1)); range(isoOf(sb), isoOf(new Date(sb.getFullYear(), sb.getMonth(), sb.getDate() + 4)));
  add(lastMon(y + 1, 4));                                // Memorial Day
  return out.sort();
}

function newCourse(o) {
  o = o || {}; const y = o.year || 2026;
  return {
    v: COURSE_V, title: o.title || 'My course', subject: o.subject || 'other', grade: o.grade || '', teacher: o.teacher || '', seq: 1,
    school: { period: o.period || 50, perWeek: o.perWeek || 5, start: y + '-08-24', end: (y + 1) + '-06-04', off: defaultDaysOff(y), lost: 8, pace: 1, classSize: 18 },
    /* What the teacher says they want. The report compares the design to this, not to anyone else's idea of good teaching. */
    intent: { active: 50, together: 20, high: 20, hw: 30 },
    transfer: '', goals: [], units: [], lessons: [], assess: [],
    syllabus: { about: '', materials: '', weights: { major: 50, minor: 25, homework: 15, participation: 10 }, late: 'window', retake: 'majors', contact: '', help: '', honesty: '' },
    game: { warm: false, seen: {}, banners: {} }, snaps: [],
  };
}
/* Makes any course object safe to use: fills in what an older save lacks, and refuses or repairs anything a hand-edited or
   hostile file could carry (ids go into the page as attributes, so they must be plain; every choice must be one the tool offers;
   every number must be a sane number). Throws if the file cannot be a course. */
const ID_OK = /^[A-Za-z][A-Za-z0-9_-]{0,23}$/;
function migrate(c) {
  if (!c || typeof c !== 'object' || Array.isArray(c)) throw new Error('not a course');
  const d = newCourse({}), obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {}), arr = (v) => (Array.isArray(v) ? v : []);
  const str = (v, n) => (v == null ? '' : String(v)).slice(0, n || 4000), has = (tbl, id) => tbl.some((x) => x[0] === id);
  const num = (v, lo, hi, dflt) => { v = +v; return isFinite(v) ? clamp(v, lo, hi) : dflt; }, int = (v, lo, hi, dflt) => Math.round(num(v, lo, hi, dflt));
  const opt = (v, tbl, dflt) => (has(tbl, v) ? v : dflt), iso = (v, dflt) => (/^\d{4}-\d{2}-\d{2}$/.test(v || '') ? v : dflt);
  for (const k of ['school', 'intent', 'syllabus', 'game']) { c[k] = obj(c[k]); for (const f in d[k]) if (c[k][f] == null) c[k][f] = d[k][f]; }
  for (const k of ['goals', 'units', 'lessons', 'assess', 'snaps']) c[k] = arr(c[k]).filter((x) => x && typeof x === 'object');
  const all = c.goals.concat(c.units, c.lessons, c.assess), seen = new Set();
  for (const x of all) { if (!ID_OK.test(String(x.id)) || seen.has(x.id)) throw new Error('bad id'); seen.add(x.id); }
  const gid = new Set(c.goals.map((g) => g.id)), uid = new Set(c.units.map((u) => u.id)), aid = new Set(c.assess.map((a) => a.id)), goals = (v, self) => arr(v).filter((g) => gid.has(g) && g !== self);
  c.v = COURSE_V; c.title = str(c.title, 200); c.subject = opt(c.subject, SUBJECTS, 'other'); c.grade = str(c.grade, 60); c.teacher = str(c.teacher, 120); c.transfer = str(c.transfer);
  const S = c.school; S.period = int(S.period, 10, 240, 50); S.perWeek = [5, 4, 3, 2.5, 2, 1].includes(+S.perWeek) ? +S.perWeek : 5; S.start = iso(S.start, d.school.start); S.end = iso(S.end, d.school.end);
  S.off = arr(S.off).filter((x) => /^\d{4}-\d{2}-\d{2}$/.test(x)).slice(0, 400); S.lost = int(S.lost, 0, 80, 8); S.pace = [0.5, 1, 1.5].includes(+S.pace) ? +S.pace : 1; S.classSize = int(S.classSize, 6, 40, 18);
  const I = c.intent; I.active = int(I.active, 0, 100, 50); I.together = int(I.together, 0, 100, 20); I.high = int(I.high, 0, 100, 20); I.hw = int(I.hw, 0, 240, 30);
  for (const g of c.goals) { g.text = str(g.text); g.kind = opt(g.kind, GOAL_KINDS, 'knowledge'); g.priority = opt(g.priority, PRIORITIES, 'important'); g.level = int(g.level, 1, 4, 2); g.unit = uid.has(g.unit) ? g.unit : null; g.after = goals(g.after, g.id); }
  for (const u of c.units) { u.title = str(u.title, 200); u.days = int(u.days, 0, 400, 10); u.questions = arr(u.questions).map((q) => str(q, 600)).slice(0, 12); u.source = opt(u.source, SOURCES, 'adopt'); u.sourceNote = str(u.sourceNote); u.note = str(u.note); }
  c.assess = c.assess.filter((a) => uid.has(a.unit));
  for (const a of c.assess) {
    a.title = str(a.title, 200); a.kind = a.kind === 'major' ? 'major' : 'minor'; a.method = opt(a.method, METHODS, 'selected'); a.targets = arr(a.targets).filter((t) => has(TARGETS, t)); a.level = int(a.level, 1, 4, 2); a.goals = goals(a.goals);
    a.min = int(a.min, 0, 600, 0); a.out = int(a.out, 0, 3000, 0); a.fb = opt(a.fb, FEEDBACKS, 'score'); a.back = int(a.back, 0, 60, 2); a.rubric = opt(a.rubric, RUBRICS, 'none'); a.retake = !!a.retake;
    for (const f of ['role', 'audience', 'product', 'note']) a[f] = str(a[f]);
  }
  const live = new Set(c.assess.map((a) => a.id));
  c.lessons = c.lessons.filter((l) => uid.has(l.unit));
  for (const l of c.lessons) {
    l.title = str(l.title, 200); l.days = int(l.days, 1, 60, 1); l.note = str(l.note); l.blocks = arr(l.blocks).filter((b) => b && typeof b === 'object');
    for (const b of l.blocks) {
      if (!ID_OK.test(String(b.id))) throw new Error('bad id');
      b.move = MOVE_BY[b.move] ? b.move : 'lecture'; b.min = int(b.min, 1, 600, 10); b.goals = goals(b.goals); b.note = str(b.note);
      const sw = {}, src = obj(b.sw); for (const s of MOVE_BY[b.move].sw || []) if (s.opts.some((o) => o.id === src[s.id])) sw[s.id] = src[s.id]; b.sw = sw;
      if (b.lv != null) { b.lv = int(b.lv, 1, 4, 0); if (!b.lv) delete b.lv; } if (!['A', 'M', 'T'].includes(b.pu)) delete b.pu; if (!live.has(b.assess)) delete b.assess;
    }
    if (l.hw && typeof l.hw === 'object') { const h = l.hw; h.purpose = opt(h.purpose, HW_PURPOSES, 'practice'); h.kind = opt(h.kind, HW_KINDS, 'problems'); h.fb = opt(h.fb, HW_FEEDBACK, 'none'); h.graded = opt(h.graded, HW_GRADING, 'no'); h.min = int(h.min, 0, 600, 20); h.goals = goals(h.goals); h.device = !!h.device; } else l.hw = null;
  }
  const Y = c.syllabus; for (const f of ['about', 'materials', 'contact', 'help', 'honesty']) Y[f] = str(Y[f]); for (const f of ['late', 'retake']) Y[f] = /^[a-z]{1,20}$/.test(Y[f]) ? Y[f] : d.syllabus[f];
  Y.weights = obj(Y.weights); for (const f of ['major', 'minor', 'homework', 'participation']) Y.weights[f] = int(Y.weights[f], 0, 100, d.syllabus.weights[f]);
  const G = c.game; G.seen = obj(G.seen); G.banners = obj(G.banners); if (G.base) G.base = obj(G.base);
  c.snaps = c.snaps.slice(0, 8).map((s) => ({ name: str(s.name, 60), days: num(s.days, 0, 1e4, 0), active: num(s.active, 0, 1, 0), together: num(s.together, 0, 1, 0), high: num(s.high, 0, 1, 0), hw: num(s.hw, 0, 1e4, 0), serious: int(s.serious, 0, 1e4, 0), grades: arr(s.grades).map((g) => str(g, 3)).slice(0, 8) }));
  /* New ids must never repeat an old one, whatever the file says its counter is. */
  let mx = 0; const bump = (id) => { const m = /(\d+)$/.exec(id); if (m) mx = Math.max(mx, +m[1]); }; all.forEach((x) => bump(x.id)); c.lessons.forEach((l) => l.blocks.forEach((b) => bump(b.id)));
  c.seq = Math.max(int(c.seq, 1, 1e9, 1), mx + 1);
  delete c.demo; delete c.warm;
  return c;
}

/* ---------- finding things ---------- */
const byId = (list, id) => list.find((x) => x.id === id) || null;
const unitOf = (c, id) => byId(c.units, id), goalOf = (c, id) => byId(c.goals, id), lessonOf = (c, id) => byId(c.lessons, id), assessOf = (c, id) => byId(c.assess, id);
const unitLessons = (c, uid) => c.lessons.filter((l) => l.unit === uid);
const unitAssess = (c, uid) => c.assess.filter((a) => a.unit === uid);
const unitGoals = (c, uid) => c.goals.filter((g) => g.unit === uid);
const plannedDays = (c, uid) => sum(unitLessons(c, uid).map((l) => l.days || 1));

/* ---------- making things ---------- */
function addGoal(c, o) { const g = Object.assign({ id: newId(c, 'G'), text: '', kind: 'understanding', priority: 'important', level: 2, unit: null, after: [] }, o || {}); c.goals.push(g); return g; }
function addUnit(c, o) { const u = Object.assign({ id: newId(c, 'U'), title: 'New unit', days: 15, questions: [], source: 'adopt', sourceNote: '', note: '' }, o || {}); c.units.push(u); return u; }
function addLesson(c, uid, o) { const l = Object.assign({ id: newId(c, 'L'), unit: uid, title: 'New lesson', days: 1, blocks: [], hw: null, note: '' }, o || {}); c.lessons.push(l); return l; }
function addBlock(c, lesson, moveId, min, at) {
  const b = { id: newId(c, 'B'), move: moveId, min: Math.max(1, Math.round(min || 10)), goals: [], sw: {}, note: '' };
  if (at == null || at >= lesson.blocks.length) lesson.blocks.push(b); else lesson.blocks.splice(at, 0, b);
  return b;
}
function addAssess(c, uid, o) { const a = Object.assign({ id: newId(c, 'A'), unit: uid, title: 'New assessment', kind: 'minor', method: 'selected', targets: ['knowledge'], level: 2, goals: [], min: 15, out: 0, fb: 'score', back: 2, rubric: 'none', retake: false, role: '', audience: '', product: '', note: '' }, o || {}); c.assess.push(a); return a; }
const newHomework = () => ({ purpose: 'practice', kind: 'problems', min: 20, goals: [], fb: 'check', graded: 'completion', device: false });
/* Replaces a lesson's blocks with a ready-made shape, scaled to the period. Keeps about a tenth of the period free for setup. */
function applyPattern(c, lesson, pid) {
  const p = PATTERNS.find((x) => x.id === pid); if (!p) return;
  lesson.blocks = [];
  for (const b of p.blocks) addBlock(c, lesson, b[0], Math.max(2, Math.round(b[1] * c.school.period * 0.92)));
}
function removeUnit(c, uid) { c.lessons = c.lessons.filter((l) => l.unit !== uid); c.assess = c.assess.filter((a) => a.unit !== uid); c.goals.forEach((g) => { if (g.unit === uid) g.unit = null; }); c.units = c.units.filter((u) => u.id !== uid); }
function removeGoal(c, gid) {
  c.goals = c.goals.filter((g) => g.id !== gid); c.goals.forEach((g) => (g.after = g.after.filter((x) => x !== gid)));
  c.lessons.forEach((l) => { l.blocks.forEach((b) => (b.goals = b.goals.filter((x) => x !== gid))); if (l.hw) l.hw.goals = l.hw.goals.filter((x) => x !== gid); });
  c.assess.forEach((a) => (a.goals = a.goals.filter((x) => x !== gid)));
}
function removeAssess(c, aid) { c.assess = c.assess.filter((a) => a.id !== aid); c.lessons.forEach((l) => l.blocks.forEach((b) => { if (b.assess === aid) delete b.assess; })); }

/* A block as it will actually run: the move, with the teacher's switches and overrides applied. */
function blockEff(b) {
  const m = MOVE_BY[b.move] || MOVE_BY.lecture;
  const e = { move: m, mix: m.mix, g: m.g, th: m.th, pu: m.pu, lv: m.lv, show: m.show || 0, fb: m.fb || 'none', talk: m.talk || 0, floor: m.floor || 0, setup: m.setup || 0, cleanup: m.cleanup || 0, arr: m.arr || 'rows', retr: !!m.retr, think: !!m.think };
  for (const s of m.sw || []) {
    const o = s.opts.find((x) => x.id === (b.sw && b.sw[s.id])) || s.opts[0];
    for (const k in o) if (k !== 'id' && k !== 'label') e[k] = o[k];
  }
  if (b.lv) e.lv = b.lv; if (b.pu) e.pu = b.pu;
  return e;
}

/* ---------- the calendar ---------- */
/* Every date the class meets, in order. perWeek 5 = daily, 4 = Mon-Thu, 3 = Mon/Wed/Fri, 2 = Tue/Thu, 2.5 = every other school day. */
function meetingDates(c) {
  const s = c.school, off = new Set(s.off), out = []; let k = 0;
  /* A half-typed date (year 0202, or an end in 9999) must not make the page walk through centuries of days. */
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s.start || '') || !/^\d{4}-\d{2}-\d{2}$/.test(s.end || '') || s.end < s.start || s.start < '2000-01-01' || s.end > '2100-12-31' || (dateOf(s.end) - dateOf(s.start)) / DAY_MS > 800) return out;
  const days = { 5: [1, 2, 3, 4, 5], 4: [1, 2, 3, 4], 3: [1, 3, 5], 2: [2, 4], 1: [3] }[s.perWeek];
  for (let d = dateOf(s.start), end = dateOf(s.end); d <= end; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) {
    const iso = isoOf(d), dow = d.getDay();
    if (dow === 0 || dow === 6 || off.has(iso)) continue;
    if (days ? days.includes(dow) : k++ % 2 === 0) out.push(iso);
  }
  return out;
}
/* Class meetings you can plan for: the calendar, less the days that vanish to assemblies, drills, testing and weather. */
const availableDays = (c) => Math.max(0, meetingDates(c).length - (c.school.lost || 0));
const budgetedDays = (c) => sum(c.units.map((u) => u.days || 0));
/* Where each unit falls on the calendar if units run in order. */
function unitSpans(c) {
  const dates = meetingDates(c), out = []; let i = 0;
  for (const u of c.units) { const a = i, b = i + Math.max(0, u.days || 0) - 1; out.push({ unit: u.id, from: a, to: b, start: dates[a] || null, end: dates[Math.min(b, dates.length - 1)] || null, fits: b < dates.length }); i = b + 1; }
  return out;
}
