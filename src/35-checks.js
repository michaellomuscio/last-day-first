/* Design checks and report-card grades.
   runChecks(c) reads the plan and returns findings, most serious first. gradeCourse(c) turns them into six grades.

   Sources (see research/02 section 9 and research/03 sections 16 and 17):
   - Wiggins and McTighe: assessment aligned to every lasting goal; goals taught before they are assessed; transfer shown by performance.
   - Webb, Depth of Knowledge: an assessment should ask for at least the thinking level of the goal it claims to measure.
   - Stiggins and Chappuis: match the method to the kind of target (methodFit in 30-analyze.js).
   - Rosenshine and Cepeda: bringing earlier learning back, checking understanding, feedback while it can be used.
   Every number below that research marks as weak (spacing gaps, minute limits, buffers, shares of time) is written as an
   observation ("worth a look", sev 1 or 0), never as a rule. The checks never call a teaching method bad in itself; the
   intent checks compare the plan with the teacher's own stated aims.

   Grade formula. For each area, P = 10 per serious finding + 4 per "worth a look" + 1 per note, and N = 40 + 14 x (units
   with something built in them, at least 1). score = round(100 x N / (N + P)). One serious problem costs about 23
   points in a one-unit course and about 14 in a four-unit course, and the score never goes below zero. An area scores null (grade a dash) until enough exists
   to judge it. Letter: A 93+, A- 90, B+ 87, B 83, B- 80, C+ 77, C 73, C- 70, D 60, else F. */

const CHECK_AREAS = [['alignment', 'Alignment'], ['evidence', 'Evidence'], ['feasibility', 'Feasibility'], ['practice', 'Practice and feedback'], ['workload', 'Workload'], ['intent', 'Intent']];
const CHECK_WEIGHT = { 2: 10, 1: 4, 0: 1 };

/* Grades can be shown as letters or as words; a school profile or the teacher chooses. */
const gradeWord = (s) => (s == null ? 'Not yet judged' : s >= 90 ? 'Strong' : s >= 80 ? 'Sound' : s >= 70 ? 'Developing' : 'Needs work');
const gradeShow = (c, area) => (c && c.gradeStyle === 'words' ? gradeWord(area.score) : area.grade);
function gradeLetter(s) {
  if (s == null) return '—';
  return s >= 93 ? 'A' : s >= 90 ? 'A−' : s >= 87 ? 'B+' : s >= 83 ? 'B' : s >= 80 ? 'B−' : s >= 77 ? 'C+' : s >= 73 ? 'C' : s >= 70 ? 'C−' : s >= 60 ? 'D' : 'F';
}

const ckTrim = (s, n) => { s = String(s || '').replace(/\s+/g, ' ').replace(/[.\s]+$/, ''); n = n || 60; if (s.length <= n) return s; const cut = s.slice(0, n - 1), sp = cut.lastIndexOf(' '); return (sp > n * 0.6 ? cut.slice(0, sp) : cut).replace(/[,;:.\s]+$/, '') + '…'; };
const ckQ = (s) => '“' + s + '”';
const ckGoal = (g) => ckQ(ckTrim(g.text) || 'an unwritten goal');
const ckUnit = (u) => ckQ(ckTrim(u.title, 50) || 'Untitled unit');
const ckName = (list, id) => { const x = list.find((r) => r[0] === id); return x ? x[1].toLowerCase() : String(id); };
const ckPct = (x) => Math.round(100 * x) + '%';

