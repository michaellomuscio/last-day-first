/* Documents: every generator, on a full course and an empty one. */
const E = require('../dist/engine.cjs');
const { DOCS, packetHTML, courseMarkdown, courseFileName, demoCourse, newCourse, esc, syllabusMissing, KITS, kitToCourse } = E;
let LENIENT = false, fails = 0; const ok = (c, m) => { if (!c) { fails++; console.log('FAIL', m); } };
const text = (h) => h.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
const BAD = [/undefined/, /NaN/, /\[object Object\]/, /\bnull\b/];
function clean(name, s, isHtml) {
  ok(typeof s === 'string' && s.trim().length > 0, name + ' is empty');
  const t = isHtml ? text(s) : s;
  BAD.forEach((re) => { if (LENIENT && re.source === 'undefined') return; const m = t.match(re); ok(!m, name + ' contains ' + re + (m ? ' near: ' + t.slice(Math.max(0, m.index - 40), m.index + 40).replace(/\s+/g, ' ') : '')); });
  ok(!/\.\.|\?\.|!\./.test(t.replace(/\.\.\./g, '')), name + ' has doubled punctuation near: ' + ((t.match(/.{30}(\.\.|\?\.|!\.).{10}/) || [''])[0]));
  ok(!/not set/i.test(t), name + ' says not set');
  ok(!/\b1 (minutes|days|hours|nights|checks|classes)\b/.test(t), name + ' has a bad plural');
  ok(LENIENT || !/!/.test(t.replace(/<!DOCTYPE/i, '')) || !isHtml, name + ' has an exclamation mark');
  ok(!/Understanding by Design|UbD/.test(t), name + ' names a trademark');
  if (isHtml) {
    ok(!/<script/i.test(s), name + ' has a script');
    for (const tag of ['table', 'tr', 'td', 'th', 'section', 'ul', 'ol', 'dl', 'p']) {
      const o = (s.match(new RegExp('<' + tag + '[\\s>]', 'g')) || []).length, c = (s.match(new RegExp('</' + tag + '>', 'g')) || []).length;
      ok(o === c, name + ': <' + tag + '> opens ' + o + ' closes ' + c);
    }
  }
}
const sizes = [];
function run(label, c) {
  DOCS.forEach((d) => { const h = d.html(c); clean(label + ' ' + d.id, h, true); sizes.push(label + ' ' + d.id + ' ' + h.length); });
  const p = packetHTML(c, [], {}); clean(label + ' packet', p, true); ok(/^<!DOCTYPE html>/.test(p), 'doctype'); ok(/<title>[^<]+<\/title>/.test(p), 'title');
  const md = courseMarkdown(c); clean(label + ' markdown', md, false);
  sizes.push(label + ' packet ' + p.length, label + ' markdown ' + md.length);
  ok(packetHTML(c, ['syllabus'], {}).indexOf('id="doc-scope"') < 0, 'ids filter');
  return p;
}
ok(DOCS.map((d) => d.id).join() === 'scope,pacing,units,lessons,assessments,homework,syllabus,report', 'document ids');

/* teacher text that already ends in a mark must not be doubled */
const punct = demoCourse(); punct.units[0].title = 'Who is telling the story?'; punct.units[0].questions = ['Why replace it?']; punct.assess[0].role = 'A historian.'; punct.assess[0].product = 'The unit test.';
run('punct', punct);

const demo = demoCourse(), packet = run('demo', demo); run('empty', newCourse({}));
demo.units.forEach((u) => ok(packet.includes(esc(u.title)), 'packet lacks unit ' + u.title));
demo.lessons.forEach((l) => ok(packet.includes(esc(l.title)), 'packet lacks lesson ' + l.title));
demo.assess.forEach((a) => ok(packet.includes(esc(a.title)), 'packet lacks assessment ' + a.title));

