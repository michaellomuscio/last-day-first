/* Chapter 1, "What should last": the aim of the course, the goals sorted by priority, the web of ideas, and a small sorting game.
   Everything here is prefixed goals / ACT.goal so it cannot collide with other files. */
const goalsUI = { focus: null };
const GOALS_ROWS = 8;        // dots per sub-column in the web before it wraps
const GOALS_SUBW = 176;      // width of one sub-column in the web
const GOALS_PITCH = 28;      // vertical spacing of dots (40 on touch screens, so each dot is a big enough target)
const goalsTouch = () => !!(window.matchMedia && window.matchMedia('(pointer: coarse), (max-width: 700px)').matches);
const goalsPitch = () => (goalsTouch() ? 40 : GOALS_PITCH);
/* Small helpers for naming controls, used by all six chapter files (a11y is the shared prefix).
   a11yGroup wraps a helper's buttons in a named group. a11yStep names the stepper's number box and its two buttons. */
const a11yGroup = (labelId, inner) => '<span class="a11y-g" role="group" aria-labelledby="' + labelId + '">' + inner + '</span>';
const a11yGroupL = (label, inner) => '<span class="a11y-g" role="group" aria-label="' + esc(label) + '">' + inner + '</span>';
const a11yStep = (name, path, value, min, max, step) => stepper(path, value, min, max, step).replace('aria-label="Less"', 'aria-label="Decrease ' + esc(name) + '"').replace('aria-label="Amount"', 'aria-label="' + esc(name) + '"').replace('aria-label="More"', 'aria-label="Increase ' + esc(name) + '"');
const goalsRank = (p) => (p === 'lasting' ? 0 : p === 'important' ? 1 : 2);
const goalsNeed = (c) => (c.units.length ? 2 * c.units.length : 6);

/* A select with an empty value is how "no unit" is stored by data-bind; turn it back into null so every other file sees a clean course. */
function goalsClean(c) {
  c.goals.forEach((g) => {
    if (!Array.isArray(g.after)) g.after = [];
    if (g.unit === '' || (g.unit && !unitOf(c, g.unit))) g.unit = null;
  });
}
/* Can you get from goal `from` to goal `target` by following "builds on" links? Used to refuse circles. */
function goalsReach(c, from, target) {
  const seen = {}, stack = [from];
  while (stack.length) { const id = stack.pop(); if (id === target) return true; if (seen[id]) continue; seen[id] = 1; const g = goalOf(c, id); if (g) g.after.forEach((a) => stack.push(a)); }
  return false;
}

/* ---------- the three columns ---------- */
function goalsCard(c, g) {
  const p = 'goal:' + g.id + ':', others = PRIORITIES.filter((x) => x[0] !== g.priority);
  const unitOpts = [['', 'No unit yet']].concat(c.units.map((u, i) => [u.id, (i + 1) + '. ' + short(u.title || 'Untitled unit', 30)]));
  const lv = LEVELS.find((x) => x[0] === g.level);
  return '<div class="gl-goal' + (App.sel.goal === g.id ? ' sel' : '') + '" id="gl-' + g.id + '">' +
    area(p + 'text', g.text, 'rows="3" placeholder="Students will understand, know or be able to…" aria-label="Goal text"') +
    '<div class="stack" style="gap:4px"><span class="lbl" id="gl-k-' + g.id + '">What kind</span>' + a11yGroup('gl-k-' + g.id, seg(p + 'kind', GOAL_KINDS, g.kind)) + '</div>' +
    '<div class="gl-two"><div class="stack" style="gap:4px"><label class="lbl" for="gl-lv-' + g.id + '">Thinking level</label>' + pick(p + 'level', LEVELS, g.level, 'id="gl-lv-' + g.id + '" data-num title="' + esc(lv ? lv[2] : '') + '"') + '</div>' +
    '<div class="stack" style="gap:4px"><label class="lbl" for="gl-un-' + g.id + '">Unit</label>' + pick(p + 'unit', unitOpts, g.unit || '', 'id="gl-un-' + g.id + '"') + '</div></div>' +
    '<div class="gl-foot" role="group" aria-label="Move or delete this goal"><span class="lbl">Move to</span>' + others.map((o) => '<button class="btn sm" data-act="goalMove" data-arg="' + g.id + '=' + o[0] + '">' + esc(o[1]) + '</button>').join('') +
    '<button class="btn sm ghost danger gl-del" data-act="goalDel" data-arg="' + g.id + '" aria-label="Delete this goal">Delete</button></div></div>';
}
function goalsColumns(c) {
  return '<div class="gl-cols">' + PRIORITIES.map((pr) => {
    const list = c.goals.filter((g) => g.priority === pr[0]), over = pr[0] === 'lasting' && list.length > goalsNeed(c);
    return '<section class="gl-col ' + pr[0] + '"><header><h3>' + esc(pr[1]) + ' <b class="num" data-live="gl-n-' + pr[0] + '">' + list.length + '</b></h3><p class="hint">' + esc(pr[2]) + '</p>' +
      (over ? '<p class="gl-nudge" data-live="gl-nudge">' + list.length + ' lasting goals for ' + plural(c.units.length, 'unit') + ' is a lot. If everything is lasting, nothing is.</p>' : '<span data-live="gl-nudge"></span>') + '</header>' +
      list.map((g) => goalsCard(c, g)).join('') +
      '<button class="btn gl-add" data-act="goalAdd" data-arg="' + pr[0] + '">+ Add a goal</button></section>';
  }).join('') + '</div>';
}

