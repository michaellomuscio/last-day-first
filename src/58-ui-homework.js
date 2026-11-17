/* Chapter 6, Homework: an overview of the evenings the plan spends. Homework itself is set on each lesson (lesson.hw);
   this screen shows it across the class days and lets the teacher adjust quickly. Research notes follow research/03, section 9. */
const HWV_COLOR = { practice: '#2d62ad', review: '#2e7d4f', prepare: '#c9822b', extend: '#8b6bb5', finish: '#62748e' };
const HWV_SHADES = ['#17171b', '#4b4a52', '#85818a', '#b9b2a2', '#d6cdbb', '#e9e2d3'];

/* Which unit the chart and list show: "all" or a unit id. It follows the shared unit until the teacher picks here. */
function hwvScope(c) {
  if (App.sel.hwvSeen !== App.sel.unit || App.sel.hwvScope === undefined) { App.sel.hwvSeen = App.sel.unit; App.sel.hwvScope = unitOf(c, App.sel.unit) ? App.sel.unit : c.units[0] ? c.units[0].id : 'all'; }
  if (App.sel.hwvScope !== 'all' && !unitOf(c, App.sel.hwvScope)) App.sel.hwvScope = 'all';
  return App.sel.hwvScope;
}
const hwvUnits = (c, scope) => (scope === 'all' ? c.units : c.units.filter((u) => u.id === scope));
const hwvLessons = (c, scope) => hwvUnits(c, scope).reduce((a, u) => a.concat(unitLessons(c, u.id)), []);
const hwvPct = (x, tot) => (tot > 0 ? Math.round((100 * x) / tot) : 0);
const hwvName = (table, id) => optName(table, id) || id;

function hwvChart(c, scope, H) {
  const days = courseDays(c).filter((d) => scope === 'all' || d.unit === scope), limit = c.intent && c.intent.hw > 0 ? c.intent.hw : 0;
  if (!days.length) return '<p class="hint">No class days yet.</p>';
  let top = Math.max(limit * 1.25, H.max * 1.1, 30); const tick = top > 90 ? 30 : 15; top = Math.ceil(top / tick) * tick;
  const pc = (m) => (100 * m / top).toFixed(2) + '%';
  const groups = hwvUnits(c, scope).map((u) => ({ u, ds: days.filter((d) => d.unit === u.id) })).filter((g) => g.ds.length);
  const bars = groups.map((g) => '<div class="hwv-grp" style="flex:' + g.ds.length + '">' + g.ds.map((d) => {
    const when = 'Day ' + (d.i + 1) + (d.date ? ', ' + niceDate(d.date) : '');
    if (!d.lesson) return '<span class="hwv-col empty" title="' + esc(when + ': no lesson planned yet') + '"></span>';
    const jump = esc(JSON.stringify({ view: 'lessons', unit: d.unit, lesson: d.lesson.id }));
    if (!d.hw) return '<button class="hwv-col none" data-act="jump" data-arg="' + jump + '" title="' + esc(when + ': ' + d.lesson.title + '. No homework.') + '" aria-label="' + esc(when + ', no homework') + '"><s></s></button>';
    const h = d.hw;
    return '<button class="hwv-col" data-act="jump" data-arg="' + jump + '" title="' + esc(when + ': ' + d.lesson.title + '. ' + h.min + ' min, ' + hwvName(HW_PURPOSES, h.purpose).toLowerCase() + '.') + '" aria-label="' + esc(when + ', ' + h.min + ' minutes' + (limit && h.min > limit ? ', over your limit' : '')) + '"><i class="' + (limit && h.min > limit ? 'over' : '') + '" style="height:' + pc(h.min) + ';background:' + HWV_COLOR[h.purpose] + '"></i></button>';
  }).join('') + '</div>').join('');
  const labels = groups.map((g) => '<div class="hwv-lab" style="flex:' + g.ds.length + '" title="' + esc(g.u.title) + '"><span>' + esc(g.u.title) + '</span></div>').join('');
  let grid = ''; for (let m = tick; m <= top; m += tick) grid += '<div class="hwv-gl" style="bottom:' + pc(m) + '"><span>' + m + '</span></div>';
  const nOver = limit ? days.filter((d) => d.hw && d.hw.min > limit).length : 0, nHw = days.filter((d) => d.hw && d.hw.min > 0).length, mx = days.reduce((m, d) => Math.max(m, d.hw ? d.hw.min : 0), 0);
  const summary = 'Across ' + plural(days.length, 'class day') + ', ' + nHw + (nHw === 1 ? ' has' : ' have') + ' homework. The longest night is ' + mx + ' minutes.' + (limit ? ' ' + (nOver ? plural(nOver, 'night') + (nOver === 1 ? ' is' : ' are') + ' over your limit of ' + limit + ' minutes, drawn with stripes.' : 'No night is over your limit of ' + limit + ' minutes.') : '');
  return '<p class="hwv-sum hint" id="hwv-sum">' + esc(summary) + '</p><div class="hwv-scroll"><div class="hwv-chart" role="group" aria-label="Minutes of homework each class day" aria-describedby="hwv-sum" style="--n:' + days.length + '"><div class="hwv-plot"><div class="hwv-axis">' + grid + '</div>' + (limit ? '<div class="hwv-limit" style="bottom:' + pc(limit) + '"><span>your limit: ' + limit + ' min</span></div>' : '') + '<div class="hwv-bars">' + bars + '</div></div>' +
    '<div class="hwv-labs">' + labels + '</div></div></div>' +
    '<div class="legend">' + HW_PURPOSES.map((p) => '<span><i class="dot" style="background:' + HWV_COLOR[p[0]] + '"></i>' + esc(p[1]) + '</span>').join('') + '<span><i class="hwv-sw-over" aria-hidden="true"></i>Striped bar: over your limit</span><span class="hint">Gaps are nights with no homework. Minutes per night. Click a bar to open its lesson.</span></div>';
}

