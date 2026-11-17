const E = require('../dist/engine.cjs');
const { demoCourse, newCourse, runChecks, gradeCourse, checksFor, addUnit, addLesson, addBlock } = E;
let fails = 0;
const ok = (cond, msg) => { if (!cond) { fails++; console.log('FAIL ' + msg); } };
const AREAS = ['alignment', 'evidence', 'feasibility', 'practice', 'workload', 'intent'], VIEWS = ['goals', 'sequence', 'evidence', 'calendar', 'lessons', 'homework', 'syllabus'];
const has = (fs, id) => fs.some((f) => f.id === id);

const demo = demoCourse(), F = runChecks(demo), G = gradeCourse(demo, F);
for (const f of F) {
  const all = [f.id, f.area, f.text, f.why, f.source].join('|');
  ok(!/undefined|NaN|\[object/.test(all + JSON.stringify(f.where)), 'bad text in ' + f.id + ': ' + f.text);
  ok(AREAS.includes(f.area), 'area ' + f.area); ok([0, 1, 2].includes(f.sev), 'sev ' + f.sev); ok(VIEWS.includes(f.where.view), 'view ' + f.where.view);
  ok(typeof f.text === 'string' && f.text.length > 10 && typeof f.why === 'string' && f.why.length > 10, 'empty strings ' + f.id);
  ok(!/!|Understanding by Design|UbD/.test(f.text + f.why), 'banned wording in ' + f.id);
}
for (let i = 1; i < F.length; i++) ok(F[i - 1].sev >= F[i].sev, 'not sorted by severity');
ok(G.areas.length === 6 && G.built > 0 && G.built <= 1, 'grade shape');

const empty = newCourse({}), EF = runChecks(empty), EG = gradeCourse(empty, EF);
ok(EF.length <= 3, 'empty course findings: ' + EF.length);
ok(EG.areas.every((a) => a.score === null && a.grade === '—'), 'empty grades not null');
ok(EG.built === 0, 'empty built ' + EG.built);

{ const c = demoCourse(), g = c.goals.find((x) => x.priority === 'lasting' && c.assess.some((a) => a.goals.includes(x.id)));
  ok(!runChecks(c).some((f) => f.id === 'al-lasting-no-assess' && f.where.goal === g.id), 'demo should link lasting goal');
  c.assess.forEach((a) => (a.goals = a.goals.filter((x) => x !== g.id)));
  ok(runChecks(c).some((f) => f.id === 'al-lasting-no-assess' && f.where.goal === g.id), 'no-assessment finding missing'); }
{ const c = demoCourse(), a = c.assess.find((x) => x.kind === 'major'); a.level = 1;
  ok(has(runChecks(c), 'al-level-below'), 'level finding missing'); }
{ const c = demoCourse(); c.units[0].days += 200;
  ok(has(runChecks(c), 'fe-days-over'), 'feasibility finding missing'); }
{ const c = demoCourse(); c.intent.hw = 30; c.lessons[0].hw.min = 40;
  ok(has(runChecks(c), 'wl-hw-over'), 'workload finding missing'); }
{ const c = demoCourse(), fs = runChecks(c); ok(checksFor(fs, 'lessons').every((f) => f.where.view === 'lessons'), 'checksFor view');
  const u = c.units[0].id; ok(checksFor(fs, { view: 'lessons', unit: u }).every((f) => f.where.unit === u), 'checksFor unit'); }

/* ---- fairness: an explicit-instruction week and an aimless week ---- */
const { addGoal, addAssess } = E;
function week(kind) {
  const c = newCourse({ title: 'Week' }); c.intent = { active: 50, together: 20, high: 20, hw: 30 };
  const u = addUnit(c, { title: 'Linear equations', days: 5, questions: ['How do I know a solution is right?'] });
  const g1 = addGoal(c, { text: 'An equation says two quantities stay equal, so anything done to one side is done to the other.', kind: 'skill', priority: 'lasting', level: 3, unit: u.id });
  const g2 = addGoal(c, { text: 'Solve a two-step equation.', kind: 'skill', priority: 'important', level: 2, unit: u.id });
  if (kind === 'explicit') {
    addAssess(c, u.id, { title: 'Equation quiz', kind: 'minor', method: 'selected', level: 2, goals: [g1.id, g2.id], min: 10, back: 1 });
    var major = addAssess(c, u.id, { title: 'Explain and solve', kind: 'major', method: 'written', targets: ['reasoning'], level: 3, goals: [g1.id, g2.id], min: 40, rubric: 'analytic', fb: 'rubric', back: 2 });
  }
  for (let d = 0; d < 5; d++) {
    const l = addLesson(c, u.id, { title: 'Day ' + (d + 1) });
    const B = (m, min, goals, sw) => { const b = addBlock(c, l, m, min); b.goals = goals || []; if (sw) b.sw = sw; return b; };
    if (kind === 'explicit' && d === 4) { B('retrieval', 5, [g2.id]); B('test', 40, [g1.id, g2.id]).assess = major.id; }
    else if (kind === 'explicit') { B('retrieval', 5, [g2.id]); B('mini', 8, [g1.id]); B('worked', 8, [g2.id], { fade: 'they' }); B('guided', 8, [g2.id]); B('indep', 14, [g2.id], { fb: 'circulate', coach: 'respond' }); B('exit', 4, [g1.id]); }
    else { B('game', 15); B('simulate', 15); B('gallery', 15); }
  }
  return c;
}
const EX = week('explicit'), AI = week('aimless'), exF = runChecks(EX), aiF = runChecks(AI), exG = gradeCourse(EX, exF), aiG = gradeCourse(AI, aiF);
ok(!exF.some((f) => f.sev === 2), 'explicit week has a severity 2 finding: ' + exF.filter((f) => f.sev === 2).map((f) => f.id));
ok(exG.areas.every((a) => a.score == null || a.score >= (a.id === 'intent' ? 80 : 83)), 'explicit week grade below B: ' + exG.areas.map((a) => a.name + ' ' + a.grade));
ok(!exF.some((f) => f.id === 'al-take-in-only' || f.id === 'al-level-below'), 'explicit week wrongly flagged: ' + exF.map((f) => f.id));
ok(!exF.filter((f) => f.area === 'intent').some((f) => f.sev > 1), 'intent above severity 1');
ok(aiF.some((f) => f.sev === 2), 'aimless week has no severity 2 finding');
ok(has(aiF, 'al-orphan') && aiF.find((f) => f.id === 'al-orphan').sev === 2, 'aimless orphan not severity 2');
const al = (G) => G.areas.find((a) => a.id === 'alignment').score;
ok(al(aiG) < al(exG), 'aimless alignment not lower: ' + al(aiG) + ' vs ' + al(exG));
console.log('Explicit week: ' + exG.areas.map((a) => a.name + ' ' + a.grade).join(', ') + '; ' + exF.length + ' findings');
console.log('Aimless week:  ' + aiG.areas.map((a) => a.name + ' ' + a.grade).join(', ') + '; ' + aiF.length + ' findings');
/* intent floor and allowance */
{ const c = week('explicit'); c.intent.together = 90; c.intent.high = 90; c.intent.active = 100; const f = runChecks(c), g = gradeCourse(c, f);
  ok(f.filter((x) => x.area === 'intent').every((x) => x.sev === 1), 'intent sev'); ok(g.areas.find((a) => a.id === 'intent').score >= 80, 'intent floor'); }
/* loose group work */
{ const c = week('explicit'), l = c.lessons[0]; addBlock(c, l, 'projwork', 35); ok(has(runChecks(c), 'pr-group-loose'), 'loose group finding missing');
  l.blocks[l.blocks.length - 1].sw = { acct: 'roles' }; ok(!has(runChecks(c), 'pr-group-loose'), 'roles should clear it'); }
/* level check uses the best assessment; written essay with rubric counts */
{ const c = week('explicit'); c.assess.find((a) => a.kind === 'major').level = 2; ok(has(runChecks(c), 'al-level-below'), 'level below when no assessment reaches goal'); }
/* enough and planned */
{ const c = demoCourse(), g = gradeCourse(c); ok(g.enough === false && g.planned > 0 && g.planned < 1, 'demo enough/planned ' + g.enough + g.planned);
  ok(['practice', 'workload', 'intent'].every((id) => g.areas.find((a) => a.id === id).score === null), 'lesson areas should be null');
  ok(gradeCourse(EX).enough === true && gradeCourse(EX).planned === 1, 'week is enough'); }
/* assessment time: only once the unit's days are fully planned; zero-minute majors flagged */
{ const c = week('explicit'), m = c.assess.find((a) => a.kind === 'major');
  ok(!has(runChecks(c), 'fe-assess-no-time'), 'block present, no finding'); c.lessons.forEach((l) => l.blocks.forEach((b) => delete b.assess));
  ok(has(runChecks(c), 'fe-assess-no-time'), 'no-time when fully planned');
  c.units[0].days = 9; ok(!has(runChecks(c), 'fe-assess-no-time'), 'no-time should wait for a full plan');
  m.min = 0; m.out = 0; ok(has(runChecks(c), 'fe-assess-no-minutes'), 'zero-minute major'); }

/* speed: 160-day course */
{ const c = demoCourse(); c.school.perWeek = 5;
  const u = addUnit(c, { title: 'Big', days: 140 });
  for (let i = 0; i < 140; i++) { const l = addLesson(c, u.id, { title: 'L' + i, hw: { purpose: 'practice', kind: 'problems', min: 20, goals: [], fb: 'check', graded: 'completion', device: false } }); ['retrieval', 'lecture', 'guided', 'exit'].forEach((m) => addBlock(c, l, m, 10)); }
  runChecks(c); const t = process.hrtime.bigint(); for (let i = 0; i < 10; i++) runChecks(c); const ms = Number(process.hrtime.bigint() - t) / 1e7;
  console.log('runChecks on ' + c.lessons.length + ' lessons: ' + ms.toFixed(1) + ' ms'); ok(ms < 20, 'too slow ' + ms); }

console.log('Demo grades: ' + G.areas.map((a) => a.name + ' ' + a.grade + (a.score != null ? ' (' + a.score + ')' : '')).join(', ') + '; built ' + G.built.toFixed(2));
console.log('Demo findings: ' + F.length + ' (' + [2, 1, 0].map((s) => F.filter((f) => f.sev === s).length + ' sev' + s).join(', ') + ')');
for (const f of F) console.log('  [' + f.sev + '] ' + f.id + ': ' + f.text);
console.log('Distinct check ids in source: ' + new Set((require('fs').readFileSync(__dirname + '/../src/35-checks.js', 'utf8').match(/'((?:al|ev|fe|pr|hw|wl|in)-[a-z-]+)'/g) || [])).size);
if (fails) { console.log(fails + ' failure(s)'); process.exit(1); } console.log('checks: all passed');
