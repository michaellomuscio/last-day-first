/* The front door: start a course, pick up a saved one, or open a file. */
App.setup = { subject: 'science', title: '', grade: '', kit: true, period: 50, perWeek: 5, year: 2026, active: 50, together: 25, high: 25, hw: 30 };
VIEWS.start = {
  name: 'Start', wide: true,
  render(c) {
    const s = App.setup, kit = KITS.find((k) => k.subject === s.subject), saved = c || loadSaved();
    const slider = (k, label, min, max, unit, help) => '<div class="stack" style="gap:2px"><div class="row between"><span><b>' + label + '</b></span><b class="num" data-live="su-' + k + '">' + s[k] + unit + '</b></div><input type="range" data-su="' + k + '" min="' + min + '" max="' + max + '" step="5" value="' + s[k] + '" aria-label="' + label + '"><span class="hint">' + help + '</span></div>';
    return '<div class="ws start"><div class="hero"><div class="eyebrow">A planning tool for new teachers</div><h1>Plan the last day <i>first.</i></h1>' +
      '<p>Build your real course backward: what should last, how you will know, and only then the days. As you build, an observer with a clipboard watches every lesson and tells you what your students are actually doing, minute by minute.</p>' +
      '<div class="row wrap">' + (saved ? '<button class="btn pri" data-act="resume">Continue “' + esc(short(saved.title, 34)) + '”</button>' : '') + '<button class="btn" data-act="warmup">Try the five-minute warm-up</button><button class="btn" data-act="openFile">Open a course file</button><button class="btn ghost" data-act="tryDemo">Look around a sample course</button></div></div>' +
      '<div class="panel"><h2>Start a new course <small>You can change any of this later.</small></h2>' +
      '<div class="stack"><span class="lbl">What do you teach?</span><div class="chips">' + SUBJECTS.map((x) => '<button class="chip" data-act="suSet" data-arg="subject=' + x[0] + '" aria-pressed="' + (s.subject === x[0]) + '">' + x[1] + '</button>').join('') + '</div></div>' +
      '<div class="grid2"><div class="stack"><label class="lbl" for="su-title">Course name</label><input class="field" id="su-title" data-su="title" value="' + esc(s.title) + '" placeholder="' + esc(kit ? kit.course : 'For example, Chemistry') + '"></div>' +
      '<div class="stack"><span class="lbl">Starting point</span>' + (kit ? '<span class="seg"><button data-act="suSet" data-arg="kit=true" aria-pressed="' + !!s.kit + '">' + esc(kit.course) + ' starter kit</button><button data-act="suSet" data-arg="kit=false" aria-pressed="' + !s.kit + '">A blank page</button></span><span class="hint">' + (s.kit ? esc(kit.blurb) + ' Everything in it is yours to rewrite.' : 'You write every goal and unit yourself.') + '</span>' : '<span class="hint">No starter kit for this subject, so you start from a blank page.</span>') + '</div></div>' +
      '<div class="grid3"><div class="stack"><span class="lbl">A class period lasts</span><span class="seg">' + [40, 45, 50, 55, 60, 75, 80, 90].map((m) => '<button data-act="suSet" data-arg="period=' + m + '" aria-pressed="' + (s.period === m) + '">' + m + '</button>').join('') + '</span><span class="hint">minutes</span></div>' +
      '<div class="stack"><span class="lbl">The class meets</span><span class="seg">' + [[5, 'Every day'], [2.5, 'Every other day'], [4, '4 a week'], [3, '3 a week']].map((m) => '<button data-act="suSet" data-arg="perWeek=' + m[0] + '" aria-pressed="' + (s.perWeek === m[0]) + '">' + m[1] + '</button>').join('') + '</span></div>' +
      '<div class="stack"><span class="lbl">School year</span><span class="seg">' + [2026, 2027].map((y) => '<button data-act="suSet" data-arg="year=' + y + '" aria-pressed="' + (s.year === y) + '">' + y + '–' + String(y + 1).slice(2) + '</button>').join('') + '</span></div></div>' +
      '<hr class="rule"><div class="stack"><div class="sec-h">What do you want your classroom to be like? <small>The report compares your design to this. There is no right answer.</small></div><div class="grid2">' +
      slider('active', 'Students active', 20, 90, '% of class time', 'Doing something with the material, not only listening or watching.') + slider('together', 'Working in pairs or groups', 0, 70, '% of learning time', 'The rest is alone or as a whole class.') +
      slider('high', 'Strategic or extended thinking', 5, 70, '% of learning time', 'Reasoning, planning and justifying, beyond recall and routine practice.') + slider('hw', 'Homework a night, at most', 0, 60, ' min', 'For your class alone. Students have other classes too.') + '</div></div>' +
      '<div class="row"><button class="btn pri" data-act="begin">Start building</button><span class="hint">Your work saves in this browser as you go. Nothing is sent anywhere.</span></div></div>' +
      '<p class="hint fine">The approach is backward design, set out by Grant Wiggins and Jay McTighe. What the observer records draws on published classroom observation methods. The tool measures your plan, not your classroom, and it has no AI inside.</p></div>';
  },
};
ACT.suSet = (a) => { const p = a.split('='); App.setup[p[0]] = parseVal(p[1]); };
ACT.resume = (a, c) => { if (!App.c) App.c = loadSaved(); go(App.c && App.c.units.length ? 'lessons' : 'goals'); return false; };
ACT.tryDemo = () => { App.c = demoCourse(); App.c.demo = true; App.sel = {}; go('lessons'); toast('This is a sample. Nothing you change here is saved.'); return false; };
ACT.begin = () => {
  const s = App.setup, kit = s.kit && KITS.find((k) => k.subject === s.subject);
  let c = newCourse({ subject: s.subject, period: s.period, perWeek: s.perWeek, year: s.year, title: s.title.trim() || (kit ? kit.course : optName(SUBJECTS, s.subject)) });
  if (kit) { const t = c.title; c = kitToCourse(kit, c); if (s.title.trim()) c.title = t; }
  c.intent = { active: s.active, together: s.together, high: s.high, hw: s.hw };
  App.c = c; App.sel = {}; saveNow(); go('goals'); return false;
};
document.addEventListener('input', (ev) => { const el = ev.target, k = el.dataset && el.dataset.su; if (!k) return; App.setup[k] = el.type === 'range' ? +el.value : el.value; const out = document.querySelector('[data-live="su-' + k + '"]'); if (out) out.textContent = el.value + (k === 'hw' ? ' min' : k === 'active' ? '% of class time' : '% of learning time'); });
