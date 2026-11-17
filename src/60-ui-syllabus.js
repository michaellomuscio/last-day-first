/* Chapter 7, Syllabus: the promise to students and families. Form on the left, the real syllabus on the right as a sheet of paper.
   Every top-level name here starts with syl. */
const SYL_WEIGHTS = [['major', 'Major assessments', 'Tests, projects and essays that show what students can do'], ['minor', 'Minor assessments', 'Quizzes and small tasks'], ['homework', 'Homework', 'Work done outside class'], ['participation', 'Participation', 'Taking part in class']];
const sylTotal = (c) => sum(SYL_WEIGHTS.map((w) => +c.syllabus.weights[w[0]] || 0));
/* The printed syllabus has its own title and sections (h1, h2, h3). On this page they sit under the panel heading, so each moves down two levels and the screen keeps one h1. */
const sylShiftHeads = (h) => h.replace(/<(\/?)h([1-3])(?=[\s>])/g, (m, s, n) => '<' + s + 'h' + (+n + 2));
const sylSyllabusDoc = () => DOCS.find((d) => d.id === 'syllabus');

/* How the weights compare with the design: counts of assessments, and whether any homework is graded. */
function sylFacts(c) {
  const W = c.syllabus.weights, major = c.assess.filter((a) => a.kind === 'major').length, minor = c.assess.filter((a) => a.kind === 'minor').length;
  const hws = c.lessons.filter((l) => l.hw && l.hw.min > 0), graded = hws.filter((l) => l.hw.graded && l.hw.graded !== 'no');
  return { W, major, minor, hwNights: hws.length, hwGraded: graded.length, total: sylTotal(c) };
}
function sylCompareHTML(c) {
  const f = sylFacts(c), W = f.W, L = [];
  L.push('Your course has ' + plural(f.major, 'major assessment') + ' and ' + plural(f.minor, 'minor assessment') + '.');
  if (+W.major > 0 && !f.major) L.push('The syllabus gives major assessments ' + W.major + ' percent, but the course has none. Add some under Evidence, or move the weight.');
  if (+W.minor > 0 && !f.minor) L.push('Minor assessments carry ' + W.minor + ' percent, but the course has none.');
  if (+W.homework > 0 && !f.hwGraded) L.push('Homework counts for ' + W.homework + ' percent, but no homework in your lessons is graded. Either grade some of it or move that weight.');
  else if (!(+W.homework > 0) && f.hwGraded) L.push('You graded ' + plural(f.hwGraded, 'homework night') + ' in your lessons, but homework has no weight here. Students will wonder why they are being graded.');
  else if (+W.homework > 0) L.push('Homework counts for ' + W.homework + ' percent, and ' + f.hwGraded + ' of your ' + plural(f.hwNights, 'homework night') + ' ' + (f.hwGraded === 1 ? 'is' : 'are') + ' graded.');
  else L.push('Homework is not part of the grade, and none of your lessons grades it. That matches.');
  return '<ul class="syl-cmp">' + L.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ul>';
}
function sylTotalHTML(c) {
  const t = sylTotal(c); return '<span class="lbl">Total</span><b class="num syl-tot ' + (t === 100 ? 'ok' : 'off') + '">' + t + ' of 100</b>' + (t === 100 ? '<span class="tag good">Adds up</span>' : '<span class="tag bad">' + (t < 100 ? (100 - t) + ' short' : (t - 100) + ' over') + '</span>');
}
function sylPolicy(table, id) { const r = table.find((x) => x[0] === id); return r ? r[2] : ''; }

function sylDraftAbout(c) {
  const subj = (optName(SUBJECTS, c.subject) || '').toLowerCase(), qs = [];
  c.units.forEach((u) => (u.questions || []).forEach((q) => { q = String(q || '').trim().replace(/[?.!\s]+$/, ''); if (q && qs.length < 3) qs.push('“' + q + '?”'); }));
  const list = qs.length > 1 ? qs.slice(0, -1).join(', ') + ' and ' + qs[qs.length - 1] : qs[0] || '';
  const out = [(c.title || 'This course') + ' is a ' + (c.grade ? 'grade ' + c.grade + ' ' : '') + (subj && c.subject !== 'other' ? subj + ' ' : '') + 'course.'];
  if (list) out.push('Across the year we keep coming back to questions such as ' + list);
  if (list) out[out.length - 1] += '.';
  if (c.transfer && c.transfer.trim()) out.push('The aim is that, by the end, you can do this on your own: ' + c.transfer.trim().replace(/[.\s]+$/, '') + '.');
  return out.join(' ');
}

