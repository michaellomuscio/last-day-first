/* Chapter 3, Evidence: decide what you would need to see to believe students got there, before any lesson is planned.
   Method fit after Stiggins and Chappuis; level of thinking after Webb (Depth of Knowledge). Both are rules of thumb, worded as such. */
const EV_METHOD_COLOR = { selected: '#62748e', written: '#8b6bb5', performance: '#2e7d4f', personal: '#c9822b' };
const EV_WHY = {
  'skill+selected': 'A multiple-choice test can show what students know. It cannot show that they can do it.',
  'skill+written': 'Writing about a skill is not the same as doing it. Watch students do it.',
  'product+selected': 'Picking answers cannot show that students can make something.',
  'product+personal': 'A conversation leaves nothing behind to judge. Students need to make the thing.',
  'knowledge+performance': 'A big task shows a lot, but a missing fact can hide inside it. Pair it with a quick check of the facts.',
  'reasoning+selected': 'Good questions can show some reasoning, but students never explain how they got there.',
  'knowledge+personal': 'Asking students one at a time shows what they know, but it takes a lot of class time.',
  'product+written': 'Writing can show part of a product. A real task shows more of it.',
};
const EV_GOOD = { selected: 'Right questions here can sample a lot of facts quickly.', written: 'Students put their thinking on the page where you can read it.', performance: 'Students show you the work itself, which is the closest thing to the real use.', personal: 'You can follow up on the spot and hear how they think.' };

function evUnit(c) { let u = unitOf(c, App.sel.unit); if (!u) { u = c.units[0] || null; App.sel.unit = u ? u.id : null; } return u; }
const evGoalsSorted = (c, uid) => unitGoals(c, uid).slice().sort((a, b) => PRIORITIES.findIndex((p) => p[0] === a.priority) - PRIORITIES.findIndex((p) => p[0] === b.priority));
const evAssessSorted = (c, uid) => unitAssess(c, uid).slice().sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'major' ? -1 : 1));
const evTitle = (a) => a.title || (a.kind === 'major' ? 'Untitled major assessment' : 'Untitled check');
const evEvidenceFor = (c, gid) => c.assess.filter((a) => (a.goals || []).includes(gid));

function evFitWhy(a) {
  if (!a.targets || !a.targets.length) return 'Choose what this is meant to show, and the tool can say whether the method suits it.';
  const f = methodFit(a);
  if (f === 2) return EV_GOOD[a.method] || 'This method suits what you want to see.';
  const worst = a.targets.reduce((w, t) => ((METHOD_FIT[t] || {})[a.method] < (METHOD_FIT[w] || {})[a.method] ? t : w), a.targets[0]);
  return EV_WHY[worst + '+' + a.method] || 'This method shows these targets only partly.';
}
function evLevelVerdict(c, a) {
  const gs = (a.goals || []).map((id) => goalOf(c, id)).filter(Boolean);
  if (!gs.length) return { tone: 'warn', head: 'Not checked', text: 'Pick the goals this gives evidence of. Then the tool can check the level of thinking.' };
  const top = gs.reduce((m, g) => (g.level > m.level ? g : m), gs[0]);
  if (a.level >= top.level) return { tone: 'good', head: 'Reaches the goals', text: 'It asks for ' + optName(LEVELS, a.level).toLowerCase() + ', as much as the hardest goal it claims (' + optName(LEVELS, top.level).toLowerCase() + ').' };
  return { tone: 'bad', head: 'Falls short', text: 'It asks for ' + optName(LEVELS, a.level).toLowerCase() + ', but the goal "' + short(top.text || 'Untitled goal', 50) + '" is set at ' + optName(LEVELS, top.level).toLowerCase() + '.' };
}
function evVerdicts(c, a) {
  const f = methodFit(a), noT = !a.targets || !a.targets.length, lv = evLevelVerdict(c, a);
  const ft = noT ? ['warn', 'Not checked'] : f === 2 ? ['good', 'Strong fit'] : f === 1 ? ['warn', 'Workable'] : ['bad', 'Poor fit'];
  return '<div class="ev-verdicts"><div class="ev-v"><span class="lbl">Method</span>' + tag(ft[1], ft[0]) + '<span>' + esc(evFitWhy(a)) + '</span></div>' +
    '<div class="ev-v"><span class="lbl">Level</span>' + tag(lv.head, lv.tone) + '<span>' + esc(lv.text) + '</span></div></div>';
}

