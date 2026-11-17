/* The documents a teacher leaves with: scope and sequence, pacing guide, unit plans, lesson plans, assessment plan,
   homework plan, syllabus and report. Pure string building: no document, no window.
   Every teacher-entered string goes through esc(). Each document is an HTML fragment of semantic tags only. */

/* ---------- policy tables: [id, label, sentence for the syllabus] ---------- */
const LATE_POLICIES = [
  ['window', 'A short grace window', 'Work handed in up to two school days after the due date is accepted at full credit. After that, talk to me and we will agree on a new date.'],
  ['none', 'On time, or by arrangement', 'Work is due on the due date. If something stops you, tell me before the deadline and we will agree on a new date together.'],
  ['penalty', 'A small loss each day', 'Late work loses a little credit for each school day it is late, down to a floor of half credit. Work that is never handed in earns no credit.'],
  ['flex', 'Flexible, with a conversation', 'Late work is accepted. Tell me when you are behind and we will make a plan. I would rather see your best work late than rushed work on time.'],
  ['pass', 'Two extensions each term', 'Each term you may take two extensions of two school days, no questions asked. Tell me before the due date. After that, talk to me about a new date.'],
];
const RETAKE_POLICIES = [
  ['majors', 'Major assessments only', 'You may retake or redo a major assessment once. First show me what you have practised or fixed since the first try. The new result replaces the old one.'],
  ['all', 'Any assessment', 'You may retake any assessment once. First show me what you have practised or fixed since the first try. The new result replaces the old one.'],
  ['revise', 'Revise and resubmit', 'You may revise written and made work after you get feedback and hand it in again. Include a short note on what you changed and why.'],
  ['average', 'Retake, scores averaged', 'You may retake an assessment once after extra practice. The two results are averaged.'],
  ['none', 'No retakes', 'Assessments are taken once. Your later work gives you the chance to show growth, and I look at the whole pattern of your work.'],
];

