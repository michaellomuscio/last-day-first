/* Tests for the simulated class. They check direction, not exact numbers: the model is an illustration, so only the order of outcomes matters. */
const E = require('../dist/engine.cjs');
const { newCourse, addUnit, addGoal, addLesson, addBlock, addAssess, applyPattern, simulate, stressTest, demoCourse, newHomework } = E;

let failed = 0;
function test(name, fn) {
  try { const msg = fn(); console.log('ok   ' + name + (msg ? '  (' + msg + ')' : '')); }
  catch (e) { failed++; console.log('FAIL ' + name + '  ' + e.message); }
}
const ok = (cond, msg) => { if (!cond) throw new Error(msg); };
const f2 = (x) => x.toFixed(2);
const mean = (a) => a.reduce((s, x) => s + x, 0) / (a.length || 1);
const meanOf = (r, ids, f) => mean(ids.map((id) => (f === 'recall' || f === 'linked' || f === 'use' ? r.goals[id][f] : r.goals[id].later[f.slice(6).toLowerCase()])));
const later = (r, ids, f) => mean(ids.map((id) => r.goals[id].later[f]));
const now = (r, ids, f) => mean(ids.map((id) => r.goals[id][f]));
const SEEDS = [1, 2, 3, 4, 5];
const avgOver = (fn) => mean(SEEDS.map(fn));

/* A unit of `n` lessons teaching goals in turn. kind picks what each lesson is made of. */
function unitCourse(kind, o) {
  o = o || {};
  const c = newCourse({}); c.school.lost = 0;
  const n = o.days || 12, u = addUnit(c, { days: n });
  const goals = [];
  for (let k = 0; k < (o.goals || 3); k++) goals.push(addGoal(c, { unit: u.id, text: 'Goal ' + (k + 1), kind: o.kind || 'knowledge', level: 2, after: k && o.chain ? [goals[k - 1].id] : [] }));
  for (let i = 0; i < n; i++) {
    const l = addLesson(c, u.id, {}), g = goals[i % goals.length].id;
    if (kind === 'direct') applyPattern(c, l, 'direct');
    else if (kind === 'lecture') addBlock(c, l, 'lecture', 45);
    else if (kind === 'seminar') addBlock(c, l, 'seminar', 45);
    else if (kind === 'task') addBlock(c, l, 'task', 45);
    else if (kind === 'mini') { addBlock(c, l, 'mini', 20); addBlock(c, l, 'guided', 20); }
    else if (kind === 'direct-task') { applyPattern(c, l, 'direct'); }
    l.blocks.forEach((b) => (b.goals = [g]));
    if (o.hw) l.hw = Object.assign(newHomework(), { purpose: 'review', kind: 'problems', min: o.hw, goals: goals.map((x) => x.id), fb: 'discussed', graded: 'completion' });
  }
  return { c, goals: goals.map((g) => g.id) };
}

test('a. same seed gives the same result; a different seed gives a different class', () => {
  const c = demoCourse(), a = simulate(c, { seed: 7 }), b = simulate(c, { seed: 7 }), d = simulate(c, { seed: 8 });
  ok(JSON.stringify(a) === JSON.stringify(b), 'same seed differed');
  ok(JSON.stringify(a.students) !== JSON.stringify(d.students), 'different seeds gave the same students');
  ok(a.students.length === c.school.classSize, 'class size');
  return a.students.slice(0, 4).map((s) => s.name).join(', ');
});