function evEditor(c, a, u) {
  const p = 'assess:' + a.id + ':', major = a.kind === 'major', gs = evGoalsSorted(c, u.id);
  const lab = (t, hint, key) => '<span class="lbl"' + (key ? ' id="ev-l-' + a.id + '-' + key + '"' : '') + '>' + t + '</span>' + (hint ? '<span class="hint">' + hint + '</span>' : '');
  const grp = (key, inner) => a11yGroup('ev-l-' + a.id + '-' + key, inner), nm = a.title || (major ? 'major assessment' : 'check');
  const m = METHODS.find((x) => x[0] === a.method);
  return evVerdicts(c, a) + '<div class="ev-fields">' +
    '<div class="stack">' + lab('Method', '', 'method') + grp('method', seg(p + 'method', METHODS, a.method)) + '<span class="hint">' + esc(m ? m[2] : '') + '</span></div>' +
    '<div class="stack">' + lab('What it targets', 'Pick all that apply.', 'targets') + grp('targets', chips(p + 'targets', TARGETS, a.targets)) + '</div>' +
    '<div class="stack">' + lab('Thinking level', '', 'level') + grp('level', seg(p + 'level', LEVELS, a.level)) + '<span class="hint">' + esc((LEVELS.find((x) => x[0] === a.level) || [0, 0, ''])[2]) + '</span></div>' +
    '<div class="stack ev-wide">' + lab('Goals it gives evidence of', '', 'goals') + grp('goals', goalPicker(p + 'goals', gs, a.goals)) + '</div>' +
    '<div class="stack">' + lab('Minutes in class') + a11yStep('Minutes in class for ' + nm, p + 'min', a.min, 0, 240, 5) + '</div>' +
    '<div class="stack">' + lab('Minutes outside class') + a11yStep('Minutes outside class for ' + nm, p + 'out', a.out, 0, 600, 5) + '</div>' +
    '<div class="stack">' + lab('Feedback students get', '', 'fb') + grp('fb', seg(p + 'fb', FEEDBACKS, a.fb)) + '</div>' +
    (a.fb !== 'none' ? '<div class="stack">' + lab('Days until it comes back') + a11yStep('Days until feedback comes back for ' + nm, p + 'back', a.back, 0, 60, 1) + '</div>' : '') +
    '<div class="stack">' + lab('Rubric', '', 'rubric') + grp('rubric', seg(p + 'rubric', RUBRICS, a.rubric)) + '</div>' +
    '<div class="stack">' + lab('Retakes allowed', '', 'retake') + grp('retake', seg(p + 'retake', [[true, 'Yes'], [false, 'No']], a.retake)) + '</div>' +
    (major && a.method === 'performance' ? '<div class="stack ev-wide ev-real"><span class="lbl">Make the task real</span><div class="grid3">' +
      '<label class="stack"><span class="hint">The role students take</span>' + field(p + 'role', a.role, 'placeholder="A lab technician writing to a doctor"') + '</label>' +
      '<label class="stack"><span class="hint">The audience</span>' + field(p + 'audience', a.audience, 'placeholder="Parents at a clinic night"') + '</label>' +
      '<label class="stack"><span class="hint">The product</span>' + field(p + 'product', a.product, 'placeholder="A one-page fact sheet"') + '</label></div></div>' : '') +
    '</div>';
}

