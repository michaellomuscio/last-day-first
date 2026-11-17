/* Chapter 4, Pacing guide: put the units on real dates. School settings, the headline numbers, and the year as month grids.
   Click a weekday to make it a day off. Every top-level name here starts with cal. */

/* Twelve unit colors. Mid-dark so white numbers stay readable, and distinct enough to tell apart in a black and white print by their order in the legend. */
const CAL_COLORS = ['#2d62ad', '#b5502a', '#2e7d4f', '#7a4fa3', '#946700', '#1f7f86', '#a8325e', '#5b6f1e', '#44546a', '#a85616', '#6a3d2a', '#2b6fb0'];   // each reaches 4.5 to 1 against white text
/* The one day that can be reached with Tab. Arrow keys move it. */
const calUI = { cur: null, tab: null };
const calUnitColor = (i) => CAL_COLORS[((i % CAL_COLORS.length) + CAL_COLORS.length) % CAL_COLORS.length];
const CAL_DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const calIsoOk = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || '') && !isNaN(dateOf(s).getTime());
const calLong = (iso) => CAL_DOW[dateOf(iso).getDay()] + ', ' + niceDate(iso);
function calStartYear(c) { const d = dateOf(c.school.start); return d.getMonth() < 6 ? d.getFullYear() - 1 : d.getFullYear(); }

/* Everything the calendar draws, worked out once. */
function calModel(c) {
  const ok = calIsoOk(c.school.start) && calIsoOk(c.school.end) && c.school.start <= c.school.end;
  if (!ok) return { ok: false };
  const dates = meetingDates(c), days = courseDays(c), idx = {}; dates.forEach((d, i) => (idx[d] = i));
  const spans = unitSpans(c), avail = availableDays(c), used = budgetedDays(c);
  return { ok: true, dates, days, idx, spans, avail, used, off: new Set(c.school.off || []), planned: days.filter((d) => d.lesson).length, buffer: Math.max(0, dates.length - days.length), left: avail - used };
}

