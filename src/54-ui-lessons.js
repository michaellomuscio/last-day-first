/* Lessons: build a class period out of timed blocks while an observer watches. Left: the unit's days. Middle: the strip and the
   selected block. Right: the classroom, playing the period, and the Learning Facts label that updates on every change. */
const DEFAULT_MIN = { entry: 3, announce: 2, break: 2, cleanup: 2, directions: 3, turn: 2, tps: 6, exit: 4, retrieval: 5, quickwrite: 5, reflect: 5, mini: 10, video: 6, demo: 8, worked: 8, qa: 6, quiz: 12, lecture: 20,
  guided: 10, indep: 12, partner: 10, drill: 6, game: 15, sread: 10, closeread: 12, write: 20, lab: 30, task: 20, studio: 25, projwork: 30, research: 20, peer: 10, gallery: 10, present: 20, perform: 15, test: 40, ptask: 40,
  confer: 15, goover: 8, seminar: 25, debate: 25, simulate: 20, stations: 24, skillp: 15, readaloud: 8 };
const famColor = (mix) => FAMILY_BY[dominantFam(mix)].color;

function curUnit(c) { let u = unitOf(c, App.sel.unit); if (!u) { u = c.units[0] || null; App.sel.unit = u ? u.id : null; } return u; }
function curLesson(c) { const u = curUnit(c); if (!u) return null; const ls = unitLessons(c, u.id); let l = ls.find((x) => x.id === App.sel.lesson); if (!l) { l = ls[0] || null; App.sel.lesson = l ? l.id : null; App.sel.block = null; } return l; }

function stripHTML(c, l, L) {
  const span = Math.max(L.period, L.total, 1), w = (m) => (100 * m / span).toFixed(3) + '%';
  let h = '<div class="strip" id="strip">';
  for (const s of L.segs) {
    if (s.over) h += '<span class="blk over" style="width:' + w(s.t1 - s.t0) + '" title="' + esc(s.what) + ': about ' + (s.t1 - s.t0) + ' min you did not plan for"></span>';
    else { const b = l.blocks[s.i], F = FAMILY_BY[dominantFam(s.mix)]; h += '<button class="blk' + (App.sel.block === b.id ? ' sel' : '') + '" data-act="selBlock" data-arg="' + b.id + '" aria-pressed="' + (App.sel.block === b.id) + '" aria-label="' + esc(s.e.move.name + ', ' + b.min + ' minutes, mostly ' + F.name.toLowerCase()) + '" style="width:' + w(b.min) + ';background:' + F.color + ';color:' + F.text + '" title="' + esc(s.e.move.name + ', ' + b.min + ' min') + '"><b>' + esc(s.e.move.name) + '</b><i>' + b.min + '</i></button>'; }
  }
  if (L.total < L.period) h += '<span class="blk spare" style="width:' + w(L.period - L.total) + '" title="Unplanned time"></span>';
  h += '<span class="bell" style="left:' + w(L.period) + '" title="The bell"><i>bell</i></span><span class="head" id="playhead"></span></div><div class="ruler">';
  const stepMin = span > 70 ? 10 : 5; for (let m = 0; m <= span; m += stepMin) h += '<span style="left:' + w(m) + '">' + m + '</span>';
  /* The same blocks as a plain list: easier to tap on a phone and to read aloud. Shown only on narrow screens. */
  h += '</div><ol class="blocklist">' + L.segs.filter((s) => !s.over).map((s) => { const b = l.blocks[s.i]; return '<li><button class="' + (App.sel.block === b.id ? 'sel' : '') + '" data-act="selBlock" data-arg="' + b.id + '"><i class="dot" style="background:' + famColor(s.mix) + '"></i><span>' + esc(s.e.move.name) + '</span><b>' + b.min + ' min</b></button></li>'; }).join('') + '</ol>';
  return h;
}
function miniStrip(c, l) { const L = lessonLabel(c, l), span = Math.max(L.period, L.total, 1); return '<span class="mini">' + L.segs.map((s) => '<i style="width:' + (100 * (s.t1 - s.t0) / span).toFixed(2) + '%;background:' + (s.over ? 'var(--sunk)' : famColor(s.mix)) + '"></i>').join('') + '</span>'; }