function evMajorCard(c, a, u) {
  return '<section class="card ev-card ev-major' + (App.sel.assess === a.id ? ' sel' : '') + '" id="ev-' + a.id + '"><div class="row"><span class="tag ink">Major</span><input class="field big grow" data-bind="assess:' + a.id + ':title" value="' + esc(a.title) + '" aria-label="Title of the major assessment">' +
    '<button class="btn sm ghost danger" data-act="evDel" data-arg="' + a.id + '" aria-label="Delete ' + esc(evTitle(a)) + '">Delete</button></div>' + evEditor(c, a, u) + '</section>';
}
function evMinorRow(c, a, u) {
  const open = App.sel.evOpen === a.id || App.sel.assess === a.id, f = methodFit(a);
  const head = '<div class="row ev-minor-h"><button class="ev-toggle grow" data-act="evOpen" data-arg="' + a.id + '" aria-expanded="' + open + '"><span class="ev-caret">' + (open ? '▾' : '▸') + '</span><b>' + esc(short(evTitle(a), 50)) + '</b><span class="hint">' + esc(optName(METHODS, a.method)) + ' · ' + a.min + ' min · ' + plural((a.goals || []).length, 'goal') + '</span></button>' +
    (f === 0 ? tag('Poor fit', 'bad') : '') + '<button class="x" data-act="evDel" data-arg="' + a.id + '" aria-label="Delete ' + esc(evTitle(a)) + '" title="Delete">×</button></div>';
  if (!open) return '<div class="card ev-card ev-minor">' + head + '</div>';
  return '<div class="card ev-card ev-minor sel" id="ev-' + a.id + '">' + head + '<div class="stack"><label class="lbl" for="ev-t-' + a.id + '">Title</label>' + field('assess:' + a.id + ':title', a.title, 'id="ev-t-' + a.id + '"') + '</div>' + evEditor(c, a, u) + '</div>';
}