/* weights shown in the syllabus add up to the course's weights */
const syl = DOCS.find((d) => d.id === 'syllabus').html(demo), W = demo.syllabus.weights;
const shown = [...syl.matchAll(/<tr class="w"><th[^>]*>[^<]*<\/th><td>(\d+)%<\/td>/g)].reduce((a, m) => a + +m[1], 0);
ok(shown === W.major + W.minor + W.homework + W.participation, 'syllabus weights show ' + shown);
ok(/Total<\/th><td>100%/.test(syl), 'syllabus total row');

/* one evidence grid per unit */
const asg = DOCS.find((d) => d.id === 'assessments').html(demo);
ok((asg.match(/<table class="grid"/g) || []).length === demo.units.filter((u) => demo.goals.some((g) => g.unit === u.id)).length, 'one evidence grid per unit');
/* syllabusMissing */
ok(syllabusMissing(newCourse({})).length >= 3, 'empty course is missing things');
const full = demoCourse(); full.syllabus.contact = 'Room 12'; ok(syllabusMissing(full).length === 0, 'complete course is ready: ' + syllabusMissing(full));
ok(!/Draft\. Not ready/.test(DOCS.find((d) => d.id === 'syllabus').html(full)), 'no draft notice when ready');
ok(/Draft\. Not ready to send\./.test(DOCS.find((d) => d.id === 'syllabus').html(demo)), 'draft notice when not ready');
full.syllabus.weights.major = 60; ok(syllabusMissing(full).length === 1, 'weights not 100');
/* only the first question of each unit in the syllabus */
ok(!DOCS.find((d) => d.id === 'syllabus').html(demo).includes('Why are cells so small'), 'syllabus shows one question per unit');

/* empty sections are left out */
const bare = newCourse({}); const sb = DOCS.find((d) => d.id === 'syllabus').html(bare);
ok(!/<h2>Academic honesty/.test(sb) && !/<h2>How to get help/.test(sb), 'blank syllabus sections are omitted');
const sk = demo.syllabus; sk.honesty = 'Do your own work <b>always</b>.'; ok(DOCS.find((d) => d.id === 'syllabus').html(demo).includes('&lt;b&gt;'), 'teacher text is escaped'); sk.honesty = '';

/* the report uses grading and checks when another module provides them */
globalThis.gradeCourse = () => ({ overall: 'B', areas: [{ name: 'Evidence', grade: 'A', why: 'Every goal has evidence.' }] });
globalThis.runChecks = () => [{ area: 'Time', level: 'Watch', text: 'Lesson four runs long.' }];
const rep = DOCS.find((d) => d.id === 'report').html(demo); clean('report with checks', rep, true);
/* once 35-checks.js exists its own gradeCourse and runChecks win over these stubs, so accept either */
ok(rep.includes('Evidence') || rep.includes('<h2>Grades</h2>'), 'report shows grades');
ok(rep.includes('Lesson four runs long.') || rep.includes('<h2>Findings</h2>'), 'report shows findings');
delete globalThis.gradeCourse; delete globalThis.runChecks;

ok(courseFileName(demo, 'html') === 'biology.html' && courseFileName(newCourse({ title: '  A/B: "Chem" ' }), '.md') === 'a-b-chem.md' && courseFileName({ title: '???' }, '') === 'course', 'file names');
/* kit text is written elsewhere: it may say 'undefined slope' or end a line with an exclamation mark, so only the structure is checked */
LENIENT = true; KITS.forEach((k) => run('kit ' + k.id, kitToCourse(k)));
require('fs').writeFileSync(__dirname + '/../dist/history-packet.html', packetHTML(kitToCourse(KITS.find((k) => k.id === 'history')), [], {}));
console.log(sizes.filter((x) => /packet|syllabus/.test(x)).join('\n'));
console.log(fails ? fails + ' FAILED' : 'docs: all passed');
require('fs').writeFileSync(__dirname + '/../dist/demo-packet.html', packet);
process.exit(fails ? 1 : 0);