function blockInspector(c, l, b) {
  const e = blockEff(b), m = e.move, p = l.id + '/' + b.id, u = unitOf(c, l.unit), goals = unitGoals(c, u.id), others = c.goals.filter((g) => g.unit !== u.id && b.goals.includes(g.id)), as = unitAssess(c, u.id);
  const i = l.blocks.indexOf(b);
  return '<div class="panel insp"><h2><span><i class="dot" style="background:' + famColor(e.mix) + '"></i> ' + esc(m.name) + '</span><span class="row"><button class="btn sm ghost" data-act="moveBlock" data-arg="-1" ' + (i === 0 ? 'disabled' : '') + ' title="Move earlier">←</button><button class="btn sm ghost" data-act="moveBlock" data-arg="1" ' + (i === l.blocks.length - 1 ? 'disabled' : '') + ' title="Move later">→</button><button class="btn sm ghost" data-act="dupBlock" title="Duplicate">Copy</button><button class="btn sm ghost danger" data-act="delBlock">Remove</button></span></h2>' +
    '<p class="hint">' + esc(m.does) + '</p>' +
    '<div class="row wrap"><span class="lbl">Minutes</span>' + stepper('block:' + p + ':min', b.min, 1, 240, 1) + '<span class="row">' + [-5, 5].map((d) => '<button class="btn sm" data-act="nudge" data-arg="block:' + p + ':min=' + d + '=1=240">' + (d > 0 ? '+' : '−') + '5</button>').join('') + '</span></div>' +
    (m.sw || []).map((s) => '<div class="stack"><span class="lbl">' + esc(s.label) + '</span>' + seg('sw:' + p + ':' + s.id, s.opts.map((o) => [o.id, o.label]), (b.sw && b.sw[s.id]) || s.opts[0].id) + '</div>').join('') +
    (m.pu === 'N' && !b.pu ? '' : '<div class="stack"><span class="lbl">Which goals is this for?</span>' + goalPicker('block:' + p + ':goals', goals.concat(others), b.goals) + '</div>') +
    '<details' + (b.pu || b.lv || b.note || b.assess ? ' open' : '') + '><summary>Fine-tune how this block is described</summary><div class="stack" style="padding-top:10px">' +
    '<div class="stack"><span class="lbl">Purpose <span class="hint" style="text-transform:none;letter-spacing:0">usually ' + optName(PURPOSES, m.pu).toLowerCase() + '</span></span>' + seg('block:' + p + ':pu', [['null', 'As usual']].concat(PURPOSES.filter((x) => x[0] !== 'N').map((x) => [x[0], x[1], x[2]])), b.pu || 'null') + '</div>' +
    '<div class="stack"><span class="lbl">Thinking level <span class="hint" style="text-transform:none;letter-spacing:0">usually ' + LEVEL_NAME[e.move.lv].toLowerCase() + '</span></span>' + seg('block:' + p + ':lv', [['null', 'As usual']].concat(LEVELS.map((x) => [x[0], x[1], x[2]])), b.lv || 'null') + '</div>' +
    (m.grp === 'show' && as.length ? '<div class="stack"><span class="lbl">This is the class time for</span>' + pick('block:' + p + ':assess', [['', 'No particular assessment']].concat(as.map((a) => [a.id, a.title])), b.assess || '') + '</div>' : '') +
    '<div class="stack"><span class="lbl">Your notes</span>' + area('block:' + p + ':note', b.note || '', 'placeholder="What you will say, show or hand out"') + '</div></div></details></div>';
}
function homeworkHTML(c, l) {
  const h = l.hw, u = unitOf(c, l.unit), p = 'hw:' + l.id + ':';
  if (!h) return '<div class="panel"><h2>Tonight’s homework <small>None set</small></h2><div class="row"><button class="btn sm" data-act="hwOn">Set homework for this lesson</button><span class="hint">No homework is a choice too.</span></div></div>';
  return '<div class="panel"><h2>Tonight’s homework <button class="btn sm ghost danger" data-act="hwOff">Remove</button></h2>' +
    '<div class="row wrap"><span class="lbl">It is for</span>' + seg(p + 'purpose', HW_PURPOSES, h.purpose) + '</div>' +
    '<div class="row wrap"><span class="lbl">Minutes</span>' + stepper(p + 'min', h.min, 0, 180, 5) + '<span class="lbl">Kind</span><span style="width:190px">' + pick(p + 'kind', HW_KINDS, h.kind, 'aria-label="Kind of homework"') + '</span></div>' +
    '<div class="stack"><span class="lbl">Which goals?</span>' + goalPicker(p + 'goals', unitGoals(c, u.id).concat(c.goals.filter((g) => g.unit !== u.id && h.goals.includes(g.id))), h.goals) + '</div>' +
    '<div class="row wrap"><span class="lbl">Feedback</span>' + seg(p + 'fb', HW_FEEDBACK, h.fb) + '</div><div class="row wrap"><span class="lbl">Grade</span>' + seg(p + 'graded', HW_GRADING, h.graded) + '<span class="lbl">Needs a device</span>' + seg(p + 'device', [[false, 'No'], [true, 'Yes']], h.device) + '</div></div>';
}
function paletteHTML() {
  return '<div class="panel pal"><h2>Add a block <small>It goes after the selected block</small></h2>' + MOVE_GROUPS.map((g) => '<div class="palrow"><span class="lbl">' + g[1] + '</span><span class="chips">' + MOVES.filter((m) => m.grp === g[0]).map((m) => '<button class="chip" data-act="addMove" data-arg="' + m.id + '" title="' + esc(m.does) + '"><i class="dot" style="background:' + famColor(m.mix) + '"></i> ' + esc(m.name) + '</button>').join('') + '</span></div>').join('') + '</div>';
}

