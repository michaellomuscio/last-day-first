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
    intent: { active: 50, together: 25, high: 25, hw: 30 },
    transfer: '', goals: [], units: [], lessons: [], assess: [],
    syllabus: { about: '', materials: '', weights: { major: 50, minor: 25, homework: 15, participation: 10 }, late: 'window', retake: 'majors', contact: '', help: '', honesty: '' },
    game: { warm: false, seen: {}, banners: {} }, snaps: [],
  };
}
/* Fills in anything an older saved course lacks. */
function migrate(c) {
  const d = newCourse({});
  for (const k in d) if (c[k] == null) c[k] = d[k];
  for (const k in d.school) if (c.school[k] == null) c.school[k] = d.school[k];
  for (const k in d.intent) if (c.intent[k] == null) c.intent[k] = d.intent[k];
  for (const k in d.syllabus) if (c.syllabus[k] == null) c.syllabus[k] = d.syllabus[k];
  for (const k in d.game) if (c.game[k] == null) c.game[k] = d.game[k];
  c.lessons.forEach((l) => { l.blocks = l.blocks || []; l.days = l.days || 1; });
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
  const e = { move: m, mix: m.mix, g: m.g, th: m.th, pu: m.pu, lv: m.lv, show: m.show || 0, fb: m.fb || 'none', talk: m.talk || 0, setup: m.setup || 0, cleanup: m.cleanup || 0, arr: m.arr || 'rows', retr: !!m.retr, think: !!m.think };
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
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s.start || '') || !/^\d{4}-\d{2}-\d{2}$/.test(s.end || '') || s.end < s.start) return out;
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
