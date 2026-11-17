/* Chapter 2, "Scope and sequence": decide what gets the days. Day budget bar, units in teaching order, the tray of goals with no unit,
   and a rough estimate of your own preparation hours. Everything here is prefixed seq / ACT.seq. */
const seqUI = { focusUnit: null, focusQ: null };
const seqSrc = (id) => SOURCES.find((s) => s[0] === id) || SOURCES[0];
/* Preparation hours: SOURCES gives hours per class day for each way of getting materials. A rough guide, not a measurement. */
const seqHours = (u) => seqSrc(u.source)[2] * Math.max(0, u.days || 0);
const seqTotalHours = (c) => sum(c.units.map(seqHours));
const seqHrs = (h) => (h < 10 ? String(Math.round(h * 10) / 10).replace(/\.0$/, '') : String(Math.round(h)));
const seqBufferOk = (c) => Math.max(3, Math.round(availableDays(c) * 0.03));

function seqClean(c) {
  c.units.forEach((u) => { if (!Array.isArray(u.questions)) u.questions = []; if (!u.source || !SOURCES.some((s) => s[0] === u.source)) u.source = 'adopt'; });
  c.goals.forEach((g) => { if (g.unit === '' || (g.unit && !unitOf(c, g.unit))) g.unit = null; });
}

/* ---------- the day budget ---------- */
function seqBudgetHTML(c) {
  const avail = availableDays(c), used = budgetedDays(c), diff = avail - used, total = Math.max(avail, used, 1), pc = (n) => (100 * n / total).toFixed(3) + '%';
  let bar = '<div class="sq-bar" role="img" aria-label="' + esc(used + ' days budgeted of ' + avail + ' available. ' + c.units.map((u, i) => (i + 1) + '. ' + (u.title || 'Untitled') + ', ' + (u.days || 0) + ' days').join('. ') + (used > avail ? '. Over by ' + (used - avail) + ' days.' : '')) + '">';
  c.units.forEach((u, i) => { bar += '<div class="sq-seg s' + (i % 2) + '" style="flex:' + (u.days || 0) + ' 0 0" title="' + esc((i + 1) + '. ' + u.title + ': ' + (u.days || 0) + ' days') + '"><b>' + (i + 1) + '</b><span>' + esc(u.title || 'Untitled') + '</span><i>' + (u.days || 0) + '</i></div>'; });
  if (diff > 0) bar += '<div class="sq-seg spare" style="flex:' + diff + ' 0 0" title="' + diff + ' days of buffer"><span>' + (diff >= total * 0.06 ? 'Buffer' : '') + '</span></div>';
  if (used > avail) bar += '<div class="sq-over" style="left:' + pc(avail) + ';width:' + pc(used - avail) + '"></div>';
  bar += '<div class="sq-last" style="left:' + pc(avail) + '" title="The last day you can plan for"><i>Days available</i></div></div>';
  const ok = seqBufferOk(c), tone = diff < 0 ? 'bad' : diff < ok ? 'warn' : 'good';
  const verdict = diff < 0 ? plural(-diff, 'day') + ' over' : diff === 0 ? 'No buffer' : plural(diff, 'day') + ' of buffer';
  const words = 'Your units add up to <b>' + plural(used, 'class day') + '</b>. The calendar gives you <b>' + avail + '</b> after the ' + plural(c.school.lost || 0, 'day') + ' you set aside for assemblies, drills, testing and weather. ' +
    (diff < 0 ? 'That is <b>' + plural(-diff, 'day') + ' more than you have.' : diff === 0 ? 'That leaves <b>no buffer</b>, and some days will be lost.' : 'That leaves <b>' + plural(diff, 'day') + '</b> of buffer' + (diff < ok ? ', which is thin.' : '.')) + (diff < 0 ? '</b>' : '');
  let cut = '';
  if (diff < 0) {
    const fam = c.goals.filter((g) => g.priority === 'familiar');
    cut = '<div class="sq-cut"><div class="lbl">First to cut: goals marked Worth meeting</div>' + (fam.length
      ? '<div class="chips">' + fam.map((g) => { const u = unitOf(c, g.unit); return '<span class="chip" title="' + esc(g.text) + '">' + esc(short(g.text || 'Untitled goal', 48)) + (u ? ' <i>' + esc(short(u.title, 18)) + '</i>' : '') + '</span>'; }).join('') + '</div><p class="hint">Dropping a goal only saves days when you also shorten the unit it sits in.</p>'
      : '<p class="hint">No goals are marked Worth meeting. Look at the Important ones next, or shorten a unit.</p>') + '</div>';
  }
  return '<div class="sq-stats"><div><span class="lbl">Days budgeted</span><b class="num">' + used + '</b></div><div><span class="lbl">Days available</span><b class="num">' + avail + '</b></div>' +
    '<div><span class="lbl">' + (diff < 0 ? 'Overrun' : 'Buffer left') + '</span><b class="num ' + tone + '">' + Math.abs(diff) + '</b></div><span class="tag ' + tone + '">' + verdict + '</span></div>' + bar + '<p class="sq-words">' + words + '</p>' + cut;
}

