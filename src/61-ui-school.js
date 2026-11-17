/* The school profile: a leader fills it in once and hands the file to teachers. It sets the schedule and calendar, the grading
   policy, school-wide syllabus text, house expectations and a standards list, and can lock any of those. Also here: the editors
   for a rotating schedule and for named days off, which the Calendar chapter shares, and the standards table in the report. */
const PF_KEY = 'ldf-school-1';
function pfLoad() { try { const t = localStorage.getItem(PF_KEY); return t ? cleanProfile(JSON.parse(t)) : null; } catch (e) { return null; } }
function pfSave() { try { if (App.pf) localStorage.setItem(PF_KEY, JSON.stringify(App.pf)); } catch (e) { /* storage is optional */ } }
App.pf = pfLoad(); App.pfUse = false;
const pfGet = () => App.pf || (App.pf = newProfile());
/* Where a shared editor reads and writes: the profile being edited ('pf') or the open course ('c'). */
const schedOf = (t) => (t === 'pf' ? pfGet().schedule : App.c.school), calOf = (t) => (t === 'pf' ? pfGet().calendar : App.c.school);

/* ---------- rotating schedule ---------- */
const cycName = (len, n) => (len <= 8 ? 'Day ' + 'ABCDEFGH'[n - 1] : 'Day ' + n);
function cycleEditorHTML(t) {
  const S = schedOf(t), cy = S.cycle;
  let h = '<div class="stack"><span class="lbl" id="cyc-l-' + t + '">The timetable</span><span class="seg" role="group" aria-labelledby="cyc-l-' + t + '"><button data-act="cycSet" data-arg="' + t + '=week" aria-pressed="' + !cy + '">Repeats each week</button><button data-act="cycSet" data-arg="' + t + '=cycle" aria-pressed="' + !!cy + '">Rotates (A/B days or a longer cycle)</button></span></div>';
  if (!cy) return h + '<p class="hint">Choose how often the class meets above. Pick “Rotates” if your school numbers or letters its days and the rotation carries on across weekends.</p>';
  h += '<div class="row wrap"><span class="lbl">Days in the cycle</span><span class="step"><button data-act="cycLen" data-arg="' + t + '=-1" aria-label="One fewer day in the cycle">−</button><input type="number" value="' + cy.len + '" readonly aria-label="Days in the cycle" tabindex="-1"><button data-act="cycLen" data-arg="' + t + '=1" aria-label="One more day in the cycle">+</button></span></div>' +
    '<div class="stack"><span class="lbl" id="cyc-d-' + t + '">This class meets on</span><span class="chips" role="group" aria-labelledby="cyc-d-' + t + '">' + Array.from({ length: cy.len }, (x, k) => '<button class="chip" data-act="cycDay" data-arg="' + t + '=' + (k + 1) + '" aria-pressed="' + cy.on.includes(k + 1) + '">' + cycName(cy.len, k + 1) + '</button>').join('') + '</span></div>' +
    '<p class="hint">The class meets on ' + cy.on.length + ' of every ' + cy.len + ' school days. The rotation skips days off and picks up where it stopped, so a snow day pushes everything back a day.</p>';
  return h;
}
ACT.cycSet = (a) => { const p = a.split('='), S = schedOf(p[0]); S.cycle = p[1] === 'cycle' ? S.cycle || { len: 2, on: [1] } : null; };
ACT.cycLen = (a) => { const p = a.split('='), cy = schedOf(p[0]).cycle; if (!cy) return; cy.len = clamp(cy.len + +p[1], 2, 10); cy.on = cy.on.filter((d) => d <= cy.len); if (!cy.on.length) cy.on = [1]; };
ACT.cycDay = (a) => { const p = a.split('='), cy = schedOf(p[0]).cycle, d = +p[1]; if (!cy) return; const k = cy.on.indexOf(d); if (k >= 0) { if (cy.on.length > 1) cy.on.splice(k, 1); else toast('The class has to meet on at least one day of the cycle.'); } else { cy.on.push(d); cy.on.sort((x, y) => x - y); } };