function hwvSplit(title, table, data, colors, total) {
  const keys = table.filter((t) => data[t[0]] > 0);
  if (!keys.length || !total) return '<div class="stack"><span class="lbl">' + title + '</span><span class="hint">No homework yet.</span></div>';
  const col = (k, i) => (colors ? colors[k[0]] : HWV_SHADES[i % HWV_SHADES.length]);
  return '<div class="stack"><span class="lbl">' + title + '</span><div class="hwv-split" role="img" aria-label="' + esc(title + ': ' + keys.map((k) => k[1] + ' ' + hwvPct(data[k[0]], total) + ' percent').join(', ')) + '">' + keys.map((k, i) => '<i style="flex:' + data[k[0]] + ';background:' + col(k, i) + '" title="' + esc(k[1] + ': ' + hwvPct(data[k[0]], total) + '%') + '"></i>').join('') + '</div>' +
    '<div class="hwv-keys">' + keys.map((k, i) => '<span><i style="background:' + col(k, i) + '"></i>' + esc(k[1]) + ' <b class="num">' + hwvPct(data[k[0]], total) + '%</b></span>').join('') + '</div></div>';
}

function hwvSummary(c, scope, H) {
  if (!H.days) return '<p class="hint">There are no planned lessons here yet, so there is nothing to add up.</p>';
  const limit = c.intent && c.intent.hw > 0 ? c.intent.hw : 0;
  return '<div class="hwv-figs"><div class="hwv-fig"><b>' + H.nights + '<small> of ' + H.days + '</small></b><span>nights have homework</span></div>' +
    '<div class="hwv-fig"><b>' + Math.round(H.avgNight) + '<small> min</small></b><span>on a typical night with homework</span></div>' +
    '<div class="hwv-fig' + (limit && H.max > limit ? ' warn' : '') + '"><b>' + H.max + '<small> min</small></b><span>on the longest night' + (limit && H.max > limit ? ', over your limit of ' + limit : '') + '</span></div>' +
    '<div class="hwv-fig"><b>' + hwvPct(H.device, H.total) + '<small>%</small></b><span>of homework minutes need a device or internet</span></div></div>' +
    '<div class="hwv-splits">' + hwvSplit('By purpose', HW_PURPOSES, H.purpose, HWV_COLOR, H.total) + hwvSplit('By kind', HW_KINDS, H.kind, null, H.total) + hwvSplit('By feedback', HW_FEEDBACK, H.fb, null, H.total) + hwvSplit('By grading', HW_GRADING, H.graded, null, H.total) + '</div>' +
    (H.device ? '<p class="hint">Not every student has a device or a connection at home. Plan what those students do.</p>' : '');
}

