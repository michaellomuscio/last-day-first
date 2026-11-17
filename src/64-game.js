/* The game around the tool: a five-minute warm-up that teaches the one move that matters (change a block, watch the label),
   and banners for design feats. Banners reward what a teacher did to the design, never a teaching style. */
const BANNERS = [
  { id: 'aim', name: 'Last day first', how: 'Write the course aim and at least one lasting goal.', test: (c) => c.transfer.trim().length > 20 && c.goals.some((g) => g.priority === 'lasting') },
  { id: 'web', name: 'Connected', how: 'Link five goals to the ideas they build on.', test: (c) => sum(c.goals.map((g) => g.after.length)) >= 5 },
  { id: 'fits', name: 'It fits', how: 'Fit every unit into the year with at least five days to spare.', test: (c) => c.units.length >= 3 && availableDays(c) - budgetedDays(c) >= 5 && budgetedDays(c) >= availableDays(c) * 0.7 },
  { id: 'evidence', name: 'Evidence first', how: 'Give every unit a major assessment.', test: (c) => c.units.length >= 2 && c.units.every((u) => unitAssess(c, u.id).some((a) => a.kind === 'major')) },
  { id: 'tool', name: 'Right tool', how: 'Have at least four assessments, each using a method that suits what it measures.', test: (c) => c.assess.length >= 4 && c.assess.every((a) => methodFit(a) === 2) },
  { id: 'bell', name: 'Bell to bell', how: 'Plan a lesson that uses the whole period and still ends before the bell.', test: (c, x) => x.lessons.some((L) => L.total > 0 && L.over <= 0 && L.over >= -0.08 * L.period) },
  { id: 'ten', name: 'Everyone by minute ten', how: 'Plan a lesson where students are active for at least half of the first ten minutes.', test: (c, x) => x.lessons.some((L) => warmActiveBy(L, 10) >= 5) },
  { id: 'voice', name: 'Every voice', how: 'Plan a lesson where a typical student speaks for five minutes.', test: (c, x) => x.lessons.some((L) => L.talk >= 5) },
  { id: 'back', name: 'Brought back', how: 'In one unit, bring earlier learning back from memory on three different days.', test: (c) => c.units.some((u) => unitLessons(c, u.id).filter((l) => l.blocks.some((b) => blockEff(b).retr)).length >= 3) },
  { id: 'unit', name: 'A whole unit', how: 'Plan every day of one unit.', test: (c) => c.units.some((u) => u.days >= 5 && plannedDays(c, u.id) >= u.days) },
  { id: 'intent', name: 'As intended', how: 'Plan a unit of five days or more that meets all three of your own targets.', test: (c) => c.units.some((u) => { const L = unitLabel(c, u.id), S = shares(L); return L.days >= 5 && S.active >= c.intent.active / 100 && S.together >= c.intent.together / 100 && S.high >= c.intent.high / 100; }) },
  { id: 'clean', name: 'Clean sheet', how: 'Have ten days planned and nothing marked to fix.', test: (c, x) => x.days >= 10 && !x.findings.some((f) => f.sev >= 2) },
  { id: 'promise', name: 'The promise', how: 'Finish the syllabus: what the course is about, weights that total 100, and how to reach you.', test: (c) => chapterState(c, 'syllabus') === 'done' },
  { id: 'twice', name: 'Taught it twice', how: 'Save a version, redesign, and end up with less to fix than before.', test: (c, x) => c.snaps.some((s) => s.days >= 3 && x.findings.filter((f) => f.sev >= 2).length < s.serious) },
];
/* Minutes in the first `m` minutes of a lesson in which students are doing more than taking it in. */
function warmActiveBy(L, m) { let a = 0; for (const s of L.segs || []) { if (s.over || s.t0 >= m) continue; const span = Math.min(s.t1, m) - s.t0; let act = 0; for (const code in s.mix) { const ic = icapOf(code, s.e); act += s.mix[code] * ((ic.A || 0) + (ic.C || 0) + (ic.I || 0)); } a += span * act; } return a; }
function checkBanners(c) {
  if (!c || c.demo) return;
  const x = { lessons: c.lessons.map((l) => lessonLabel(c, l)), findings: App.findings, days: sum(c.lessons.map((l) => l.days || 1)) };
  for (const b of BANNERS) { if (c.game.banners[b.id]) continue; let ok = false; try { ok = !!b.test(c, x); } catch (e) { ok = false; } if (ok) { c.game.banners[b.id] = 1; toast('Banner earned: ' + b.name); } }
}
function bannersHTML(c) {
  const n = BANNERS.filter((b) => c.game.banners[b.id]).length;
  return '<div class="panel"><h2>Banners <small>' + n + ' of ' + BANNERS.length + '</small></h2><div class="bans">' + BANNERS.map((b) => '<div class="ban' + (c.game.banners[b.id] ? ' won' : '') + '" title="' + esc(b.how) + '"><b>' + b.name + '</b><span>' + b.how + '</span></div>').join('') + '</div></div>';
}
const baseRender = render;
render = function () { baseRender(); if (App.c && App.view !== 'start') { const before = Object.keys(App.c.game.banners).length; checkBanners(App.c); if (Object.keys(App.c.game.banners).length !== before) { save(); if (App.view === 'report') baseRender(); } } };