test('b. no NaN, everything within 0 to 1, notes within limits', () => {
  const c = demoCourse(), r = simulate(c, { seed: 3 }), st = stressTest(c, { seed: 3 });
  const chk = (v, where) => { if (v === null) return; ok(typeof v === 'number' && !isNaN(v) && v >= 0 && v <= 1, where + ' = ' + v); };
  for (const res of [r, st.result, st.base]) {
    for (const id in res.goals) { const g = res.goals[id]; ['recall', 'linked', 'use', 'seen', 'low', 'high'].forEach((k) => chk(g[k], id + '.' + k)); ['recall', 'linked', 'use'].forEach((k) => chk(g.later[k], id + '.later.' + k)); }
    res.links.forEach((l) => chk(l.strength, 'link'));
    res.days.forEach((d) => ['recall', 'linked', 'use'].forEach((k) => chk(d[k], 'day.' + k)));
    res.byStudent.forEach((s) => ['recall', 'linked', 'use'].forEach((k) => chk(s[k], 'student.' + k)));
    ok(res.notes.length <= 6, 'too many notes');
    res.notes.concat(res.assumptions.map((a) => a.text), st.notes).forEach((t) => ok(!/!|UbD|Understanding by Design/.test(t), 'bad wording: ' + t));
  }
  ok(r.days.length === E.courseDays(c).length, 'one entry per day');
  ok(r.links.length === c.goals.reduce((s, g) => s + g.after.length, 0), 'one link per after');
  return r.notes.length + ' notes, ' + r.assumptions.length + ' assumptions';
});

test('c. lecture only fades faster and connects far less than explain-then-practise', () => {
  const L = unitCourse('lecture'), D = unitCourse('direct');
  const lr = avgOver((s) => later(simulate(L.c, { seed: s }), L.goals, 'recall')), dr = avgOver((s) => later(simulate(D.c, { seed: s }), D.goals, 'recall'));
  const ll = avgOver((s) => now(simulate(L.c, { seed: s }), L.goals, 'linked')), dl = avgOver((s) => now(simulate(D.c, { seed: s }), D.goals, 'linked'));
  ok(lr < dr, 'later recall lecture ' + f2(lr) + ' not below direct ' + f2(dr));
  ok(ll < 0.5 * dl, 'linked lecture ' + f2(ll) + ' not much below direct ' + f2(dl));
  return 'later recall ' + f2(lr) + ' vs ' + f2(dr) + ', linked ' + f2(ll) + ' vs ' + f2(dl);
});

test('d. spaced retrieval beats the same retrieval massed on one day', () => {
  function build(spaced) {
    const c = newCourse({}); c.school.lost = 0;
    const u = addUnit(c, { days: 26 }), A = [0, 1, 2].map((k) => addGoal(c, { unit: u.id, text: 'A' + k, kind: 'knowledge' })), B = addGoal(c, { unit: u.id, text: 'B', kind: 'knowledge' });
    for (let i = 0; i < 26; i++) {
      const l = addLesson(c, u.id, {});
      if (i < 6) { applyPattern(c, l, 'direct'); l.blocks.forEach((b) => (b.goals = [A[i % 3].id])); }
      else { const b = addBlock(c, l, 'mini', 30); b.goals = [B.id]; }
      const warm = spaced ? [10, 14, 18, 22].indexOf(i) >= 0 : i === 22;
      if (warm) for (let k = 0; k < (spaced ? 1 : 4); k++) addBlock(c, l, 'retrieval', 8).goals = A.map((g) => g.id);
    }
    return { c, ids: A.map((g) => g.id) };
  }
  const S = build(true), M = build(false);
  const sr = avgOver((s) => later(simulate(S.c, { seed: s }), S.ids, 'recall')), mr = avgOver((s) => later(simulate(M.c, { seed: s }), M.ids, 'recall'));
  ok(sr > mr + 0.05, 'spaced ' + f2(sr) + ' not above massed ' + f2(mr));
  /* the same, with review homework instead of warm-ups */
  function buildHw(spaced) {
    const b = build(false); b.c.lessons.forEach((l, i) => { l.blocks = l.blocks.filter((x) => x.move !== 'retrieval'); if (spaced ? [10, 14, 18, 22].indexOf(i) >= 0 : i === 22) l.hw = Object.assign(newHomework(), { purpose: 'review', kind: 'problems', min: 20, goals: b.ids, fb: 'discussed' }); });
    return b;
  }
  const HS = buildHw(true), HM = buildHw(false);
  const hs = avgOver((s) => later(simulate(HS.c, { seed: s }), HS.ids, 'recall')), hm = avgOver((s) => later(simulate(HM.c, { seed: s }), HM.ids, 'recall'));
  ok(hs > hm, 'review homework spaced ' + f2(hs) + ' not above massed ' + f2(hm));
  return 'warm-ups ' + f2(sr) + ' vs ' + f2(mr) + ', homework ' + f2(hs) + ' vs ' + f2(hm);
});

