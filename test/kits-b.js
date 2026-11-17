/* Checks the language, arts, cs and health starter kits. Run `node build.js` first. */
const E = require('../dist/engine.cjs');
let fails = 0;
const fail = (m) => { fails++; console.log('FAIL ' + m); };
for (const id of ['language', 'arts', 'cs', 'health']) {
  const kit = E.KITS.find((k) => k.id === id);
  if (!kit) { fail('kit missing: ' + id); continue; }
  const bad = E.validateKit(kit);
  bad.forEach((b) => fail(b));
  const c = E.kitToCourse(kit);
  const days = c.units.reduce((s, u) => s + u.days, 0);
  if (days < 150 || days > 165) fail(id + ': days ' + days);
  if (c.units.length < 7 || c.units.length > 9) fail(id + ': unit count ' + c.units.length);
  let links = 0;
  c.units.forEach((u, i) => {
    const as = c.assess.filter((a) => a.unit === u.id);
    if (!as.some((a) => a.kind === 'major')) fail(id + ': no major in ' + u.title);
    if (as.filter((a) => a.kind === 'minor').length < 2) fail(id + ': fewer than two minors in ' + u.title);
    const gs = c.goals.filter((g) => g.unit === u.id);
    if (gs.filter((g) => g.priority === 'lasting').length > 2) fail(id + ': too many lasting in ' + u.title);
    if (!gs.some((g) => g.priority === 'lasting')) fail(id + ': no lasting goal in ' + u.title);
    if (gs.length < 4 || gs.length > 6) fail(id + ': goal count in ' + u.title);
    const earlier = new Set(c.goals.filter((g) => c.units.findIndex((x) => x.id === g.unit) < i).map((g) => g.id));
    if (gs.some((g) => (g.after || []).some((a) => earlier.has(a)))) links++;
  });
  c.goals.forEach((g) => { if (!g.unit || !c.units.some((u) => u.id === g.unit)) fail(id + ': goal without unit ' + g.text); });
  if (links / c.units.length < 0.6) fail(id + ': only ' + links + ' units link back');
  kit.units.forEach((u) => (u.goals || []).forEach((g) => { if (/!(?!=)/.test(g.text) || /Students will/.test(g.text)) fail(id + ': wording ' + g.key); }));
  let lessons = 0;
  kit.units.forEach((ku) => { if ((ku.lessons || []).length && ku !== kit.units[0]) fail(id + ': lessons outside first unit'); });
  const first = kit.units[0];
  if (!first.lessons || first.lessons.length < 4 || first.lessons.length > 6) fail(id + ': first unit needs 4 to 6 lessons');
  c.lessons.forEach((l) => {
    lessons++;
    const tot = l.blocks.reduce((s, b) => s + b.min, 0);
    if (tot < 44 || tot > 48) fail(id + ': lesson "' + l.title + '" totals ' + tot);
    l.blocks.forEach((b) => { if (E.MOVE_BY[b.move].pu !== 'N' && !(b.goals || []).length) fail(id + ': block without goal in ' + l.title); });
    const lab = E.lessonLabel(c, l);
    if (lab.orphan !== 0) fail(id + ': orphan ' + lab.orphan + ' in ' + l.title);
    if (l.hw && (l.hw.min < 10 || l.hw.min > 30)) fail(id + ': homework minutes in ' + l.title);
  });
  console.log(id + ': ' + c.units.length + ' units, ' + c.goals.length + ' goals, ' + days + ' days, ' + links + ' units linked back, ' + lessons + ' lessons');
}
if (fails) { console.log(fails + ' problem(s)'); process.exit(1); }
console.log('ok');