/* ---------- the warm-up ---------- */
function warmCourse() {
  const c = newCourse({ title: 'Warm-up', subject: 'science' }); c.demo = true; c.warm = true; c.intent = { active: 50, together: 20, high: 20, hw: 30 };
  const u = addUnit(c, { title: 'Energy in living things', days: 5, questions: ['Where does the mass of a tree come from?'] });
  const g = addGoal(c, { text: 'Plants build their bodies mostly out of air and water, using energy from light.', kind: 'understanding', priority: 'lasting', level: 3, unit: u.id });
  const l = addLesson(c, u.id, { title: 'Photosynthesis, day one' });
  [['lecture', 32], ['video', 12], ['qa', 6], ['directions', 3]].forEach((b) => { const k = addBlock(c, l, b[0], b[1]); if (b[0] !== 'directions') k.goals = [g.id]; });
  App.sel = { unit: u.id, lesson: l.id };
  return c;
}
const WARM_TASKS = [
  ['End before the bell', (L) => L.total > 0 && L.over <= 0.5],
  ['Students active for at least half the period', (L) => shares(L).active >= 0.5],
  ['Students show what they know for five minutes or more, with feedback they can use', (L) => L.fbNow >= 5],
  ['Keep at least ten minutes of new material going in', (L) => (L.purpose.A || 0) >= 10 && (L.fam.take || 0) >= 8],
];
function warmPanel(c, l, L) {
  const done = WARM_TASKS.map((t) => t[1](L)), all = done.every(Boolean);
  return '<div class="warm"><div class="stack"><div class="eyebrow">Warm-up</div><h2>' + (all ? 'That is the whole tool in one lesson.' : 'This lesson is a first draft. Make it better.') + '</h2><p>' + (all ? 'You changed the design and the observer’s report changed with it. Your own course works the same way, for every lesson, unit and the year.' : 'A new teacher planned this period: a long explanation, a video, a few questions. Click a block on the strip to shorten or remove it. Add blocks from the list below. Watch the label on the right.') + '</p>' + (all ? '<div class="row"><button class="btn pri" data-act="go" data-arg="start">Start my own course</button></div>' : '') + '</div><div class="stack" data-live="warm">' + WARM_TASKS.map((t, k) => '<div class="task' + (done[k] ? ' done' : '') + '"><i>' + (done[k] ? '✓' : '') + '</i>' + t[0] + '</div>').join('') + '</div></div>';
}
ACT.warmup = () => { App.c = warmCourse(); go('lessons'); return false; };
MENTOR.report = (c) => { const L = courseLabel(c); return L.days < 5 ? ['There is not much here to read yet. Plan a week of one unit and come back.'] : ['Read the label before the grades. The grades tell you what to fix. The label tells you what it is like to be your student.']; };