/* ---------- named days off ---------- */
function offListHTML(t) {
  const C = calOf(t), runs = offRuns({ school: C }), bind = t === 'pf' ? 'pfon' : 'offname';
  return '<div class="stack"><div class="sec-h">Days off, by name <small>' + plural((C.off || []).length, 'day') + ' in all</small></div>' +
    (runs.length ? '<div class="offlist">' + runs.map((r) => '<div class="offrow"><span class="num">' + niceDate(r.from) + (r.to !== r.from ? ' to ' + niceDate(r.to) : '') + '</span><input class="field" data-bind="' + bind + '::' + r.from + '" value="' + esc(r.name) + '" placeholder="What is it? For example, Fall break" aria-label="Name for the day off starting ' + niceDate(r.from) + '"><button class="x" data-act="offDel" data-arg="' + t + '=' + r.from + '=' + r.to + '" aria-label="Make ' + niceDate(r.from) + (r.to !== r.from ? ' to ' + niceDate(r.to) : '') + ' school days again">×</button></div>').join('') + '</div>' : '<p class="hint">No days off yet.</p>') +
    '<div class="row wrap offadd"><span class="lbl">Add</span><input type="date" class="field" id="off-from-' + t + '" aria-label="First day off"><span class="hint">to</span><input type="date" class="field" id="off-to-' + t + '" aria-label="Last day off, if more than one day"><input class="field" id="off-name-' + t + '" placeholder="Name" aria-label="Name of the day off"><button class="btn sm" data-act="offAdd" data-arg="' + t + '">Add days off</button></div></div>';
}
ACT.offAdd = (t) => {
  const C = calOf(t), from = $('off-from-' + t).value, to = $('off-to-' + t).value || from, name = $('off-name-' + t).value.trim(), ok = (x) => /^\d{4}-\d{2}-\d{2}$/.test(x);
  if (!ok(from) || !ok(to) || to < from || (dateOf(to) - dateOf(from)) / DAY_MS > 60) { toast('Pick a first day, and a last day no more than two months later.'); return false; }
  C.off = C.off || []; C.offNames = C.offNames || {}; let first = null;
  for (let d = dateOf(from), e = dateOf(to); d <= e; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) { if (d.getDay() % 6 === 0) continue; const iso = isoOf(d); if (!C.off.includes(iso)) C.off.push(iso); if (!first) first = iso; }
  C.off.sort(); if (first && name) { const run = offRuns({ school: C }).find((r) => first >= r.from && first <= r.to); C.offNames[run ? run.from : first] = name; }
};
ACT.offDel = (a) => { const p = a.split('='), C = calOf(p[0]); C.off = (C.off || []).filter((x) => x < p[1] || x > p[2]); if (C.offNames) delete C.offNames[p[1]]; };
/* The extra panels the Calendar chapter shows under its settings. */
function calExtraHTML(c) { return '<div class="grid2"><div class="panel"><h2>Rotating timetable <small>For A/B days and longer cycles</small></h2>' + cycleEditorHTML('c') + '</div><div class="panel">' + offListHTML('c') + '</div></div>'; }