/* ---------- the web of ideas ---------- */
function goalsWebLayout(c) {
  const mk = (id, title, goals) => ({ id, title, goals: goals.slice().sort((a, b) => goalsRank(a.priority) - goalsRank(b.priority)) });
  const cols = [], loose = c.goals.filter((g) => !g.unit);
  if (loose.length) cols.push(mk(null, 'Unplaced', loose));
  c.units.forEach((u, i) => cols.push(mk(u.id, (i + 1) + '. ' + (u.title || 'Untitled unit'), c.goals.filter((g) => g.unit === u.id))));
  const pos = {}, P = goalsPitch(); let x = 0, maxRows = 1;
  cols.forEach((col) => {
    const subs = Math.max(1, Math.ceil(col.goals.length / GOALS_ROWS)); col.x = x; col.w = subs * GOALS_SUBW + 12;
    col.goals.forEach((g, i) => { const sub = Math.floor(i / GOALS_ROWS), row = i % GOALS_ROWS; pos[g.id] = { x: x + 22 + sub * GOALS_SUBW, y: 62 + row * P }; maxRows = Math.max(maxRows, Math.min(GOALS_ROWS, col.goals.length)); });
    x += col.w;
  });
  return { cols, pos, w: Math.max(x, 200), h: 62 + maxRows * P + 14, pitch: P };
}
function goalsWebHTML(c) {
  if (!c.goals.length) return empty('Add a few goals above and they appear here as dots.');
  const L = goalsWebLayout(c), sel = App.sel.goal && goalOf(c, App.sel.goal) ? App.sel.goal : null, R = { lasting: 9, important: 6.5 };
  let s = '<svg class="gl-svg' + (sel ? ' has-sel' : '') + '" width="' + L.w + '" height="' + L.h + '" viewBox="0 0 ' + L.w + ' ' + L.h + '" role="group" aria-label="Dots for each goal">';
  L.cols.forEach((col, i) => {
    const max = Math.max(8, Math.floor((col.w - 20) / 7.3)), t = short(col.title, max);
    s += '<g><title>' + esc(col.title) + '</title><rect class="gl-colbg' + (i % 2 ? ' alt' : '') + '" x="' + col.x + '" y="0" width="' + col.w + '" height="' + L.h + '"/>' +
      '<text class="gl-colh" x="' + (col.x + 12) + '" y="24">' + esc(t.toUpperCase()) + '</text><text class="gl-colc" x="' + (col.x + 12) + '" y="40">' + plural(col.goals.length, 'goal') + '</text></g>';
  });
  c.goals.forEach((g) => {
    const b = L.pos[g.id]; if (!b) return;
    g.after.forEach((aid) => {
      const a = L.pos[aid]; if (!a) return;
      const dx = b.x - a.x, mx = (a.x + b.x) / 2 + (Math.abs(dx) < 4 ? -26 : 0), my = (a.y + b.y) / 2 - Math.min(40, Math.abs(dx) * 0.1);
      s += '<path class="gl-edge' + (sel && (g.id === sel || aid === sel) ? ' on' : '') + '" d="M' + a.x + ' ' + a.y + ' Q' + mx.toFixed(1) + ' ' + my.toFixed(1) + ' ' + b.x + ' ' + b.y + '"/>';
    });
  });
  c.goals.forEach((g) => {
    const b = L.pos[g.id]; if (!b) return; const r = R[g.priority] || 4, name = g.text || 'Untitled goal';
    s += '<g class="gl-dot ' + (goalsRank(g.priority) === 0 ? 'lasting' : goalsRank(g.priority) === 1 ? 'important' : 'familiar') + (g.id === sel ? ' sel' : '') + '" data-act="goalDot" data-arg="' + g.id + '" tabindex="0" role="button" aria-label="' + esc(optName(PRIORITIES, g.priority) + ': ' + short(name, 80)) + '" aria-pressed="' + (g.id === sel) + '">' +
      '<title>' + esc(name) + '</title><rect class="gl-hit" x="' + (b.x - 14) + '" y="' + (b.y - L.pitch / 2) + '" width="' + (GOALS_SUBW - 20) + '" height="' + L.pitch + '"/>' +
      '<circle class="gl-focus" cx="' + b.x + '" cy="' + b.y + '" r="' + (r + 9) + '"/>' +
      (g.id === sel ? '<circle class="gl-ring" cx="' + b.x + '" cy="' + b.y + '" r="' + (r + 7) + '"/>' : '') +
      '<circle class="gl-c" cx="' + b.x + '" cy="' + b.y + '" r="' + r + '"/><text class="gl-lbl" x="' + (b.x + 15) + '" y="' + (b.y + 4) + '">' + esc(short(name, 24)) + '</text></g>';
  });
  s += '</svg>';
  let info;
  if (sel) {
    const g = goalOf(c, sel), up = g.after.map((id) => goalOf(c, id)).filter(Boolean), down = c.goals.filter((x) => x.after.includes(sel));
    info = '<div class="gl-info"><p><b>Selected:</b> ' + esc(g.text || 'Untitled goal') + '</p><p class="hint">Click a second dot to say this goal builds on it. Click that dot again to take the line away.</p>' +
      (up.length ? '<div class="row wrap"><span class="lbl">Builds on</span>' + up.map((u) => '<button class="chip on" data-act="goalUnlink" data-arg="' + sel + '=' + u.id + '" title="Take this line away">' + esc(short(u.text || 'Untitled goal', 40)) + ' ×</button>').join('') + '</div>' : '') +
      (down.length ? '<div class="row wrap"><span class="lbl">Leads to</span>' + down.map((u) => '<span class="chip" title="' + esc(u.text) + '">' + esc(short(u.text || 'Untitled goal', 40)) + '</span>').join('') + '</div>' : '') +
      '<button class="btn sm" data-act="goalClear">Clear selection</button></div>';
  } else info = '<div class="gl-info"><p class="hint">Click a dot to pick a goal. Then click another to connect them.</p></div>';
  return '<div class="gl-webwrap" tabindex="0" role="region" aria-label="Web of ideas. Scrolls sideways when it is wider than the screen.">' + s + '</div>' + info;
}

