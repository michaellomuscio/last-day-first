/* The shell: state, saving, data binding, navigation, and the small HTML helpers every workspace uses. */
const App = { c: null, view: 'start', sel: {}, findings: [], modal: null, play: { on: false, t: 0 } };
const VIEWS = {}, ACT = {}, MENTOR = {};
const $ = (id) => document.getElementById(id);
const CHAPTERS = [['goals', 'Goals', 'What should last'], ['sequence', 'Sequence', 'Scope and sequence'], ['evidence', 'Evidence', 'Assessments'], ['calendar', 'Calendar', 'Pacing guide'],
  ['lessons', 'Lessons', 'Units and lessons'], ['homework', 'Homework', 'Homework'], ['syllabus', 'Syllabus', 'Syllabus'], ['report', 'Report', 'Label, grades, fingerprint']];

/* ---------- saving ---------- */
const SAVE_KEY = 'ldf-course-1';
let saveTimer = 0;
function saveNow() { try { if (App.c && !App.c.demo) localStorage.setItem(SAVE_KEY, JSON.stringify(App.c)); } catch (e) { /* storage is optional */ } }
function save() { clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, 400); }
function loadSaved() { try { const t = localStorage.getItem(SAVE_KEY); if (!t) return null; const c = JSON.parse(t); return c && Array.isArray(c.units) ? migrate(c) : null; } catch (e) { return null; } }
/* Nothing typed in the last moment is lost when the page is closed, hidden or left. */
const flushSave = () => { clearTimeout(saveTimer); saveNow(); };
window.addEventListener('pagehide', flushSave); window.addEventListener('beforeunload', flushSave); document.addEventListener('visibilitychange', () => { if (document.hidden) flushSave(); });
function download(name, text, mime) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: mime || 'text/plain' })); a.download = name;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

/* ---------- binding: "kind:id:prop" names a field on the course ---------- */
function resolve(kind, id) {
  const c = App.c;
  switch (kind) {
    case 'course': return c; case 'school': return c.school; case 'intent': return c.intent; case 'syllabus': return c.syllabus; case 'weights': return c.syllabus.weights;
    case 'goal': return goalOf(c, id); case 'unit': return unitOf(c, id); case 'lesson': return lessonOf(c, id); case 'assess': return assessOf(c, id);
    case 'hw': { const l = lessonOf(c, id); return l ? l.hw : null; }
    case 'block': { const p = id.split('/'), l = lessonOf(c, p[0]); return l ? byId(l.blocks, p[1]) : null; }
    case 'sw': { const p = id.split('/'), l = lessonOf(c, p[0]), b = l ? byId(l.blocks, p[1]) : null; return b ? (b.sw = b.sw || {}) : null; }
    case 'ui': return App.sel; case 'rep': return App.rep;
  }
  return null;
}
const parseVal = (v) => (v === 'true' ? true : v === 'false' ? false : v === 'null' ? null : v !== '' && !isNaN(v) ? +v : v);
function setPath(path, value) { const p = path.split(':'), o = resolve(p[0], p[1]); if (o) o[p[2]] = value; return !!o; }
function getPath(path) { const p = path.split(':'), o = resolve(p[0], p[1]); return o ? o[p[2]] : undefined; }

