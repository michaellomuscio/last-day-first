/* Joins src/ into one page. Writes dist/index.html (the app) and dist/engine.cjs (everything that needs no browser, for tests). */
const fs = require('fs'), path = require('path');
const src = path.join(__dirname, 'src'), dist = path.join(__dirname, 'dist');
const ls = (d, ext) => (fs.existsSync(d) ? fs.readdirSync(d).filter((f) => f.endsWith(ext)).sort().map((f) => path.join(d, f)) : []);
const read = (f) => fs.readFileSync(f, 'utf8');
const js = ls(src, '.js'), kits = ls(path.join(src, 'kits'), '.js'), css = ls(path.join(src, 'css'), '.css');
/* Files numbered below 50 are the engine: no document, no window. Kits are data and load after the engine's tables. */
const isEngine = (f) => /^[0-4]\d-/.test(path.basename(f));
const engine = js.filter(isEngine), ui = js.filter((f) => !isEngine(f));
fs.mkdirSync(dist, { recursive: true });
const EXPORTS = fs.existsSync(path.join(src, 'exports.txt')) ? read(path.join(src, 'exports.txt')).split(/\s+/).filter(Boolean) : [];
fs.writeFileSync(path.join(dist, 'engine.cjs'), engine.concat(kits).map(read).join('\n') + '\nmodule.exports = { ' + EXPORTS.join(', ') + ' };\n');
const page = read(path.join(src, 'page.html')).replace('/*__CSS__*/', () => css.map(read).join('\n')).replace('/*__JS__*/', () => engine.concat(kits, ui).map(read).join('\n'));
fs.writeFileSync(path.join(dist, 'index.html'), page);
/* docs/index.html is the copy kept in the repository: open it in a browser to use the tool. */
fs.mkdirSync(path.join(__dirname, 'docs'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'docs', 'index.html'), page);
console.log('built', (page.length / 1024).toFixed(0) + ' KB,', engine.length + ' engine files,', kits.length + ' kits,', ui.length + ' interface files');