function calCell(c, M, iso) {
  const d = dateOf(iso), n = d.getDate();
  if (iso < c.school.start || iso > c.school.end) return '<span class="cal-d gap" aria-hidden="true"></span>';
  const i = M.idx[iso], off = M.off.has(iso), btn = (cls, style, title, inner) => '<button class="cal-d ' + cls + '" data-act="calDay" data-arg="' + iso + '"' + (style ? ' style="' + style + '"' : '') + ' tabindex="' + (iso === calUI.tab ? 0 : -1) + '" title="' + esc(title) + '" aria-label="' + esc(title) + '"><span class="cal-n" aria-hidden="true">' + n + '</span>' + (inner || '') + '</button>';
  if (off) return btn('off', '', calLong(iso) + '. Day off. Click to make it a school day again.');
  if (i == null) return btn('none', '', calLong(iso) + '. Your class does not meet. Click to mark a day off.');
  const day = M.days[i];
  if (!day) return btn('buf', '', calLong(iso) + '. Open day, after your last unit. Click to mark a day off.');
  const u = unitOf(c, day.unit), k = c.units.indexOf(u);
  return btn('u', 'background:' + calUnitColor(k), calLong(iso) + '. Unit ' + (k + 1) + ': ' + (u ? u.title : '') + (day.lesson ? '. Lesson: ' + day.lesson.title : '. No lesson planned yet') + '. Click to mark a day off.', '<span class="cal-un" aria-hidden="true">' + (k + 1) + '</span>' + (day.lesson ? '<i class="cal-mk"></i>' : ''));
}
function calMonth(c, M, y, m) {
  const last = new Date(y, m + 1, 0).getDate(); let cells = [], col = 0;
  for (let n = 1; n <= last; n++) {
    const d = new Date(y, m, n), dow = d.getDay(); if (dow === 0 || dow === 6) continue;
    if (!cells.length) for (let k = 0; k < dow - 1; k++) cells.push('<span class="cal-d gap"></span>');
    cells.push(calCell(c, M, isoOf(d)));
  }
  return '<div class="cal-m"><h3>' + MONTH_NAMES[m] + ' <small>' + y + '</small></h3><div class="cal-g" role="group" aria-label="' + MONTH_NAMES[m] + ' ' + y + '">' + ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((x) => '<b aria-hidden="true">' + x[0] + '</b>').join('') + cells.join('') + '</div></div>';
}
function calGridsHTML(c, M) {
  if (!M.ok) return '<p class="hint">Pick a first day and a last day above. The calendar appears here.</p>';
  const a = dateOf(c.school.start), b = dateOf(c.school.end), out = [];
  /* Roving tab stop: the remembered day if it can still be reached, otherwise the first weekday of the year. */
  const okDay = (iso) => iso && iso >= c.school.start && iso <= c.school.end && dateOf(iso).getDay() % 6 !== 0;
  if (okDay(calUI.cur)) calUI.tab = calUI.cur; else { const d = dateOf(c.school.start); while (d.getDay() % 6 === 0) d.setDate(d.getDate() + 1); calUI.tab = isoOf(d); }
  let y = a.getFullYear(), m = a.getMonth(), guard = 0;
  while ((y < b.getFullYear() || (y === b.getFullYear() && m <= b.getMonth())) && guard++ < 18) { out.push(calMonth(c, M, y, m)); if (++m > 11) { m = 0; y++; } }
  return '<div class="cal-months">' + out.join('') + '</div>';
}
function calStatsHTML(c, M) {
  if (!M.ok) return '';
  const left = M.left, st = (n, w, tone) => '<div class="cal-stat ' + (tone || '') + '"><b class="num">' + n + '</b><span>' + w + '</span></div>';
  const lost = c.school.lost || 0;
  return '<div class="cal-stats">' + st(M.dates.length, 'class meetings on the calendar') + st(M.avail, 'days you can plan for<br><small>after ' + lost + ' lost to assemblies, drills, testing and weather</small>') + st(M.used, 'days your units use') +
    (!c.units.length ? st('–', 'buffer<br><small>Add units to see it</small>') : left >= 0 ? st(left, (left === 1 ? 'day' : 'days') + ' of buffer left', left < 3 ? 'warn' : 'good') : st(-left, (left === -1 ? 'day' : 'days') + ' over<br><small>Your units need more days than you have</small>', 'bad')) + '</div>';
}
function calLegendHTML(c, M) {
  if (!M.ok) return '';
  const rows = c.units.map((u, k) => {
    const s = M.spans[k], span = !s.start ? 'No dates left' : niceDate(s.start) + ' to ' + niceDate(s.end);
    return '<li><i class="cal-sw" style="background:' + calUnitColor(k) + '" aria-hidden="true"><em>' + (k + 1) + '</em></i><b>' + (k + 1) + '. ' + esc(u.title || 'Untitled unit') + '</b><span>' + span + '</span><span class="num">' + plural(u.days || 0, 'day') + '</span>' + (s.fits ? '' : '<span class="tag bad">Runs past the last day</span>') + '</li>';
  }).join('');
  const keys = '<ul class="cal-keys"><li><i class="cal-sw off"></i>Day off</li><li><i class="cal-sw buf"></i>Open day after your last unit</li><li><i class="cal-sw none"></i>Class does not meet</li><li><i class="cal-sw u"><i class="cal-mk"></i></i>A lesson is planned</li><li><span class="cal-un-key" aria-hidden="true">2</span>The small number in a class day is its unit</li></ul>';
  return '<div class="stack"><h2 class="sec-h">Your units on the calendar</h2>' + (rows ? '<ul class="cal-legend">' + rows + '</ul>' : '<p class="hint">No units yet. Lay them out under Sequence and they fill in here.</p>') + keys + '</div>';
}

VIEWS.calendar = {
  name: 'Pacing guide',
  render(c) {
    const S = c.school, M = calModel(c), off = (S.off || []).length;
    const settings = '<div class="panel"><h2>School settings <small>Change any of these and the year below updates</small></h2><div class="cal-set">' +
      '<div class="stack"><label class="lbl" for="cal-start">First day</label><input id="cal-start" type="date" class="field" data-bind="school::start" value="' + esc(S.start) + '" aria-label="First day of school"></div>' +
      '<div class="stack"><label class="lbl" for="cal-end">Last day</label><input id="cal-end" type="date" class="field" data-bind="school::end" value="' + esc(S.end) + '" aria-label="Last day of school"></div>' +
      '<div class="stack"><span class="lbl">Period length, in minutes</span><span>' + a11yStep('Period length in minutes', 'school::period', S.period, 20, 150, 5) + '</span></div>' +
      '<div class="stack"><span class="lbl">Class size</span><span>' + a11yStep('Class size', 'school::classSize', S.classSize, 1, 40, 1) + '</span></div>' +
      '<div class="stack wide2"><span class="lbl" id="cal-l-meets">How often the class meets</span>' + a11yGroup('cal-l-meets', seg('school::perWeek', [[5, 'Every day'], [2.5, 'Every other day'], [4, '4 days (Mon to Thu)'], [3, '3 days (Mon, Wed, Fri)'], [2, '2 days (Tue, Thu)']], S.perWeek)) + '</div>' +
      '<div class="stack wide2"><span class="lbl">Days you expect to lose</span><span class="row wrap">' + a11yStep('Days you expect to lose', 'school::lost', S.lost, 0, 60, 1) + '<span class="hint">to assemblies, drills, testing and weather. Most schools lose more than new teachers expect.</span></span></div>' +
      '<div class="stack wide2"><span class="lbl" id="cal-l-pace">How quickly your classes get moving</span>' + a11yGroup('cal-l-pace', seg('school::pace', [[0.5, 'Quickly'], [1, 'Typical'], [1.5, 'Slowly']], S.pace)) +
      '<span class="hint">This scales the setup and moving time the lesson builder adds, such as settling in and getting into groups. It is an assumption. No published figure exists, so use your own sense of your classes.</span></div></div></div>';
    const head = '<div class="ws-head"><div class="eyebrow">Chapter 4</div><h1>Pacing guide</h1><p>The year is shorter than it looks. Put your units on real dates, and leave room for the days that vanish.</p></div>';
    return '<div class="ws cal">' + head + settings + '<div data-live="stats">' + calStatsHTML(c, M) + '</div>' +
      '<div class="panel"><h2>The school year <small>Click a weekday to make it a day off, or to put it back</small></h2><div data-live="grid">' + calGridsHTML(c, M) + '</div>' +
      '<div class="row wrap"><button class="btn sm" data-act="calHolidays" title="Replace your days off with the usual US holidays for this school year">Use the usual US holidays</button><button class="btn sm" data-act="calClear">Clear all days off</button><span class="hint" data-live="offn">' + plural(off, 'day') + ' off. Holidays are a starting point. Check your school calendar.</span></div></div>' +
      '<div class="panel" data-live="legend">' + calLegendHTML(c, M) + '</div></div>';
  },
};
ACT.calDay = (iso, c) => { calUI.cur = iso;  const a = c.school.off = c.school.off || [], k = a.indexOf(iso); if (k >= 0) a.splice(k, 1); else a.push(iso); a.sort(); };
ACT.calHolidays = (a, c) => { if (!calIsoOk(c.school.start)) { toast('Pick a first day first.'); return false; } c.school.off = defaultDaysOff(calStartYear(c)); };
/* One tab stop for the whole year. Arrow keys move by a day (left, right) or a week (up, down); Home and End jump to the first and last day.
   Enter or space press the focused day like any button. Moving the tab stop never redraws, so focus is not lost. */
