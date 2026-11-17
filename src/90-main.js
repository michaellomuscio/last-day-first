/* Start-up. Preview hooks for tests and screenshots: ?demo=1&view=lessons&unit=1&lesson=3&kit=math */
function boot() {
  const q = new URLSearchParams(location.search);
  if (q.get('demo') || q.get('kit')) {
    const kit = q.get('kit') && KITS.find((k) => k.id === q.get('kit'));
    App.c = kit ? kitToCourse(kit, newCourse({})) : demoCourse(); App.c.demo = true;
    const u = App.c.units[(+q.get('unit') || 1) - 1]; if (u) { App.sel.unit = u.id; const l = unitLessons(App.c, u.id)[(+q.get('lesson') || 1) - 1]; if (l) App.sel.lesson = l.id; }
    App.view = q.get('view') || 'lessons';
    if (q.get('t')) App.play.t = +q.get('t');
    const st = document.createElement('style'); st.textContent = '*{animation:none!important}'; document.head.appendChild(st);
  } else { const c = loadSaved(); if (c) App.c = c; App.view = 'start'; }
  window.addEventListener('error', (e) => { console.log('PAGE ERROR ' + e.message + ' @' + e.lineno); document.title = 'ERROR ' + e.message; });
  render();
  /* ?click=sel1|sel2 clicks each selector in turn (for smoke tests); the title ends as CLICKED n or ERROR ... */
  if (q.get('click')) { let n = 0; try { for (const sel of q.get('click').split('|')) { const el = document.querySelector(sel); if (!el) throw new Error('nothing matches ' + sel); el.click(); n++; } document.title = 'CLICKED ' + n; console.log('CLICKED ' + n); } catch (e) { document.title = 'ERROR ' + e.message; console.log('PAGE ERROR ' + e.message); } }
  App.wantTest = !!q.get('test');
}
/* A small handle for testers and the curious: the current course, its report data and its documents, from the browser console. */
window.LDF = { get course() { return App.c; }, get profile() { return App.pf; }, get view() { return App.view; }, label: () => courseLabel(App.c), checks: () => runChecks(App.c), grades: () => gradeCourse(App.c), simulate: (o) => simulate(App.c, o || {}), packet: (ids) => packetHTML(App.c, ids || []), markdown: () => courseMarkdown(App.c) };
boot();