function evUnitRow(c) {
  return '<div class="ev-units" role="group" aria-label="Choose a unit to work on">' + c.units.map((u, k) => {
    const as = unitAssess(c, u.id), maj = as.filter((a) => a.kind === 'major').length;
    return '<button class="ev-unit' + (App.sel.unit === u.id ? ' on' : '') + '" data-act="sel" data-arg="unit=' + u.id + '" aria-pressed="' + (App.sel.unit === u.id) + '"><b>' + (k + 1) + '. ' + esc(short(u.title || 'Untitled unit', 26)) + '</b>' +
      (maj ? tag(plural(maj, 'major'), 'good') : tag('No major', 'bad')) + '<span class="hint">' + plural(as.length - maj, 'check') + '</span></button>';
  }).join('') + '</div>';
}
function evGoalList(c, u) {
  const gs = evGoalsSorted(c, u.id);
  if (!gs.length) return empty('No goals sit in this unit yet. Goals come first, so you know what the evidence is for.', '<button class="btn pri" data-act="go" data-arg="' + (c.goals.length ? 'sequence' : 'goals') + '">' + (c.goals.length ? 'Place goals in units' : 'Go to Goals') + '</button>');
  return '<div class="ev-goals">' + gs.map((g) => {
    const as = evEvidenceFor(c, g.id), recall = as.length && as.every((a) => a.level <= 1) && g.level >= 2;
    return '<div class="ev-goal' + (as.length ? '' : ' none') + '"><span class="ev-mark" aria-hidden="true">' + (as.length ? '●' : '○') + '</span><div class="grow"><b>' + esc(g.text || 'Untitled goal') + '</b><div class="hint">' +
      (as.length ? 'Shown by ' + esc(as.map((a) => short(evTitle(a), 30)).join(', ')) : 'Nothing would show students reached this.') + '</div></div>' +
      (recall ? tag('Recall only', 'warn') : '') + (as.length ? '' : tag('No evidence', 'bad')) + tag(optName(PRIORITIES, g.priority), g.priority === 'lasting' ? 'ink' : '') + '</div>';
  }).join('') + '</div>';
}
function evGrid(c, u) {
  const gs = evGoalsSorted(c, u.id), as = evAssessSorted(c, u.id);
  if (!gs.length || !as.length) return '<p class="hint">The grid appears once this unit has a goal and an assessment.</p>';
  let h = '<div class="ev-gridwrap"><table class="ev-grid" aria-label="Which assessment gives evidence of which goal"><thead><tr><th class="g" scope="col">Goal</th>' + as.map((a) => '<th scope="col" title="' + esc(evTitle(a)) + '"><span class="ev-col">' + (a.kind === 'major' ? '<i>Major</i>' : '<i>Check</i>') + esc(short(evTitle(a), 28)) + '</span></th>').join('') + '</tr></thead><tbody>';
  for (const g of gs) {
    const none = !evEvidenceFor(c, g.id).length;
    h += '<tr class="' + (none ? 'none' : '') + '"><th class="g" scope="row"><span>' + esc(short(g.text || 'Untitled goal', 70)) + '</span>' + (none ? ' ' + tag('No evidence', 'bad') : '') + '</th>' +
      as.map((a) => { const on = (a.goals || []).includes(g.id); return '<td><button class="ev-cell' + (on ? ' on' : '') + '" data-act="toggle" data-arg="assess:' + a.id + ':goals=' + g.id + '" aria-pressed="' + on + '" aria-label="' + esc(evTitle(a) + ' gives evidence of ' + short(g.text || 'this goal', 40)) + '">' + (on ? '●' : '') + '</button></td>'; }).join('') + '</tr>';
  }
  return h + '</tbody></table></div><p class="hint">Click a cell to say that an assessment gives evidence of a goal. A row with nothing in it is a goal you would never find out about.</p>';
}
function evCourseStrip(c) {
  const n = c.assess.length, count = {};
  c.assess.forEach((a) => (count[a.method] = (count[a.method] || 0) + 1));
  const lasting = c.goals.filter((g) => g.priority === 'lasting'), withE = lasting.filter((g) => evEvidenceFor(c, g.id).length).length;
  return '<div class="ev-course"><div class="stack"><span class="lbl">Methods across the whole course</span>' +
    (n ? '<div class="ev-bar" role="img" aria-label="' + esc('Mix of assessment methods: ' + METHODS.map((m) => m[1] + ' ' + (count[m[0]] || 0)).join(', ')) + '">' + METHODS.filter((m) => count[m[0]]).map((m) => '<i style="flex:' + count[m[0]] + ';background:' + EV_METHOD_COLOR[m[0]] + '" title="' + esc(m[1] + ': ' + count[m[0]]) + '"></i>').join('') + '</div>' +
      '<div class="legend">' + METHODS.map((m) => '<span><i class="dot" style="background:' + EV_METHOD_COLOR[m[0]] + '"></i>' + esc(m[1]) + ' <b class="num">' + (count[m[0]] || 0) + '</b></span>').join('') + '</div>' : '<p class="hint">No assessments yet.</p>') + '</div>' +
    '<div class="stack"><span class="lbl">Lasting goals with evidence</span>' + (lasting.length ? '<div class="ev-big"><b class="num">' + withE + '</b> of ' + lasting.length + '</div><span class="hint">' + (lasting.length - withE ? plural(lasting.length - withE, 'lasting goal') + ' with nothing to show students got there.' : 'Every lasting goal has something that would show it.') + '</span>' : '<p class="hint">No lasting goals yet.</p>') + '</div></div>';
}