/* ---------- the sorting game ---------- */
const goalsKindName = { knowledge: 'knowledge', skill: 'a skill', understanding: 'an understanding' };
const goalsBank = [
  { t: 'The Declaration of Independence was adopted in 1776.', k: 'knowledge', why: 'It is a fact you can look up, and it is simply true.' },
  { t: 'The mitochondrion is the part of a cell where most usable energy is made.', k: 'knowledge', why: 'It is a fact and a term to know, with one correct answer.' },
  { t: 'The Spanish word for library is “biblioteca”.', k: 'knowledge', why: 'Vocabulary is knowledge: you either know the word or you do not.' },
  { t: 'The quadratic formula is x = (−b ± √(b² − 4ac)) / 2a.', k: 'knowledge', why: 'Knowing the formula is a fact. Using it to solve something is a skill.' },
  { t: 'In Romeo and Juliet, the two feuding families are the Montagues and the Capulets.', k: 'knowledge', why: 'It is a fact about the text that you can check on a page.' },
  { t: 'Water boils at 100 degrees Celsius at sea level.', k: 'knowledge', why: 'It is a fact, tied to a condition, that a student can recall.' },
  { t: 'In Python, len() gives the number of items in a list.', k: 'knowledge', why: 'It is a fact about how a tool works that you can look up.' },
  { t: 'Solve a two-step linear equation.', k: 'skill', why: 'It is something students do, and you can watch them do it.' },
  { t: 'Write a paragraph that backs up a claim with evidence from a text.', k: 'skill', why: 'It is a way of working that gets better with practice and feedback.' },
  { t: 'Focus a microscope and draw what you see.', k: 'skill', why: 'It is a physical, repeatable procedure, so it is a skill.' },
  { t: 'Conjugate regular Spanish -ar verbs in the present tense.', k: 'skill', why: 'Students are producing something, not just recalling it, so it is a skill.' },
  { t: 'Cite a source in MLA format.', k: 'skill', why: 'It is a procedure students carry out, not an idea they explain.' },
  { t: 'Find and fix a bug by reading the error message.', k: 'skill', why: 'It is something you do, and you get faster with practice.' },
  { t: 'Sketch a still life using light and shadow.', k: 'skill', why: 'It is a craft that students show by making something.' },
  { t: 'Read a primary source and work out why its author wrote it.', k: 'skill', why: 'It is a reading skill students can use on any source.' },
  { t: 'Living things stay alive by keeping conditions inside them steady while the world outside changes.', k: 'understanding', why: 'It is a big idea that explains many examples, and it still holds in a new case.' },
  { t: 'A function describes how one quantity depends on another, and a graph is one way to see that.', k: 'understanding', why: 'It explains how many different things connect, so it is an understanding.' },
  { t: 'Who holds power in a society shapes whose story gets told in its history books.', k: 'understanding', why: 'It is a claim students could argue about and apply to any period.' },
  { t: 'Growth by repeated multiplication starts slowly and then outruns our intuition.', k: 'understanding', why: 'It explains why many situations behave as they do, beyond one example.' },
  { t: 'Authors choose what to show and what to leave out, and those choices shape how a reader feels.', k: 'understanding', why: 'It is an idea students can carry to any text they read.' },
  { t: 'Good evidence is not only true. It also has to fit the claim it is used to support.', k: 'understanding', why: 'It is a lasting idea about reasoning that works in every subject.' },
  { t: 'Complex programs are built by combining small, simple steps.', k: 'understanding', why: 'It explains how programming works, not just how to do one task.' },
  { t: 'A translation is never word for word, because words carry culture as well as meaning.', k: 'understanding', why: 'It is an idea about language that applies to any pair of languages.' },
];
let goalsGame = null;
function goalsShuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function goalsGameStart() {
  const by = { knowledge: [], skill: [], understanding: [] };
  goalsBank.forEach((q, i) => by[q.k].push(i));
  Object.keys(by).forEach((k) => goalsShuffle(by[k]));
  let pick10 = []; Object.keys(by).forEach((k) => (pick10 = pick10.concat(by[k].splice(0, 3))));
  pick10.push(goalsShuffle(by.knowledge.concat(by.skill, by.understanding))[0]);
  goalsGame = { order: goalsShuffle(pick10), i: 0, got: [], done: false };
}
function goalsGameHTML() {
  const G = goalsGame, n = G.order.length;
  const dots = '<div class="gl-prog" aria-hidden="true">' + G.order.map((idx, k) => '<i class="' + (k < G.got.length ? (G.got[k] === goalsBank[idx].k ? 'ok' : 'no') : k === G.i ? 'now' : '') + '"></i>').join('') + '</div>';
  const top = '<div class="row between"><div class="eyebrow">Practice</div><button class="btn sm ghost" data-act="closeModal">Close</button></div>';
  if (G.done) {
    const score = G.order.filter((idx, k) => G.got[k] === goalsBank[idx].k).length;
    const advice = score >= 8 ? 'You can tell them apart. Now check your own list: are most of your goals the easy kind to write, which is facts?'
      : score >= 5 ? 'You are close. When unsure, ask: can I look it up, can I watch someone do it, or does it explain why or how?'
      : 'Try this test on each goal. If you can look it up, it is knowledge. If you can watch it, it is a skill. If it explains why or how, it is an understanding.';
    return top + '<h2 id="gl-game-h">You got ' + score + ' of ' + n + '</h2>' + dots + '<p class="gl-advice">' + advice + '</p><p class="hint">Most real goals mix kinds. Pick the one that matters most for that goal.</p><div class="foot"><button class="btn" data-act="goalPractice">Play again</button><button class="btn pri" data-act="closeModal">Back to my goals</button></div>';
  }
  const q = goalsBank[G.order[G.i]], ans = G.got[G.i], answered = ans != null;
  const btns = GOAL_KINDS.map((kd) => {
    const cls = answered ? (kd[0] === q.k ? ' right' : kd[0] === ans ? ' wrong' : ' dim') : '';
    return '<button class="gl-choice' + cls + '" data-act="goalAnswer" data-arg="' + kd[0] + '"' + (answered ? ' disabled' : '') + '><b>' + (kd[0] === 'skill' ? 'A skill' : kd[0] === 'understanding' ? 'A big idea' : 'A fact') + (answered && kd[0] === q.k ? ' <em class="gl-say">Correct answer</em>' : answered && kd[0] === ans ? ' <em class="gl-say">Your answer</em>' : '') + '</b><span>' +
      (kd[0] === 'knowledge' ? 'Something you can look up or recall.' : kd[0] === 'skill' ? 'Something students can do.' : 'An idea that explains why or how.') + '</span></button>';
  }).join('');
  const fb = answered ? '<p id="gl-fb" class="gl-fb ' + (ans === q.k ? 'ok' : 'no') + '"><b>' + (ans === q.k ? 'Right.' : 'Not quite. This is ' + goalsKindName[q.k] + '.') + '</b> ' + esc(q.why) + '</p><div class="foot"><button class="btn pri" data-act="goalNext" id="gl-next" aria-describedby="gl-fb">' + (G.i + 1 >= n ? 'See my score' : 'Next statement') + '</button></div>' : '';
  return top + '<h2 id="gl-game-h">Fact, skill or big idea?</h2>' + dots + '<p class="lbl">Statement ' + (G.i + 1) + ' of ' + n + '</p><p class="gl-q">“' + esc(q.t) + '”</p><div class="gl-choices" role="group" aria-label="What kind of goal is this statement">' + btns + '</div>' + fb;
}
function goalsGameShow() { openModal('<div class="gl-mod">' + goalsGameHTML() + '</div>'); const b = $('gl-next') || document.querySelector('#modal .gl-choice:not(:disabled)') || document.querySelector('#modal .btn.pri'); if (b) b.focus({ preventScroll: true }); }
ACT.goalPractice = () => { goalsGameStart(); goalsGameShow(); return false; };
ACT.goalAnswer = (a) => { if (!goalsGame || goalsGame.done || goalsGame.got[goalsGame.i] != null) return false; goalsGame.got[goalsGame.i] = a; goalsGameShow(); return false; };
ACT.goalNext = () => { if (!goalsGame) return false; goalsGame.i++; if (goalsGame.i >= goalsGame.order.length) goalsGame.done = true; goalsGameShow(); return false; };