test('e. transfer work with no input does not make students able to use the idea', () => {
  const T = unitCourse('task', { days: 14 }), D = unitCourse('direct', { days: 14 });
  const tu = avgOver((s) => now(simulate(T.c, { seed: s }), T.goals, 'use')), tr = avgOver((s) => now(simulate(T.c, { seed: s }), T.goals, 'recall'));
  ok(tu < 0.2, 'use with no input ' + f2(tu) + ' is not low');
  const dr0 = avgOver((s) => now(simulate(D.c, { seed: s }), D.goals, 'recall'));
  ok(tr < dr0 - 0.2, 'recall with no input ' + f2(tr) + ' is not clearly below taught ' + f2(dr0));
  /* taught first, then a transfer task, does better */
  const m = unitCourse('direct', { days: 10 }), l = addLesson(m.c, m.c.units[0].id, {});
  for (let k = 0; k < 4; k++) { const q = addLesson(m.c, m.c.units[0].id, {}); addBlock(m.c, q, 'task', 45).goals = m.goals; }
  m.c.units[0].days = 15;
  const mu = avgOver((s) => now(simulate(m.c, { seed: s }), m.goals, 'use'));
  ok(mu > tu, 'taught-then-transfer use ' + f2(mu) + ' not above untaught ' + f2(tu));
  return 'use ' + f2(tu) + ' with no input, ' + f2(mu) + ' after teaching';
});

test('f. a goal that builds on an untaught earlier goal links poorly', () => {
  function build(teachA) {
    const c = newCourse({}); c.school.lost = 0;
    const u = addUnit(c, { days: 14 }), A = addGoal(c, { unit: u.id, text: 'Earlier idea', kind: 'knowledge' }), B = addGoal(c, { unit: u.id, text: 'Later idea', kind: 'understanding', after: [A.id] });
    for (let i = 0; i < 14; i++) {
      const l = addLesson(c, u.id, {});
      if (i < 5) { if (teachA) { applyPattern(c, l, 'direct'); l.blocks.forEach((b) => (b.goals = [A.id])); } }
      else { addBlock(c, l, 'mini', 15).goals = [B.id]; addBlock(c, l, 'seminar', 25).goals = [B.id]; }
    }
    return { c, A: A.id, B: B.id };
  }
  const T = build(true), U = build(false);
  const lt = avgOver((s) => simulate(T.c, { seed: s }).goals[T.B].linked), lu = avgOver((s) => simulate(U.c, { seed: s }).goals[U.B].linked);
  ok(lu < 0.6 * lt, 'untaught prerequisite linked ' + f2(lu) + ' vs taught ' + f2(lt));
  ok(lu < 0.25, 'linked with no prerequisite ' + f2(lu) + ' is not low');
  const rl = simulate(U.c, { seed: 1 }).links[0].strength;
  return 'linked ' + f2(lu) + ' vs ' + f2(lt) + ', link strength ' + f2(rl);
});

test('g. 90 minutes of homework a night does not beat 30 for students who struggle to finish it', () => {
  const lowMean = (r, f) => { const idx = r.students.map((s, i) => (s.traits.hw < 0.55 ? i : -1)).filter((i) => i >= 0); return mean(idx.map((i) => r.byStudent[i][f])); };
  const M = unitCourse('mini', { days: 16, hw: 30 }), H = unitCourse('mini', { days: 16, hw: 90 });
  const mr = avgOver((s) => lowMean(simulate(M.c, { seed: s, n: 60 }), 'recall')), hr = avgOver((s) => lowMean(simulate(H.c, { seed: s, n: 60 }), 'recall'));
  ok(hr <= mr + 0.005, 'heavy ' + f2(hr) + ' beat moderate ' + f2(mr) + ' for low-reliability students');
  return 'recall ' + f2(hr) + ' at 90 min vs ' + f2(mr) + ' at 30 min';
});

