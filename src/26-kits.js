/* Subject starter kits: optional scaffolds a teacher can load and then rewrite into their own course.
   A kit refers to its goals by short keys; kitToCourse turns it into a real course with ids. See src/kits/. */
const KITS = [];
function kitToCourse(kit, base) {
  const c = base || newCourse({}); c.title = kit.course; c.subject = kit.subject; c.grade = kit.grade || ''; c.transfer = kit.transfer || '';
  c.goals = []; c.units = []; c.lessons = []; c.assess = [];
  const key = {}, scale = c.school.period / 50, later = [];
  for (const u of kit.units) {
    const U = addUnit(c, { title: u.title, days: u.days, questions: (u.questions || []).slice(), source: u.source || 'adopt' });
    for (const g of u.goals || []) { const G = addGoal(c, { text: g.text, kind: g.kind, priority: g.priority, level: g.level, unit: U.id }); key[g.key] = G.id; later.push([G, g.after || []]); }
    const ids = (ks) => (ks || []).map((k) => key[k]).filter(Boolean);
    const mk = (a, kind) => addAssess(c, U.id, Object.assign({}, a, { kind, goals: ids(a.goals), min: Math.round((a.min || 0) * (kind === 'major' ? scale : 1)) }));
    if (u.major) mk(u.major, 'major');
    for (const a of u.minors || []) mk(a, 'minor');
    for (const l of u.lessons || []) {
      const L = addLesson(c, U.id, { title: l.title, days: l.days || 1, hw: l.hw ? Object.assign(newHomework(), l.hw, { goals: ids(l.hw.goals) }) : null });
      for (const b of l.blocks || []) { const B = addBlock(c, L, b[0], Math.max(1, Math.round(b[1] * scale))); B.goals = ids(b[2]); if (b[3]) B.sw = Object.assign({}, b[3]); }
    }
  }
  for (const [G, after] of later) G.after = after.map((k) => key[k]).filter((id) => id && id !== G.id);
  return c;
}
/* Returns a list of problems with a kit; an empty list means it is well formed. */
function validateKit(kit) {
  const bad = [], keys = new Set(), has = (tbl, id) => tbl.some((x) => x[0] === id), say = (m) => bad.push(kit.id + ': ' + m);
  for (const f of ['id', 'subject', 'course', 'blurb', 'transfer']) if (!kit[f]) say('missing ' + f);
  if (!has(SUBJECTS, kit.subject)) say('unknown subject ' + kit.subject);
  if (!Array.isArray(kit.units) || kit.units.length < 4) say('needs at least four units');
  for (const u of kit.units || []) for (const g of u.goals || []) { if (keys.has(g.key)) say('duplicate goal key ' + g.key); keys.add(g.key); }
  const chk = (ks, where) => (ks || []).forEach((k) => { if (!keys.has(k)) say(where + ' refers to unknown goal ' + k); });
  for (const u of kit.units || []) {
    if (!u.title || !(u.days > 0)) say('unit needs a title and days');
    if (!(u.questions || []).length) say(u.title + ' has no questions');
    if ((u.goals || []).length < 2) say(u.title + ' needs at least two goals');
    for (const g of u.goals || []) {
      if (!g.text || !has(GOAL_KINDS, g.kind) || !has(PRIORITIES, g.priority) || !(g.level >= 1 && g.level <= 4)) say('bad goal ' + g.key);
      chk(g.after, 'goal ' + g.key);
    }
    for (const a of [u.major].concat(u.minors || []).filter(Boolean)) {
      if (!a.title || !has(METHODS, a.method) || !(a.targets || []).length || (a.targets || []).some((t) => !has(TARGETS, t)) || !(a.level >= 1 && a.level <= 4)) say('bad assessment ' + a.title);
      if (a.fb && !has(FEEDBACKS, a.fb)) say('bad feedback on ' + a.title); if (a.rubric && !has(RUBRICS, a.rubric)) say('bad rubric on ' + a.title);
      chk(a.goals, 'assessment ' + a.title);
    }
    if (!u.major) say(u.title + ' has no major assessment');
    for (const l of u.lessons || []) {
      for (const b of l.blocks || []) { const m = MOVE_BY[b[0]]; if (!m) say('unknown move ' + b[0] + ' in ' + l.title); else for (const s in b[3] || {}) { const sw = (m.sw || []).find((x) => x.id === s); if (!sw || !sw.opts.some((o) => o.id === b[3][s])) say('bad switch ' + s + ' on ' + b[0] + ' in ' + l.title); } chk(b[2], 'lesson ' + l.title); }
      if (l.hw) { if (!has(HW_PURPOSES, l.hw.purpose) || !has(HW_KINDS, l.hw.kind) || !has(HW_FEEDBACK, l.hw.fb) || !has(HW_GRADING, l.hw.graded)) say('bad homework in ' + l.title); chk(l.hw.goals, 'homework in ' + l.title); }
    }
  }
  return bad;
}