/* ---------- HTML helpers (all return strings) ---------- */
const attrs = (a) => (a ? ' ' + a : '');
const seg = (path, options, cur) => '<span class="seg" role="group">' + options.map((o) => '<button data-act="set" data-arg="' + path + '=' + o[0] + '" aria-pressed="' + (String(cur) === String(o[0])) + '"' + (o[2] ? ' title="' + esc(o[2]) + '"' : '') + '>' + esc(o[1]) + '</button>').join('') + '</span>';
const chips = (path, options, cur) => '<span class="chips">' + options.map((o) => '<button class="chip" data-act="toggle" data-arg="' + path + '=' + o[0] + '" aria-pressed="' + (cur || []).includes(o[0]) + '"' + (o[2] ? ' title="' + esc(o[2]) + '"' : '') + '>' + esc(o[1]) + '</button>').join('') + '</span>';
const field = (path, value, a) => '<input class="field" data-bind="' + path + '" value="' + esc(value) + '"' + attrs(a) + '>';
const area = (path, value, a) => '<textarea class="area" data-bind="' + path + '"' + attrs(a) + '>' + esc(value) + '</textarea>';
const stepper = (path, value, min, max, step) => '<span class="step"><button data-act="nudge" data-arg="' + path + '=' + (-(step || 1)) + '=' + min + '=' + max + '" aria-label="Less">−</button><input type="number" data-bind="' + path + '" data-num min="' + min + '" max="' + max + '" value="' + value + '" aria-label="Amount"><button data-act="nudge" data-arg="' + path + '=' + (step || 1) + '=' + min + '=' + max + '" aria-label="More">+</button></span>';
const pick = (path, options, cur, a) => '<select class="pick" data-bind="' + path + '"' + attrs(a) + '>' + options.map((o) => '<option value="' + esc(o[0]) + '"' + (String(cur) === String(o[0]) ? ' selected' : '') + '>' + esc(o[1]) + '</option>').join('') + '</select>';
const short = (s, n) => (s.length > (n || 60) ? s.slice(0, (n || 60) - 1).trimEnd() + '…' : s);
const goalPicker = (path, goals, sel) => (goals.length ? '<span class="chips">' + goals.map((g) => '<button class="chip" data-act="toggle" data-arg="' + path + '=' + g.id + '" aria-pressed="' + (sel || []).includes(g.id) + '" title="' + esc(g.text) + '">' + esc(short(g.text || 'Untitled goal', 46)) + '</button>').join('') + '</span>' : '<span class="hint">No goals here yet. Add them under Goals.</span>');
const tag = (text, tone) => '<span class="tag ' + (tone || '') + '">' + esc(text) + '</span>';
const empty = (text, button) => '<div class="empty"><p>' + text + '</p>' + (button || '') + '</div>';
const mentor = (lines) => (lines && lines.length ? '<div class="mentor"><b>From your mentor</b>' + lines.map((l) => '<p>' + l + '</p>').join('') + '</div>' : '');
const optName = (table, id) => { const o = table.find((x) => x[0] === id); return o ? o[1] : ''; };
function toast(text) { const el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); el.textContent = text; const box = $('toasts'); box.appendChild(el); while (box.children.length > 2) box.removeChild(box.firstChild); setTimeout(() => el.remove(), 3200); }
function openModal(html) {
  if (!App.modal) App.modalBack = document.activeElement && document.activeElement !== document.body ? { act: document.activeElement.dataset && document.activeElement.dataset.act, arg: document.activeElement.dataset && document.activeElement.dataset.arg, el: document.activeElement } : null;
  App.modal = true; $('modal').innerHTML = '<div class="scrim" data-act="closeModalBg"><div class="modal" role="dialog" aria-modal="true" tabindex="-1">' + html + '</div></div>';
  const box = $('modal').querySelector('.modal'), h = box.querySelector('h2'); if (h) { if (!h.id) h.id = 'modal-title'; box.setAttribute('aria-labelledby', h.id); }
  const first = box.querySelector('.foot .btn.pri') || box.querySelector('button, input, select, textarea, [tabindex="0"]'); (first || box).focus({ preventScroll: true });
}
function closeModal() {
  if (!App.modal) return; App.modal = null; $('modal').innerHTML = '';
  /* Give focus back to whatever opened the dialog, or to its replacement after a re-render. */
  const b = App.modalBack; App.modalBack = null; if (!b) return;
  setTimeout(() => { if (App.modal) return; const again = document.contains(b.el) ? b.el : b.act ? Array.from(document.querySelectorAll('[data-act="' + b.act + '"]')).find((x) => x.dataset.arg === b.arg) : null; (again && !again.disabled ? again : $('main')).focus({ preventScroll: true }); }, 0);
}