function runChecks(c) {
  const out = [];
  const add = (id, area, sev, text, why, where, source) => out.push({ id, area, sev, text, why, where, source });
  const hasGoals = c.goals.length > 0, hasUnits = c.units.length > 0;

  /* ---- computed once ---- */
  const GM = goalMap(c), CL = courseLabel(c), dayList = courseDays(c);
  const spanOf = {}; unitSpans(c).forEach((s) => (spanOf[s.unit] = s));
  const U = {}, unitIdx = {};
  c.units.forEach((u, i) => {
    const ls = unitLessons(c, u.id), L = unitLabel(c, u.id);
    U[u.id] = { u, i, ls, as: unitAssess(c, u.id), gs: unitGoals(c, u.id), L, S: shares(L), span: spanOf[u.id] };
    unitIdx[u.id] = i;
  });
  const lessonDay = {}, assessDay = {}, assessLesson = {};
  for (const d of dayList) {
    if (!d.lesson) continue;
    if (lessonDay[d.lesson.id] == null) {
      lessonDay[d.lesson.id] = d.i;
      for (const b of d.lesson.blocks) if (b.assess && assessDay[b.assess] == null) { assessDay[b.assess] = d.i; assessLesson[b.assess] = d.lesson.id; }
    }
  }
  const plannedAll = CL.days;                                 // lesson days planned across the course
  const built = (x) => x.ls.length || x.as.length || x.gs.length || (x.u.questions || []).some((q) => String(q).trim());
  const LL = {}; c.lessons.forEach((l) => (LL[l.id] = lessonLabel(c, l)));
  const reviewGoals = new Set();
  c.lessons.forEach((l) => { if (l.hw && l.hw.purpose === 'review') (l.hw.goals || []).forEach((g) => reviewGoals.add(g)); });
  const lasting = c.goals.filter((g) => g.priority === 'lasting'), lastingU = lasting.filter((g) => g.kind === 'understanding');
  const isStrongPerf = (a) => a.level >= 3 && (a.method === 'performance' || a.method === 'personal' || (a.method === 'written' && a.rubric && a.rubric !== 'none'));

  /* ============ ALIGNMENT ============ */
  if (hasGoals) {
    // 1. A lasting understanding nothing assesses. Wiggins and McTighe: assessments aligned to every Stage 1 element.
    for (const g of lastingU) if (!GM[g.id].assess.length)
      add('al-lasting-no-assess', 'alignment', 2, 'Nothing is planned to show whether students reach the lasting understanding ' + ckGoal(g) + '.',
        'Without some evidence, you will not know whether the idea you care most about was learned.', { view: 'evidence', unit: g.unit || undefined, goal: g.id }, 'Wiggins and McTighe');

    // 2. Assessment pitched below the goal. Webb: consistency of the level of thinking. Each goal is judged by the best assessment that lists it.
    for (const g of c.goals) {
      const m = GM[g.id]; if (!m.assess.length) continue;
      let best = null; for (const id of m.assess) { const a = assessOf(c, id); if (a && (!best || a.level > best.level)) best = a; }
      if (best && best.level < g.level) add('al-level-below', 'alignment', g.priority === 'familiar' ? 1 : 2,
        'The best assessment of the goal ' + ckGoal(g) + ' is ' + ckQ(ckTrim(best.title, 50)) + ', which asks for ' + LEVEL_NAME[best.level].toLowerCase() + ', while the goal is set at ' + LEVEL_NAME[g.level].toLowerCase() + '.',
        'A task that asks for less thinking than the goal can show less than the goal needs. A smaller check alongside a higher-level task is fine.', { view: 'evidence', unit: best.unit, assess: best.id, goal: g.id }, 'Webb, Depth of Knowledge');
    }
    for (const a of c.assess) {
      // 3. Method against target. Stiggins and Chappuis.
      if (a.targets && a.targets.length && methodFit(a) === 0) {
        const bad = a.targets.find((t) => (METHOD_FIT[t] || {})[a.method] === 0), best = METHODS.filter((m) => METHOD_FIT[bad][m[0]] === 2).map((m) => m[1].toLowerCase());
        add('al-method-fit', 'alignment', 1, ckQ(ckTrim(a.title, 50)) + ' uses ' + ckName(METHODS, a.method) + ' to check ' + ckName(TARGETS, bad) + ', and that method is usually a weak fit for it.',
          'A ' + ckName(TARGETS, bad) + ' target is usually shown more directly by ' + (best.join(' or ') || 'another method') + '.', { view: 'evidence', unit: a.unit, assess: a.id }, 'Stiggins and Chappuis');
      }
    }

    // 4. Assessed but never taught. Only judged where lessons exist to look at.
    for (const g of c.goals) {
      const m = GM[g.id]; if (!m.assess.length || m.min > 0) continue;
      const ls = g.unit && U[g.unit] ? U[g.unit].ls.length : c.lessons.length;
      if (!ls) continue;
      add('al-untaught', 'alignment', g.priority === 'familiar' ? 1 : 2, 'The goal ' + ckGoal(g) + ' is assessed, but no planned lesson teaches it.',
        'Students are being asked to show something the plan has not yet given them time to learn.', { view: 'lessons', unit: g.unit || undefined, goal: g.id }, 'Wiggins and McTighe');
    }

    // 5. Learning time tied to no goal, by unit.
    for (const x of Object.values(U)) {
      const L = x.L; if (!x.ls.length || L.learn <= 0) continue;
      const share = L.orphan / L.learn;
      if (L.orphan >= 10 && share >= 0.15)
        add('al-orphan', 'alignment', share >= 0.25 && L.orphan >= 30 ? 2 : 1, 'In ' + ckUnit(x.u) + ', about ' + ckPct(share) + ' of learning time is tied to no goal.',
          'Time that serves no goal is the easiest place to find room, or to find a goal you have not yet written down.', { view: 'lessons', unit: x.u.id }, 'Wiggins and McTighe');
    }

    // 6. A unit that only takes in. Purpose A, M, T from the observer.
    for (const x of Object.values(U)) {
      const P = x.L.purpose, a = P.A || 0, mt = (P.M || 0) + (P.T || 0);
      if (x.ls.length >= 2 && a >= 60 && mt === 0 && x.gs.some((g) => g.kind === 'understanding'))
        add('al-take-in-only', 'alignment', 1, 'The planned lessons in ' + ckUnit(x.u) + ' are all take in and practise; none of the minutes is aimed at making sense of the idea or using it somewhere new, and the unit has an understanding goal.',
          'Goals about understanding tend to need some time to work out why and to use the idea in a new place, as well as to meet and practise it.', { view: 'lessons', unit: x.u.id }, 'Wiggins and McTighe');
    }

    // 7. Lasting understanding or transfer aim with no strong performance evidence.
    if (c.assess.length && (lastingU.length || String(c.transfer || '').trim()) && !c.assess.some(isStrongPerf))
      add('al-no-performance', 'alignment', 1, 'No assessment is a performance, a conversation or a rubric-marked written task at strategic thinking or above, though the course names ' + (lastingU.length ? 'lasting understandings' : 'a transfer aim') + '.',
        'Using an idea in a new situation is usually shown by a task where students do that, judged against criteria.', { view: 'evidence' }, 'Wiggins and McTighe');
    else if (c.assess.some(isStrongPerf))
      for (const g of lastingU) { const m = GM[g.id]; if (m.assess.length && !m.assess.some((id) => isStrongPerf(assessOf(c, id))))
        add('al-no-performance', 'alignment', 1, 'The lasting understanding ' + ckGoal(g) + ' is assessed, but not by a performance, conversation or rubric-marked written task at strategic thinking or above.',
          'Showing an idea can be used in a new setting usually takes more than recall or short answers; a worth-a-look observation, not a rule.', { view: 'evidence', unit: g.unit || undefined, goal: g.id }, 'Wiggins and McTighe'); }

    // 8. Goals with no unit (only once units exist; summarized when there are many).
    if (hasUnits) {
      const loose = c.goals.filter((g) => !g.unit || !U[g.unit]);
      if (loose.length === 1) add('al-goal-no-unit', 'alignment', 1, 'The goal ' + ckGoal(loose[0]) + ' is not assigned to a unit.', 'A goal with no unit has no place in the sequence, so nothing is planned for it.', { view: 'goals', goal: loose[0].id }, 'Wiggins and McTighe');
      else if (loose.length > 1) add('al-goal-no-unit', 'alignment', 1, plural(loose.length, 'goal') + ' (starting with ' + ckGoal(loose[0]) + ') ' + (loose.length === 1 ? 'is' : 'are') + ' not assigned to a unit.', 'A goal with no unit has no place in the sequence, so nothing is planned for it.', { view: 'goals', goal: loose[0].id }, 'Wiggins and McTighe');
    }

    // 11. Too many lasting goals in one unit, and none at all.
    for (const x of Object.values(U)) {
      const n = x.gs.filter((g) => g.priority === 'lasting').length;
      if (n > 3) add('al-too-many-lasting', 'alignment', 1, ckUnit(x.u) + ' has ' + n + ' lasting goals.',
        'Lasting means worth remembering years from now, and a short list is easier to teach toward. Three or fewer per unit is a rough guide, not a rule.', { view: 'goals', unit: x.u.id }, 'Wiggins and McTighe');
    }
    if (c.goals.length >= 3 && !lasting.length)
      add('al-no-lasting', 'alignment', 1, 'No goal is marked lasting yet.', 'Picking the few ideas worth keeping for life shows where the course should spend its time.', { view: 'goals' }, 'Wiggins and McTighe');
  }

  // 9. Units that are started but missing goals, questions or a major assessment.
  for (const x of Object.values(U)) {
    if (!built(x)) continue;
    const u = x.u, w = { view: 'sequence', unit: u.id };
    if (!x.gs.length && (hasGoals || x.ls.length))
      add('al-unit-no-goals', 'alignment', 1, ckUnit(u) + ' has no goals yet.', 'Without goals there is nothing for the lessons and assessments to line up with.', { view: 'goals', unit: u.id }, 'Wiggins and McTighe');
    if (!(u.questions || []).some((q) => String(q).trim()))
      add('al-unit-no-questions', 'alignment', x.gs.some((g) => g.priority === 'lasting') ? 1 : 0, ckUnit(u) + ' has no guiding questions.', 'A question or two gives students and you a reason to keep coming back to the big idea.', w, 'Wiggins and McTighe');
    if (!x.as.some((a) => a.kind === 'major') && (x.gs.length || x.ls.length))
      add('al-unit-no-major', 'alignment', 1, ckUnit(u) + ' has no major assessment.', 'A culminating task or test is where students show what the unit was for.', { view: 'evidence', unit: u.id }, 'Wiggins and McTighe');
  }

  // 10. A goal built on a goal that is taught later.
  for (const g of c.goals) {
    const gu = g.unit && U[g.unit]; if (!gu) continue;
    for (const pid of g.after || []) {
      const p = goalOf(c, pid), pu = p && p.unit && U[p.unit]; if (!pu) continue;
      let late = pu.i > gu.i;
      if (!late && pu.i === gu.i) { const a = GM[g.id].days[0], b = GM[pid].days[0]; late = a != null && b != null && b > a; }
      if (late) { add('al-order', 'alignment', pu.i > gu.i ? 2 : 1, 'The goal ' + ckGoal(g) + ' builds on ' + ckGoal(p) + ', which is taught ' + (pu.i > gu.i ? 'in a later unit' : 'later in the same unit') + '.',
        'Students are asked to build on something they have not met yet.', { view: 'sequence', unit: g.unit, goal: g.id }, 'Wiggins and McTighe'); break; }
    }
  }

  /* ============ EVIDENCE ============ */
  if (c.assess.length >= 3) {
    const m0 = c.assess[0].method;
    if (c.assess.every((a) => a.method === m0))
      add('ev-single-method', 'evidence', 1, 'All ' + c.assess.length + ' assessments use the same method (' + ckName(METHODS, m0) + ').',
        'Different goals are shown best in different ways, so relying on one method can hide what some students know.', { view: 'evidence' }, 'Stiggins and Chappuis');
  }
  const W = c.syllabus.weights || {}, wt = (W.major || 0) + (W.minor || 0) + (W.homework || 0) + (W.participation || 0);
  if (wt !== 100) add('ev-weights-total', 'evidence', 1, 'The grading weights add up to ' + wt + ', not 100.', 'Students and families read the weights as percentages of the grade.', { view: 'syllabus' }, 'Brookhart and colleagues, clear criteria');
  else if ((W.homework || 0) + (W.participation || 0) > (W.major || 0) + (W.minor || 0))
    add('ev-weights-homework', 'evidence', 1, 'Homework and participation together count for more of the grade (' + ((W.homework || 0) + (W.participation || 0)) + '%) than tests and tasks (' + ((W.major || 0) + (W.minor || 0)) + '%).',
      'Teachers disagree about how much practice work should count; the more it does, the less the grade says about what students can show on their own.', { view: 'syllabus' }, 'Guskey and others, a disputed question');

  /* ============ FEASIBILITY ============ */
  if (hasUnits) {
    const avail = availableDays(c), budget = budgetedDays(c);
    if (budget > avail)
      add('fe-days-over', 'feasibility', 2, 'The units add up to ' + budget + ' class days, but the calendar has about ' + avail + ' to plan with.', 'The last ' + plural(budget - avail, 'day') + ' of the plan will not happen unless something is cut or shortened.', { view: 'calendar' }, 'Your own calendar');
    else if (budget > 0 && c.units.length >= 2 && avail - budget < Math.max(3, Math.round(avail * 0.03)))
      add('fe-no-buffer', 'feasibility', 1, 'The units use ' + budget + ' of ' + avail + ' available days, leaving ' + (avail - budget === 0 ? 'no spare day' : plural(avail - budget, 'spare day')) + '.',
        'Schools lose days to things nobody planned; a few spare days are worth a look.', { view: 'calendar' }, 'Your own calendar');
  }
  for (const x of Object.values(U)) {
    const u = x.u, planned = x.L.days;
    if (u.days > 0 && planned > u.days)
      add('fe-unit-overplanned', 'feasibility', 2, ckUnit(u) + ' has ' + planned + ' days of lessons planned, but only ' + u.days + ' budgeted.', 'Either the unit needs more days or some of the lessons will not fit.', { view: 'sequence', unit: u.id }, 'Your own calendar');
    if (x.L.overDays > 0) {
      let worst = null, count = 0, blocks = 0;
      for (const l of x.ls) { const o = LL[l.id].over; if (o > 0.5) { count++; if (LL[l.id].planned > c.school.period + 0.5) blocks++; if (!worst || o > worst.o) worst = { l, o }; } }
      if (worst) add('fe-lesson-over', 'feasibility', blocks ? 2 : 1,
        blocks ? (count === 1 ? ckQ(ckTrim(worst.l.title, 50)) + ' has more minutes of blocks planned than the period holds.' : plural(blocks, 'lesson') + ' in ' + ckUnit(u) + ' have more minutes of blocks planned than the period holds; the longest overrun is in ' + ckQ(ckTrim(worst.l.title, 40)) + '.')
          : (count === 1 ? ckQ(ckTrim(worst.l.title, 50)) + ' may run past the bell once settling in and moving are counted.' : plural(count, 'lesson') + ' in ' + ckUnit(u) + ' may run past the bell once settling in and moving are counted; the closest call is ' + ckQ(ckTrim(worst.l.title, 40)) + '.'),
        blocks ? 'The blocks you planned do not fit in the period.' : 'The setup and moving times are estimates, so treat this as worth a look rather than a certainty.', { view: 'lessons', unit: u.id, lesson: worst.l.id }, 'Your own plan');
    }
    for (const a of x.as) {
      if (a.kind !== 'major') continue;
      if (!(a.min > 0) && !(a.out > 0))
        add('fe-assess-no-minutes', 'feasibility', 1, ckQ(ckTrim(a.title, 50)) + ' is a major assessment that takes no time in or out of class.', 'Every major assessment needs some time from students, so a zero here is likely a gap.', { view: 'evidence', unit: u.id, assess: a.id }, 'Your own plan');
      else if (a.min > 0 && x.ls.length && assessDay[a.id] == null && u.days > 0 && planned >= u.days)
        add('fe-assess-no-time', 'feasibility', 1, ckQ(ckTrim(a.title, 50)) + ' needs ' + a.min + ' minutes in class, but no lesson has a block for it, and the unit\u2019s days are fully planned.', 'The time has to come from somewhere, and it is easier to find now than the week before.', { view: 'lessons', unit: u.id, assess: a.id }, 'Your own plan');
    }
  }

  /* ============ PRACTICE AND FEEDBACK ============ */
  for (const x of Object.values(U)) {
    const L = x.L, u = x.u, w = { view: 'lessons', unit: u.id };
    const quiet = sum(x.ls.map((l) => (LL[l.id].show < 2 ? l.days || 1 : 0)));
    if (L.days >= 3 && (L.show < 1 || quiet > L.days / 2))
      add('pr-no-show', 'practice', L.show < 1 ? 2 : 1, L.show < 1 ? 'In ' + ckUnit(u) + ', the planned lessons have no time where students show what they know along the way.' : 'In ' + ckUnit(u) + ', more than half of the planned days have under two minutes where students show what they know.', 'Short checks tell you and the students where things stand while there is still time to adjust.', w, 'Rosenshine');
    else if (L.days >= 4 && L.show >= 10 && x.S.fed < 0.15)
      add('pr-show-late-fb', 'practice', 1, 'In ' + ckUnit(u) + ', students show what they know, but almost none of it gets feedback during the lesson.', 'Feedback is easiest to use when it comes while students can still change their answer.', w, 'Black and Wiliam');
    // Group project time with roles left loose. Slavin; Johnson and Johnson: moderately supported.
    let loose = 0; for (const l of x.ls) for (const b of l.blocks) { const m = MOVE_BY[b.move]; if (m && (m.sw || []).some((q) => q.id === 'acct') && (b.sw && b.sw.acct) !== 'roles') loose += b.min * (l.days || 1); }
    if (loose >= 30) add('pr-group-loose', 'practice', 1, 'In ' + ckUnit(u) + ', about ' + Math.round(loose) + ' minutes of group project time leave roles to the team, so no student has a piece they answer for.',
      'Group work seems to help most when the group has a shared goal and each student answers for a part; the evidence is moderate, so this is worth a look.', w, 'Slavin; Johnson and Johnson');
    // Practised once, never brought back, in a unit long enough to forget it. Spacing gaps are weak: stated as a look.
    if (u.days >= 10 && x.span) {
      const gone = x.gs.filter((g) => { const m = GM[g.id]; return g.priority !== 'familiar' && m.min > 0 && m.days.length === 1 && !m.retr && !reviewGoals.has(g.id) && x.span.to - m.days[0] >= 5; });
      if (gone.length) add('pr-practiced-once', 'practice', gone.some((g) => g.priority === 'lasting') ? 1 : 0,
        (gone.length === 1 ? 'The goal ' + ckGoal(gone[0]) + ' is' : plural(gone.length, 'goal') + ', including ' + ckGoal(gone[0]) + ', are') + ' taught on one day in ' + ckUnit(u) + ' and not brought back.',
        'Learning that is not brought back from memory a few days later tends to fade; no particular gap is known to be best.', { view: 'lessons', unit: u.id, goal: gone[0].id }, 'Cepeda and colleagues');
    }
    // Minor checks before the major assessment.
    if (x.as.some((a) => a.kind === 'major') && !x.as.some((a) => a.kind === 'minor') && x.ls.length)
      add('pr-no-minor', 'practice', 1, ckUnit(u) + ' goes to its major assessment with no smaller check before it.', 'A short check along the way is a chance to practise and to learn what to reteach.', { view: 'evidence', unit: u.id }, 'Stiggins and Chappuis');
    // Feedback returned too late to use.
    for (const a of x.as) {
      const day = assessDay[a.id]; if (day == null || a.fb === 'none' || !x.span) continue;
      const left = x.span.to - day;
      const late = a.kind === 'minor' ? a.back >= 2 && a.back > left : a.back >= 4 && a.back > left && !a.retake;
      if (late) add('pr-late-feedback', 'practice', 1, ckQ(ckTrim(a.title, 50)) + ' comes back after ' + plural(a.back, 'day') + ', with ' + (left > 0 ? plural(left, 'day') : 'no days') + ' left in the unit.',
        'Feedback that arrives after the unit has ended is harder for students to act on' + (a.kind === 'major' ? ', unless a retake is offered.' : '.'), { view: 'evidence', unit: u.id, assess: a.id }, 'Black and Wiliam');
    }
  }
  // Homework, course-wide.
  const hwL = c.lessons.filter((l) => l.hw && l.hw.min > 0);
  const hwNew = [], hwNone = [];
  for (const l of hwL) {
    const h = l.hw, d0 = lessonDay[l.id];
    const fresh = h.purpose === 'prepare' || (h.purpose === 'practice' && (h.goals || []).some((g) => GM[g] && d0 != null && GM[g].days[0] != null && GM[g].days[0] >= d0));
    if (h.graded === 'accuracy' && fresh) hwNew.push(l);
    if (h.fb === 'none') hwNone.push(l);
  }
  if (hwNew.length) add('hw-accuracy-new', 'practice', 1, plural(hwNew.length, 'homework task') + ' (first: ' + ckQ(ckTrim(hwNew[0].title, 40)) + ') ' + (hwNew.length === 1 ? 'is' : 'are') + ' graded for accuracy on material students are meeting for the first time, which is worth a look.',
    'Whether to grade first attempts for accuracy is a judgment call; some teachers grade for completion at first.', { view: 'homework', unit: hwNew[0].unit, lesson: hwNew[0].id }, 'Common practice advice; the research on this is thin');
  if (hwNone.length) add('hw-no-feedback', 'practice', hwNone.length >= 3 ? 1 : 0, plural(hwNone.length, 'homework task') + ' (first: ' + ckQ(ckTrim(hwNone[0].title, 40)) + ') ' + (hwNone.length === 1 ? 'gets' : 'get') + ' no feedback of any kind.',
    'Whether homework needs any response is a judgment call; a quick look or a go-over in class is one option.', { view: 'homework', unit: hwNone[0].unit, lesson: hwNone[0].id }, 'Common practice advice; the research on this is thin');

  /* ============ WORKLOAD ============ */
  const limit = c.intent && c.intent.hw;
  if (limit != null && limit >= 0) {
    const over = hwL.filter((l) => l.hw.min > limit);
    if (over.length) {
      over.sort((a, b) => b.hw.min - a.hw.min); const worst = over[0], nights = sum(over.map((l) => l.days || 1));
      add('wl-hw-over', 'workload', worst.hw.min >= limit * 1.5 ? 2 : 1, plural(nights, 'night') + ' of homework ask for more than your own limit of ' + limit + ' minutes; the longest is ' + worst.hw.min + ' minutes (' + ckQ(ckTrim(worst.title, 40)) + ').',
        'You set that limit yourself, so this is where the plan and your own limit differ.', { view: 'homework', unit: worst.unit, lesson: worst.id }, 'Your own intent');
    }
  }
  {
    const dev = hwL.filter((l) => l.hw.device), nights = sum(hwL.map((l) => l.days || 1)), dn = sum(dev.map((l) => l.days || 1));
    if (dev.length) add('wl-hw-device', 'workload', dn >= 3 || dn / (nights || 1) >= 0.3 ? 1 : 0, plural(dn, 'night') + ' of homework need a device or internet (first: ' + ckQ(ckTrim(dev[0].title, 40)) + ').',
      'Some students may not have reliable access at home, so class time or another way in is worth a look.', { view: 'homework', unit: dev[0].unit, lesson: dev[0].id }, 'Your own plan');
  }

  /* ============ INTENT ============ */
  if (plannedAll >= 3 && CL.learn > 0) {
    const S = shares(CL), I = c.intent || {};
    const rows = [['in-active', 'active', 'Students are active (working with the material or making something) in', 'in', 'active', 'a share of planned class time'],
      ['in-together', 'together', 'Students work in pairs or groups for', 'in', 'together', 'a share of learning time'],
      ['in-high', 'high', 'Learning time at strategic or extended thinking is', 'in', 'high', 'a share of learning time']];
    for (const r of rows) {
      const key = r[1], target = (I[key] || 0) / 100, have = S[key];
      if (have + 0.05 + 1e-9 >= target) continue;
      let low = null; for (const x of Object.values(U)) if (x.L.days >= 3 && x.L.learn > 0 && (!low || x.S[key] < low.S[key])) low = x;
      const many = Object.values(U).filter((x) => x.L.days >= 3).length >= 2;
      const txt = key === 'active' ? 'About ' + ckPct(have) + ' of planned class time has students active, against your aim of ' + ckPct(target) + '.'
        : key === 'together' ? 'About ' + ckPct(have) + ' of learning time has students working in pairs or groups, against your aim of ' + ckPct(target) + '.'
        : 'About ' + ckPct(have) + ' of learning time is at strategic or extended thinking, against your aim of ' + ckPct(target) + '.';
      add(r[0], 'intent', 1, txt.replace(/^About/, 'Your plan and your aim differ: about') + (many && low ? ' ' + ckUnit(low.u) + ' is furthest below, at ' + ckPct(low.S[key]) + '.' : ''),
        'This only compares the plan with what you said you want; it does not say which is better.', { view: 'lessons', unit: many && low ? low.u.id : undefined }, 'Your own intent');
    }
  }

  out.forEach((f, i) => (f._o = i));
  out.sort((a, b) => b.sev - a.sev || a._o - b._o);
  out.forEach((f) => delete f._o);
  return out;
}