test('h. a level-1 quiz can look strong while connections are weak', () => {
  const c = newCourse({}); c.school.lost = 0;
  const u = addUnit(c, { days: 8 }), g = addGoal(c, { unit: u.id, text: 'Parts and what they do', kind: 'understanding', level: 3 });
  const quiz = addAssess(c, u.id, { method: 'selected', level: 1, goals: [g.id], kind: 'minor', targets: ['knowledge'] });
  for (let i = 0; i < 8; i++) { const l = addLesson(c, u.id, {}); if (i < 7) { addBlock(c, l, 'mini', 25).goals = [g.id]; addBlock(c, l, 'indep', 18).goals = [g.id]; } else addBlock(c, l, 'quiz', 15).goals = [g.id], l.blocks[0].assess = quiz.id; }
  const r = avgOver((s) => simulate(c, { seed: s }).goals[g.id].seen), lk = avgOver((s) => simulate(c, { seed: s }).goals[g.id].linked);
  ok(r >= 0.6, 'seen ' + f2(r) + ' is not high');
  ok(lk < 0.35, 'linked ' + f2(lk) + ' is not low');
  ok(simulate(c, { seed: 1 }).goals[g.id].seen !== null && simulate(demoCourse(), { seed: 1 }).goals[demoCourse().goals[3].id].seen === null, 'seen null when not assessed');
  return 'seen ' + f2(r) + ', linked ' + f2(lk);
});

/* A full year: six units, five goals each, explain-then-practise with a spread of other work. */
function yearCourse() {
  const c = newCourse({}); c.school.lost = 8;
  let prev = null;
  for (let u = 0; u < 6; u++) {
    const un = addUnit(c, { title: 'Unit ' + (u + 1), days: 28 }), gs = [];
    for (let k = 0; k < 5; k++) gs.push(addGoal(c, { unit: un.id, text: 'Unit ' + (u + 1) + ' goal ' + (k + 1), kind: k === 0 ? 'understanding' : 'knowledge', priority: k === 0 ? 'lasting' : 'important', level: 2, after: k ? [gs[k - 1].id] : prev ? [prev] : [] }));
    prev = gs[0].id;
    for (let i = 0; i < 28; i++) {
      const l = addLesson(c, un.id, {}), g = gs[i % 5].id;
      if (i % 7 === 6) applyPattern(c, l, 'seminarday'); else applyPattern(c, l, 'direct');
      l.blocks.forEach((b) => (b.goals = [g])); l.hw = Object.assign(newHomework(), { purpose: i % 3 ? 'practice' : 'review', min: 25, goals: [g], fb: 'discussed' });
    }
  }
  return c;
}

test('i. stress test loses about the configured number of days and never improves retention', () => {
  const c = yearCourse(); let dr = [];
  for (const seed of SEEDS) {
    const st = stressTest(c, { seed });
    ok(Math.abs(st.lost.length - 8) <= 3, 'lost ' + st.lost.length + ' days for configured 8');
    ok(new Set(st.lost.map((x) => x.i)).size === st.lost.length, 'duplicate lost day');
    ok(st.lost.every((x) => x.date && x.what), 'lost day without date or reason');
    ok(st.notes.length && st.hit.length, 'no notes or hits');
    const ids = c.goals.map((g) => g.id);
    dr.push(later(st.base, ids, 'recall') - later(st.result, ids, 'recall'));
  }
  const d = mean(dr);
  ok(d >= -1e-9, 'stressed retention beat the base by ' + f2(-d));
  return 'mean loss in later recall ' + f2(d);
});