VIEWS.lessons = {
  name: 'Lessons', wide: true,
  render(c) {
    const u = curUnit(c);
    if (!u) return '<div class="ws"><div class="ws-head"><div class="eyebrow">Chapter 5</div><h1>Lessons</h1></div>' + empty('A lesson belongs to a unit. Lay out your units first.', '<button class="btn pri" data-act="go" data-arg="sequence">Go to Sequence</button>') + '</div>';
    const ls = unitLessons(c, u.id), l = curLesson(c), used = plannedDays(c, u.id);
    const list = '<div class="lessons-list"><h1 class="sr">Lessons in ' + esc(u.title) + '</h1><div class="stack"><span class="lbl">Unit</span>' + pick('ui::unit', c.units.map((x, k) => [x.id, (k + 1) + '. ' + x.title]), u.id, 'aria-label="Unit"') + '<span class="hint" data-live="days"><b class="num">' + used + '</b> of ' + u.days + ' days planned' + (used > u.days ? ' <span class="tag bad">over</span>' : '') + '</span></div>' +
      '<div class="stack" data-live="list">' + ls.map((x, k) => { const L = lessonLabel(c, x); return '<button class="card lcard' + (l && x.id === l.id ? ' sel' : '') + '" data-act="selLesson" data-arg="' + x.id + '"><span class="row between"><b>' + (k + 1) + '. ' + esc(short(x.title, 30)) + '</b>' + (x.days > 1 ? tag(x.days + ' days') : '') + '</span>' + miniStrip(c, x) + '<span class="row between hint"><span>' + Math.round(L.total) + ' min' + (L.over > 0.5 ? ' <span class="tag bad">' + Math.round(L.over) + ' over</span>' : '') + '</span><span>' + (x.hw ? 'HW ' + x.hw.min + ' min' : '') + '</span></span></button>'; }).join('') + '</div>' +
      '<button class="btn' + (ls.length ? ' sm' : ' pri') + '" data-act="lessonChooser">+ Add a lesson</button></div>';
    if (!l) return '<div class="ws lessons"><div class="lgrid">' + list + '<div class="stack">' + '<div class="ws-head"><div class="eyebrow">Chapter 5 · ' + esc(u.title) + '</div><h1>Plan the days</h1><p>You know where this unit ends and how you will know students got there. Now build the class periods that get them there. Start with a ready-made shape and change it, or start blank.</p></div>' + mentor(MENTOR.lessons(c)) + '</div></div></div>';
    const L = lessonLabel(c, l), b = byId(l.blocks, App.sel.block), k = ls.indexOf(l);
    const editor = '<div class="stack editor"><div class="row"><input class="field big grow" data-bind="lesson:' + l.id + ':title" value="' + esc(l.title) + '" aria-label="Lesson title"><span class="lbl">Days</span>' + stepper('lesson:' + l.id + ':days', l.days, 1, 20, 1) + '</div>' +
      '<div class="row wrap"><button class="btn sm ghost" data-act="moveLesson" data-arg="-1" ' + (k === 0 ? 'disabled' : '') + '>↑ Earlier</button><button class="btn sm ghost" data-act="moveLesson" data-arg="1" ' + (k === ls.length - 1 ? 'disabled' : '') + '>↓ Later</button><button class="btn sm ghost" data-act="dupLesson">Copy this lesson</button><button class="btn sm ghost danger" data-act="delLesson">Delete</button><span class="grow"></span><span class="hint" data-live="fit">' + (L.over > 0.5 ? '<span class="tag bad">Runs ' + Math.round(L.over) + ' min past the bell</span>' : L.total ? '<span class="tag good">Fits, ' + Math.round(-L.over) + ' min spare</span>' : '') + '</span></div>' +
      '<div data-live="strip">' + stripHTML(c, l, L) + '</div>' + (l.blocks.length ? '' : '<p class="hint">Pick blocks below to fill the period. Hatched grey is time for settling, moving and packing up that the plan did not include.</p>') +
      (b ? blockInspector(c, l, b) : l.blocks.length ? '<p class="hint">Click a block on the strip to change it.</p>' : '') + paletteHTML() + homeworkHTML(c, l) +
      '<div class="panel"><h2>Materials and notes <small>Printed on the lesson plan</small></h2>' + area('lesson:' + l.id + ':note', l.note || '', 'placeholder="What to have ready, the text or problem set, where the handouts are"') + '</div></div>';
    const fams = FAMILIES.filter((f) => (L.fam[f.id] || 0) > 0.05);
    const obs = '<div class="stack observer"><div class="room"><canvas id="room" width="680" height="440" role="img" aria-label="The classroom during this lesson" aria-describedby="roomcap"></canvas><div class="roomcap" id="roomcap"></div></div>' +
      '<div class="row"><button class="btn sm pri" data-act="play" id="playbtn">▶ Play the period</button><input type="range" id="scrub" min="0" max="' + Math.max(1, Math.round(L.total * 10)) + '" value="' + Math.round(App.play.t * 10) + '" aria-label="Minute of the period"></div>' +
      '<div class="legend" data-live="legend">' + fams.map((f) => '<span><i class="dot" style="background:' + f.color + '"></i>' + f.short + '</span>').join('') + '</div>' +
      '<div data-live="lmentor">' + mentor(MENTOR.lessons(c)) + '</div>' +
      '<div data-live="label">' + labelHTML(L, { title: l.title, c, scope: 'lesson' }) + '</div><button class="btn sm ghost" data-act="glossary">What do these words mean?</button></div>';
    return '<div class="ws lessons">' + (c.warm && typeof warmPanel === 'function' ? warmPanel(c, l, L) : '') + '<div class="lgrid">' + list + editor + obs + '</div></div>';
  },
  after() { roomSync(); const s = $('scrub'); if (s) s.oninput = () => { App.play.t = +s.value / 10; App.play.on = false; roomSync(); }; },
  live() { roomSync(); },
};
MENTOR.lessons = (c) => {
  const l = curLesson(c), out = [];
  if (!l) return ['Start from a shape you recognise, then make it yours. No one writes a good lesson on a blank page.'];
  const L = lessonLabel(c, l), S = shares(L);
  if (!l.blocks.length) return ['Ask first: what will students be doing at minute ten? Then at minute thirty?'];
  if (L.over > 0.5) out.push('This runs past the bell. Something has to go. Decide now, at your desk, not at minute 48.');
  if (L.orphan > 3) out.push('Some of this time is tied to no goal. If you cannot say what it is for, students cannot either.');
  if (L.stretch.min >= 25 && L.stretch.fam === 'take') out.push(Math.round(L.stretch.min) + ' minutes of listening in one stretch. It can work. Would a question to a partner in the middle cost you anything?');
  if (L.show < 2 && L.learn > 20) out.push('Nobody shows you what they know today. How will you find out who is lost before tomorrow?');
  if (!out.length && S.active >= c.intent.active / 100) out.push('This matches what you said you wanted. Press play and watch it once before you move on.');
  if (!out.length) out.push('Press play and watch the room. Then change one block and watch the label move.');
  return out.slice(0, 2);
};