/* ---------- small helpers ---------- */
const docsLab = (tbl, id, i) => { const r = tbl.find((x) => x[0] == id); return r ? r[i == null ? 1 : i] : (id == null ? '' : String(id)); };
const docsLow = (s) => String(s || '').toLowerCase();
const docsList = (a) => a.filter(Boolean).join(', ');
const docsUl = (items) => (items.length ? '<ul>' + items.map((x) => '<li>' + x + '</li>').join('') + '</ul>' : '');
const docsRow = (cells, th) => '<tr>' + cells.map((x, i) => (th && i === 0 ? '<th scope="row">' : '<td>') + x + (th && i === 0 ? '</th>' : '</td>')).join('') + '</tr>';
function docsTable(heads, rows, cls) {
  return '<table' + (cls ? ' class="' + cls + '"' : '') + '><thead><tr>' + heads.map((h) => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>' + rows.join('') + '</tbody></table>';
}
/* Joins teacher text and a closing mark without doubling it: "Why?" + "." stays "Why?". Returns escaped HTML. */
function docsEnd(raw, mark) {
  const t = String(raw == null ? '' : raw).trim(), m = mark == null ? '.' : mark;
  if (!t) return '';
  const core = t.replace(/[\s"'”’)\]]+$/, '');
  return esc(t) + (/[.!?…:;]$/.test(core) ? '' : m);
}
/* Lower-cases a leading A, An or The so a role or audience reads inside a sentence. */
const docsMid = (s) => String(s == null ? '' : s).trim().replace(/^(A|An|The)(\s)/, (m, w, sp) => w.toLowerCase() + sp);
const docsMin = (n) => { n = Math.round(n); return n + (n === 1 ? ' minute' : ' minutes'); };
const docsDates = (iso) => (iso ? niceDate(iso) : '');
function docsSpan(s) {
  if (!s || !s.start) return 'Past the end of the calendar';
  const a = niceDate(s.start), b = niceDate(s.end);
  return (a === b ? a : a + ' to ' + b) + (s.fits ? '' : ' (runs past the last class day)');
}
const docsGoalLine = (g) => esc(g.text) + ' <em>(' + esc(docsLow(docsLab(GOAL_KINDS, g.kind)) + ', ' + docsLow(LEVEL_NAME[g.level] || '')) + ')</em>';
/* Goals of a unit grouped by priority, lasting first. Returns HTML. */
function docsGoalGroups(c, uid, tag) {
  const gs = c.goals.filter((g) => g.unit === uid); let h = '';
  for (const p of PRIORITIES) {
    const list = gs.filter((g) => g.priority === p[0]); if (!list.length) continue;
    h += '<p><strong>' + esc(p[1]) + '</strong></p>' + docsUl(list.map(docsGoalLine));
  }
  return h;
}
const docsMajors = (c, uid) => unitAssess(c, uid).filter((a) => a.kind === 'major');
const docsTargets = (a) => docsList((a.targets || []).map((t) => docsLab(TARGETS, t)));
const docsLevel = (n) => docsLab(LEVELS, n);
const docsNone = (msg) => '<p>' + esc(msg) + '</p>';
function docsHeader(c, name) { return '<h1>' + esc(name) + '</h1><p class="sub">' + esc(c.title) + (c.grade ? ', grade ' + esc(c.grade) : '') + '</p>'; }
const docsYear = (c) => { const a = (c.school.start || '').slice(0, 4), b = (c.school.end || '').slice(0, 4); return a && b && a !== b ? a + '&ndash;' + b : a || b || ''; };
const docsYearText = (c) => docsYear(c).replace('&ndash;', '-');

/* ---------- scope and sequence ---------- */
function docsScope(c) {
  const spans = unitSpans(c); let h = docsHeader(c, 'Scope and sequence');
  h += '<h2>The aim</h2>' + (c.transfer ? '<p>By the end, students should be able to do this on their own, years from now: ' + esc(c.transfer) + '</p>' : docsNone('The transfer aim has not been written yet.'));
  h += '<h2>Units in teaching order</h2>';
  if (!c.units.length) h += docsNone('No units yet.');
  else {
    const rows = c.units.map((u, i) => {
      const s = spans[i], maj = docsMajors(c, u.id), any = unitAssess(c, u.id);
      const qs = docsUl((u.questions || []).filter(Boolean).map(esc));
      const as = (maj.length ? maj : any).map((a) => esc(a.title));
      return docsRow(['<strong>' + (i + 1) + '.</strong> ' + esc(u.title), esc(docsSpan(s)), String(u.days || 0), qs || '<em>none yet</em>', docsGoalGroups(c, u.id) || '<em>none yet</em>', as.length ? docsUl(as) : '<em>none yet</em>', esc(docsLab(SOURCES, u.source))]);
    });
    h += docsTable(['Unit', 'Dates', 'Class days', 'Questions that drive it', 'Goals, most lasting first', 'Major assessment', 'Materials from'], rows, 'wide');
  }
  const loose = c.goals.filter((g) => !c.units.some((u) => u.id === g.unit));
  if (loose.length) h += '<h2>Goals not yet placed in a unit</h2>' + docsUl(loose.map(docsGoalLine));
  const bud = budgetedDays(c), av = availableDays(c), meet = meetingDates(c).length;
  h += '<section class="keep"><h2>Totals</h2><ul><li>Days budgeted across all units: <strong>' + bud + '</strong></li><li>Days available: <strong>' + av + '</strong> (' + plural(meet, 'class meeting') + ' on the calendar, less ' + plural(c.school.lost || 0, 'day') + ' set aside for assemblies, drills, testing and weather)</li><li>' +
    (bud > av ? 'The units need <strong>' + plural(bud - av, 'more day') + '</strong> than the calendar gives.' : 'That leaves <strong>' + plural(av - bud, 'day') + '</strong> spare.') + '</li></ul></section>';
  return h;
}

/* ---------- pacing guide ---------- */
function docsPacing(c) {
  let h = docsHeader(c, 'Pacing guide');
  const dates = meetingDates(c), meet = new Set(dates), off = new Set(c.school.off || []), days = courseDays(c), by = {}, seen = {}, uidx = {};
  c.units.forEach((u, i) => (uidx[u.id] = i + 1));
  days.forEach((d) => { if (d.date) { const k = d.lesson ? d.lesson.id : null; if (k) seen[k] = (seen[k] || 0) + 1; by[d.date] = { d, n: k ? seen[k] : 0 }; } });
  h += '<p>Each box shows the unit number and, where a lesson is planned, the lesson. A day with a major assessment is boxed and marked. Days off and days the class does not meet are marked.</p>';
  if (c.units.length) h += '<h2>Key to unit numbers</h2><ol class="key">' + c.units.map((u) => '<li>' + esc(u.title) + '</li>').join('') + '</ol>';
  if (!c.school.start || !c.school.end) return h + docsNone('The school year dates have not been set.');
  const s = dateOf(c.school.start), e = dateOf(c.school.end), dow = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  h += '<h2>The calendar</h2>';
  for (let y = s.getFullYear(), m = s.getMonth(); y < e.getFullYear() || (y === e.getFullYear() && m <= e.getMonth()); m++) {
    if (m > 11) { m = 0; y++; if (y > e.getFullYear() || (y === e.getFullYear() && m > e.getMonth())) break; }
    const first = new Date(y, m, 1), last = new Date(y, m + 1, 0), start = new Date(y, m, 1 - ((first.getDay() + 6) % 7)), rows = [];
    for (let w = new Date(start); w <= last; w = new Date(w.getFullYear(), w.getMonth(), w.getDate() + 7)) {
      const cells = [];
      for (let k = 0; k < 5; k++) {
        const d = new Date(w.getFullYear(), w.getMonth(), w.getDate() + k);
        if (d.getMonth() !== m) { cells.push('<td></td>'); continue; }
        const iso = isoOf(d), num = '<span class="dn">' + d.getDate() + '</span> ';
        if (iso < c.school.start || iso > c.school.end) cells.push('<td><span class="muted">' + d.getDate() + '</span></td>');
        else if (off.has(iso)) cells.push('<td>' + num + '<span class="muted">Day off</span></td>');
        else if (!meet.has(iso)) cells.push('<td>' + num + '<span class="muted">No class</span></td>');
        else {
          const x = by[iso];
          if (!x) cells.push('<td>' + num + '<span class="muted">Class, no unit</span></td>');
          else {
            const l = x.d.lesson, big = l ? l.blocks.map((b) => (b.assess ? assessOf(c, b.assess) : null)).filter((a) => a && a.kind === 'major') : [];
            cells.push('<td' + (big.length ? ' class="maj"' : '') + '>' + num + '<strong>Unit ' + uidx[x.d.unit] + '</strong>' + (l ? '<br>' + esc(l.title) + ((l.days || 1) > 1 ? ' (day ' + x.n + ' of ' + l.days + ')' : '') : '<br><span class="muted">no lesson yet</span>') + (big.length ? '<br><strong>MAJOR ASSESSMENT</strong>' : '') + '</td>');
          }
        }
      }
      rows.push('<tr>' + cells.join('') + '</tr>');
    }
    h += '<table class="cal"><thead><tr><th colspan="5" class="mh">' + MONTH_NAMES[m] + ' ' + y + '</th></tr><tr>' + dow.map((x) => '<th>' + x + '</th>').join('') + '</tr></thead><tbody>' + rows.join('') + '</tbody></table>';
  }
  h += '<h2>Units at a glance</h2>';
  const sp = unitSpans(c);
  if (!c.units.length) return h + docsNone('No units yet.');
  h += docsTable(['Unit', 'Starts', 'Ends', 'Class days', 'Days with no lesson planned yet'], c.units.map((u, i) => {
    const left = Math.max(0, (u.days || 0) - plannedDays(c, u.id)), over = Math.max(0, plannedDays(c, u.id) - (u.days || 0));
    return docsRow([(i + 1) + '. ' + esc(u.title), esc(docsDates(sp[i].start)) || '&nbsp;', esc(docsDates(sp[i].end)) || '&nbsp;', String(u.days || 0), over ? 'None (lessons use ' + plural(over, 'more day') + ' than the unit has)' : String(left)]);
  }));
  return h;
}

/* ---------- unit plans ---------- */
function docsBlockSummary(c, l) { return l.blocks.length ? l.blocks.map((b) => (MOVE_BY[b.move] ? MOVE_BY[b.move].name : b.move) + ' ' + b.min + ' min').join(', ') : 'No blocks planned yet'; }
function docsUnits(c) {
  let h = docsHeader(c, 'Unit plans');
  if (!c.units.length) return h + docsNone('No units yet.');
  const sp = unitSpans(c);
  c.units.forEach((u, i) => {
    h += '<section class="unit"><h2>Unit ' + (i + 1) + '. ' + esc(u.title) + '</h2><p>' + esc(docsSpan(sp[i])) + '. ' + plural(u.days || 0, 'class day') + '.</p>';
    h += '<h3>Where students should end up</h3>';
    const qs = (u.questions || []).filter(Boolean);
    h += qs.length ? '<h4>Questions that drive the unit</h4>' + docsUl(qs.map(esc)) : '';
    h += docsGoalGroups(c, u.id) || docsNone('No goals yet.');
    h += '<h3>How you will know</h3>';
    const as = unitAssess(c, u.id), maj = as.filter((a) => a.kind === 'major'), min = as.filter((a) => a.kind !== 'major');
    if (!as.length) h += docsNone('No assessments yet.');
    maj.forEach((a) => {
      const gl = a.goals.map((id) => goalOf(c, id)).filter(Boolean).map((g) => esc(g.text));
      h += '<h4>' + esc(a.title) + ' (major)</h4><dl>' + (a.role ? '<dt>Student role</dt><dd>' + esc(a.role) + '</dd>' : '') + (a.audience ? '<dt>Audience</dt><dd>' + esc(a.audience) + '</dd>' : '') + (a.product ? '<dt>What students make or do</dt><dd>' + esc(a.product) + '</dd>' : '') +
        '<dt>Method</dt><dd>' + esc(docsLab(METHODS, a.method)) + '</dd><dt>It checks</dt><dd>' + (esc(docsTargets(a)) || 'nothing chosen') + ', at the level of ' + esc(docsLow(docsLevel(a.level))) + '</dd><dt>Goals it gives evidence for</dt><dd>' + (gl.length ? docsUl(gl) : '<em>none linked</em>') +
        '</dd><dt>Rubric</dt><dd>' + esc(docsLab(RUBRICS, a.rubric)) + '</dd><dt>Feedback</dt><dd>' + esc(docsLab(FEEDBACKS, a.fb)) + (a.fb !== 'none' ? ', back to students after ' + plural(a.back || 0, 'day') : '') + '</dd><dt>Time</dt><dd>' + docsMin(a.min || 0) + ' in class, ' + docsMin(a.out || 0) + ' outside' + (a.retake ? '. Students may retake it.' : '.') + '</dd></dl>' + (a.note ? '<p>' + esc(a.note) + '</p>' : '');
    });
    if (min.length) h += '<h4>Shorter checks</h4>' + docsTable(['Title', 'Method', 'Checks', 'Level', 'Minutes', 'Feedback', 'Back in'], min.map((a) => docsRow([esc(a.title), esc(docsLab(METHODS, a.method)), esc(docsTargets(a)), esc(docsLevel(a.level)), String(a.min || 0), esc(docsLab(FEEDBACKS, a.fb)), a.fb === 'none' ? '' : plural(a.back || 0, 'day')])));
    h += '<h3>How they will get there</h3>';
    const ls = unitLessons(c, u.id);
    h += ls.length ? '<ol>' + ls.map((l) => '<li><strong>' + esc(l.title) + '</strong> (' + plural(l.days || 1, 'day') + '). ' + esc(docsBlockSummary(c, l)) + '.</li>').join('') + '</ol>' : docsNone('No lessons planned yet. Class days set aside: ' + (u.days || 0) + '.');
    h += '<p><strong>Materials come from:</strong> ' + esc(docsLow(docsLab(SOURCES, u.source))) + '.' + (u.sourceNote ? ' ' + esc(u.sourceNote) : '') + '</p>' + (u.note ? '<p><strong>Note:</strong> ' + esc(u.note) + '</p>' : '');
    h += '</section>';
  });
  return h;
}

/* ---------- lesson plans ---------- */
function docsHwLine(l) {
  const h = l.hw; if (!h || !(h.min > 0)) return 'No homework is set.';
  return esc(docsLab(HW_PURPOSES, h.purpose)) + ': ' + esc(docsLow(docsLab(HW_KINDS, h.kind))) + ', about ' + docsMin(h.min) + '. ' + esc(docsLab(HW_FEEDBACK, h.fb)) + '; ' + esc(docsLow(docsLab(HW_GRADING, h.graded))) + (h.device ? '. Needs a device or internet.' : '. No device needed.');
}
function docsLessons(c) {
  let h = docsHeader(c, 'Lesson plans'), any = false;
  const first = {}; courseDays(c).forEach((d) => { if (d.lesson && !first[d.lesson.id]) first[d.lesson.id] = d.date; });
  c.units.forEach((u, ui) => unitLessons(c, u.id).forEach((l, li) => {
    any = true; const L = lessonLabel(c, l), seen = [];
    l.blocks.forEach((b) => (b.goals || []).forEach((g) => { if (goalOf(c, g) && !seen.includes(g)) seen.push(g); }));
    h += '<section class="lesson"><h2>' + esc(l.title) + '</h2><p>Unit ' + (ui + 1) + ', ' + docsEnd(u.title) + ' Lesson ' + (li + 1) + ', ' + plural(l.days || 1, 'class day') + (first[l.id] ? ', starting ' + esc(niceDate(first[l.id])) : '') + '.</p>';
    h += '<h3>Goals this lesson serves</h3>' + (seen.length ? docsUl(seen.map((g) => esc(goalOf(c, g).text))) : docsNone('No goals are linked to this lesson yet.'));
    h += '<h3>Agenda</h3>';
    if (!l.blocks.length) h += docsNone('No blocks planned yet.');
    else {
      let t = 0;
      const rows = l.blocks.map((b) => {
        const m = MOVE_BY[b.move] || MOVE_BY.lecture, ch = [], at = t; t += b.min;
        (m.sw || []).forEach((s) => { const k = s.opts.findIndex((o) => o.id === (b.sw && b.sw[s.id])); if (k > 0) ch.push(s.label + ': ' + s.opts[k].label); });
        const a = b.assess ? assessOf(c, b.assess) : null;
        return docsRow([String(at), String(b.min), '<strong>' + esc(m.name) + '</strong>', esc(m.does) + (ch.length ? ' ' + esc(ch.join('. ')) + '.' : '') + (a ? ' This is the assessment: ' + docsEnd(a.title) : ''), esc(b.note || '')]);
      });
      h += docsTable(['Starts at (min)', 'Minutes', 'Move', 'What students are doing', 'Your note'], rows, 'agenda');
    }
    const ov = L.over, per = c.school.period;
    h += '<h3>Running time</h3><p>The blocks add up to ' + docsMin(L.planned) + '. Allow about ' + docsMin(L.overhead) + ' more for settling in, moving between activities and packing up. ' +
      (L.total ? 'The lesson is then likely to run ' + docsMin(L.total) + ' in a ' + per + ' minute period, ' + (ov > 0.5 ? 'about ' + docsMin(ov) + ' past the bell.' : 'with about ' + docsMin(Math.abs(ov)) + ' to spare.') : '') + '</p>';
    h += '<h3>Homework that night</h3><p>' + docsHwLine(l) + '</p>' + (l.note && String(l.note).trim() ? '<h3>Materials and notes</h3>' + docsPara(l.note) : '') + '</section>';
  }));
  return any ? h : h + docsNone('No lessons are planned yet.');
}

/* ---------- assessment plan ---------- */
function docsAssessments(c) {
  let h = docsHeader(c, 'Assessment plan');
  if (!c.assess.length) return h + docsNone('No assessments yet.');
  const rows = []; let n = 0; const num = {};
  c.units.forEach((u, i) => unitAssess(c, u.id).forEach((a) => { num[a.id] = ++n; rows.push(docsRow([(i + 1) + '. ' + esc(u.title), n + '. ' + esc(a.title), a.kind === 'major' ? 'Major' : 'Minor', esc(docsLab(METHODS, a.method)), esc(docsTargets(a)), esc(docsLevel(a.level)), a.min + ' in, ' + (a.out || 0) + ' out', esc(docsLab(FEEDBACKS, a.fb)), a.retake ? 'Yes' : 'No'])); }));
  c.assess.filter((a) => !num[a.id]).forEach((a) => { num[a.id] = ++n; rows.push(docsRow(['No unit', n + '. ' + esc(a.title), a.kind === 'major' ? 'Major' : 'Minor', esc(docsLab(METHODS, a.method)), esc(docsTargets(a)), esc(docsLevel(a.level)), a.min + ' in, ' + (a.out || 0) + ' out', esc(docsLab(FEEDBACKS, a.fb)), a.retake ? 'Yes' : 'No'])); });
  h += '<h2>Every assessment</h2>' + docsTable(['Unit', 'Assessment', 'Major or minor', 'Method', 'Checks', 'Level', 'Minutes', 'Feedback', 'Retake'], rows, 'wide');
  const everyEvidence = (g) => c.assess.some((a) => (a.goals || []).includes(g.id)), missing = [];
  h += '<h2>Which assessment gives evidence for which goal</h2><p>One grid for each unit. An X means the assessment is linked to the goal. A goal with no X has no evidence yet.</p>';
  const groups = c.units.map((u, i) => ({ t: 'Unit ' + (i + 1) + '. ' + u.title, gs: unitGoals(c, u.id), as: unitAssess(c, u.id) })).concat([{ t: 'Goals not placed in a unit', gs: c.goals.filter((g) => !unitOf(c, g.unit)), as: c.assess.filter((a) => !unitOf(c, a.unit)) }]);
  let grids = 0;
  groups.forEach((gr, gi) => {
    if (!gr.gs.length) return;
    const cols = gr.as.slice(), tag = {};
    c.assess.forEach((a) => { if (!cols.includes(a) && gr.gs.some((g) => (a.goals || []).includes(g.id))) { cols.push(a); const u = unitOf(c, a.unit); tag[a.id] = u ? ' (Unit ' + (c.units.indexOf(u) + 1) + ')' : ''; } });
    grids++;
    h += '<h3>' + esc(gr.t) + '</h3><table class="grid"><thead><tr><th class="gl">Goal</th>' + cols.map((a) => '<th>' + esc(a.title) + (tag[a.id] || '') + '</th>').join('') + '<th>Gap</th></tr></thead><tbody>' +
      gr.gs.map((g) => { const ev = everyEvidence(g); if (!ev) missing.push(g); return '<tr><th scope="row" class="gl">' + esc(g.text) + ' <em>(' + esc(docsLow(docsLab(PRIORITIES, g.priority))) + ')</em></th>' + cols.map((a) => '<td class="mk">' + ((a.goals || []).includes(g.id) ? 'X' : '') + '</td>').join('') + '<td class="mk">' + (ev ? '' : '<strong>No evidence</strong>') + '</td></tr>'; }).join('') + '</tbody></table>';
  });
  if (!grids) return h + docsNone('No goals yet.');
  h += '<h2>Goals with no evidence</h2>' + (missing.length ? '<p>These goals are taught or hoped for, but no assessment is linked to them.</p>' + docsUl(missing.map(docsGoalLine)) : docsNone('Every goal has at least one assessment linked to it.'));
  return h;
}

/* ---------- homework plan ---------- */
function docsHwSummary(H, c) {
  if (!H.days) return docsNone('No class days are planned here yet.');
  if (!H.nights) return docsNone('No homework is set in this part of the course.');
  return '<p>Homework is set on ' + H.nights + ' of ' + plural(H.days, 'class day') + '. On those nights it takes about ' + docsMin(H.avgNight) + ', and the longest is ' + docsMin(H.max) + '. Averaged over every class day, that is about ' + docsMin(H.avg) + '.' + (c.intent && c.intent.hw ? ' Your own limit is ' + docsMin(c.intent.hw) + ' a night.' : '') + '</p>';
}
function docsHomework(c) {
  let h = docsHeader(c, 'Homework plan'), all = [];
  c.units.forEach((u, i) => {
    const ls = unitLessons(c, u.id); all = all.concat(ls);
    h += '<section class="unit"><h2>Unit ' + (i + 1) + '. ' + esc(u.title) + '</h2>';
    const hl = ls.filter((l) => l.hw && l.hw.min > 0);
    h += hl.length ? docsTable(['Lesson', 'Purpose', 'Kind', 'Minutes', 'Feedback', 'Grading', 'Device'], hl.map((l) => docsRow([esc(l.title) + ((l.days || 1) > 1 ? ' (' + plural(l.days, 'night') + ')' : ''), esc(docsLab(HW_PURPOSES, l.hw.purpose)), esc(docsLab(HW_KINDS, l.hw.kind)), String(l.hw.min), esc(docsLab(HW_FEEDBACK, l.hw.fb)), esc(docsLab(HW_GRADING, l.hw.graded)), l.hw.device ? 'Needed' : 'No']))) : docsNone('No homework planned.');
    h += docsHwSummary(homeworkStats(c, ls), c) + '</section>';
  });
  if (!c.units.length) h += docsNone('No units yet.');
  h += '<h2>The whole course</h2>' + docsHwSummary(homeworkStats(c, all), c);
  return h;
}

/* ---------- syllabus ---------- */
const docsSec = (title, body) => (body ? '<section><h2>' + esc(title) + '</h2>' + body + '</section>' : '');
const docsPara = (s) => (s && String(s).trim() ? String(s).trim().split(/\n+/).map((p) => '<p>' + esc(p) + '</p>').join('') : '');
/* What a syllabus still needs before it can go to families. Empty when it is ready. */
function syllabusMissing(c) {
  const S = c.syllabus || {}, W = S.weights || {}, tot = sum(['major', 'minor', 'homework', 'participation'].map((k) => +W[k] || 0)), out = [];
  if (!c.units.length) out.push('no units yet');
  if (!String(S.about || '').trim()) out.push('a short description of what the course is about');
  if (tot !== 100) out.push('grade shares that add up to 100 percent (they add up to ' + tot + ')');
  if (!String(S.contact || '').trim()) out.push('a line on how to reach you');
  return out;
}
function docsSyllabus(c) {
  const S = c.syllabus, sp = unitSpans(c), miss = syllabusMissing(c); let h = '';
  if (miss.length) h += '<p class="draft"><strong>Draft. Not ready to send.</strong> Still missing: ' + miss.map(esc).join('; ') + '.</p>';
  h += '<h1>' + esc(c.title) + ': syllabus</h1><p class="sub">' + (c.grade ? 'Grade ' + esc(c.grade) + '. ' : '') + (c.teacher ? 'Teacher: ' + esc(c.teacher) + '. ' : '') + esc(docsYearText(c)) + '</p>';
  h += docsSec('What this course is about', docsPara(S.about) + (c.transfer ? '<p>By the end of the year, we want you to be able to do this on your own: ' + docsEnd(c.transfer) + '</p>' : ''));
  const qs = []; c.units.forEach((u) => { const q = (u.questions || []).filter(Boolean)[0]; if (q) qs.push(q); });
  h += docsSec('The big questions', qs.length ? '<p>These questions run through the year. We keep coming back to them.</p>' + docsUl(qs.map(esc)) : '');
  h += docsSec('The units, in order', c.units.length ? '<ol>' + c.units.map((u, i) => '<li><strong>' + docsEnd(u.title) + '</strong> ' + (sp[i].start ? 'About ' + esc(docsSpan(sp[i]).replace(/ \(.*\)$/, '')) + '. ' : '') + plural(u.days || 0, 'class day') + '.</li>').join('') + '</ol><p>Dates may shift a little. I will tell you when they do.</p>' : '');
  let as = '';
  const maj = c.assess.filter((a) => a.kind === 'major'), min = c.assess.filter((a) => a.kind !== 'major');
  if (maj.length) as += '<p>Major assessments are the big moments where you show what you can do. They are not surprises. You will know what is expected before you start.</p>' + docsUl(maj.map((a) => '<strong>' + docsEnd(a.title) + '</strong>' + (a.role ? ' You take the part of ' + docsEnd(docsMid(a.role)) : '') + (a.audience ? ' You write or speak for ' + docsEnd(docsMid(a.audience)) : '') + (a.product ? ' You make ' + docsEnd(docsMid(a.product)) : '')));
  if (min.length) {
    const kinds = { selected: 'quizzes', written: 'short writing', performance: 'short tasks', personal: 'conversations' }, ks = [];
    min.forEach((a) => { const k = kinds[a.method]; if (k && !ks.includes(k)) ks.push(k); });
    const per = Math.max(1, Math.round(min.length / Math.max(1, c.units.length)));
    as += '<p>Along the way there are shorter checks, about ' + plural(per, 'check') + ' in each unit' + (ks.length ? ', such as ' + ks.join(', ').replace(/, ([^,]*)$/, ' and $1') : '') + '. They help you and me see what is working and what needs another try.</p>';
  }
  h += docsSec('How you will show what you have learned', as);
  const W = S.weights || {}, wt = [['major', 'Major assessments'], ['minor', 'Shorter checks'], ['homework', 'Homework'], ['participation', 'Taking part in class']], tot = sum(wt.map((x) => +W[x[0]] || 0));
  const wrows = wt.filter((x) => +W[x[0]] > 0).map((x) => '<tr class="w"><th scope="row">' + x[1] + '</th><td>' + (+W[x[0]]) + '%</td></tr>');
  h += docsSec('How your grade is worked out', wrows.length ? '<p>Your grade is made of these parts.</p><table class="weights"><thead><tr><th>Part</th><th>Share of your grade</th></tr></thead><tbody>' + wrows.join('') + '<tr class="wt"><th scope="row">Total</th><td>' + tot + '%</td></tr></tbody></table>' + (tot !== 100 ? '<p>These shares add up to ' + tot + ' percent, not 100. I will fix this before the year starts.</p>' : '') : '');
  const late = LATE_POLICIES.find((x) => x[0] === S.late), ret = RETAKE_POLICIES.find((x) => x[0] === S.retake);
  h += docsSec('Late work and retakes', (late ? '<h3>Late work</h3><p>' + esc(late[2]) + '</p>' : '') + (ret ? '<h3>Retakes</h3><p>' + esc(ret[2]) + '</p>' : ''));
  const H = courseLabel(c).hw, planned = sum(c.units.map((u) => plannedDays(c, u.id))), bud = budgetedDays(c), lim = c.intent && c.intent.hw > 0 ? c.intent.hw : 0;
  let hw = '';
  if (H && H.nights && (planned >= 10 || (bud > 0 && planned >= bud / 5))) hw = '<p>Homework comes on about ' + pctOf(H.nights, H.days) + ' percent of class days. On those nights, expect about ' + docsMin(H.avgNight) + '. The longest is about ' + docsMin(H.max) + '. If it takes you much longer, stop and tell me. That helps me plan better.</p>';
  else if (lim) hw = '<p>Homework will usually take no more than about ' + docsMin(lim) + ' a night. If it takes you much longer, stop and tell me. That helps me plan better.</p>';
  h += docsSec('Homework', hw);
  h += docsSec('What you will need', docsPara(S.materials));
  h += docsSec('Academic honesty', docsPara(S.honesty));
  h += docsSec('How to get help', docsPara(S.help));
  h += docsSec('How to reach me', docsPara(S.contact) + (c.teacher ? '<p>' + esc(c.teacher) + '</p>' : ''));
  return h;
}

/* ---------- course report ---------- */
function docsFindings(list) {
  const groups = {}, order = [];
  (Array.isArray(list) ? list : []).forEach((f) => {
    if (typeof f === 'string') f = { text: f };
    const ar = f.area || f.group || f.cat || 'General', a = (typeof CHECK_AREAS !== 'undefined' && (CHECK_AREAS.find((x) => x[0] === ar) || [])[1]) || ar, t = f.text || f.msg || f.title || f.say || f.what || '';
    if (!groups[a]) { groups[a] = []; order.push(a); }
    const sv = { 2: 'To fix', 1: 'Worth a look', 0: 'Note' }, lv = typeof f.sev === 'number' ? sv[f.sev] || '' : f.level || f.severity || f.tone || '', more = f.fix || f.why || f.detail || '';
    groups[a].push((lv && typeof lv === 'string' ? '<strong>' + esc(lv) + '.</strong> ' : '') + esc(t) + (more && typeof more === 'string' ? ' ' + esc(more) : ''));
  });
  return order.map((a) => '<h3>' + esc(a.charAt(0).toUpperCase() + a.slice(1)) + '</h3>' + docsUl(groups[a])).join('');
}
function docsGrades(g) {
  if (!g) return '';
  const arr = Array.isArray(g) ? g : g.areas || g.grades || g.items || g.rows || [];
  const cell = (v) => (v == null || v === '—' ? 'Not yet' : typeof v === 'object' ? esc(v.letter || v.grade || v.label || '') : esc(v));
  const overall = !Array.isArray(g) && g.overall != null ? '<p><strong>Overall:</strong> ' + cell(g.overall) + '</p>' : '';
  if (!arr.length) return overall;
  return overall + docsTable(['Area', 'Grade', 'What it rests on'], arr.map((r) => docsRow([cell(r.name || r.area || r.title || r.id), cell(r.grade != null ? r.grade : r.letter != null ? r.letter : r.score), cell(r.summary || r.why || r.text || r.note || r.says || r.detail)])));
}
function docsReport(c) {
  let h = docsHeader(c, 'Course report');
  const planned = sum(c.units.map((u) => plannedDays(c, u.id))), bud = budgetedDays(c);
  h += '<p>This report measures the plan, not the room. It reads how each block is described and adds it up.</p><p><strong>' + planned + ' of ' + plural(bud, 'class day') + '</strong> budgeted are planned so far.</p>' +
    '<p>The grades describe only what is planned so far. They are for your own use.</p><p>A grade counts the design problems the checks found in what is built, compared with what you said you want. It does not judge your teaching.</p>';
  h += '<h2>The whole course</h2><div class="lfwrap">' + labelHTML(courseLabel(c), { c, scope: 'course', title: c.title }) + '</div>';
  const us = c.units.filter((u) => unitLessons(c, u.id).length);
  if (us.length === 1) h += '<h2>Unit by unit</h2><p>Only ' + esc(us[0].title) + ' has planned lessons so far, so the course label above is the label for that unit.</p>';
  else if (us.length) h += '<h2>Unit by unit</h2>' + us.map((u) => '<div class="lfwrap">' + labelHTML(unitLabel(c, u.id), { c, scope: 'unit', title: u.title }) + '</div>').join('');
  try {
    if (typeof gradeCourse === 'function') { const G = gradeCourse(c); h += '<h2>Grades</h2>' + (G && G.enough === false ? '<p>It is too early to grade. Plan a few more lessons first.</p>' : docsGrades(G)); }
    if (typeof runChecks === 'function') { const f = docsFindings(runChecks(c)); if (f) h += '<h2>Findings</h2>' + f; }
  } catch (e) { /* a broken check must never stop the packet */ }
  return h;
}

/* ---------- the list ---------- */
const DOCS = [
  { id: 'scope', name: 'Scope and sequence', does: 'Every unit in teaching order, with dates, questions, goals and assessments.', html: docsScope },
  { id: 'pacing', name: 'Pacing guide', does: 'A month-by-month calendar of units and lessons.', html: docsPacing },
  { id: 'units', name: 'Unit plans', does: 'Each unit: where students end up, how you will know, how they get there.', html: docsUnits },
  { id: 'lessons', name: 'Lesson plans', does: 'Each planned lesson with a timed agenda and its homework.', html: docsLessons },
  { id: 'assessments', name: 'Assessment plan', does: 'Every assessment, and which goals each one gives evidence for.', html: docsAssessments },
  { id: 'homework', name: 'Homework plan', does: 'Homework night by night, with minutes and grading.', html: docsHomework },
  { id: 'syllabus', name: 'Syllabus', does: 'For students and families, in plain words.', html: docsSyllabus },
  { id: 'report', name: 'Course report', does: 'The Learning Facts labels, grades and findings.', html: docsReport },
];

/* ---------- the packet ---------- */
/* Compact standalone styles for the Learning Facts label: heavy black rules, no flex or grid, so it prints in black and white and opens in Word. */
const DOCS_LABEL_CSS = '.lfwrap{margin:0 0 14pt}' +
  '.lf{width:3.5in;box-sizing:border-box;border:2px solid #000;padding:6px 9px 8px;font-family:Helvetica,Arial,sans-serif;font-size:7.5pt;line-height:1.18;color:#000;background:#fff;page-break-inside:avoid;break-inside:avoid;-webkit-print-color-adjust:exact;print-color-adjust:exact}' +
  '.lf div,.lf span{font-size:7.5pt}.lf-title{font-size:24pt!important;font-weight:900;line-height:1;letter-spacing:-.5px}.lf-name{font-weight:700;font-size:11pt!important;margin-top:2px}.lf-serv{margin-bottom:3px}' +
  '.lf-bar{border-top:9px solid #000;margin:3px 0}.lf-bar.mid{border-top-width:5px}.lf-bar.thin{border-top-width:1px}' +
  '.lf-row,.lf-head,.lf-int,.lf-fam{border-top:1px solid #000;padding:1px 0;position:relative}.lf-head{font-weight:700;border-top:0}' +
  '.lf-row span,.lf-head span,.lf-int span,.lf-fam span{display:inline-block;vertical-align:top}' +
  '.lf-row span:nth-child(1){width:70%}.lf-row span:nth-child(2){width:29%;text-align:right}' +
  '.lf-head span:nth-child(1),.lf-fam span:nth-child(1),.lf-int span:nth-child(1){width:62%}.lf-head span:nth-child(2),.lf-head span:nth-child(3),.lf-fam span:nth-child(2),.lf-fam span:nth-child(3),.lf-int span:nth-child(2),.lf-int span:nth-child(3){width:18%;text-align:right}' +
  '.lf-fam{padding-bottom:5px}.lf-fam.zero{color:#555}.lf-fam i{display:inline-block;width:8px;height:8px;margin-right:5px;border:1px solid #000}.lf-fam em{position:absolute;left:0;bottom:1px;height:3px;display:block}' +
  '.lf-stack{font-size:0;white-space:nowrap;overflow:hidden;height:9px;border:1px solid #000;margin:3px 0 2px}.lf-stack i{display:inline-block;height:9px}.lf-mix span{display:inline-block;margin-right:8px}.lf-mix i{display:inline-block;width:8px;height:8px;margin-right:3px;border:1px solid #000}' +
  '.lf-note{border-top:1px solid #000;padding:2px 0}.lf-int.gap{font-weight:700}.lf-row.bad,.lf-row.warn{font-weight:700}.lf-foot{border-top:3px solid #000;margin-top:4px;padding-top:2px;font-size:7.5pt!important}.lf-empty{padding:6px 0}';
const DOCS_CSS = '@page{size:letter;margin:.8in .75in .9in}' +
  'html{-webkit-print-color-adjust:exact;print-color-adjust:exact}body{font-family:Georgia,"Times New Roman",serif;font-size:11pt;line-height:1.45;color:#000;background:#fff;margin:0 auto;max-width:7.6in;padding:0 .3in}' +
  'h1,h2,h3,h4,th,.sub,.toc{font-family:Helvetica,Arial,sans-serif}h1{font-size:22pt;margin:0 0 4pt;border-bottom:3px solid #000;padding-bottom:4pt}h2{font-size:14pt;margin:18pt 0 6pt;border-bottom:1px solid #000;padding-bottom:2pt;page-break-after:avoid}h3{font-size:11.5pt;margin:12pt 0 4pt;page-break-after:avoid}h4{font-size:10.5pt;margin:10pt 0 3pt;page-break-after:avoid}' +
  'p{margin:4pt 0 6pt}ul,ol{margin:3pt 0 8pt;padding-left:20pt}li{margin:1pt 0}.sub{margin:0 0 12pt;color:#333}.muted{color:#555;font-size:8.5pt}em{font-style:italic}' +
  'table{border-collapse:collapse;width:100%;margin:6pt 0 10pt;font-size:9.5pt}th,td{border:1px solid #000;padding:3pt 5pt;text-align:left;vertical-align:top}th{background:#e6e6e6;font-weight:700}tr{page-break-inside:avoid;break-inside:avoid}thead{display:table-header-group}table{page-break-inside:avoid;break-inside:avoid}p{orphans:3;widows:3}h2+p,h3+p{page-break-after:avoid;break-after:avoid}section.keep{page-break-inside:avoid;break-inside:avoid}.draft{border:2px solid #000;padding:6pt 8pt;font-family:Helvetica,Arial,sans-serif;font-size:10.5pt;margin:0 0 12pt}' +
  'table td p{margin:0 0 2pt}table td ul{margin:0 0 3pt;padding-left:12pt}table.wide{font-size:8pt;page-break-inside:auto;break-inside:auto}table.wide th,table.wide td{padding:2pt 3pt}' +
  'table.cal{table-layout:fixed;font-size:8pt}table.grid{table-layout:auto}table.cal td{height:.62in;width:20%}table.cal th.mh{font-size:12pt;background:#cfcfcf;text-align:left}td.maj{border:3px solid #000;background:#ddd}ol.key{font-size:9.5pt;columns:2}table.grid th.gl{width:42%}.dn{font-weight:700;font-family:Helvetica,Arial,sans-serif;font-size:9pt}' +
  'table.grid{font-size:8.5pt}td.mk{text-align:center;font-weight:700}tr.grp th{background:#cfcfcf}table.weights{width:60%}table.weights td{text-align:right}tr.wt th,tr.wt td{font-weight:700;border-top:3px double #000}' +
  'dl{margin:4pt 0 8pt}dt{font-family:Helvetica,Arial,sans-serif;font-weight:700;font-size:9.5pt;margin-top:4pt}dd{margin:0 0 0 16pt}' +
  '.doc:after{content:"";display:block;clear:both}.doc h2{clear:both}section.unit,section.lesson{margin-bottom:14pt}section.lesson{page-break-before:always;page-break-inside:avoid;break-inside:avoid}section.lesson:first-of-type{page-break-before:auto}' +
  '.doc{page-break-before:always}.cover{padding-top:2.2in;page-break-after:always}.cover h1{font-size:34pt;border-bottom:6px solid #000}.cover .by{font-family:Helvetica,Arial,sans-serif;font-size:13pt;margin:4pt 0}.toc{margin-top:.5in}.toc h2{border:0;font-size:12pt}.toc ol{font-size:11pt}.toc a{color:#000;text-decoration:none}' +
  '@media print{body{max-width:none;padding:0}}';
function packetHTML(c, ids, opts) {
  opts = opts || {}; const want = ids && ids.length ? ids : DOCS.map((d) => d.id), docs = DOCS.filter((d) => want.includes(d.id));
  const title = opts.title || c.title || 'Course packet', subj = docsLab(SUBJECTS, c.subject), foot = String(title).replace(/[\\<>{}]/g, '').replace(/"/g, "'").replace(/[\r\n]/g, ' ').slice(0, 120);
  let h = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(title) + ' course packet</title><style>' + DOCS_CSS + DOCS_LABEL_CSS +
    '@page{@bottom-left{content:"' + foot + '";font:8pt Helvetica,Arial,sans-serif}@bottom-right{content:"Page " counter(page);font:8pt Helvetica,Arial,sans-serif}}</style></head><body>';
  /* One document on its own needs no cover or contents page. */
  if (docs.length > 1 && opts.cover !== false) h += '<div class="cover"><h1>' + esc(title) + '</h1><p class="by">' + esc(subj) + (c.grade ? ', grade ' + esc(c.grade) : '') + '</p>' + (c.teacher ? '<p class="by">' + esc(c.teacher) + '</p>' : '') + '<p class="by">School year ' + docsYear(c) + '</p>' + (opts.note ? '<p>' + esc(opts.note) + '</p>' : '') +
    '<div class="toc"><h2>Contents</h2><ol>' + docs.map((d) => '<li><a href="#doc-' + d.id + '">' + esc(d.name) + '</a></li>').join('') + '</ol></div></div>';
  docs.forEach((d) => { h += '<section class="doc" id="doc-' + d.id + '">' + d.html(c) + '</section>'; });
  return h + '</body></html>';
}

/* ---------- Markdown ---------- */
const docsMd = (s) => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
function courseMarkdown(c) {
  const sp = unitSpans(c), L = [];
  L.push('# ' + docsMd(c.title) + ': scope and sequence', '');
  if (c.transfer) L.push('**Aim:** ' + docsMd(c.transfer), '');
  c.units.forEach((u, i) => {
    L.push('## Unit ' + (i + 1) + '. ' + docsMd(u.title), '', '- Dates: ' + docsSpan(sp[i]), '- Class days: ' + (u.days || 0), '- Materials from: ' + docsLow(docsLab(SOURCES, u.source)));
    (u.questions || []).filter(Boolean).forEach((q) => L.push('- Question: ' + docsMd(q)));
    for (const p of PRIORITIES) c.goals.filter((g) => g.unit === u.id && g.priority === p[0]).forEach((g) => L.push('- Goal (' + docsLow(p[1]) + ', ' + docsLow(docsLab(GOAL_KINDS, g.kind)) + ', ' + docsLow(LEVEL_NAME[g.level] || '') + '): ' + docsMd(g.text)));
    unitAssess(c, u.id).forEach((a) => L.push('- Assessment (' + a.kind + '): ' + docsMd(a.title)));
    L.push('');
  });
  L.push('Days budgeted: ' + budgetedDays(c) + '. Days available: ' + availableDays(c) + '.', '', '# Unit plans', '');
  c.units.forEach((u, i) => {
    L.push('## Unit ' + (i + 1) + '. ' + docsMd(u.title), '', '### Where students should end up', '');
    (u.questions || []).filter(Boolean).forEach((q) => L.push('- ' + docsMd(q)));
    c.goals.filter((g) => g.unit === u.id).forEach((g) => L.push('- ' + docsMd(g.text)));
    L.push('', '### How you will know', '');
    unitAssess(c, u.id).forEach((a) => L.push('- **' + docsMd(a.title) + '** (' + a.kind + ', ' + docsLow(docsLab(METHODS, a.method)) + ', ' + (a.min || 0) + ' min)' + (a.product ? ': ' + docsMd(a.product) : '')));
    L.push('', '### How they will get there', '');
    unitLessons(c, u.id).forEach((l, k) => L.push((k + 1) + '. ' + docsMd(l.title) + ' (' + plural(l.days || 1, 'day') + '). ' + docsBlockSummary(c, l) + '.'));
    L.push('');
  });
  const S = c.syllabus, W = S.weights || {}, miss = syllabusMissing(c);
  L.push('# Syllabus: ' + docsMd(c.title), '');
  if (miss.length) L.push('> **Draft. Not ready to send.** Still missing: ' + miss.join('; ') + '.', '');
  if (S.about) L.push(docsMd(S.about), '');
  if (c.transfer) L.push('By the end of the year, you should be able to: ' + docsMd(c.transfer), '');
  L.push('## Units', '');
  c.units.forEach((u, i) => L.push((i + 1) + '. ' + docsMd(u.title) + ' (' + plural(u.days || 0, 'class day') + ')'));
  L.push('', '## How your grade is worked out', '');
  [['major', 'Major assessments'], ['minor', 'Shorter checks'], ['homework', 'Homework'], ['participation', 'Taking part in class']].filter((x) => +W[x[0]] > 0).forEach((x) => L.push('- ' + x[1] + ': ' + (+W[x[0]]) + '%'));
  const late = LATE_POLICIES.find((x) => x[0] === S.late), ret = RETAKE_POLICIES.find((x) => x[0] === S.retake);
  if (late) L.push('', '## Late work', '', late[2]);
  if (ret) L.push('', '## Retakes', '', ret[2]);
  [['What you will need', S.materials], ['Academic honesty', S.honesty], ['How to get help', S.help], ['How to reach me', S.contact]].forEach((x) => { if (x[1] && String(x[1]).trim()) L.push('', '## ' + x[0], '', docsMd(x[1])); });
  return L.join('\n') + '\n';
}

function courseFileName(c, ext) {
  const s = String((c && c.title) || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'course';
  const e = String(ext || '').replace(/^\.+/, '').replace(/[^a-z0-9]/gi, '');
  return s + (e ? '.' + e : '');
}
