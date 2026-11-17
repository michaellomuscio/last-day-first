/* Drive the tool in headless Chrome from Node, with real mouse clicks and typing. No dependencies (needs Node 22+ for WebSocket).
     const { launch } = require('./tools/play.js');
     const p = await launch({ width: 1500, height: 1000 });
     await p.goto('file:///.../dist/index.html');  await p.click('[data-act="warmup"]');  await p.type('.title', 'Chemistry');
     console.log(await p.text('.lf'));  await p.shot('/tmp/shot.png');  console.log(p.errors);  await p.close();
   Always call close(): it shuts Chrome down and removes its temporary profile. */
const { spawn } = require('child_process'), fs = require('fs'), os = require('os'), path = require('path'), http = require('http');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function launch(opts) {
  opts = opts || {};
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ldf-play-')), port = 9300 + Math.floor(Math.random() * 600);
  const proc = spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=' + port, '--user-data-dir=' + dir, '--window-size=' + (opts.width || 1500) + ',' + (opts.height || 1000), 'about:blank'], { stdio: 'ignore' });
  const getJSON = (p) => new Promise((res, rej) => http.get({ host: '127.0.0.1', port, path: p }, (r) => { let d = ''; r.on('data', (c) => (d += c)); r.on('end', () => { try { res(JSON.parse(d)); } catch (e) { rej(e); } }); }).on('error', rej));
  let page = null; for (let i = 0; i < 80 && !page; i++) { try { page = (await getJSON('/json')).find((t) => t.type === 'page'); } catch (e) { /* not up yet */ } if (!page) await sleep(150); }
  if (!page) { proc.kill(); throw new Error('Chrome did not start'); }
  const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0; const waiting = new Map(), errors = [], logs = [];
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && waiting.has(m.id)) { const w = waiting.get(m.id); waiting.delete(m.id); if (m.error) w.rej(new Error(m.error.message)); else w.res(m.result); }
    else if (m.method === 'Runtime.exceptionThrown') { const d = m.params.exceptionDetails; errors.push(d.exception && d.exception.description ? d.exception.description : d.text); }
    else if (m.method === 'Runtime.consoleAPICalled') logs.push(m.params.args.map((a) => (a.value !== undefined ? a.value : a.description)).join(' '));
  };
  const send = (method, params) => new Promise((res, rej) => { const i = ++id; waiting.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
  await send('Runtime.enable'); await send('Page.enable');
  const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception && r.exceptionDetails.exception.description ? r.exceptionDetails.exception.description : r.exceptionDetails.text); return r.result.value; };
  const q = (sel, nth) => 'document.querySelectorAll(' + JSON.stringify(sel) + ')[' + (nth || 0) + ']';
  /* Scrolls the element into view and returns the point a person would click, or null if it is missing, hidden or covered. */
  const point = async (sel, nth) => ev('(() => { const el = ' + q(sel, nth) + '; if (!el) return null; el.scrollIntoView({ block: "center", inline: "center" }); const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return { hidden: true }; const x = r.left + r.width / 2, y = r.top + r.height / 2, top = document.elementFromPoint(x, y); return { x, y, covered: !(top && (top === el || el.contains(top) || top.contains(el))), by: top ? top.tagName + "." + top.className : "" }; })()');
  const P = {
    errors, logs, eval: ev, sleep,
    async goto(url) { await send('Page.navigate', { url }); await sleep(opts.settle || 800); },
    /* Phone or tablet: size(390, 844, true). Desktop: size(1500, 1000). */
    async size(w, h, mobile) { await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: mobile ? 2 : 1, mobile: !!mobile }); if (mobile) await send('Emulation.setTouchEmulationEnabled', { enabled: true }); await sleep(250); },
    /* A real click at the element's centre. Throws if nothing matches, or if the element is hidden or covered by something else. */
    async click(sel, nth) {
      const p = await point(sel, nth); if (!p) throw new Error('nothing matches ' + sel); if (p.hidden) throw new Error('hidden: ' + sel); if (p.covered) throw new Error('covered by ' + p.by + ': ' + sel);
      for (const type of ['mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: p.x, y: p.y, button: 'left', clickCount: 1 });
      await sleep(opts.pause || 120);
    },
    /* Click the first element matching `sel` whose text contains `text`. */
    async clickText(sel, text) { const n = await ev('Array.from(document.querySelectorAll(' + JSON.stringify(sel) + ')).findIndex((e) => e.textContent.includes(' + JSON.stringify(text) + '))'); if (n < 0) throw new Error('no ' + sel + ' containing "' + text + '"'); await P.click(sel, n); },
    /* Click into a field, replace what is there, and type as a person would (fires input events). */
    async type(sel, text, nth) { await P.click(sel, nth); await ev('(() => { const el = ' + q(sel, nth) + '; if (el.select) el.select(); })()'); await send('Input.insertText', { text: String(text) }); await sleep(opts.pause || 120); },
    async key(key) { const code = { Escape: 27, Enter: 13, Tab: 9, ' ': 32 }[key] || 0; for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key, code: key === ' ' ? 'Space' : key, windowsVirtualKeyCode: code, nativeVirtualKeyCode: code, text: type === 'keyDown' && key === ' ' ? ' ' : undefined }); await sleep(80); },
    /* For a <select>: choose an option by its value. For a range slider: set its value. Both fire the events the page listens for. */
    async choose(sel, value, nth) { await ev('(() => { const el = ' + q(sel, nth) + '; if (!el) throw new Error("nothing matches"); el.value = ' + JSON.stringify(String(value)) + '; el.dispatchEvent(new Event("input", { bubbles: true })); el.dispatchEvent(new Event("change", { bubbles: true })); })()'); await sleep(opts.pause || 120); },
    text: (sel, nth) => ev('(() => { const el = ' + q(sel || 'body', nth) + '; return el ? el.innerText : null; })()'),
    count: (sel) => ev('document.querySelectorAll(' + JSON.stringify(sel) + ').length'),
    exists: async (sel) => (await ev('document.querySelectorAll(' + JSON.stringify(sel) + ').length')) > 0,
    /* A PNG of the window, or of the whole page when full is true. Look at it with your image reader. */
    async shot(file, full) {
      if (full) { const h = await ev('Math.max(document.documentElement.scrollHeight, ...Array.from(document.querySelectorAll(".main, .side, .modal")).map((e) => e.scrollHeight + 160))'), w = await ev('window.innerWidth'); await send('Emulation.setDeviceMetricsOverride', { width: w, height: Math.min(h, 6000), deviceScaleFactor: 1, mobile: false }); await sleep(250); }
      const r = await send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(file, Buffer.from(r.data, 'base64'));
      if (full) { await send('Emulation.clearDeviceMetricsOverride'); await sleep(150); }
      return file;
    },
    async close() { try { await send('Browser.close'); } catch (e) { /* already gone */ } await sleep(200); try { proc.kill(); } catch (e) { /* fine */ } try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) { /* fine */ } },
  };
  return P;
}
module.exports = { launch, sleep };