/* ---------- chapters ---------- */
function chapterState(c, id) {
  const s = chapterRaw(c, id);
  /* A tick means the teacher has been there and nothing on that page is marked to fix. A starter kit does not arrive ticked. */
  if (s === 'done' && id !== 'report' && (!c.game.seen[id] || App.findings.some((f) => f.sev >= 2 && f.where && f.where.view === id))) return 'some';
  return s;
}
function chapterRaw(c, id) {
  const some = (x) => (x ? 'some' : 'none');
  if (id === 'goals') return c.goals.length >= 3 && c.goals.some((g) => g.priority === 'lasting') && c.transfer.trim() ? 'done' : some(c.goals.length || c.transfer.trim());
  if (id === 'sequence') return c.units.length >= 2 && c.goals.length && c.goals.every((g) => g.unit) ? 'done' : some(c.units.length);
  if (id === 'evidence') return c.units.length && c.units.every((u) => unitAssess(c, u.id).some((a) => a.kind === 'major')) ? 'done' : some(c.assess.length);
  if (id === 'calendar') return c.units.length && budgetedDays(c) <= availableDays(c) && budgetedDays(c) >= availableDays(c) * 0.8 ? 'done' : some(c.units.length && c.game.seen.calendar);
  if (id === 'lessons') return c.units.some((u) => u.days > 0 && plannedDays(c, u.id) >= u.days) ? 'done' : some(c.lessons.length);
  if (id === 'homework') return c.lessons.filter((l) => l.hw).length >= 3 || c.game.seen.homework && c.lessons.length ? 'done' : some(c.lessons.some((l) => l.hw));
  if (id === 'syllabus') return c.syllabus.about.trim() && sum(Object.values(c.syllabus.weights)) === 100 && c.syllabus.contact.trim() ? 'done' : some(c.syllabus.about.trim());
  return c.game.seen.report ? 'done' : 'none';
}

/* ---------- rendering ---------- */
function computeFindings() { try { App.findings = App.c && typeof runChecks === 'function' ? runChecks(App.c) : []; } catch (e) { App.findings = []; console.error(e); } }
function renderTop() {
  const c = App.c;
  $('top').innerHTML = '<button class="word" data-act="go" data-arg="start" title="Home">Last Day <i>First</i></button>' +
    (c && c.warm ? '<span class="grow"></span><button class="btn sm" data-act="go" data-arg="start">Leave the warm-up</button>' : c ? '<input class="title" data-bind="course::title" value="' + esc(c.title) + '" aria-label="Course title"><button class="btn sm" data-act="glossary" title="What the words on these pages mean">Words</button><button class="btn sm" data-act="saveFile" title="Download this course as a file you can reopen or hand to a mentor">Save file</button><button class="btn sm" data-act="go" data-arg="report">Report</button>' : '<span class="grow"></span>');
  const cnt = {}; App.findings.forEach((f) => { if (f.sev >= 2 && f.where) cnt[f.where.view] = (cnt[f.where.view] || 0) + 1; });
  $('nav').hidden = !c || !!c.warm || App.view === 'start';
  $('nav').innerHTML = c ? CHAPTERS.map((ch, k) => '<button data-act="go" data-arg="' + ch[0] + '" class="' + chapterState(c, ch[0]) + '"' + (App.view === ch[0] ? ' aria-current="page"' : '') + ' title="' + ch[2] + (chapterState(c, ch[0]) === 'done' ? ' (done)' : '') + '"><span class="n">' + (chapterState(c, ch[0]) === 'done' ? '✓' : k + 1) + '</span>' + ch[1] + (cnt[ch[0]] && App.view !== ch[0] ? '<span class="cnt" aria-label="' + cnt[ch[0]] + ' to fix">' + cnt[ch[0]] + '</span>' : '') + '</button>').join('') : '';
}
function sideHTML() {
  const v = App.view, lines = MENTOR[v] ? MENTOR[v](App.c) : [], fs = App.findings.filter((f) => f.where && f.where.view === v).slice(0, 8);
  return mentor(lines) + '<div class="stack"><div class="sec-h">Checks on this page <small>' + (fs.length ? fs.length + ' to look at' : 'all clear') + '</small></div>' +
    (fs.length ? fs.map((f) => '<button class="finding s' + f.sev + '" data-act="jump" data-arg="' + esc(JSON.stringify(f.where)) + '" title="' + esc(f.source || '') + '"><b>' + esc(f.text) + '</b><span>' + esc(f.why || '') + '</span></button>').join('') : '<p class="hint">Nothing flagged here. Checks run on every change.</p>') + '</div>';
}
function render() {
  const c = App.c; if (!c && App.view !== 'start') App.view = 'start';
  const V = VIEWS[App.view] || VIEWS.start, main = $('main'), keep = main.scrollTop;
  computeFindings(); renderTop();
  const wide = !c || V.wide; $('body').className = 'body' + (wide ? ' wide' : ''); $('side').hidden = wide;
  main.innerHTML = V.render(c) + (wide ? '' : '<div class="side-inline" data-live="sideinline">' + sideHTML() + '</div>'); main.scrollTop = App.scrollReset ? 0 : keep; App.scrollReset = false;
  if (!wide) $('side').innerHTML = sideHTML();
  document.title = (c && VIEWS[App.view] && App.view !== 'start' ? V.name + ' \u2013 ' : '') + 'Last Day First';
  if (V.after) V.after(main);
}
/* While someone is typing, only the parts marked data-live are refreshed, so the caret never jumps. */
function refreshLive() {
  const V = VIEWS[App.view]; if (!V || !App.c) return;
  computeFindings();
  const tmp = document.createElement('div'); tmp.innerHTML = V.render(App.c) + (V.wide ? '' : '<div class="side-inline" data-live="sideinline">' + sideHTML() + '</div>');
  $('main').querySelectorAll('[data-live]').forEach((el) => { const n = tmp.querySelector('[data-live="' + el.dataset.live + '"]'); if (n && n.innerHTML !== el.innerHTML) el.innerHTML = n.innerHTML; });
  if (!$('side').hidden) $('side').innerHTML = sideHTML();
  if (V.live) V.live();
}
function go(view, fromHistory) {
  if (App.c && App.c.warm && view !== 'lessons') { App.c = loadSaved(); App.sel = {}; view = 'start'; }
  if (!VIEWS[view]) view = 'start';
  /* The browser's Back button moves between chapters instead of leaving the page. */
  if (!fromHistory && view !== App.view) { try { history.pushState({ view }, '', '#' + view); } catch (e) { /* not available here */ } }
  App.view = view; App.scrollReset = true; if (App.c && App.c.game) App.c.game.seen[view] = 1; App.play.on = false; render(); }