ACT.selLesson = (a) => { App.sel.lesson = a; App.sel.block = null; App.play.t = 0; App.play.on = false; };
ACT.selBlock = (a, c) => { App.sel.block = App.sel.block === a ? null : a; const l = curLesson(c), L = lessonLabel(c, l), s = L.segs.find((x) => x.block === a); if (s) { App.play.t = s.t0 + 0.01; App.play.on = false; } };
ACT.lessonChooser = () => { openModal('<h2>Add a lesson</h2><p class="hint">Start from a shape you recognise and change it, or start with an empty period. Every block can be changed afterwards.</p><div class="shapes"><button class="card" data-act="addLesson" data-arg=""><b>Blank lesson</b><span class="hint">An empty period.</span></button>' + PATTERNS.map((p) => '<button class="card" data-act="addLesson" data-arg="' + p.id + '"><b>' + p.name + '</b><span class="hint">' + p.does + '</span></button>').join('') + '</div><div class="foot"><button class="btn" data-act="closeModal">Cancel</button></div>'); return false; };
ACT.addLesson = (a, c) => {
  const u = curUnit(c), n = unitLessons(c, u.id).length, l = addLesson(c, u.id, { title: 'Lesson ' + (n + 1) }); if (a) applyPattern(c, l, a);
  /* Blocks from a shape start out tied to the unit's first goal, so nothing is orphaned before the teacher has looked. */
  const g = unitGoals(c, u.id)[0]; if (g) l.blocks.forEach((b) => { if (MOVE_BY[b.move].pu !== 'N') b.goals = [g.id]; });
  App.sel.lesson = l.id; App.sel.block = null; App.play.t = 0; closeModal();
};
ACT.dupLesson = (a, c) => { const l = curLesson(c), n = clone(l); n.id = newId(c, 'L'); n.title = l.title + ' (copy)'; n.blocks.forEach((b) => (b.id = newId(c, 'B'))); c.lessons.splice(c.lessons.indexOf(l) + 1, 0, n); App.sel.lesson = n.id; App.sel.block = null; };
ACT.delLesson = (a, c) => { const l = curLesson(c); c.lessons = c.lessons.filter((x) => x !== l); App.sel.lesson = null; App.sel.block = null; };
ACT.moveLesson = (a, c) => { const l = curLesson(c), ls = unitLessons(c, l.unit), k = ls.indexOf(l), o = ls[k + +a]; if (!o) return; const i = c.lessons.indexOf(l), j = c.lessons.indexOf(o); c.lessons[i] = o; c.lessons[j] = l; };
ACT.addMove = (a, c) => {
  const l = curLesson(c); if (!l) return;
  const at = App.sel.block ? l.blocks.findIndex((b) => b.id === App.sel.block) + 1 : l.blocks.length, L = lessonLabel(c, l);
  let m = DEFAULT_MIN[a] || 10; if (a === 'test' || a === 'ptask') m = Math.max(10, c.school.period - 8);
  const b = addBlock(c, l, a, m, at);
  if (MOVE_BY[a].pu !== 'N') { const prev = l.blocks[at - 1]; b.goals = prev && prev.goals.length ? prev.goals.slice() : unitGoals(c, l.unit).slice(0, 1).map((g) => g.id); }
  App.sel.block = b.id;
};
ACT.delBlock = (a, c) => { const l = curLesson(c); l.blocks = l.blocks.filter((b) => b.id !== App.sel.block); App.sel.block = null; };
ACT.dupBlock = (a, c) => { const l = curLesson(c), i = l.blocks.findIndex((b) => b.id === App.sel.block), n = clone(l.blocks[i]); n.id = newId(c, 'B'); l.blocks.splice(i + 1, 0, n); App.sel.block = n.id; };
ACT.moveBlock = (a, c) => { const l = curLesson(c), i = l.blocks.findIndex((b) => b.id === App.sel.block), j = i + +a; if (j < 0 || j >= l.blocks.length) return; const t = l.blocks[i]; l.blocks[i] = l.blocks[j]; l.blocks[j] = t; };
ACT.hwOn = (a, c) => { const l = curLesson(c); l.hw = newHomework(); l.hw.goals = unitGoals(c, l.unit).slice(0, 1).map((g) => g.id); };
ACT.hwOff = (a, c) => { curLesson(c).hw = null; };
ACT.play = (a, c) => { const l = curLesson(c), L = lessonLabel(c, l); if (App.play.t >= L.total - 0.05) App.play.t = 0; App.play.on = !App.play.on; roomSync(); return false; };