/* ---------- the view ---------- */
VIEWS.goals = {
  name: 'Goals',
  render(c) {
    goalsClean(c);
    const lasting = c.goals.filter((g) => g.priority === 'lasting').length;
    return '<div class="ws gl"><div class="ws-head"><div class="eyebrow">Chapter 1</div><h1>What should last</h1>' +
      '<p>Begin with what students should still understand and be able to do years from now. Everything else in the course is built to get them there.</p></div>' +
      '<div class="gl-narrow">' + mentor(MENTOR.goals(c)) + '</div>' +
      '<section class="panel gl-aim"><label class="gl-aimh" for="gl-aim">The aim of the course</label><p class="hint">Finish this sentence in your own words. Keep it to what a student could do alone, long after your class.</p>' +
      '<div class="gl-lead">Years from now, on their own, students should be able to…</div>' +
      '<textarea class="area" id="gl-aim" data-bind="course::transfer" rows="3" placeholder="…explain how living things work, and weigh a health claim against the evidence for it.">' + esc(c.transfer) + '</textarea></section>' +
      '<div class="row between wrap"><div class="stack" style="gap:2px"><h2 class="gl-h2">Goals, by how much they matter</h2><p class="hint">A goal is one thing students should know, be able to do, or understand. The Lasting column should be short.</p></div>' +
      '<button class="btn" data-act="goalPractice">Practise: fact, skill or big idea?</button></div>' +
      goalsColumns(c) +
      '<section class="panel gl-web"><h2>The web of ideas <small>' + plural(c.goals.length, 'dot') + '</small></h2>' +
      '<p class="hint">Dots are what students should know. Lines are how ideas connect, and connected ideas are the ones that last.</p>' +
      '<div class="gl-legend"><span><i class="k l" aria-hidden="true"></i>Lasting: large solid dot</span><span><i class="k i" aria-hidden="true"></i>Important: medium open dot</span><span><i class="k f" aria-hidden="true"></i>Worth meeting: small grey dot</span></div>' +
      '<div data-live="goalweb">' + goalsWebHTML(c) + '</div></section></div>';
  },
  after(root) {
    if (!goalsUI.focus) return;
    const t = root.querySelector('[data-bind="goal:' + goalsUI.focus + ':text"]'); goalsUI.focus = null;
    if (t) { t.focus({ preventScroll: true }); t.scrollIntoView({ block: 'nearest' }); }
  },
};

