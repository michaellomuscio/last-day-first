/* Runs every engine test. node build.js && node test/run.js */
const { spawnSync } = require('child_process'), fs = require('fs'), path = require('path');
let bad = 0;
for (const f of fs.readdirSync(__dirname).filter((x) => x.endsWith('.js') && x !== 'run.js').sort()) {
  const r = spawnSync(process.execPath, [path.join(__dirname, f)], { encoding: 'utf8' });
  const last = (r.stdout || '').trim().split('\n').pop();
  console.log((r.status === 0 ? 'ok   ' : 'FAIL ') + f.padEnd(12) + ' ' + last);
  if (r.status !== 0) { bad++; console.log((r.stdout || '').split('\n').slice(-12).join('\n'), r.stderr || ''); }
}
process.exit(bad ? 1 : 0);