VIEWS.syllabus = {
  name: 'Syllabus',
  render(c) {
    const S = c.syllabus, W = S.weights || {}, doc = sylSyllabusDoc(), empty0 = !S.about.trim();
    const head = '<div class="ws-head"><div class="eyebrow">Chapter 7</div><h1>Syllabus</h1><p>The syllabus is the promise you make to students and families on day one. It should match the course you actually built.</p></div>';
    const about = '<div class="panel"><h2>What this course is about</h2>' + area('syllabus::about', S.about, 'id="syl-about" aria-label="What this course is about" rows="4" placeholder="Two or three plain sentences a family would understand."') +
      '<div class="row wrap"><button class="btn sm" data-act="sylDraft" ' + (empty0 && (c.units.length || c.transfer.trim()) ? '' : 'disabled') + ' title="Works only while the box is empty">Draft it from my aim and unit questions</button><span class="hint">' + (empty0 ? 'It joins your aim and your unit questions into a few sentences. You rewrite it.' : 'Clear the box to draft a fresh one.') + '</span></div>' +
      '<div class="grid2"><div class="stack"><label class="lbl" for="syl-teacher">Your name</label>' + field('course::teacher', c.teacher, 'id="syl-teacher" placeholder="Printed at the top of the syllabus"') + '</div><div class="stack"><label class="lbl" for="syl-grade">Grade</label>' + field('course::grade', c.grade, 'id="syl-grade" placeholder="For example 9"') + '</div></div></div>';
    const wrows = SYL_WEIGHTS.map((w) => '<div class="syl-w"><span><b>' + w[1] + '</b><small>' + w[2] + '</small></span>' + a11yStep('Percent of the grade for ' + w[1].toLowerCase(), 'weights::' + w[0], +W[w[0]] || 0, 0, 100, 5) + '<span class="hint">percent</span></div>').join('');
    const weights = '<div class="panel"><h2>How the grade is worked out <small>Must add up to 100</small></h2>' + wrows +
      '<div class="row wrap" data-live="wtotal">' + sylTotalHTML(c) + '</div><div class="row wrap"><button class="btn sm" data-act="sylEven">Split evenly</button><button class="btn sm" data-act="sylScale" ' + (sylTotal(c) > 0 && sylTotal(c) !== 100 ? '' : 'disabled') + ' title="Keep the same proportions and make the total 100">Scale to 100</button></div>' +
      '<div class="syl-cmpbox"><span class="lbl">Compared with your design</span><div data-live="compare">' + sylCompareHTML(c) + '</div></div></div>';
    const pol = (title, path, table, cur) => '<div class="stack"><span class="lbl" id="syl-l-' + path.split(':')[2] + '">' + title + '</span>' + a11yGroup('syl-l-' + path.split(':')[2], seg(path, table.map((x) => [x[0], x[1]]), cur)) + '<p class="syl-quote" data-live="pol-' + path.split(':')[2] + '">' + esc(sylPolicy(table, cur)) + '</p></div>';
    const policy = '<div class="panel"><h2>Late work and retakes</h2>' + pol('Late work', 'syllabus::late', LATE_POLICIES, S.late) + pol('Retakes', 'syllabus::retake', RETAKE_POLICIES, S.retake) +
      '<p class="hint">Experienced teachers disagree about both of these, and there is no single right answer. The choice is yours. Pick what you can keep up all year.</p></div>';
    const words = '<div class="panel"><h2>In your own words</h2>' +
      '<div class="stack"><label class="lbl" for="syl-materials">What students need to bring</label>' + area('syllabus::materials', S.materials, 'id="syl-materials" rows="2" placeholder="Notebook, calculator, a charged laptop"') + '</div>' +
      '<div class="stack"><label class="lbl" for="syl-honesty">Academic honesty</label>' + area('syllabus::honesty', S.honesty, 'id="syl-honesty" rows="3" placeholder="What counts as your own work, and what happens if it is not"') + '</div>' +
      '<div class="stack"><label class="lbl" for="syl-help">How to get help</label>' + area('syllabus::help', S.help, 'id="syl-help" rows="3" placeholder="When you are stuck: where to go, when you are free, who else can help"') + '</div>' +
      '<div class="stack"><label class="lbl" for="syl-contact">How to reach you</label>' + area('syllabus::contact', S.contact, 'id="syl-contact" rows="2" placeholder="School email, and when you usually answer"') + '</div></div>';
    const sylMiss = typeof syllabusMissing === 'function' ? syllabusMissing(c) : [];
    const preview = '<div class="syl-side"><div data-live="sylmiss">' + (sylMiss.length ? '<div class="syl-draft"><b>Not ready to send.</b> Still missing: ' + esc(sylMiss.join('; ')) + '. Until then it prints with a draft notice at the top.</div>' : '<div class="syl-draft ok"><b>Ready to send.</b> Read it once as a parent would before you do.</div>') + '</div><div class="row between wrap"><h2 class="sec-h" style="display:block">The syllabus as families will see it</h2><span class="row"><button class="btn sm pri" data-act="sylPrint">Print or save as PDF</button><button class="btn sm" data-act="sylWord">Download for Word</button></span></div>' +
      '<div class="syl-sheet"><div class="syl-doc" data-live="preview">' + (doc ? sylShiftHeads(doc.html(c)) : '') + '</div></div></div>';
    return '<div class="ws syl">' + head + '<div class="syl-grid"><div class="stack syl-form">' + about + weights + policy + words + '</div>' + preview + '</div></div>';
  },
};
ACT.sylDraft = (a, c) => { if (c.syllabus.about.trim()) return false; c.syllabus.about = sylDraftAbout(c); };
ACT.sylEven = (a, c) => { for (const w of SYL_WEIGHTS) c.syllabus.weights[w[0]] = 25; };
ACT.sylScale = (a, c) => {
  const W = c.syllabus.weights, t = sylTotal(c); if (!t) return false;
  let left = 100; SYL_WEIGHTS.forEach((w, i) => { const v = i === SYL_WEIGHTS.length - 1 ? left : Math.round((+W[w[0]] || 0) * 100 / t); W[w[0]] = Math.max(0, v); left -= W[w[0]]; });
};
ACT.sylPrint = (a, c) => {
  const w = window.open('', '_blank');
  if (!w) { toast('Your browser blocked the new window. Allow pop-ups for this page, then try again.'); return false; }
  w.document.open(); w.document.write(packetHTML(c, ['syllabus'])); w.document.close(); w.focus(); setTimeout(() => { try { w.print(); } catch (e) { /* the teacher can print from the window */ } }, 500);
  return false;
};
ACT.sylWord = (a, c) => { download((c.title || 'course').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-').toLowerCase() + '-syllabus.doc', packetHTML(c, ['syllabus']), 'application/msword'); toast('Downloaded. Word opens it as an ordinary document.'); return false; };

MENTOR.syllabus = (c) => {
  const f = sylFacts(c), S = c.syllabus, W = f.W, L = [];
  if (f.total !== 100) L.push('Your weights add up to ' + f.total + ', not 100. Fix that before a parent does the math for you.');
  if (+W.homework > +W.major) L.push('Homework counts for more than your major assessments. Make sure that is what you mean.');
  if (+W.homework > 0 && !f.hwGraded) L.push('The syllabus weighs homework, but nothing in your lessons grades it. Students will notice the gap before you do.');
  if (!S.help.trim()) L.push('Nothing says how to get help. A student who is stuck needs to know exactly where to go.');
  if (!S.about.trim()) L.push('Say in your own words what the course is about. Families read that part first.');
  if (!S.contact.trim()) L.push('Tell families how to reach you, and when you usually answer.');
  return L.slice(0, 2);
};