document.addEventListener('focusin', (ev) => {
  const el = ev.target; if (!el.classList || !el.classList.contains('cal-d') || el.tagName !== 'BUTTON') return;
  document.querySelectorAll('.cal-d[tabindex="0"]').forEach((x) => { if (x !== el) x.setAttribute('tabindex', '-1'); });
  el.setAttribute('tabindex', '0'); calUI.cur = el.dataset.arg;
});
document.addEventListener('keydown', (ev) => {
  const el = ev.target; if (!el.classList || !el.classList.contains('cal-d') || el.tagName !== 'BUTTON' || ev.altKey || ev.ctrlKey || ev.metaKey) return;
  const all = Array.from(document.querySelectorAll('button.cal-d')), i = all.indexOf(el); if (i < 0) return;
  const to = { ArrowLeft: i - 1, ArrowRight: i + 1, ArrowUp: i - 5, ArrowDown: i + 5, Home: 0, End: all.length - 1 }[ev.key];
  if (to == null) return;
  ev.preventDefault(); const t = all[Math.max(0, Math.min(all.length - 1, to))]; if (t) { t.focus(); t.scrollIntoView({ block: 'nearest' }); }
});
ACT.calClear = (a, c) => { c.school.off = []; };

MENTOR.calendar = (c) => {
  const M = calModel(c), L = []; if (!M.ok) return ['Pick the first and last day of school, and I will show you the year.'];
  if (!c.units.length) return ['Lay out your units first. Then come back and see where each one lands.'];
  if (M.left < 0) L.push('Your units need ' + plural(-M.left, 'more day') + ' than the year gives you. Trim something now, before the year trims it for you.');
  else if (M.left < 3) L.push('You have almost no buffer. Something always eats a week. Leave yourself a few spare days.');
  else if (M.left > M.avail * 0.25) L.push('You have a lot of open days. Do not fill them all, but check that the big units have enough time.');
  const gap = (a, b) => (dateOf(b) - dateOf(a)) / DAY_MS;
  for (let k = 0; k < c.units.length && L.length < 2; k++) {
    const s = M.spans[k]; if (!s.fits || s.to < s.from) continue;
    const after = M.dates[s.to + 1], title = esc(c.units[k].title || 'Unit ' + (k + 1));
    if (after && gap(M.dates[s.to], after) >= 8) L.push(title + ' ends just before a long break. Students forget over a break, so plan a short review for when they return.');
    else { let cut = -1; for (let i = s.from; i < s.to; i++) if (gap(M.dates[i], M.dates[i + 1]) >= 8) { cut = i; break; } if (cut >= 0) L.push(title + ' runs across a long break. Plan a way to restart it when everyone is back.'); }
  }
  if (L.length < 2 && M.used > 0 && M.planned < M.used * 0.3) L.push('Most of your days are still open. Build the first few weeks of lessons before you worry about the rest.');
  return L.slice(0, 2);
};