/* ---------- the classroom ---------- */
const Room = { pos: [], n: 0, last: 0, L: null, lesson: null };
/* Where everyone sits for a given arrangement, as points in a unit square (y grows away from the board). */
function roomSeats(arr, n) {
  const out = [], cl = (cx, cy, k, r) => { for (let j = 0; j < k; j++) { const a = j / k * 6.283 + 0.5; out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.9]); } };
  if (arr === 'circle') { for (let i = 0; i < n; i++) { const a = i / n * 6.283 - 1.57; out.push([0.5 + Math.cos(a) * 0.4, 0.6 + Math.sin(a) * 0.3]); } }
  else if (arr === 'pairs') { const p = Math.ceil(n / 2), cols = p > 9 ? 4 : 3, rows = Math.ceil(p / cols); for (let i = 0; i < n; i++) { const k = i >> 1, cx = (k % cols + 0.5) / cols, cy = 0.3 + (Math.floor(k / cols) + 0.5) / rows * 0.64; out.push([cx + (i & 1 ? 0.045 : -0.045), cy]); } }
  else if (arr === 'groups' || arr === 'lab' || arr === 'stations') { const size = arr === 'lab' ? 6 : arr === 'stations' ? 4 : 3, g = Math.ceil(n / size), cols = g > 4 ? 3 : 2, rows = Math.ceil(g / cols); let left = n; for (let k = 0; k < g; k++) { const m = Math.min(size, left); left -= m; cl((k % cols + 0.5) / cols, 0.3 + (Math.floor(k / cols) + 0.5) / rows * 0.64, m, arr === 'lab' ? 0.085 : 0.06); } }
  else if (arr === 'front') { const half = Math.ceil(n / 2); for (let i = 0; i < n; i++) { const row = i < half ? 0 : 1, k = row ? i - half : i, m = row ? n - half : half, a = (k + 0.5) / m * 2.2 - 1.1; out.push([0.5 + Math.sin(a) * (0.3 + row * 0.12), 0.34 + row * 0.2 + Math.cos(a) * 0.16]); } }
  else if (arr === 'free') { for (let i = 0; i < n; i++) out.push([0.1 + hash(i, 7, 3) * 0.8, 0.3 + hash(i, 9, 5) * 0.62]); }
  else { const rows = n > 28 ? 5 : n > 18 ? 4 : 3, cols = Math.ceil(n / rows); for (let i = 0; i < n; i++) out.push([(i % cols + 0.5) / cols * 0.84 + 0.08, 0.32 + (Math.floor(i / cols) + 0.5) / rows * 0.6]); }
  return out;
}
const TALK_CODES = { qa: 1, discuss: 1, pair: 1, speak: 1, present: 1, project: 1 };
/* Which code each student is in at minute t of a segment: students are dealt into the mix, and the deal rotates so turns pass around. */
function roomCodes(seg, n, t) {
  const turn = Math.floor(t / 0.75), order = []; for (let i = 0; i < n; i++) order.push([hash(i, seg.t0 * 10 | 0, turn), i]); order.sort((a, b) => a[0] - b[0]);
  const out = new Array(n), codes = Object.keys(seg.mix).sort((a, b) => seg.mix[a] - seg.mix[b]); let k = 0, acc = 0;
  codes.forEach((code, ci) => { acc += seg.mix[code] * n; const upto = ci === codes.length - 1 ? n : Math.round(acc); for (; k < upto; k++) out[order[k][1]] = code; });
  return out;
}
function roomSync() {
  const c = App.c, l = c && App.view === 'lessons' ? curLesson(c) : null; Room.lesson = l; Room.L = l ? lessonLabel(c, l) : null; Room.n = c ? clamp(c.school.classSize || 18, 6, 36) : 18;
  const b = $('playbtn'); if (b) b.textContent = App.play.on ? '❚❚ Pause' : '▶ Play the period';
  roomDraw(0);
}
function roomDraw(dt) {
  const cv = $('room'), L = Room.L; if (!cv || !L) return;
  const x = cv.getContext('2d'), W = cv.width, H = cv.height, n = Room.n, t = clamp(App.play.t, 0, Math.max(0, L.total - 0.001));
  const seg = L.segs.find((s) => t >= s.t0 && t < s.t1) || L.segs[L.segs.length - 1] || null;
  let arr = seg && seg.arr; if (seg && !arr) { const nx = L.segs.find((s) => s.t0 >= seg.t1 && s.arr); arr = nx ? nx.arr : 'rows'; }
  const seats = roomSeats(arr || 'rows', n);
  if (Room.pos.length !== n) Room.pos = seats.map((p) => [p[0], p[1]]);
  const k = dt && !REDUCED_MOTION ? clamp(dt * 3.2, 0, 1) : 1; for (let i = 0; i < n; i++) { Room.pos[i][0] += (seats[i][0] - Room.pos[i][0]) * k; Room.pos[i][1] += (seats[i][1] - Room.pos[i][1]) * k; }
  x.clearRect(0, 0, W, H); x.fillStyle = '#fbf8f0'; x.fillRect(0, 0, W, H);
  x.strokeStyle = '#e7dfcd'; x.lineWidth = 1; for (let g = 40; g < W; g += 40) { x.beginPath(); x.moveTo(g, 0); x.lineTo(g, H); x.stroke(); } for (let g = 40; g < H; g += 40) { x.beginPath(); x.moveTo(0, g); x.lineTo(W, g); x.stroke(); }
  x.fillStyle = '#24372f'; x.fillRect(W * 0.2, 14, W * 0.6, 26); x.fillStyle = '#17171b'; x.fillRect(W * 0.2, 40, W * 0.6, 4);
  if (!seg) { x.fillStyle = '#85818a'; x.font = '600 26px Archivo, sans-serif'; x.textAlign = 'center'; x.fillText('An empty room. Add a block.', W / 2, H / 2); return; }
  const codes = roomCodes(seg, n, t), e = seg.e, lead = !seg.over && e && (e.th === 'teacher' || e.th === 'shared'), R = n > 26 ? 13 : 16;
  const tx = lead ? W * (0.5 + 0.12 * Math.sin(t * 0.9)) : W * (0.5 + 0.38 * Math.sin(t * 0.55)), ty = lead ? 66 : H * (0.6 + 0.3 * Math.cos(t * 0.4));
  for (let i = 0; i < n; i++) {
    const px = Room.pos[i][0] * W, py = Room.pos[i][1] * H, code = codes[i] || 'wait', F = FAMILY_BY[CODES[code].fam];
    x.fillStyle = 'rgba(23,23,27,.10)'; x.beginPath(); x.ellipse(px, py + R * 0.9, R * 1.25, R * 0.5, 0, 0, 6.3); x.fill();
    x.fillStyle = F.color; x.strokeStyle = '#17171b'; x.lineWidth = 2.5; x.beginPath(); x.arc(px, py, R, 0, 6.3); x.fill(); x.stroke();
    if (TALK_CODES[code] && (code !== 'pair' && code !== 'speak' && code !== 'project' || (i + Math.floor(t * 3)) % 2 === 0)) { x.fillStyle = '#fff'; x.beginPath(); x.arc(px + R * 0.95, py - R * 1.05, R * 0.55, 0, 6.3); x.fill(); x.stroke(); x.fillStyle = '#17171b'; for (let d = -1; d <= 1; d++) { x.beginPath(); x.arc(px + R * 0.95 + d * 3.4, py - R * 1.05, 1.3, 0, 6.3); x.fill(); } }
    else if (code === 'notes' || code === 'practice' || code === 'make' || code === 'assess' || code === 'revise') { x.strokeStyle = '#fff'; x.lineWidth = 2.5; x.beginPath(); x.moveTo(px - R * 0.45, py + R * 0.3); x.lineTo(px + R * 0.45, py - R * 0.3); x.stroke(); }
    else if (code === 'read') { x.fillStyle = '#fff'; x.fillRect(px - R * 0.5, py - R * 0.3, R, R * 0.6); }
  }
  x.fillStyle = '#17171b'; x.beginPath(); x.arc(tx, ty, R * 1.15, 0, 6.3); x.fill(); x.fillStyle = '#ffe45c'; x.beginPath(); x.arc(tx, ty, R * 0.45, 0, 6.3); x.fill();
  const cap = $('roomcap'); if (cap) {
    const tally = {}; codes.forEach((cd) => { const f = CODES[cd].fam; tally[f] = (tally[f] || 0) + 1; });
    const txt = '<b>Minute ' + Math.floor(t) + '</b> · ' + esc(seg.over ? seg.what : e.move.name) + '<span>' + FAMILIES.filter((f) => tally[f.id]).sort((a, b) => tally[b.id] - tally[a.id]).map((f) => tally[f.id] + ' ' + f.short.toLowerCase()).join(' · ') + '</span>';
    if (cap.innerHTML !== txt) cap.innerHTML = txt;
  }
  const ph = $('playhead'); if (ph) ph.style.left = (100 * t / Math.max(L.period, L.total, 1)).toFixed(2) + '%';
  const sc = $('scrub'); if (sc && document.activeElement !== sc) sc.value = Math.round(t * 10);
}
function roomFrame(ts) {
  const dt = Math.min(0.1, (ts - Room.last) / 1000 || 0); Room.last = ts;
  if (App.view === 'lessons' && Room.L && $('room')) {
    if (App.play.on) { App.play.t += dt * 1.6; if (App.play.t >= Room.L.total) { App.play.t = Room.L.total; App.play.on = false; roomSync(); } }
    roomDraw(dt);
  }
  requestAnimationFrame(roomFrame);
}
requestAnimationFrame(roomFrame);
