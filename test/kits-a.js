/* Checks the four starter kits in src/kits/ (english, math, science, history). Run `node build.js` first. */
const E = require('../dist/engine.cjs');
const { KITS, kitToCourse, validateKit, lessonLabel, MOVE_BY } = E;
let failed = 0;
const fail = (m) => { failed++; console.log('  FAIL ' + m); };
const IDS = ['english', 'math', 'science', 'history'];

for (const id of IDS) {
  const kit = KITS.find((k) => k.id === id);
  if (!kit) { fail(id + ': kit not found in KITS'); continue; }
  const before = failed;
  const probs = validateKit(kit);
  probs.forEach((p) => fail(p));
  const c = kitToCourse(kit);
  const days = c.units.reduce((s, u) => s + u.days, 0);
  if (days < 150 || days > 165) fail(id + ': unit days total ' + days + ', want 150 to 165');
  if (c.units.length < 7 || c.units.length > 9) fail(id + ': ' + c.units.length + ' units, want 7 to 9');
  for (const k of ['blurb', 'transfer', 'grade']) if (!kit[k]) fail(id + ': missing ' + k);
  let links = 0, linkedUnits = 0;
  const unitIndex = {}; c.units.forEach((u, i) => (unitIndex[u.id] = i));
  c.units.forEach((u, i) => {
    const gs = c.goals.filter((g) => g.unit === u.id);
    const majors = c.assess.filter((a) => a.unit === u.id && a.kind === 'major');
    const minors = c.assess.filter((a) => a.unit === u.id && a.kind === 'minor');
    if (majors.length !== 1) fail(id + ': ' + u.title + ' has ' + majors.length + ' major assessments');
    if (minors.length < 2 || minors.length > 3) fail(id + ': ' + u.title + ' has ' + minors.length + ' minors');
    if (gs.length < 4 || gs.length > 6) fail(id + ': ' + u.title + ' has ' + gs.length + ' goals, want 4 to 6');
    if (gs.filter((g) => g.priority === 'lasting').length > 2) fail(id + ': ' + u.title + ' has more than two lasting goals');
    if (!gs.some((g) => g.priority === 'lasting')) fail(id + ': ' + u.title + ' has no lasting goal');
    if (!gs.some((g) => g.kind === 'understanding')) fail(id + ': ' + u.title + ' has no understanding');
    if (u.questions.length < 1 || u.questions.length > 3) fail(id + ': ' + u.title + ' questions ' + u.questions.length);
    for (const a of majors.concat(minors)) {
      if (!a.goals.length) fail(id + ': assessment "' + a.title + '" targets no goals');
      if (a.goals.some((g) => c.goals.find((x) => x.id === g).unit !== u.id) && a.kind === 'minor') fail(id + ': minor "' + a.title + '" targets another unit');
    }
    let reaches = false;
    for (const g of gs) for (const a of g.after) { const t = c.goals.find((x) => x.id === a); if (t && unitIndex[t.unit] < i) { reaches = true; links++; } }
    if (reaches) linkedUnits++;
  });
  c.goals.forEach((g) => { if (!g.unit || !c.units.find((u) => u.id === g.unit)) fail(id + ': goal without a unit: ' + g.text); });
  if (linkedUnits / c.units.length < 0.6) fail(id + ': only ' + linkedUnits + ' of ' + c.units.length + ' units link to earlier units');
  const lastingUnits = c.goals.filter((g) => g.priority === 'lasting').length;
  const first = kit.units[0];
  if (!first.lessons || first.lessons.length < 4 || first.lessons.length > 6) fail(id + ': first unit needs 4 to 6 lessons');
  for (const u of kit.units.slice(1)) if (u.lessons && u.lessons.length) fail(id + ': only the first unit has lessons (' + u.title + ')');
  c.lessons.forEach((l) => {
    const t = l.blocks.reduce((s, b) => s + b.min, 0);
    if (t < 44 || t > 48) fail(id + ': lesson "' + l.title + '" blocks total ' + t + ', want 44 to 48');
    l.blocks.forEach((b) => { const m = MOVE_BY[b.move]; if (m.pu !== 'N' && !b.goals.length) fail(id + ': lesson "' + l.title + '" block ' + b.move + ' has no goal'); });
    const orphan = lessonLabel(c, l).orphan;
    if (orphan !== 0) fail(id + ': lesson "' + l.title + '" orphan ' + orphan);
    if (l.hw && (l.hw.min < 15 || l.hw.min > 30)) fail(id + ': homework in "' + l.title + '" is ' + l.hw.min + ' minutes');
  });
  const lessonMoves = new Set(); c.lessons.forEach((l) => l.blocks.forEach((b) => lessonMoves.add(b.move)));
  if (!c.lessons.some((l) => l.blocks.some((b) => MOVE_BY[b.move].retr))) fail(id + ': no retrieval in the first-unit lessons');
  console.log((failed === before ? 'ok   ' : 'FAIL ') + id + ': ' + c.units.length + ' units, ' + c.goals.length + ' goals (' + lastingUnits + ' lasting), ' + days + ' days, ' + links + ' cross-unit links in ' + linkedUnits + ' units, ' + c.lessons.length + ' lessons');
}
if (failed) { console.log(failed + ' problem(s)'); process.exit(1); }
console.log('all kits pass');
