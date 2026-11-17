/* Chapter 4, Pacing guide: put the units on real dates. School settings, the headline numbers, and the year as month grids.
   Click a weekday to make it a day off. Every top-level name here starts with cal. */

/* Twelve unit colors. Mid-dark so white numbers stay readable, and distinct enough to tell apart in a black and white print by their order in the legend. */
const CAL_COLORS = ['#2d62ad', '#b5502a', '#2e7d4f', '#7a4fa3', '#9c6d00', '#1f7f86', '#a8325e', '#5b6f1e', '#44546a', '#c0601a', '#6a3d2a', '#3b82c4'];
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
  if (iso < c.school.start || iso > c.school.end) return '<span class="cal-d out" aria-hidden="true">' + n + '</span>';
  const i = M.idx[iso], off = M.off.has(iso), btn = (cls, style, title, inner) => '<button class="cal-d ' + cls + '" data-act="calDay" data-arg="' + iso + '"' + (style ? ' style="' + style + '"' : '') + ' title="' + esc(title) + '" aria-label="' + esc(title) + '">' + n + (inner || '') + '</button>';
  if (off) return btn('off', '', calLong(iso) + '. Day off. Click to make it a school day again.');
  if (i == null) return btn('none', '', calLong(iso) + '. Your class does not meet. Click to mark a day off.');
  const day = M.days[i];
  if (!day) return btn('buf', '', calLong(iso) + '. Open day, after your last unit. Click to mark a day off.');
  const u = unitOf(c, day.unit), k = c.units.indexOf(u);
  return btn('u', 'background:' + calUnitColor(k), calLong(iso) + '. Unit ' + (k + 1) + ': ' + (u ? u.title : '') + (day.lesson ? '. Lesson: ' + day.lesson.title : '. No lesson planned yet') + '. Click to mark a day off.', day.lesson ? '<i class="cal-mk"></i>' : '');
}
function calMonth(c, M, y, m) {
  const last = new Date(y, m + 1, 0).getDate(); let cells = [], col = 0;
  for (let n = 1; n <= last; n++) {
    const d = new Date(y, m, n), dow = d.getDay(); if (dow === 0 || dow === 6) continue;
    if (!cells.length) for (let k = 0; k < dow - 1; k++) cells.push('<span class="cal-d gap"></span>');
    cells.push(calCell(c, M, isoOf(d)));
  }
  return '<div class="cal-m"><h3>' + MONTH_NAMES[m] + ' <small>' + y + '</small></h3><div class="cal-g">' + ['M', 'T', 'W', 'T', 'F'].map((x) => '<b>' + x + '</b>').join('') + cells.join('') + '</div></div>';
}
function calGridsHTML(c, M) {
  if (!M.ok) return '<p class="hint">Pick a first day and a last day above. The calendar appears here.</p>';
  const a = dateOf(c.school.start), b = dateOf(c.school.end), out = [];
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
    return '<li><i class="cal-sw" style="background:' + calUnitColor(k) + '"></i><b>' + (k + 1) + '. ' + esc(u.title || 'Untitled unit') + '</b><span>' + span + '</span><span class="num">' + plural(u.days || 0, 'day') + '</span>' + (s.fits ? '' : '<span class="tag bad">Runs past the last day</span>') + '</li>';
  }).join('');
  const keys = '<ul class="cal-keys"><li><i class="cal-sw off"></i>Day off</li><li><i class="cal-sw buf"></i>Open day after your last unit</li><li><i class="cal-sw none"></i>Class does not meet</li><li><i class="cal-sw u"><i class="cal-mk"></i></i>A lesson is planned</li></ul>';
  return '<div class="stack"><div class="sec-h">Your units on the calendar</div>' + (rows ? '<ul class="cal-legend">' + rows + '</ul>' : '<p class="hint">No units yet. Lay them out under Sequence and they fill in here.</p>') + keys + '</div>';
}

VIEWS.calendar = {
  name: 'Pacing guide',
  render(c) {
    const S = c.school, M = calModel(c), off = (S.off || []).length;
    const settings = '<div class="panel"><h2>School settings <small>Change any of these and the year below updates</small></h2><div class="cal-set">' +
      '<div class="stack"><span class="lbl">First day</span><input type="date" class="field" data-bind="school::start" value="' + esc(S.start) + '" aria-label="First day of school"></div>' +
      '<div class="stack"><span class="lbl">Last day</span><input type="date" class="field" data-bind="school::end" value="' + esc(S.end) + '" aria-label="Last day of school"></div>' +
      '<div class="stack"><span class="lbl">Period length, in minutes</span><span>' + stepper('school::period', S.period, 20, 150, 5) + '</span></div>' +
      '<div class="stack"><span class="lbl">Class size</span><span>' + stepper('school::classSize', S.classSize, 1, 40, 1) + '</span></div>' +
      '<div class="stack wide2"><span class="lbl">How often the class meets</span>' + seg('school::perWeek', [[5, 'Every day'], [2.5, 'Every other day'], [4, '4 days (Mon to Thu)'], [3, '3 days (Mon, Wed, Fri)'], [2, '2 days (Tue, Thu)']], S.perWeek) + '</div>' +
      '<div class="stack wide2"><span class="lbl">Days you expect to lose</span><span class="row wrap">' + stepper('school::lost', S.lost, 0, 60, 1) + '<span class="hint">to assemblies, drills, testing and weather. Most schools lose more than new teachers expect.</span></span></div>' +
      '<div class="stack wide2"><span class="lbl">How quickly your classes get moving</span>' + seg('school::pace', [[0.5, 'Quickly'], [1, 'Typical'], [1.5, 'Slowly']], S.pace) +
      '<span class="hint">This scales the setup and moving time the lesson builder adds, such as settling in and getting into groups. It is an assumption. No published figure exists, so use your own sense of your classes.</span></div></div></div>';
    const head = '<div class="ws-head"><div class="eyebrow">Chapter 4</div><h1>Pacing guide</h1><p>The year is shorter than it looks. Put your units on real dates, and leave room for the days that vanish.</p></div>';
    return '<div class="ws cal">' + head + settings + '<div data-live="stats">' + calStatsHTML(c, M) + '</div>' +
      '<div class="panel"><h2>The school year <small>Click a weekday to make it a day off, or to put it back</small></h2><div data-live="grid">' + calGridsHTML(c, M) + '</div>' +
      '<div class="row wrap"><button class="btn sm" data-act="calHolidays" title="Replace your days off with the usual US holidays for this school year">Use the usual US holidays</button><button class="btn sm" data-act="calClear">Clear all days off</button><span class="hint" data-live="offn">' + plural(off, 'day') + ' off. Holidays are a starting point. Check your school calendar.</span></div></div>' +
      '<div class="panel" data-live="legend">' + calLegendHTML(c, M) + '</div></div>';
  },
};
ACT.calDay = (iso, c) => { const a = c.school.off = c.school.off || [], k = a.indexOf(iso); if (k >= 0) a.splice(k, 1); else a.push(iso); a.sort(); };
ACT.calHolidays = (a, c) => { if (!calIsoOk(c.school.start)) { toast('Pick a first day first.'); return false; } c.school.off = defaultDaysOff(calStartYear(c)); };
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