MENTOR.goals = (c) => {
  const g = c.goals, out = [], lasting = g.filter((x) => x.priority === 'lasting'), aim = c.transfer.trim();
  if (!g.length && !aim) return ['Start with the aim. What should a student be able to do, on their own, long after your class?'];
  if (!aim) out.push('You have goals but no aim yet. Write the one sentence all of them should serve.');
  if (g.length && !lasting.length) out.push('Nothing is marked lasting yet. Pick the one or two ideas you would want a student to hold in ten years.');
  else if (g.length >= 3 && g.every((x) => x.kind === 'knowledge')) out.push('Every goal is knowledge. Facts matter, but what will students still be able to explain or do in ten years?');
  else if (lasting.length > goalsNeed(c)) out.push('That is a lot of lasting goals. Keep two or three per unit at most, or none will feel lasting.');
  if (out.length < 2 && g.length >= 3 && !g.some((x) => x.after.length)) out.push('None of your goals connect yet. Draw a line from each idea to the one it builds on.');
  if (out.length < 2 && g.some((x) => !x.text.trim())) out.push('Some goals are still blank. Say what you mean in a sentence, or delete them.');
  if (out.length < 2 && g.length && g.some((x) => !x.unit) && c.units.length) out.push('Some goals have no unit yet. The next chapter is where they find a home.');
  if (!out.length) out.push('This is taking shape. Read the lasting goals aloud. Could a stranger tell what you plan to teach?');
  return out.slice(0, 2);
};