/* ---------- built-in actions ---------- */
ACT.go = (a) => { go(a); return false; };
ACT.set = (a) => { const i = a.indexOf('='); setPath(a.slice(0, i), parseVal(a.slice(i + 1))); };
ACT.toggle = (a) => { const i = a.indexOf('='), path = a.slice(0, i), v = parseVal(a.slice(i + 1)); let arr = getPath(path); if (!Array.isArray(arr)) arr = []; const k = arr.indexOf(v); if (k >= 0) arr.splice(k, 1); else arr.push(v); setPath(path, arr); };
ACT.nudge = (a) => { const p = a.split('='), cur = +getPath(p[0]) || 0; setPath(p[0], clamp(cur + +p[1], +p[2], +p[3])); };
ACT.sel = (a) => { const p = a.split('='); App.sel[p[0]] = parseVal(p[1]); };
ACT.jump = (a) => { const w = JSON.parse(a); for (const k of ['unit', 'lesson', 'assess', 'goal']) if (w[k]) App.sel[k] = w[k]; go(w.view); return false; };
ACT.closeModal = () => { closeModal(); return false; };
ACT.closeModalBg = (a, c, el, ev) => { if (ev.target === el) closeModal(); return false; };
ACT.saveFile = (a, c) => { download(((c.title || '').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-').toLowerCase() || 'course') + '.course.json', JSON.stringify(c, null, 1), 'application/json'); toast('Saved. Open the file here any time to pick up where you left off.'); return false; };
ACT.openFile = () => { $('file').click(); return false; };
/* Every term the pages use, in plain words. */
const GLOSSARY = [
  ['Backward design', 'Planning a course from its end: first what students should understand for good, then what would show they do, and only then the lessons. The approach was set out by Grant Wiggins and Jay McTighe.'],
  ['Lasting, important, worth meeting', 'Three sizes of goal. Lasting ideas are the few a student should keep for life. Important ones are needed to reach them. Worth meeting is good to have seen, and the first to cut.'],
  ['Understanding, knowledge, skill', 'An understanding is a big idea stated as a claim. Knowledge is facts, terms and concepts. A skill is something a student can do.'],
  ['Evidence', 'What you would need to see to believe a student reached a goal: a task, a test, a conversation, a piece of work.'],
  ['Selected response', 'Questions where students choose an answer: multiple choice, matching, true or false, fill in the blank.'],
  ['Written response', 'Students write the answer themselves, from a sentence to an essay.'],
  ['Performance', 'Students make or do something that is judged against stated criteria: a lab report, a speech, a model, a recital.'],
  ['Personal communication', 'You find out by talking with or watching a student: a conference, an oral exam, questions in class with notes kept.'],
  ['Take in, make meaning, transfer', 'What a block of class time is for. Take in: something new is introduced. Make meaning: students work out why, compare, explain or connect. Transfer: students use it on their own in a situation they have not seen.'],
  ['Thinking level', 'How much thinking a task asks for, in four steps: recall a fact; apply a skill or concept; strategic thinking (reason, plan and justify, with more than one sound answer); extended thinking (investigate and create over time). The steps follow Norman Webb\u2019s Depth of Knowledge.'],
  ['Taking it in, working with it, creating, building with others', 'Four ways a student can be engaged: receiving (listening, watching); doing something with the material (notes, practice); producing something new (explaining, writing, solving an unfamiliar problem); and producing it with other people.'],
  ['Who does the thinking', 'Whether the teacher is doing the reasoning aloud, the class is sharing it, students are doing it together, or each student is doing it alone.'],
  ['Retrieval', 'Pulling something learned earlier back out of memory without looking it up. A few questions at the start of class on last week\u2019s material is retrieval.'],
  ['Setup, moving, waiting', 'Minutes that are not learning: settling in at the bell, getting into groups, handing out materials, packing up. The tool adds an estimate of these to every lesson; you can change how generous it is under Calendar.'],
  ['Learning Facts', 'The label on every lesson, unit and course. It reports what students would be doing if the plan ran as written. It measures the plan, not the room.'],
  ['The web of ideas', 'A picture of your goals as dots joined by lines where one builds on another. A simulated class runs through your plan and the picture shows which ideas are likely to hold and connect. It is an illustration, not a forecast.'],
  ['Stress test', 'Runs the year again with the days a real school year loses to weather, assemblies and testing, to show what would be squeezed.'],
];
ACT.glossary = () => { openModal('<h2>Words used here</h2><dl class="gloss">' + GLOSSARY.map((g) => '<dt>' + g[0] + '</dt><dd>' + g[1] + '</dd>').join('') + '</dl><div class="foot"><button class="btn pri" data-act="closeModal">Close</button></div>'); return false; };

/* Leaving a field re-renders the page. If that happened between pressing and releasing the mouse on a button, the button would be
   replaced mid-click and the click lost, so the re-render waits until the press is over. */
document.addEventListener('pointerdown', () => { App.pressing = true; }, true);
document.addEventListener('pointerup', () => { setTimeout(() => { App.pressing = false; if (App.renderDue) { App.renderDue = false; render(); } }, 0); }, true);
document.addEventListener('pointercancel', () => { App.pressing = false; }, true);
document.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-act]'); if (!el || el.disabled) return;
  const f = ACT[el.dataset.act]; if (!f) return;
  const act = el.dataset.act, arg = el.dataset.arg;
  if (f(arg, App.c, el, ev) === false) return;
  App.renderDue = false; save(); render();
  if (!App.modal && (!document.activeElement || document.activeElement === document.body)) { const all = Array.from(document.querySelectorAll('#main [data-act="' + act + '"], #top [data-act="' + act + '"], #nav [data-act="' + act + '"]')).filter((x) => !x.disabled), again = all.find((x) => x.dataset.arg === arg) || all[0]; (again || $('main')).focus({ preventScroll: true }); }
});
document.addEventListener('input', (ev) => {
  const el = ev.target; if (!el.dataset || !el.dataset.bind || !App.c) return;
  let v = el.value; if (el.dataset.num != null || el.type === 'range') { v = el.value === '' ? 0 : +el.value; if (!isFinite(v)) v = 0; if (!(+el.step > 0 && +el.step < 1)) v = Math.round(v); if (el.min !== '' && v < +el.min) v = +el.min; if (el.max !== '' && v > +el.max) v = +el.max; }
  if (el.type === 'checkbox') v = el.checked;
  setPath(el.dataset.bind, v); save();
  if (el.tagName !== 'SELECT' && el.type !== 'checkbox') refreshLive();
});
document.addEventListener('change', (ev) => { const el = ev.target; if (el.id === 'file') return openCourseFile(el); if (el.dataset && el.dataset.bind && App.c) { if (el.classList.contains('title')) return renderTop(); if (App.pressing) App.renderDue = true; else render(); } });
window.addEventListener('popstate', (ev) => { if (App.modal) closeModal(); go((ev.state && ev.state.view) || (location.hash || '').slice(1) || 'start', true); });
document.addEventListener('keydown', (ev) => {
  if (!App.modal) return;
  if (ev.key === 'Escape') { closeModal(); return; }
  if (ev.key !== 'Tab') return;
  /* Keep Tab inside the open dialog. */
  const box = $('modal').querySelector('.modal'), f = Array.from(box.querySelectorAll('button:not(:disabled), input, select, textarea, summary, [tabindex="0"]')); if (!f.length) { ev.preventDefault(); box.focus(); return; }
  const a = document.activeElement, first = f[0], last = f[f.length - 1];
  if (!box.contains(a) || a === box) { ev.preventDefault(); (ev.shiftKey ? last : first).focus(); } else if (ev.shiftKey && a === first) { ev.preventDefault(); last.focus(); } else if (!ev.shiftKey && a === last) { ev.preventDefault(); first.focus(); }
});
const REDUCED_MOTION = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
/* Puts a new course in place of the current one. If a different course is saved in this browser, asks first: there is room for one. */
function replaceCourse(c, then) {
  const old = App.c && !App.c.demo && !App.c.warm ? App.c : loadSaved();
  const doIt = () => { App.c = c; App.sel = {}; computeFindings(); if (c.game.kit && !c.game.base && typeof bannerBase === 'function') bannerBase(c); saveNow(); closeModal(); then(); };
  if (!old || (!old.units.length && !old.goals.length)) return doIt();
  App.replace = { doIt, old };
  openModal('<h2>Replace the course saved here?</h2><p>This browser keeps one course at a time. It is holding <b>\u201c' + esc(short(old.title, 60)) + '\u201d</b>, with ' + plural(old.units.length, 'unit') + ' and ' + plural(old.lessons.length, 'lesson') + '. Starting or opening another replaces it.</p><p>Save it as a file first if you want to keep it. You can open the file again any time.</p><div class="foot"><button class="btn" data-act="closeModal">Cancel</button><button class="btn" data-act="replaceSave">Save it as a file, then continue</button><button class="btn pri" data-act="replaceGo">Replace it</button></div>');
}
ACT.replaceGo = () => { const r = App.replace; App.replace = null; if (r) r.doIt(); return false; };
ACT.replaceSave = () => { const r = App.replace; if (!r) return false; ACT.saveFile('', r.old); App.replace = null; r.doIt(); return false; };
function openCourseFile(input) {
  const f = input.files && input.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    let c = null; try { c = JSON.parse(r.result); if (!c || !Array.isArray(c.units) || !Array.isArray(c.goals)) throw new Error('not a course'); c = migrate(c); } catch (e) { c = null; toast('That file is not a course saved from here.'); }
    input.value = ''; if (c) replaceCourse(c, () => { go(c.units.length ? 'report' : 'goals'); toast('Opened ' + (c.title || 'the course') + '.'); });
  };
  r.readAsText(f);
}