function hwvRow(c, l, multi) {
  const h = l.hw, p = 'hw:' + l.id + ':', u = unitOf(c, l.unit), jump = esc(JSON.stringify({ view: 'lessons', unit: l.unit, lesson: l.id }));
  const lt = l.title || 'Untitled lesson', open = '<button class="btn sm ghost" data-act="jump" data-arg="' + jump + '" aria-label="Open lesson ' + esc(lt) + '">Open lesson</button>';
  const t = '<div class="hwv-t"><b>' + esc(l.title || 'Untitled lesson') + '</b><span class="hint">' + (l.days > 1 ? l.days + ' days' : '1 day') + (h ? ' · ' + esc(hwvName(HW_KINDS, h.kind)) + ' · ' + esc(h.fb === 'none' ? 'no feedback' : hwvName(HW_FEEDBACK, h.fb).toLowerCase()) + ' · ' + esc(hwvName(HW_GRADING, h.graded).toLowerCase()) + (h.device ? ' · needs a device' : '') : '') + '</span></div>';
  if (!h) return '<div class="hwv-row">' + t + '<span class="hint hwv-no">No homework</span><span class="hwv-end"><button class="btn sm" data-act="hwvAdd" data-arg="' + l.id + '" aria-label="Add homework to ' + esc(lt) + '">+ Add homework</button>' + open + '</span></div>';
  return '<div class="hwv-row">' + t + '<span class="hwv-ctl">' + a11yStep('Homework minutes for ' + lt, p + 'min', h.min, 0, 240, 5) + '<span class="hint">min</span></span>' + a11yGroupL('Purpose of the homework for ' + lt, seg(p + 'purpose', HW_PURPOSES, h.purpose)) +
    '<span class="hwv-end"><button class="btn sm ghost danger" data-act="hwvDel" data-arg="' + l.id + '" aria-label="Remove homework from ' + esc(lt) + '">Remove</button>' + open + '</span></div>';
}

/* Time estimator. Nothing here is saved; it lives on App.sel only. */
function hwvEst() {
  const s = App.sel, kind = s.hwvKind || 'reading', n = (k, d) => (s[k] == null || isNaN(s[k]) ? d : +s[k]);
  const E = { kind, pages: n('hwvPages', 8), perPage: n('hwvPer', 3), count: n('hwvCount', 10), each: n('hwvEach', 3), words: n('hwvWords', 400), wpm: n('hwvWpm', 10) };
  E.min = kind === 'reading' ? E.pages * E.perPage : kind === 'problems' ? E.count * E.each : E.wpm > 0 ? E.words / E.wpm : 0;
  return E;
}
function hwvEstResult(E) {
  const m = Math.round(E.min), slow = Math.round(E.min * 2);
  return '<div class="hwv-est-out"><b class="num">' + m + '</b> minutes for a student working at your pace.<span class="hint">If the slowest quarter of your class takes twice as long, which is only an example, they spend about <b class="num">' + slow + '</b> minutes.</span></div>';
}
function hwvEstimator() {
  const E = hwvEst(), num = (k, v, label, max) => '<label class="stack"><span class="hint">' + label + '</span><input class="field" type="number" min="0" max="' + max + '" data-bind="ui::' + k + '" data-num value="' + v + '" aria-label="' + label + '"></label>';
  const inputs = E.kind === 'reading' ? num('hwvPages', E.pages, 'Pages', 200) + num('hwvPer', E.perPage, 'Minutes per page', 30) : E.kind === 'problems' ? num('hwvCount', E.count, 'How many problems', 100) + num('hwvEach', E.each, 'Minutes each', 30) : num('hwvWords', E.words, 'Words to write', 5000) + num('hwvWpm', E.wpm, 'Words per minute', 60);
  return '<div class="panel hwv-est"><h2>How long will it take?<small>A quick estimate. Nothing is saved.</small></h2>' + a11yGroupL('Kind of homework to estimate', seg('ui::hwvKind', [['reading', 'Reading'], ['problems', 'Problems'], ['writing', 'Writing']], E.kind)) +
    '<div class="grid2 hwv-est-in">' + inputs + '</div><div data-live="hwest">' + hwvEstResult(E) + '</div>' +
    '<p class="hint">Teachers usually underestimate how long students take. You know the work, so it feels quick. The slowest quarter of a class often needs far longer than the fastest quarter, and it is those students who give up first. Try the homework yourself, slowly, and watch the clock.</p></div>';
}

function hwvResearch() {
  return '<div class="panel hwv-res"><h2>What studies found<small>Findings from studies, not rules for your class</small></h2><ul>' +
    '<li>A large review of studies (Cooper, Robinson and Patall, 2006) found that homework was linked with higher achievement, and more strongly in high school than in younger grades.</li>' +
    '<li>In the same review, for older high school students, the link levelled off at about two hours a night. More than that was not linked with higher grades.</li>' +
    '<li>Most of those studies compared students who did different amounts of homework. They did not assign it at random, so students who are more able or motivated may simply do more. Treat the two hours as a rough marker, not a cause.</li>' +
    '<li>Surveys at a set of high-performing California high schools (Galloway, Conner and Pope, 2013) found students averaging over three hours a night, linked with stress and health problems. Those schools are well off and not typical.</li>' +
    '<li>Classroom guidance from the US Institute of Education Sciences suggests that homework is a chance to see earlier material again, spread over days. Studies of this are mostly small.</li>' +
    '<li>The old rule of ten minutes per grade level is a habit, not a finding.</li></ul>' +
    '<p class="hint">This tool sees only your homework. Your students have other classes on the same night.</p></div>';
}