/* ---------- actions ---------- */
ACT.goalAdd = (pr, c) => { const g = addGoal(c, { priority: pr, kind: pr === 'lasting' ? 'understanding' : 'knowledge', level: pr === 'lasting' ? 3 : pr === 'important' ? 2 : 1, text: '' }); goalsUI.focus = g.id; };
ACT.goalMove = (a, c) => { const p = a.split('='), g = goalOf(c, p[0]); if (g) g.priority = p[1]; };
ACT.goalDel = (a, c) => { if (App.sel.goal === a) App.sel.goal = null; removeGoal(c, a); toast('Goal deleted.'); };
ACT.goalClear = () => { App.sel.goal = null; };
ACT.goalUnlink = (a, c) => { const p = a.split('='), g = goalOf(c, p[0]); if (g) g.after = g.after.filter((x) => x !== p[1]); };
ACT.goalDot = (id, c) => {
  const first = App.sel.goal && goalOf(c, App.sel.goal);
  if (!first) { App.sel.goal = id; return; }
  if (first.id === id) { App.sel.goal = null; return; }
  const second = goalOf(c, id); if (!second) return;
  if (first.after.includes(id)) { first.after = first.after.filter((x) => x !== id); toast('Line removed.'); return; }
  if (goalsReach(c, id, first.id)) { toast(second.after.includes(first.id) ? 'The other goal already builds on this one. Two goals cannot build on each other.' : 'That would make a circle of goals that build on each other.'); return; }
  first.after.push(id); toast('Now this goal builds on the one you clicked.');
};
/* The web has taller rows on touch screens, so redraw it when the screen crosses that line. */
let goalsWasTouch = goalsTouch(), goalsRz = 0;
window.addEventListener('resize', () => { clearTimeout(goalsRz); goalsRz = setTimeout(() => { const t = goalsTouch(); if (t !== goalsWasTouch) { goalsWasTouch = t; if (App.view === 'goals' && App.c && !App.modal) render(); } }, 150); });
document.addEventListener('keydown', (ev) => {
  const el = ev.target; if (!el || !el.classList || !el.classList.contains('gl-dot')) return;
  if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); el.dispatchEvent(new MouseEvent('click', { bubbles: true })); }
});