test('j. a full simulation is fast', () => {
  const demo = demoCourse(), year = yearCourse();
  simulate(demo); simulate(year);
  let t = process.hrtime.bigint(); for (let i = 0; i < 20; i++) simulate(demo, { seed: i }); const a = Number(process.hrtime.bigint() - t) / 20e6;
  t = process.hrtime.bigint(); for (let i = 0; i < 20; i++) simulate(year, { seed: i }); const b = Number(process.hrtime.bigint() - t) / 20e6;
  ok(a < 60, 'demo took ' + a.toFixed(1) + ' ms');
  ok(b < 60, 'year course took ' + b.toFixed(1) + ' ms');
  return 'demo ' + a.toFixed(1) + ' ms, 170 days with 30 goals ' + b.toFixed(1) + ' ms';
});

test('k. eight weeks on: heard once < massed < spaced, and connections fade slowly', () => {
  function sc(mode) {
    const c = newCourse({}); c.school.lost = 0; const u = addUnit(c, { days: 30 }), g = addGoal(c, { unit: u.id, text: 'A', kind: 'knowledge' });
    for (let i = 0; i < 30; i++) {
      const l = addLesson(c, u.id, {});
      if (mode === 'once' && i === 0) addBlock(c, l, 'lecture', 40).goals = [g.id];
      if (mode === 'massed' && i < 2) { applyPattern(c, l, 'direct'); l.blocks.forEach((b) => (b.goals = [g.id])); }
      if (mode === 'spaced') { if (i === 0) { applyPattern(c, l, 'direct'); l.blocks.forEach((b) => (b.goals = [g.id])); } else if ([3, 7, 12].indexOf(i) >= 0) addBlock(c, l, 'retrieval', 8).goals = [g.id]; }
    }
    return { c, id: g.id, until: { once: 0, massed: 1, spaced: 12 }[mode] };
  }
  const band = {}; for (const m of ['once', 'massed', 'spaced']) { const o = sc(m); band[m] = avgOver((s) => simulate(o.c, { seed: s, until: o.until }).goals[o.id].later.recall); }
  ok(band.once < band.massed && band.massed < band.spaced, 'bands out of order ' + [band.once, band.massed, band.spaced].map(f2).join(' '));
  ok(band.once < 0.2 && band.massed < 0.4 && band.spaced > 0.35 && band.spaced < 0.7, 'bands outside rough range ' + [band.once, band.massed, band.spaced].map(f2).join(' '));
  /* a goal with strong linking keeps most of its connections and use */
  const d = demoCourse(), last = Math.max.apply(null, E.courseDays(d).filter((x) => x.lesson).map((x) => x.i)), g = d.goals[0].id;
  const r = avgOver((s) => simulate(d, { seed: s, until: last }).goals[g].later.linked / simulate(d, { seed: s, until: last }).goals[g].linked);
  ok(r >= 0.6, 'later linked kept only ' + f2(r) + ' of its end value');
  const x = simulate(d, { seed: 7, until: last }).goals[g];
  ok(x.later.recall >= 0.6 * x.later.linked - 1e-9, 'recall floor under connected goal');
  return 'later recall ' + f2(band.once) + ' < ' + f2(band.massed) + ' < ' + f2(band.spaced) + '; linked kept ' + f2(r);
});