/* ---------- units ---------- */
function seqUnitCard(c, u, k) {
  const p = 'unit:' + u.id + ':', src = seqSrc(u.source), mine = unitGoals(c, u.id), free = c.goals.filter((g) => !g.unit);
  const hasLast = mine.some((g) => g.priority === 'lasting');
  const qs = u.questions.map((q, i) => '<div class="row"><input class="field" data-seqq="' + u.id + ':' + i + '" value="' + esc(q) + '" placeholder="A question with no single right answer" aria-label="Question ' + (i + 1) + ' for unit ' + (k + 1) + '"><button class="x" data-act="seqQDel" data-arg="' + u.id + '=' + i + '" aria-label="Remove question ' + (i + 1) + ' from unit ' + (k + 1) + '">×</button></div>').join('');
  const groups = PRIORITIES.map((pr) => { const gs = mine.filter((g) => g.priority === pr[0]); if (!gs.length) return ''; return '<div class="sq-grp"><span class="tag ' + (pr[0] === 'lasting' ? 'ink' : '') + '">' + esc(pr[1]) + '</span><span class="chips">' + gs.map((g) => '<button class="chip" data-act="seqUnplace" data-arg="' + g.id + '" title="' + esc((g.text || 'Untitled goal') + ' (click to take it out of this unit)') + '">' + esc(short(g.text || 'Untitled goal', 44)) + ' ×</button>').join('') + '</span></div>'; }).join('');
  const place = free.length ? '<select class="pick" data-seqgoalto="' + u.id + '" aria-label="Place a goal in unit ' + (k + 1) + '"><option value="">Place a goal here…</option>' + free.map((g) => '<option value="' + g.id + '">' + esc(short((g.text || 'Untitled goal'), 60)) + '</option>').join('') + '</select>' : '<p class="hint">Every goal already has a unit.</p>';
  return '<section class="sq-unit" id="sq-' + u.id + '"><div class="sq-uhead"><span class="sq-n" aria-hidden="true">' + (k + 1) + '</span>' +
    '<input class="field big grow" data-bind="' + p + 'title" value="' + esc(u.title) + '" aria-label="Unit ' + (k + 1) + ' title"><div class="sq-days"><span class="lbl">Days</span>' + a11yStep('Days in unit ' + (k + 1), p + 'days', u.days || 0, 1, 150, 1) + '</div>' +
    '<div class="sq-tools"><button class="btn sm ghost" data-act="seqMove" data-arg="' + u.id + '=-1"' + (k === 0 ? ' disabled' : '') + ' aria-label="Move this unit earlier">↑ Earlier</button><button class="btn sm ghost" data-act="seqMove" data-arg="' + u.id + '=1"' + (k === c.units.length - 1 ? ' disabled' : '') + ' aria-label="Move this unit later">↓ Later</button><button class="btn sm ghost danger" data-act="seqDel" data-arg="' + u.id + '" aria-label="Delete unit ' + (k + 1) + '">Delete</button></div></div>' +
    '<div class="sq-body"><div class="stack"><h3 class="sec-h">Questions that drive this unit</h3><p class="hint">Open questions worth arguing about, with no single right answer. For example: can you trust the person telling the story?</p>' + qs +
    '<div><button class="btn sm" data-act="seqQAdd" data-arg="' + u.id + '">+ Add a question</button></div></div>' +
    '<div class="stack"><h3 class="sec-h">Goals in this unit ' + (hasLast || !mine.length ? '' : '<span class="tag warn">No lasting goal</span>') + '</h3>' + (mine.length ? groups : '<p class="hint">No goals placed here yet.</p>') + place + '</div></div>' +
    '<div class="sq-src"><div class="stack"><span class="lbl" id="sq-srcl-' + u.id + '">Where the materials come from</span>' + a11yGroup('sq-srcl-' + u.id, seg(p + 'source', SOURCES.map((s) => [s[0], s[1], s[3]]), u.source)) + '<p class="hint"><b>' + esc(src[1]) + '.</b> ' + esc(src[3]) + '</p>' +
    '<p class="sq-hrs" data-live="seqhrs-' + u.id + '">Your preparation: about <b class="num">' + seqHrs(seqHours(u)) + ' hours</b> <span class="hint">(' + src[2] + ' hours for each class day, times ' + (u.days || 0) + ' days)</span></p></div>' +
    '<div class="stack"><label class="lbl" for="sq-sn-' + u.id + '">Which book, colleague or sites</label>' + field(p + 'sourceNote', u.sourceNote || '', 'id="sq-sn-' + u.id + '" placeholder="Optional"') +
    '<label class="lbl" for="sq-nt-' + u.id + '">Notes to yourself</label>' + area(p + 'note', u.note || '', 'id="sq-nt-' + u.id + '" rows="2" placeholder="Optional"') + '</div></div></section>';
}