/* ---------- standards in the report ---------- */
function repStandardsHTML(c) {
  const cited = {}; c.goals.forEach((g) => goalStds(g).forEach((code) => (cited[code] = cited[code] || []).push(g)));
  const list = profileStandards(c.profile), text = {}; list.forEach((s) => (text[s.code] = s.text));
  const codes = Object.keys(cited).sort(); if (!codes.length && !list.length) return '';
  const ev = (g) => c.assess.some((a) => a.goals.includes(g.id)), missing = list.filter((s) => !cited[s.code]);
  return '<div class="panel"><h2>Standards <small>' + esc(c.standardsName || (c.profile && c.profile.standardsName) || 'As cited on your goals') + '</small></h2>' +
    (codes.length ? '<div class="scrollx"><table class="tbl"><tr><th>Standard</th><th>Goals that cite it</th><th>Evidence</th></tr>' + codes.map((k) => { const gs = cited[k], n = gs.filter(ev).length; return '<tr><td><b>' + esc(k) + '</b>' + (text[k] ? '<br><span class="hint">' + esc(short(text[k], 110)) + '</span>' : '') + '</td><td>' + gs.map((g) => esc(short(g.text, 70))).join('<br>') + '</td><td>' + (n === gs.length ? tag('assessed', 'good') : n ? tag(n + ' of ' + gs.length + ' assessed', 'warn') : tag('no evidence yet', 'bad')) + '</td></tr>'; }).join('') + '</table></div>' : '<p class="hint">No goal cites a standard yet. Add codes on a goal under Goals.</p>') +
    (missing.length ? '<p class="hint"><b>' + plural(missing.length, 'standard') + ' on your school’s list that no goal cites yet:</b> ' + missing.slice(0, 40).map((s) => esc(s.code)).join(', ') + (missing.length > 40 ? ' and more' : '') + '.</p>' : '') + '</div>';
}