/* Five-day weeks on one goal, as an instructional coach might compare them. */
function weekCourse(name) {
  const W = {
    explicit: [['retrieval', 5], ['mini', 12], ['worked', 10, { fade: 'they' }], ['guided', 10], ['indep', 10, { fb: 'circulate' }], ['exit', 5]],
    seminar: [['sread', 12, { task: 'task' }], ['seminar', 25, { prep: 'notes' }], ['reflect', 8]],
    aimless: [['game', 15], ['simulate', 20], ['gallery', 10]],
    volunteers: [['qa', 20], ['guided', 20]],
  };
  const c = newCourse({}); c.school.lost = 0; const u = addUnit(c, { days: 5 }), g = addGoal(c, { unit: u.id, text: 'The idea of the week', kind: 'understanding', level: 2 });
  for (let i = 0; i < 5; i++) {
    const l = addLesson(c, u.id, {}), bl = name === 'lecture' ? [i % 2 ? ['video', 45] : ['lecture', 45]] : W[name];
    bl.forEach((b) => { const k = addBlock(c, l, b[0], b[1]); k.goals = [g.id]; if (b[2]) k.sw = b[2]; });
  }
  return { c, id: g.id };
}
const weekStats = (name) => { const o = weekCourse(name); const r = SEEDS.map((s) => simulate(o.c, { seed: s, until: 4 }).goals[o.id]); return { recall: mean(r.map((x) => x.recall)), linked: mean(r.map((x) => x.linked)), use: mean(r.map((x) => x.use)), later: mean(r.map((x) => x.later.recall)) }; };

test('l. a good explicit week connects ideas, a seminar week more, and lazy weeks little', () => {
  const ex = weekStats('explicit'), sm = weekStats('seminar'), lz = weekStats('lecture'), ai = weekStats('aimless');
  ok(ex.linked >= 0.28 && ex.linked <= 0.45, 'explicit linked ' + f2(ex.linked));
  ok(sm.linked >= 0.42 && sm.linked <= 0.58, 'seminar linked ' + f2(sm.linked));
  ok(lz.linked >= 0.03 && lz.linked <= 0.12, 'lazy lecture linked ' + f2(lz.linked));
  ok(ai.linked < 0.2 && ai.recall < 0.7, 'aimless games recall ' + f2(ai.recall) + ' linked ' + f2(ai.linked));
  ok(ex.linked < sm.linked && sm.linked > lz.linked * 3 && ex.linked > lz.linked * 3, 'ordering of linked');
  ok(ex.later >= sm.later, 'explicit later recall ' + f2(ex.later) + ' below seminar ' + f2(sm.later));
  ok(ex.later > lz.later + 0.2 && ex.later > ai.later + 0.2, 'explicit later recall not clearly above lazy weeks');
  const lines = [['explicit', ex], ['seminar', sm], ['lecture', lz], ['games', ai]].map((x) => x[0] + ' ' + f2(x[1].recall) + '/' + f2(x[1].linked) + '/' + f2(x[1].use) + '/' + f2(x[1].later));
  return 'recall/linked/use/later: ' + lines.join(', ');
});

test('m. notes: aimless activity is flagged; the volunteers note stays off seminars and shows for volunteer-only questions', () => {
  const o = weekCourse('aimless'), r = simulate(o.c, { seed: 1, until: 4 });
  ok(r.notes.some((n) => /activity with little or no teaching/.test(n)), 'no activity note: ' + r.notes.join(' | '));
  const sem = simulate(weekCourse('seminar').c, { seed: 1 });
  ok(!sem.notes.some((n) => /only volunteers/.test(n)), 'volunteers note fired on a seminar week');
  const vol = simulate(weekCourse('volunteers').c, { seed: 1 });
  ok(vol.notes.some((n) => /only volunteers/.test(n)), 'volunteers note missing for volunteer-only questions: ' + vol.notes.join(' | '));
  const all = weekCourse('volunteers'); all.c.lessons.forEach((l) => l.blocks.forEach((b) => { if (b.move === 'qa') b.sw = { who: 'all' }; if (b.move === 'guided') b.sw = { who: 'all' }; }));
  ok(!simulate(all.c, { seed: 1 }).notes.some((n) => /only volunteers/.test(n)), 'volunteers note fired when everyone responds');
  ok(!r.notes.concat(sem.notes).some((n) => /\bis what builds\b|\bbuilds the connection\b/.test(n)), 'note states an assumption as fact');
  return 'activity note present, volunteers note exempts seminars';
});

if (failed) { console.log(failed + ' failed'); process.exit(1); }
console.log('all passed');
