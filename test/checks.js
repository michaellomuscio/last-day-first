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