/* How much of the course exists, 0..1: goals 10%, units with days 10%, units with an assessment 10%,
   lesson days planned against days budgeted 50%, lessons with homework 5%, syllabus 15%. */
function ckBuilt(c) {
  const nU = c.units.length, budget = budgetedDays(c), planned = sum(c.lessons.map((l) => l.days || 1)), S = c.syllabus || {};
  const goals = Math.min(1, c.goals.length / 8);
  const units = nU ? Math.min(1, Math.min(budget, availableDays(c)) / Math.max(1, availableDays(c))) : 0;
  const assess = nU ? c.units.filter((u) => c.assess.some((a) => a.unit === u.id)).length / nU : 0;
  const lessons = budget ? Math.min(1, planned / budget) : 0;
  const hw = c.lessons.length ? Math.min(1, c.lessons.filter((l) => l.hw && l.hw.min > 0).length / c.lessons.length / 0.6) : 0;
  const syl = ['about', 'materials', 'contact', 'help', 'honesty'].filter((k) => String(S[k] || '').trim()).length / 5;
  return clamp(0.10 * goals + 0.10 * units + 0.10 * assess + 0.50 * lessons + 0.05 * hw + 0.15 * syl, 0, 1);
}

function gradeCourse(c, findings) {
  findings = findings || runChecks(c);
  const nU = c.units.filter((u) => c.lessons.some((l) => l.unit === u.id) || c.assess.some((a) => a.unit === u.id) || c.goals.some((g) => g.unit === u.id) || (u.days > 0)).length;
  const N = 40 + 14 * Math.max(1, nU), planned = sum(c.lessons.map((l) => l.days || 1)), hwN = c.lessons.filter((l) => l.hw && l.hw.min > 0).length, budget = budgetedDays(c);
  /* Enough lessons exist to judge how the days run: 10 planned class days, or one unit of 5+ days fully planned. */
  const enough = planned >= 10 || c.units.some((u) => u.days >= 5 && plannedDays(c, u.id) >= u.days);
  const can = { alignment: c.goals.length >= 1, evidence: c.goals.length >= 1 && c.assess.length >= 1, feasibility: c.units.some((u) => u.days > 0),
    practice: enough, workload: enough && (hwN >= 1 || planned >= 5), intent: enough };
  const basis = { alignment: plural(c.goals.length, 'goal') + ' and ' + plural(c.assess.length, 'assessment'), evidence: plural(c.goals.length, 'goal') + ' and ' + plural(c.assess.length, 'assessment'),
    feasibility: plural(budget, 'budgeted day') + (enough ? '' : ' (the calendar only; lessons are not planned enough to judge minutes)'), practice: plural(planned, 'planned day'), workload: plural(planned, 'planned day'), intent: plural(planned, 'planned day') };
  const wait = { alignment: 'Add some goals to see how well the plan lines up.', evidence: 'Add goals and an assessment to judge the evidence.', feasibility: 'Budget days for the units to compare them with the calendar.',
    practice: 'Plan at least 10 class days, or one whole unit, before this can be judged.', workload: 'Plan at least 10 class days, or one whole unit, with homework before this can be judged.', intent: 'Plan at least 10 class days, or one whole unit, before the plan can be compared with your aim.' };
  const areas = CHECK_AREAS.map(([id, name]) => {
    const mine = findings.filter((f) => f.area === id), n = mine.length;
    if (!can[id]) return { id, name, score: null, grade: '\u2014', summary: wait[id], n };
    const P = sum(mine.map((f) => CHECK_WEIGHT[f.sev])); let score = Math.round(100 * N / (N + P));
    if (id === 'intent') score = Math.max(score, 80);          // an aim you set yourself never pulls the grade below B minus
    const s2 = mine.filter((f) => f.sev === 2).length, s1 = mine.filter((f) => f.sev === 1).length, s0 = n - s2 - s1;
    const parts = [s2 && plural(s2, 'thing') + ' to fix', s1 && plural(s1, 'thing') + ' worth a look', s0 && plural(s0, 'small note')].filter(Boolean);
    const summary = (parts.length ? parts.join(' and ') : 'Nothing to flag') + ' across ' + basis[id] + '.';
    return { id, name, score, grade: gradeLetter(score), summary, n };
  });
  return { areas, built: ckBuilt(c), enough, planned: budget > 0 ? clamp(planned / budget, 0, 1) : 0 };
}

/* Findings for one view, optionally narrowed to a unit, lesson, assessment or goal. `where` may be a view id or { view, unit, lesson, assess, goal }. */
function checksFor(findings, where) {
  const w = typeof where === 'string' ? { view: where } : where || {};
  return findings.filter((f) => (!w.view || f.where.view === w.view) && (!w.unit || f.where.unit === w.unit) && (!w.lesson || f.where.lesson === w.lesson) && (!w.assess || f.where.assess === w.assess) && (!w.goal || f.where.goal === w.goal));
}