function seqTrayHTML(c) {
  const free = c.goals.filter((g) => !g.unit);
  if (!c.goals.length) return '';
  if (!free.length) return '<section class="panel"><h2>Goals not yet placed <small>None. Every goal has a unit.</small></h2></section>';
  const opts = '<option value="">Put in a unit…</option>' + c.units.map((u, i) => '<option value="' + u.id + '">' + esc((i + 1) + '. ' + short(u.title || 'Untitled unit', 34)) + '</option>').join('');
  return '<section class="panel sq-tray"><h2>Goals not yet placed <small>' + free.length + '</small></h2><p class="hint">These goals are not in any unit, so no days are set aside for them. Place each one, or decide it does not belong in the course.</p>' +
    '<div class="sq-trayl">' + free.map((g) => '<div class="sq-tg"><span class="tag ' + (g.priority === 'lasting' ? 'ink' : '') + '">' + esc(optName(PRIORITIES, g.priority) || g.priority) + '</span><span class="sq-tgt" title="' + esc(g.text) + '">' + esc(short(g.text || 'Untitled goal', 90)) + '</span>' +
      (c.units.length ? '<select class="pick" data-sequnitfor="' + g.id + '" aria-label="Put ' + esc('“' + short(g.text || 'Untitled goal', 40) + '”') + ' in a unit">' + opts + '</select>' : '') + '</div>').join('') + '</div></section>';
}

function seqTotalHTML(c) {
  const tot = seqTotalHours(c);
  const by = SOURCES.map((s) => { const us = c.units.filter((u) => u.source === s[0]); return us.length ? '<li><span>' + esc(s[1]) + ' <i>' + plural(us.length, 'unit') + '</i></span><b class="num">about ' + seqHrs(sum(us.map(seqHours))) + ' hours</b></li>' : ''; }).join('');
  return '<div class="sq-tot"><div><span class="lbl">Your preparation hours, whole year</span><b class="num sq-big">about ' + seqHrs(tot) + ' hours</b></div><ul class="sq-by">' + by + '</ul></div>' +
    '<p class="hint">This is a rough estimate, built from typical hours per class day for each way of getting materials. Adjust it to your own pace. Most new teachers need more time in the first year.</p>';
}

VIEWS.sequence = {
  name: 'Sequence',
  render(c) {
    seqClean(c);
    const units = c.units.length ? c.units.map((u, k) => seqUnitCard(c, u, k)).join('') : empty('A unit is a chunk of the course with one big purpose, usually two to six weeks. Add your first one.');
    return '<div class="ws sq"><div class="ws-head"><div class="eyebrow">Chapter 2</div><h1>Scope and sequence</h1>' +
      '<p>Scope is what the course covers. Sequence is the order. You cannot teach everything, so decide what gets the days.</p></div>' +
      '<div class="sq-narrow">' + mentor(MENTOR.sequence(c)) + '</div>' +
      '<section class="panel"><h2>The day budget <small>one segment for each unit</small></h2><div data-live="seqbudget">' + seqBudgetHTML(c) + '</div></section>' +
      '<h2 class="sq-sec">Units, in teaching order</h2><div class="sq-units">' + units + '</div><div><button class="btn pri" data-act="seqAdd">+ Add a unit</button></div>' +
      seqTrayHTML(c) +
      '<section class="panel"><h2>Preparation time <small>a rough estimate</small></h2><div data-live="seqtotal">' + seqTotalHTML(c) + '</div></section></div>';
  },
  after(root) {
    if (seqUI.focusUnit) { const t = root.querySelector('[data-bind="unit:' + seqUI.focusUnit + ':title"]'); seqUI.focusUnit = null; if (t) { t.focus({ preventScroll: true }); t.select(); t.scrollIntoView({ block: 'center' }); } }
    if (seqUI.focusQ) { const t = root.querySelector('[data-seqq="' + seqUI.focusQ + '"]'); seqUI.focusQ = null; if (t) t.focus({ preventScroll: true }); }
  },
};

