/* A scripted click-through of every screen, for every starter kit, the sample course and a blank one.
   Open dist/index.html?test=1 and read the TEST lines in the console; the page title ends as "TEST n passed, m failed". */
function runUiTest() {
  let pass = 0, fail = 0; const errs = [];
  window.addEventListener('error', (e) => errs.push(e.message));
  const realOpen = window.open, realDl = download; window.open = () => null; download = function () {};
  const step = (name, fn) => { errs.length = 0; try { fn(); if (errs.length) throw new Error(errs[0]); pass++; } catch (e) { fail++; console.log('TEST FAIL ' + name + ': ' + (e && e.message)); } if (App.modal) closeModal(); };
  const need = (ok, msg) => { if (!ok) throw new Error(msg); };
  const click = (sel) => { const el = document.querySelector(sel); need(el, 'nothing matches ' + sel); el.click(); return el; };
  const clean = () => { const t = $('main').textContent; need($('main').innerHTML.length > 150, 'empty screen'); const tt = t.replace(/undefined slope/g, ''); need(!/undefined|NaN|\[object/.test(tt), 'bad text: ' + (tt.match(/.{30}(undefined|NaN|\[object).{30}/) || [''])[0]); };
  const views = CHAPTERS.map((x) => x[0]);
  const courses = [['sample', () => demoCourse()], ['blank', () => newCourse({})]].concat(KITS.map((k) => ['kit ' + k.id, () => kitToCourse(k, newCourse({}))]));
  for (const [name, make] of courses) for (const v of views) step(name + ' / ' + v, () => { App.c = make(); App.c.demo = true; App.sel = {}; go(v); clean(); });
  /* Every button on every screen, once, against a fresh sample course each time. */
  const skip = { go: 1, jump: 1, openFile: 1, resume: 1, begin: 1, tryDemo: 1, warmup: 1, closeModal: 1, closeModalBg: 1 };
  for (const v of views) {
    App.c = demoCourse(); App.c.demo = true; App.sel = {}; go(v);
    const acts = Array.from(new Set(Array.from(document.querySelectorAll('#main [data-act]')).map((e) => e.dataset.act))).filter((a) => !skip[a]);
    for (const a of acts) step(v + ' button ' + a, () => { App.c = demoCourse(); App.c.demo = true; App.sel = {}; go(v); const el = Array.from(document.querySelectorAll('#main [data-act="' + a + '"]')).find((e) => !e.disabled); if (!el) return; el.dispatchEvent(new MouseEvent('click', { bubbles: true })); if (!App.modal) clean(); else { const m = document.querySelector('#modal [data-act]'); if (m && !skip[m.dataset.act]) m.click(); } });
  }
  step('lesson editing', () => {
    App.c = demoCourse(); App.c.demo = true; App.sel = {}; go('lessons'); const c = App.c;
    click('.strip .blk[data-act="selBlock"]'); need(App.sel.block, 'block not selected');
    const l = curLesson(c), b = byId(l.blocks, App.sel.block), before = b.min; click('.insp [data-act="nudge"][data-arg$="=5=1=240"]'); need(b.min === before + 5, 'minutes did not change');
    const inp = document.querySelector('.insp .step input'), labBefore = $('main').querySelector('[data-live="label"]').innerHTML; inp.value = '22'; inp.dispatchEvent(new Event('input', { bubbles: true })); need(b.min === 22, 'typing minutes did not reach the model'); need($('main').querySelector('[data-live="label"]').innerHTML !== labBefore, 'label did not refresh while typing'); need(document.querySelector('.insp .step input') === inp, 'field was replaced while typing');
    const ti = document.querySelector('.editor .field.big'); ti.value = 'Renamed lesson'; ti.dispatchEvent(new Event('input', { bubbles: true })); need(l.title === 'Renamed lesson' && /Renamed lesson/.test(document.querySelector('.lessons-list').textContent), 'title did not update live');
    const n = l.blocks.length; click('.pal [data-act="addMove"][data-arg="tps"]'); need(l.blocks.length === n + 1, 'block not added');
    click('.insp [data-act="delBlock"]'); need(l.blocks.length === n, 'block not removed');
    const ls = unitLessons(c, l.unit).length; click('[data-act="lessonChooser"]'); click('#modal [data-act="addLesson"][data-arg="workshop"]'); need(unitLessons(c, l.unit).length === ls + 1 && curLesson(c).blocks.length === 3, 'pattern lesson not added');
    click('[data-act="hwOn"]'); need(curLesson(c).hw, 'homework not set'); click('[data-act="hwOff"]'); need(!curLesson(c).hw, 'homework not removed');
    click('[data-act="play"]'); need(App.play.on, 'not playing'); click('[data-act="play"]');
    const lab = lessonLabel(c, curLesson(c)); need(lab.total > 0 && $('main').querySelector('.lf'), 'no label');
  });
  step('warm-up can be won', () => {
    ACT.warmup(); const c = App.c, l = curLesson(c); need(c.warm && $('main').querySelector('.warm'), 'no warm-up panel');
    l.blocks = []; [['mini', 12], ['guided', 12], ['indep', 14], ['exit', 4]].forEach((x) => { const b = addBlock(c, l, x[0], x[1]); b.goals = [c.goals[0].id]; }); l.blocks[2].sw = { fb: 'circulate' }; render();
    need(/whole tool/.test($('main').textContent), 'warm-up did not complete: ' + WARM_TASKS.map((t) => t[1](lessonLabel(c, l))).join(','));
    click('.warm [data-act="go"]'); need(App.view === 'start', 'did not leave the warm-up');
  });
  step('start a course from a kit and from blank', () => {
    App.c = null; go('start'); const begin = () => { ACT.begin(); const b = document.querySelector('#modal [data-act="replaceGo"]'); if (b) b.click(); }; App.setup.subject = 'math'; App.setup.kit = true; App.setup.title = ''; begin(); need(App.c.units.length >= 7 && App.view === 'goals', 'kit course not made'); clean();
    closeModal(); App.setup.kit = false; App.setup.title = 'Geometry'; begin(); need(App.c.title === 'Geometry' && !App.c.units.length, 'blank course not made'); clean();
    for (const v of views) { go(v); clean(); }
  });
  step('report extras', () => {
    App.c = kitToCourse(KITS[0], newCourse({})); App.c.demo = true; App.sel = {}; go('report'); clean();
    click('[data-act="repStress"]'); need(App.rep.stress && App.rep.stress.lost.length, 'no stress test'); click('[data-act="repSnap"]'); need(App.c.snaps.length === 1, 'no snapshot');
    need(packetHTML(App.c, []).length > 5000 && courseMarkdown(App.c).length > 500, 'packet too small'); need($('main').querySelector('.fp') && $('main').querySelector('.web'), 'no fingerprint or web');
  });
  step('versions can be brought back', () => {
    App.c = demoCourse(); App.c.demo = true; App.sel = {}; go('report'); const c = App.c, n = c.lessons.length;
    click('[data-act="repSnap"]'); need(c.snaps.length === 1 && c.snaps[0].course, 'the version did not keep the course');
    c.lessons.pop(); c.title = 'Changed'; render(); click('[data-act="repRestore"]'); need(App.c.lessons.length === n && App.c.title === 'Biology' && App.c.snaps.length === 1 && App.c.snaps[0].name === 'Before going back', 'going back did not restore the course'); clean();
  });
  step('homework on a class that meets every other day', () => {
    const c = demoCourse(), a = homeworkStats(c, c.lessons); c.school.perWeek = 2.5; const b = homeworkStats(c, c.lessons);
    need(b.gap === 2 && Math.abs(b.max - a.max / 2) < 0.01 && b.total === a.total && b.maxSet === a.max, 'minutes were not spread over the nights before the next class');
    App.c = c; c.demo = true; App.sel = {}; go('homework'); clean(); go('report'); clean();
  });
  step('a new block is not tied to a goal the teacher did not choose', () => {
    App.c = demoCourse(); App.c.demo = true; App.sel = {}; go('lessons'); click('[data-act="lessonChooser"]'); click('#modal [data-act="addLesson"][data-arg="direct"]');
    const l = curLesson(App.c); need(l.blocks.length && l.blocks.every((b) => !b.goals.length), 'a ready-made lesson arrived tagged'); need(lessonLabel(App.c, l).orphan > 10 && /tied to no goal/.test($('main').textContent), 'untagged time is not pointed out');
  });
  step('school profile screen, with and without a course', () => {
    App.c = null; App.pf = newProfile(); go('school'); clean(); need(App.view === 'school', 'the profile screen needs no course');
    const acts = Array.from(new Set(Array.from(document.querySelectorAll('#main [data-act]')).map((e) => e.dataset.act))).filter((x) => !['go', 'openFile', 'pfReset'].includes(x));
    for (const x of acts) { const el = Array.from(document.querySelectorAll('#main [data-act="' + x + '"]')).find((e) => !e.disabled); if (el) { el.click(); if (App.modal) closeModal(); clean(); } }
    const nm = $('pf-name'); nm.value = 'Riverside School'; nm.dispatchEvent(new Event('input', { bubbles: true })); need(App.pf.name === 'Riverside School' && pfLoad().name === 'Riverside School', 'the profile was not saved as it was typed');
  });
  step('a profile sets and locks a course', () => {
    const P = newProfile(); P.name = 'Riverside School'; P.schedule = { period: 80, perWeek: 5, cycle: { len: 2, on: [1] } }; P.grading.weights = { major: 60, minor: 20, homework: 10, participation: 10 }; P.locks = { weights: true, calendar: true, schedule: true }; P.expect.hw = 20; P.gradeStyle = 'words'; P.standards = 'HS-LS1-2 Model of interacting systems\nHS-LS1-3 Feedback mechanisms'; P.standardsName = 'NGSS';
    App.pf = cleanProfile(JSON.parse(JSON.stringify(P))); App.c = demoCourse(); App.c.demo = true; App.sel = {}; applyProfile(App.c, App.pf); const c = App.c;
    need(c.school.period === 80 && c.school.cycle.len === 2 && c.syllabus.weights.major === 60 && c.gradeStyle === 'words' && c.profile.locks.weights, 'the profile was not applied');
    need(Math.abs(meetingDates(c).length - 92) < 4, 'an A/B timetable should meet about half the school days, got ' + meetingDates(c).length);
    go('syllabus'); clean(); need($('main').querySelector('.locknote'), 'no note that settings are set by the school');
    const w = $('main').querySelector('[data-bind="weights::major"]'); need(w && w.disabled, 'a locked weight can still be typed in');
    const nb = Array.from($('main').querySelectorAll('[data-act="nudge"]')).find((e) => /^weights::major/.test(e.dataset.arg)); need(nb && nb.disabled, 'a locked weight can still be nudged');
    ACT.set('weights::major=5'); const before = c.syllabus.weights.major; nb.disabled = false; nb.click(); need(c.syllabus.weights.major === before || c.syllabus.weights.major === 5, 'check ran'); c.syllabus.weights.major = 60;
    nb.disabled = false; nb.click(); need(c.syllabus.weights.major === 60, 'a click on a locked control changed the course');
    go('calendar'); clean(); const d = $('main').querySelector('[data-act="calDay"]'); need(d && d.disabled, 'a locked calendar day can still be toggled'); need(/Rotating timetable/.test($('main').textContent) && /Winter break/.test($('main').innerHTML), 'the timetable and named days off are missing from Calendar');
    go('report'); clean(); need(/Strong|Sound|Developing|Needs work|Not yet judged/.test($('main').querySelector('.gradegrid').textContent) && !/\bA−?\b/.test($('main').querySelector('.gradegrid b').textContent), 'grades are not shown in words'); need(/school.s expectations/.test($('main').textContent), 'the school expectations are not on the label');
    c.goals[0].std = 'HS-LS1-2, HS-XX-9'; render(); const st = $('main').textContent; need(/HS-LS1-2/.test(st) && /HS-LS1-3/.test(st) && /no goal cites yet/.test(st), 'the standards table is missing or incomplete');
    need(/HS-LS1-2/.test(packetHTML(c, ['scope'])), 'standards are not printed on the scope and sequence');
    const back = migrate(JSON.parse(JSON.stringify(c))); need(back.profile && back.profile.locks.calendar && back.school.cycle && back.goals[0].std && back.school.offNames && Object.keys(back.school.offNames).length, 'the profile, timetable, standards or day names did not survive saving');
    go('school'); clean(); click('[data-act="pfRemove"]'); need(!App.c.profile, 'the profile could not be removed'); go('syllabus'); need(!$('main').querySelector('[data-bind="weights::major"]').disabled, 'still locked after removing the profile');
  });
  step('rotating timetable and named days off in Calendar', () => {
    App.c = demoCourse(); App.c.demo = true; App.sel = {}; go('calendar'); const c = App.c, daily = meetingDates(c).length;
    click('[data-act="cycSet"][data-arg="c=cycle"]'); need(c.school.cycle && c.school.cycle.len === 2, 'no cycle'); click('[data-act="cycLen"][data-arg="c=1"]'); click('[data-act="cycLen"][data-arg="c=1"]'); click('[data-act="cycLen"][data-arg="c=1"]'); click('[data-act="cycLen"][data-arg="c=1"]'); need(c.school.cycle.len === 6, 'cycle length');
    click('[data-act="cycDay"][data-arg="c=3"]'); click('[data-act="cycDay"][data-arg="c=5"]'); need(c.school.cycle.on.join() === '1,3,5' && Math.abs(meetingDates(c).length - daily / 2) < 3, 'a six-day cycle meeting on three days should give about half the days'); clean();
    click('[data-act="cycSet"][data-arg="c=week"]'); need(!c.school.cycle && meetingDates(c).length === daily, 'could not go back to a weekly timetable');
    const n = c.school.off.length; $('off-from-c').value = '2026-10-12'; $('off-to-c').value = '2026-10-13'; $('off-name-c').value = 'Fall break'; click('[data-act="offAdd"][data-arg="c"]'); need(c.school.off.length === n + 2 && offName(c, '2026-10-13') === 'Fall break', 'named days off were not added'); clean();
    need(/Fall break/.test(packetHTML(c, ['pacing'])), 'the day name is not on the printed pacing guide');
    click('[data-act="offDel"][data-arg="c=2026-10-12=2026-10-13"]'); need(c.school.off.length === n, 'days off were not removed');
  });
  step('long goal lists fold and filter', () => {
    App.c = kitToCourse(KITS.find((k) => k.id === 'history'), newCourse({})); App.c.demo = true; App.sel = {}; go('goals'); const c = App.c;
    const cards = () => $('main').querySelectorAll('.gl-goal').length; need(cards() < c.goals.length && cards() <= 18, 'a kit\u2019s goals are all shown at once: ' + cards());
    click('.gl-more'); need(cards() > 18 || c.goals.length <= 18, 'show all did nothing');
    const f = $('gl-f'); f.value = c.units[1].id; f.dispatchEvent(new Event('input', { bubbles: true })); f.dispatchEvent(new Event('change', { bubbles: true })); need(cards() === Math.min(cards(), unitGoals(c, c.units[1].id).length) && cards() > 0, 'the unit filter did not narrow the goals'); clean();
    need($('main').querySelector('[data-bind$=":std"]'), 'no place to cite standards on a goal');
  });
  step('a saved course is not replaced without asking', () => {
    const real = kitToCourse(KITS[0], newCourse({})); real.title = 'Keep me'; App.c = real; saveNow(); App.c = null; go('start');
    App.setup.kit = false; App.setup.title = 'Intruder'; ACT.begin(); need(document.querySelector('#modal [data-act="replaceGo"]'), 'no warning before replacing a saved course'); need(loadSaved().title === 'Keep me', 'saved course was overwritten before the answer');
    click('#modal [data-act="closeModal"]'); need(loadSaved().title === 'Keep me' && !App.c, 'cancel did not keep the saved course');
    ACT.tryDemo(); go('start'); need(/Keep me/.test($('main').textContent), 'the sample course hid the saved one'); ACT.warmup(); go('start'); need(loadSaved().title === 'Keep me', 'the warm-up replaced the saved course');
  });
  step('damaged and hostile course files', () => {
    let threw = false; try { migrate({ v: 1, units: [], lessons: [], assess: [], goals: [{ id: '"><img src=x onerror=1>', text: 't' }] }); } catch (e) { threw = true; } need(threw, 'a hostile id was accepted');
    const old = migrate({ v: 7, title: 'Old <b>file</b>', units: [{ id: 'U1', title: 'u' }], goals: [{ id: 'G1', text: 'g', unit: 'U9', kind: 'nonsense' }], lessons: [{ id: 'L1', unit: 'U1', title: 'x', blocks: [{ id: 'B1', move: 'nope', min: 'abc', goals: ['G1', 'G77'], sw: { evil: '<x>' } }] }], assess: [] });
    need(old.v === COURSE_V && old.units[0].days > 0 && old.goals[0].unit === null && old.goals[0].kind === 'knowledge' && old.lessons[0].blocks[0].move === 'lecture' && old.lessons[0].blocks[0].goals.length === 1 && !Object.keys(old.lessons[0].blocks[0].sw).length, 'an older file was not repaired');
    App.c = old; App.c.demo = true; App.sel = {}; for (const v of views) { go(v); clean(); need(!$('main').querySelector('b > b, img[onerror]') && $('main').innerHTML.indexOf('<b>file</b>') < 0, 'markup from a title reached the page'); }
    need(packetHTML(old, []).indexOf('<b>file</b>') < 0, 'markup from a title reached the packet');
    const c2 = newCourse({}); c2.school.end = '9999-06-04'; const t0 = performance.now(); meetingDates(c2); need(performance.now() - t0 < 50, 'a far-off end date is slow');
  });
  window.open = realOpen; download = realDl; App.c = null; App.view = 'start'; render();
  console.log('TEST DONE ' + pass + ' passed, ' + fail + ' failed'); document.title = 'TEST ' + pass + ' passed, ' + fail + ' failed';
}
if (App.wantTest) runUiTest();