VIEWS.evidence = {
  name: 'Evidence',
  render(c) {
    const head = '<div class="ws-head"><div class="eyebrow">Chapter 3</div><h1>What would you need to see?</h1><p>Before you plan a single lesson, decide what you would need to see to believe students got there. Then plan lessons that lead to it.</p></div>';
    const u = evUnit(c);
    if (!u) return '<div class="ws">' + head + empty('Evidence belongs to a unit. Lay out your units first.', '<button class="btn pri" data-act="go" data-arg="sequence">Go to Sequence</button>') + '</div>';
    const as = evAssessSorted(c, u.id), maj = as.filter((a) => a.kind === 'major'), min = as.filter((a) => a.kind === 'minor');
    return '<div class="ws ev">' + head +
      '<div class="panel"><div class="row wrap"><label class="lbl" for="ev-unit">Unit</label><div class="grow">' + pick('ui::unit', c.units.map((x, k) => [x.id, (k + 1) + '. ' + (x.title || 'Untitled unit')]), u.id, 'id="ev-unit"') + '</div></div><div data-live="evunits">' + evUnitRow(c) + '</div></div>' +
      '<div class="panel"><h2>What should students show in \u201c' + esc((u.title || 'this unit').replace(/[?!.]+$/, '')) + '\u201d?<small>Goals, most lasting first</small></h2><div data-live="evgoals">' + evGoalList(c, u) + '</div></div>' +
      '<div class="stack"><div class="row between wrap"><h2 class="ev-h">Major assessments <small class="hint">The big task or test where students show what the unit was for.</small></h2><button class="btn sm pri" data-act="evAdd" data-arg="major">+ Add a major assessment</button></div>' +
      (maj.length ? maj.map((a) => evMajorCard(c, a, u)).join('') : empty('This unit has no major assessment. Without one, nothing says what the unit was for.', '')) + '</div>' +
      '<div class="stack"><div class="row between wrap"><h2 class="ev-h">Smaller checks <small class="hint">Short checks along the way that tell you who is lost while there is still time to help.</small></h2><button class="btn sm" data-act="evAdd" data-arg="minor">+ Add a small check</button></div>' +
      (min.length ? min.map((a) => evMinorRow(c, a, u)).join('') : '<p class="hint">No small checks yet.</p>') + '</div>' +
      '<div class="panel"><h2>Evidence grid<small>Which assessment shows which goal</small></h2><div data-live="evgrid">' + evGrid(c, u) + '</div></div>' +
      '<div class="panel"><h2>Across the whole course</h2><div data-live="evcourse">' + evCourseStrip(c) + '</div></div></div>';
  },
};

MENTOR.evidence = (c) => {
  const u = evUnit(c), out = [];
  if (!u) return ['Lay out your units first. Then come back and decide what you would need to see.'];
  const as = unitAssess(c, u.id), maj = as.filter((a) => a.kind === 'major');
  if (!maj.length) out.push('This unit has no big task. Where do students show you they can use the ideas, not just repeat them?');
  const lastingRecall = c.goals.find((g) => g.priority === 'lasting' && g.level >= 2 && evEvidenceFor(c, g.id).length && evEvidenceFor(c, g.id).every((a) => a.level <= 1 || (a.method === 'selected' && a.targets.every((t) => t === 'knowledge'))));
  if (lastingRecall) out.push('A lasting idea is only measured by recall. Remembering it for Friday is not the same as keeping it.');
  if (c.assess.length >= 3 && c.assess.every((a) => a.method === 'selected')) out.push('Every assessment here is a test. A student who can do the thing but tests badly never gets to show you.');
  if (maj.length && !as.some((a) => a.kind === 'minor')) out.push('Nothing would tell you students are lost before the big task. One ten-minute check a week earlier would.');
  const bare = unitGoals(c, u.id).filter((g) => !evEvidenceFor(c, g.id).length);
  if (bare.length && as.length) out.push('Some goals in this unit have nothing that would show them. If you cannot see it, you cannot teach toward it.');
  if (!out.length) out.push(as.length ? 'This holds together. Now ask of each task: could a student get through it without really understanding?' : 'Start with the big task. What is the one thing you most want to see students do?');
  return out.slice(0, 2);
};

ACT.evOpen = (a) => { const open = App.sel.evOpen === a || App.sel.assess === a; if (open) { App.sel.evOpen = null; if (App.sel.assess === a) App.sel.assess = null; } else App.sel.evOpen = a; };
ACT.evAdd = (a, c) => {
  const u = evUnit(c); if (!u) return;
  const n = a === 'major'
    ? addAssess(c, u.id, { kind: 'major', title: 'Unit task', method: 'performance', targets: ['reasoning', 'product'], level: 3, rubric: 'analytic', fb: 'rubric', min: 50, out: 0, back: 5, goals: [] })
    : addAssess(c, u.id, { kind: 'minor', title: 'Quick check', method: 'selected', targets: ['knowledge'], level: 1, rubric: 'none', fb: 'score', min: 10, out: 0, back: 1, goals: [] });
  App.sel.assess = null; App.sel.evOpen = a === 'minor' ? n.id : null;
};
ACT.evDel = (a, c) => { removeAssess(c, a); if (App.sel.assess === a) App.sel.assess = null; if (App.sel.evOpen === a) App.sel.evOpen = null; };