/* ---------- the profile screen ---------- */
const pfExpectRows = [['active', 'Students active', '% of class time', 50], ['together', 'Working in pairs or groups', '% of learning time', 20], ['high', 'Strategic or extended thinking', '% of learning time', 20], ['hw', 'Homework a night, at most', ' min', 30]];
VIEWS.school = {
  name: 'School profile', wide: true,
  render(c) {
    const P = pfGet(), W = P.grading.weights, tot = W.major + W.minor + W.homework + W.participation, real = c && !c.warm;
    const late = typeof LATE_POLICIES !== 'undefined' ? LATE_POLICIES : [], re = typeof RETAKE_POLICIES !== 'undefined' ? RETAKE_POLICIES : [];
    const step = (label, path, v, lo, hi, s) => '<span class="step" role="group" aria-label="' + label + '"><button data-act="nudge" data-arg="' + path + '=' + (-s) + '=' + lo + '=' + hi + '" aria-label="Less">−</button><input type="number" data-bind="' + path + '" data-num min="' + lo + '" max="' + hi + '" value="' + v + '" aria-label="' + label + '"><button data-act="nudge" data-arg="' + path + '=' + s + '=' + lo + '=' + hi + '" aria-label="More">+</button></span>';
    const using = real && c.profile ? '<div class="pf-using"><b>“' + esc(c.title) + '” is using the profile for ' + esc(c.profile.name || 'your school') + '.</b> ' + (Object.keys(c.profile.locks).length ? 'Set by the school and not changeable in the course: ' + PROFILE_LOCKS.filter((k) => c.profile.locks[k[0]]).map((k) => k[1].toLowerCase()).join('; ') + '.' : 'Nothing is locked.') + ' <button class="btn sm" data-act="pfRemove">Stop using it for this course</button></div>' : '';
    return '<div class="ws school"><div class="ws-head"><div class="eyebrow">For whoever sets things up for a school</div><h1>School profile</h1><p>Fill this in once for your school, download it as a file, and give the file to your teachers. When a teacher opens it, their course starts with your schedule, calendar and grading policy, and the report shows your expectations beside their own. Nothing is sent anywhere: the profile is a file you hand over.</p>' +
      '<div class="row wrap"><button class="btn pri" data-act="pfDownload">Download the profile file</button><button class="btn" data-act="openFile">Open a profile file</button>' + (real ? '<button class="btn" data-act="pfApplyAsk">Apply it to “' + esc(short(c.title, 28)) + '”</button>' : '') + '<button class="btn ghost" data-act="pfReset">Start the profile over</button><button class="btn ghost" data-act="go" data-arg="' + (c ? 'goals' : 'start') + '">Back</button></div></div>' + using +
      '<div class="panel"><h2>The school</h2><div class="stack"><label class="lbl" for="pf-name">School name</label>' + field('pf::name', P.name, 'id="pf-name" placeholder="As teachers will see it"') + '</div></div>' +
      '<div class="grid2"><div class="panel"><h2>Timetable</h2><div class="row wrap"><span class="lbl">A class period lasts</span>' + step('Period length in minutes', 'pfs::period', P.schedule.period, 20, 150, 5) + '<span class="hint">minutes</span></div>' +
      (P.schedule.cycle ? '' : '<div class="stack"><span class="lbl" id="pf-l-meets">A typical class meets</span><span role="group" aria-labelledby="pf-l-meets">' + seg('pfs::perWeek', [[5, 'Every day'], [2.5, 'Every other day'], [4, '4 days (Mon to Thu)'], [3, '3 days (Mon, Wed, Fri)'], [2, '2 days (Tue, Thu)']], P.schedule.perWeek) + '</span></div>') + cycleEditorHTML('pf') + '</div>' +
      '<div class="panel"><h2>School year</h2><div class="grid2"><div class="stack"><label class="lbl" for="pf-start">First day</label><input id="pf-start" type="date" class="field" data-bind="pfc::start" value="' + esc(P.calendar.start) + '"></div><div class="stack"><label class="lbl" for="pf-end">Last day</label><input id="pf-end" type="date" class="field" data-bind="pfc::end" value="' + esc(P.calendar.end) + '"></div></div>' +
      '<div class="row wrap"><span class="lbl">Days a class usually loses</span>' + step('Days a class usually loses', 'pfc::lost', P.calendar.lost, 0, 60, 1) + '<span class="hint">to assemblies, drills, testing and weather</span></div>' +
      '<div class="row wrap"><button class="btn sm" data-act="pfHolidays">Use the usual US holidays for this year</button><button class="btn sm" data-act="pfClearOff">Clear all days off</button></div></div></div>' +
      '<div class="panel">' + offListHTML('pf') + '</div>' +
      '<div class="grid2"><div class="panel"><h2>Grading policy <small data-live="pf-tot">' + (tot === 100 ? 'Weights add up to 100' : 'Weights add up to ' + tot + ', not 100') + '</small></h2>' + [['major', 'Major assessments'], ['minor', 'Minor assessments'], ['homework', 'Homework'], ['participation', 'Participation']].map((x) => '<div class="row between"><span>' + x[1] + '</span><span class="row">' + step(x[1] + ', percent of the grade', 'pfw::' + x[0], W[x[0]], 0, 100, 5) + '<span class="hint">%</span></span></div>').join('') +
      (late.length ? '<div class="stack"><label class="lbl" for="pf-late">Late work</label>' + pick('pfg::late', late.map((x) => [x[0], x[1]]), P.grading.late, 'id="pf-late"') + '</div><div class="stack"><label class="lbl" for="pf-retake">Retakes</label>' + pick('pfg::retake', re.map((x) => [x[0], x[1]]), P.grading.retake, 'id="pf-retake"') + '</div>' : '') + '</div>' +
      '<div class="panel"><h2>On every syllabus <small>Leave blank to let teachers write their own</small></h2><div class="stack"><label class="lbl" for="pf-hon">Academic honesty</label>' + area('pft::honesty', P.text.honesty, 'id="pf-hon" rows="4"') + '</div><div class="stack"><label class="lbl" for="pf-help">How students get help</label>' + area('pft::help', P.text.help, 'id="pf-help" rows="4"') + '</div></div></div>' +
      '<div class="grid2"><div class="panel"><h2>What the school expects <small>Shown beside each teacher’s own aims, never in place of them</small></h2>' + pfExpectRows.map((x) => { const v = P.expect[x[0]]; return '<div class="stack" style="gap:3px"><div class="row between"><b>' + x[1] + '</b><span class="row"><b class="num" data-live="pfe-' + x[0] + '">' + (v == null ? 'No expectation' : v + x[2]) + '</b><button class="btn sm" data-act="pfExpect" data-arg="' + x[0] + '">' + (v == null ? 'Set one' : 'Remove') + '</button></span></div>' + (v == null ? '' : '<input type="range" data-bind="pfe::' + x[0] + '" min="0" max="' + (x[0] === 'hw' ? 90 : 90) + '" step="5" value="' + v + '" aria-label="' + x[1] + '">') + '</div>'; }).join('') +
      '<p class="hint">Research does not support a right amount of lecture or group work, so think of these as your school’s agreements, not as findings.</p></div>' +
      '<div class="panel"><h2>How grades are shown</h2><span role="group" aria-label="How grades are shown">' + seg('pf::gradeStyle', [['letters', 'Letters (A to F)'], ['words', 'Words (Strong, Sound, Developing, Needs work)']], P.gradeStyle) + '</span><p class="hint">The report grades the design of a course, for the teacher’s own use. Words may sit better with new teachers than letters.</p>' +
      '<h2 style="margin-top:8px">What teachers may not change</h2><span class="chips" role="group" aria-label="Settings locked for teachers">' + PROFILE_LOCKS.map((k) => '<button class="chip" data-act="pfLock" data-arg="' + k[0] + '" aria-pressed="' + !!P.locks[k[0]] + '">' + k[1] + '</button>').join('') + '</span><p class="hint">A locked setting is copied into the course and shown as set by the school. Everything else is a starting point teachers can adjust.</p></div></div>' +
      '<div class="panel"><h2>Standards <small>Optional</small></h2><div class="stack"><label class="lbl" for="pf-stn">What they are called</label>' + field('pf::standardsName', P.standardsName, 'id="pf-stn" placeholder="For example, Next Generation Science Standards"') + '</div><div class="stack"><label class="lbl" for="pf-st">The list, one standard per line: its code, a space, then what it says</label>' + area('pf::standards', P.standards, 'id="pf-st" rows="7" placeholder="HS-LS1-2 Develop and use a model to illustrate the hierarchical organization of interacting systems"') + '</div><p class="hint" data-live="pf-stc">' + plural(profileStandards(P).length, 'standard') + ' listed. Teachers cite codes on their goals, and the report shows which standards have goals and evidence and which have neither. Paste only text you have the right to share.</p></div></div>';
  },
  after() { pfSave(); },
  live() { pfSave(); },
};
ACT.pfDownload = () => { const P = cleanProfile(pfGet()); download(((P.name || '').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-').toLowerCase() || 'school') + '.school.json', JSON.stringify(P, null, 1), 'application/json'); toast('Saved. Give this file to your teachers; they open it from the first page.'); return false; };
ACT.pfReset = () => { App.pf = newProfile(); };
ACT.pfHolidays = () => { const C = pfGet().calendar, y = /^\d{4}/.test(C.start) ? (dateOf(C.start).getMonth() < 6 ? dateOf(C.start).getFullYear() - 1 : dateOf(C.start).getFullYear()) : 2026; C.off = defaultDaysOff(y); C.offNames = defaultOffNames(y); };
ACT.pfClearOff = () => { const C = pfGet().calendar; C.off = []; C.offNames = {}; };
ACT.pfExpect = (k) => { const E = pfGet().expect; E[k] = E[k] == null ? pfExpectRows.find((x) => x[0] === k)[3] : null; };
ACT.pfLock = (k) => { const L = pfGet().locks; if (L[k]) delete L[k]; else L[k] = true; };
ACT.pfApplyAsk = (a, c) => { const P = pfGet(); openModal('<h2>Apply the school profile to this course?</h2><p>This replaces the course’s period length, timetable, first and last day, days off, grading weights, and late and retake policies with those in the profile for <b>' + esc(P.name || 'your school') + '</b>. Goals, units, assessments and lessons are not touched.</p><div class="foot"><button class="btn" data-act="closeModal">Cancel</button><button class="btn pri" data-act="pfApply">Apply it</button></div>'); return false; };
ACT.pfApply = (a, c) => { applyProfile(c, pfGet()); closeModal(); toast('The school profile is applied to this course.'); };
ACT.pfRemove = (a, c) => { c.profile = null; toast('This course no longer uses a school profile. Its settings stay as they are and can be changed.'); };