MENTOR.sequence = (c) => {
  const out = [], avail = availableDays(c), used = budgetedDays(c), diff = avail - used;
  if (!c.units.length) return ['Start with the big chunks of the year. Three to eight units is plenty. Name each by what students will be able to do.'];
  if (diff < 0) out.push('You are ' + plural(-diff, 'day') + ' over. Something has to leave now, at your desk, not in April.');
  else if (diff < seqBufferOk(c)) out.push('There is almost no buffer. Fire drills, snow days and flu will take days. Give yourself some room.');
  const bare = c.units.find((u) => !c.goals.some((g) => g.unit === u.id && g.priority === 'lasting'));
  if (bare && out.length < 2) out.push('“' + esc(short(bare.title || 'Untitled unit', 28)) + '” has no lasting goal. Why is it in the course?');
  if (out.length < 2 && c.units.length >= 2 && c.units.every((u) => u.source === 'build')) out.push('Every unit is set to build it yourself. That is a heavy first year. Which one could you borrow?');
  const loose = c.goals.filter((g) => !g.unit).length;
  if (out.length < 2 && loose) out.push(plural(loose, 'goal') + ' ' + (loose === 1 ? 'has' : 'have') + ' no unit yet. Place ' + (loose === 1 ? 'it' : 'them') + ' or cut ' + (loose === 1 ? 'it' : 'them') + '.');
  if (!out.length) out.push('The budget holds together. Now read each unit’s questions aloud. Would students argue about them?');
  return out.slice(0, 2);
};

/* ---------- actions ---------- */
ACT.seqAdd = (a, c) => { const u = addUnit(c, { title: 'New unit', days: 10 }); seqUI.focusUnit = u.id; };
ACT.seqMove = (a, c) => { const p = a.split('='), i = c.units.findIndex((u) => u.id === p[0]), j = i + +p[1]; if (i < 0 || j < 0 || j >= c.units.length) return; const t = c.units[i]; c.units[i] = c.units[j]; c.units[j] = t; };
ACT.seqDel = (a, c) => {
  const u = unitOf(c, a); if (!u) return false;
  const nl = unitLessons(c, a).length, na = unitAssess(c, a).length, ng = unitGoals(c, a).length;
  openModal('<div class="sq-mod"><h2 id="sq-del-h">Delete “' + esc(short(u.title || 'Untitled unit', 50)) + '”?</h2><p>This unit has ' + plural(u.days || 0, 'day') + ' budgeted. Deleting it also deletes its <b>' + plural(nl, 'lesson') + '</b> and <b>' + plural(na, 'assessment') + '</b>.</p>' +
    '<p class="hint">' + (ng ? plural(ng, 'goal') + ' in this unit stay in your course and move to the tray of goals not yet placed.' : 'No goals are placed in it.') + ' This cannot be undone.</p>' +
    '<div class="foot"><button class="btn" data-act="closeModal">Keep the unit</button><button class="btn pri" data-act="seqDelYes" data-arg="' + a + '">Delete the unit</button></div></div>');
  const keep = document.querySelector('#modal [data-act="closeModal"]'); if (keep) keep.focus({ preventScroll: true });
  return false;
};
ACT.seqDelYes = (a, c) => { closeModal(); removeUnit(c, a); if (App.sel.unit === a) { App.sel.unit = null; App.sel.lesson = null; } toast('Unit deleted.'); };
ACT.seqUnplace = (a, c) => { const g = goalOf(c, a); if (g) g.unit = null; };
ACT.seqQAdd = (a, c) => { const u = unitOf(c, a); if (!u) return; u.questions.push(''); seqUI.focusQ = a + ':' + (u.questions.length - 1); };
ACT.seqQDel = (a, c) => { const p = a.split('='), u = unitOf(c, p[0]); if (u) u.questions.splice(+p[1], 1); };

/* Typing in a question and the two "place a goal" selects are handled here, because data-bind cannot reach inside a list. */
document.addEventListener('input', (ev) => {
  const el = ev.target; if (!el.dataset || el.dataset.seqq == null || !App.c) return;
  const p = el.dataset.seqq.split(':'), u = unitOf(App.c, p[0]); if (u) { u.questions[+p[1]] = el.value; save(); }
});
document.addEventListener('change', (ev) => {
  const el = ev.target; if (!el.dataset || !App.c || !el.value) return;
  if (el.dataset.seqgoalto != null) { const g = goalOf(App.c, el.value); if (g) g.unit = el.dataset.seqgoalto; save(); render(); }
  else if (el.dataset.sequnitfor != null) { const g = goalOf(App.c, el.dataset.sequnitfor); if (g && unitOf(App.c, el.value)) g.unit = el.value; save(); render(); }
});