VIEWS.homework = {
  name: 'Homework',
  render(c) {
    const head = '<div class="ws-head"><div class="eyebrow">Chapter 6</div><h1>Homework</h1><p>Homework spends your students\' evenings, and you share those evenings with every other teacher they have. Set it on each lesson, then use this page to see the whole picture and adjust it.</p></div>';
    if (!c.units.length) return '<div class="ws">' + head + empty('Homework follows lessons, and lessons belong to units. Lay out your units first.', '<button class="btn pri" data-act="go" data-arg="sequence">Go to Sequence</button>') + '</div>';
    const scope = hwvScope(c), ls = hwvLessons(c, scope), H = homeworkStats(c, ls), multi = scope === 'all';
    const sel = '<div class="panel"><div class="row wrap"><label class="lbl" for="hwv-scope">Show</label><div class="grow">' + pick('ui::hwvScope', [['all', 'All units']].concat(c.units.map((x, k) => [x.id, (k + 1) + '. ' + (x.title || 'Untitled unit')])), scope, 'id="hwv-scope"') + '</div></div></div>';
    if (!c.lessons.length || !ls.length) return '<div class="ws hwv">' + head + sel + empty(multi || !c.lessons.length ? 'There are no lessons to attach homework to yet.' : 'This unit has no lessons yet. Homework is set on a lesson.', '<button class="btn pri" data-act="go" data-arg="lessons">Go to Lessons</button>') +
      hwvEstimator() + hwvResearch() + '</div>';
    let list = '';
    for (const u of hwvUnits(c, scope)) { const us = unitLessons(c, u.id); if (!us.length) continue; list += (multi ? '<h3 class="sec-h hwv-uh">' + esc(u.title) + '</h3>' : '') + us.map((l) => hwvRow(c, l, multi)).join(''); }
    return '<div class="ws hwv">' + head + sel +
      '<div class="panel"><h2>Minutes per night<small>Every class day, in order</small></h2><div data-live="hwchart">' + hwvChart(c, scope, H) + '</div></div>' +
      '<div class="panel"><h2>In plain numbers</h2><div data-live="hwsum">' + hwvSummary(c, scope, H) + '</div></div>' +
      '<div class="panel"><h2>Homework by lesson<small>Change it here or open the lesson</small></h2><div class="hwv-list">' + list + '</div></div>' +
      hwvEstimator() + hwvResearch() + '</div>';
  },
};

MENTOR.homework = (c) => {
  const out = [], hw = c.lessons.filter((l) => l.hw && l.hw.min > 0), limit = c.intent && c.intent.hw > 0 ? c.intent.hw : 0;
  if (!c.lessons.length) return ['Plan a few lessons first. Then decide what, if anything, goes home after each one.'];
  if (!hw.length) return ['No homework yet. That can be a good choice. Make it on purpose, not by default.'];
  const over = limit ? hw.filter((l) => l.hw.min > limit) : [];
  if (over.length) out.push('Some nights ask for more than the limit you set yourself. Remember your students have other teachers too.');
  if (hw.some((l) => l.hw.fb === 'none')) out.push('Some homework gets no feedback at all. Even a quick check the next day tells you who is stuck, and tells them it was worth doing.');
  if (hw.length >= 3 && !hw.some((l) => l.hw.purpose === 'review')) out.push('It is all practice on the day\'s lesson. Where do students meet last month\'s ideas again?');
  if (hw.some((l) => l.hw.device)) out.push('A night needs a device or internet. Not every student has one at home. What is the plan for them?');
  if (!out.length) out.push('This looks sensible. Do one assignment yourself, slowly, and time it.');
  return out.slice(0, 2);
};

ACT.hwvAdd = (a, c) => { const l = lessonOf(c, a); if (!l) return; l.hw = newHomework(); l.hw.goals = unitGoals(c, l.unit).slice(0, 1).map((g) => g.id); };
ACT.hwvDel = (a, c) => { const l = lessonOf(c, a); if (l) l.hw = null; };
