/* A scripted click-through of every screen, for every starter kit, the sample course and a blank one.
   Open dist/index.html?test=1 and read the TEST lines in the console; the page title ends as "TEST n passed, m failed". */
function runUiTest() {
  let pass = 0, fail = 0; const errs = [];
  window.addEventListener('error', (e) => errs.push(e.message));
  const realOpen = window.open, realDl = download; window.open = () => null; download = function () {};
  const step = (name, fn) => { errs.length = 0; try { fn(); if (errs.length) throw new Error(errs[0]); pass++; } catch (e) { fail++; console.log('TEST FAIL ' + name + ': ' + (e && e.message)); } if (App.modal) closeModal(); };
  const need = (ok, msg) => { if (!ok) throw new Error(msg); };
  const click = (sel) => { const el = document.querySelector(sel); need(el, 'nothing matches ' + sel); el.click(); return el; };
  const clean = () => { const t = $('main').textContent; need($('main').innerHTML.length > 150, 'empty screen'); need(!/undefined|NaN|\[object/.test(t), 'bad text: ' + (t.match(/.{30}(undefined|NaN|\[object).{30}/) || [''])[0]); };
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
    const ls = unitLessons(c, l.unit).length; click('[data-act="addLesson"][data-arg="workshop"]'); need(unitLessons(c, l.unit).length === ls + 1 && curLesson(c).blocks.length === 3, 'pattern lesson not added');
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
    App.c = null; go('start'); App.setup.subject = 'math'; App.setup.kit = true; App.setup.title = ''; ACT.begin(); need(App.c.units.length >= 7 && App.view === 'goals', 'kit course not made'); clean();
    App.setup.kit = false; App.setup.title = 'Geometry'; ACT.begin(); need(App.c.title === 'Geometry' && !App.c.units.length, 'blank course not made'); clean();
    for (const v of views) { go(v); clean(); }
  });
  step('report extras', () => {
    App.c = kitToCourse(KITS[0], newCourse({})); App.c.demo = true; App.sel = {}; go('report'); clean();
    click('[data-act="repStress"]'); need(App.rep.stress && App.rep.stress.lost.length, 'no stress test'); click('[data-act="repSnap"]'); need(App.c.snaps.length === 1, 'no snapshot');
    need(packetHTML(App.c, []).length > 5000 && courseMarkdown(App.c).length > 500, 'packet too small'); need($('main').querySelector('.fp') && $('main').querySelector('.web'), 'no fingerprint or web');
  });
  window.open = realOpen; download = realDl; App.c = null; App.view = 'start'; render();
  console.log('TEST DONE ' + pass + ' passed, ' + fail + ' failed'); document.title = 'TEST ' + pass + ' passed, ' + fail + ' failed';
}
if (App.wantTest) runUiTest();
