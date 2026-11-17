/* The report: grades, the course label, the fingerprint, the web of ideas after a simulated year, every check, versions, and the packet. */
App.rep = { web: 'now', unit: null, stress: null };
const repBand = (v) => (v == null ? 'none' : v >= 0.55 ? 'strong' : v >= 0.25 ? 'partial' : 'faint');
const REP_BAND_WORD = { strong: 'holding', partial: 'shaky', faint: 'mostly gone', none: 'not seen' };

/* One image for the whole course: a ring per unit, first unit at the centre. Arc color is what students do,
   ring thickness is how much of the time asks for strategic or extended thinking, ticks are major assessments. */
function fingerprintSVG(c, size) {
  const n = Math.max(1, c.units.length), S = size || 360, cx = S / 2, cy = S / 2, r0 = S * 0.09, dr = (S * 0.47 - r0) / n;
  const arc = (r, a0, a1) => { const p = (a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)], A = p(a0), B = p(a1); return 'M' + A[0].toFixed(2) + ' ' + A[1].toFixed(2) + 'A' + r.toFixed(2) + ' ' + r.toFixed(2) + ' 0 ' + (a1 - a0 > Math.PI ? 1 : 0) + ' 1 ' + B[0].toFixed(2) + ' ' + B[1].toFixed(2); };
  let h = '<svg class="fp" viewBox="0 0 ' + S + ' ' + S + '" role="img" aria-label="Course fingerprint: one ring per unit"><circle cx="' + cx + '" cy="' + cy + '" r="' + (r0 * 0.55).toFixed(1) + '" fill="#17171b"/>';
  c.units.forEach((u, k) => {
    const L = unitLabel(c, u.id), r = r0 + dr * (k + 0.5);
    if (!L.total) { h += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r.toFixed(1) + '" fill="none" stroke="#b9b2a3" stroke-width="1.5" stroke-dasharray="3 5"><title>' + esc(u.title) + ': no lessons planned yet</title></circle>'; return; }
    const w = dr * (0.34 + 0.56 * shares(L).high); let a = -Math.PI / 2;
    for (const F of FAMILIES) { const v = (L.fam[F.id] || 0) / L.total; if (v < 0.004) continue; const b = a + v * Math.PI * 2; h += '<path d="' + arc(r, a + 0.012, Math.max(a + 0.014, b - 0.012)) + '" fill="none" stroke="' + F.color + '" stroke-width="' + w.toFixed(1) + '"><title>' + esc(u.title) + ': ' + F.name.toLowerCase() + ' ' + Math.round(v * 100) + '%</title></path>'; a = b; }
    unitAssess(c, u.id).filter((x) => x.kind === 'major').forEach((x, j, all) => { const t = -Math.PI / 2 + (j + 1) / (all.length + 1) * Math.PI * 2, p = [cx + (r + dr * 0.5) * Math.cos(t), cy + (r + dr * 0.5) * Math.sin(t)]; h += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + Math.max(2, dr * 0.11).toFixed(1) + '" fill="#17171b"><title>' + esc(x.title) + '</title></circle>'; });
  });
  return h + '</svg>';
}
/* The fingerprint in words. */
function fingerprintReading(c, L) {
  if (!L.total) return 'Plan some lessons and your course will start to show its shape.';
  const fams = FAMILIES.filter((f) => f.id !== 'over').map((f) => [f, (L.fam[f.id] || 0) / L.total]).sort((a, b) => b[1] - a[1]), S = shares(L);
  const top = fams[0], low = fams.filter((x) => x[1] < 0.04 && ['talk', 'make', 'practice', 'read', 'revise'].includes(x[0].id)).map((x) => x[0].short.toLowerCase());
  const meth = {}; c.assess.forEach((a) => (meth[a.method] = (meth[a.method] || 0) + (a.kind === 'major' ? 2 : 1))); const mTop = Object.keys(meth).sort((a, b) => meth[b] - meth[a])[0];
  return top[0].short + '-heavy' + (fams[1][1] > 0.12 ? ', with a good deal of ' + fams[1][0].short.toLowerCase() : '') + (low.length ? '; little ' + low.slice(0, 2).join(' or ') : '') + '. Students are active ' + Math.round(S.active * 100) + '% of the time and do the thinking themselves ' + Math.round(S.students * 100) + '% of it.' + (mTop ? ' The evidence leans on ' + optName(METHODS, mTop).toLowerCase() + '.' : '');
}

function webSVG(c, sim) {
  const mode = App.rep.web, cols = c.units.map((u) => ({ u, goals: unitGoals(c, u.id) })).filter((x) => x.goals.length), loose = c.goals.filter((g) => !g.unit || !unitOf(c, g.unit));
  if (loose.length) cols.unshift({ u: null, goals: loose });
  if (!cols.length) return '<p class="hint">No goals yet.</p>';
  const colW = Math.max(92, Math.min(170, 1000 / cols.length)), W = colW * cols.length, rowH = 34, rows = Math.max.apply(null, cols.map((x) => x.goals.length)), H = 46 + rows * rowH, pos = {};
  cols.forEach((col, i) => col.goals.forEach((g, j) => (pos[g.id] = [colW * (i + 0.5) + ((j % 2) - 0.5) * colW * 0.34, 44 + rowH * (j + 0.5)])));
  const gm = goalMap(c);
  /* A goal no lesson or homework touches was never taught: it is drawn hollow, not as forgotten. */
  const val = (g) => { const G = sim && sim.goals[g.id]; if (!G) return null; if (mode !== 'seen' && gm[g.id] && gm[g.id].min + gm[g.id].hwMin < 0.5) return null; return mode === 'seen' ? G.seen : mode === 'now' ? G.recall : G.later ? G.later.recall : G.recall; };
  let h = '<svg class="web" viewBox="0 0 ' + W + ' ' + H + '" style="min-width:' + Math.min(W, cols.length * 110) + 'px;max-width:' + Math.round(W * 1.25) + 'px" role="img" aria-label="Web of ideas">';
  cols.forEach((col, i) => { h += (i % 2 ? '<rect x="' + colW * i + '" y="0" width="' + colW + '" height="' + H + '" fill="rgba(23,23,27,.035)"/>' : '') + '<text class="webcol" x="' + (colW * (i + 0.5)) + '" y="18" text-anchor="middle">' + esc(short(col.u ? col.u.title : 'No unit yet', Math.floor(colW / 7))) + '</text>'; });
  const links = sim && sim.links ? sim.links : c.goals.reduce((a, g) => a.concat(g.after.map((f) => ({ from: g.id, to: f, strength: 0 }))), []);
  for (const k of links) { const a = pos[k.from], b = pos[k.to]; if (!a || !b) continue; const s = mode === 'seen' ? 0 : k.strength || 0, bd = repBand(s); h += '<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '" class="weblink ' + bd + '"><title>How well students connect these two: ' + REP_BAND_WORD[bd] + '</title></line>'; }
  for (const g of c.goals) { const p = pos[g.id]; if (!p) continue; const v = val(g), bd = repBand(v), r = g.priority === 'lasting' ? 11 : g.priority === 'important' ? 8 : 5.5;
    h += '<g class="webdot ' + bd + '"><circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + r + '"/>' + (v == null && mode === 'seen' ? '<text x="' + p[0].toFixed(1) + '" y="' + (p[1] + 3.5).toFixed(1) + '" text-anchor="middle">?</text>' : '') + '<title>' + esc(g.text) + ' — ' + (mode === 'seen' ? (v == null ? 'no assessment looked at this' : 'your assessments would show it as ' + REP_BAND_WORD[bd]) : v == null ? 'not taught in any planned lesson yet' : REP_BAND_WORD[bd]) + '</title></g>'; }
  return h + '</svg>';
}

function repPrint(html, name) { const w = window.open('', '_blank'); if (!w) { download(name + '.html', html, 'text/html'); toast('Pop-ups are blocked, so the packet was downloaded. Open it and print from there.'); return; } w.document.open(); w.document.write(html); w.document.close(); w.focus(); setTimeout(() => { try { w.print(); } catch (e) { /* the user can print from the menu */ } }, 400); }
const repSummary = (c, L, G) => { const S = shares(L); return { active: S.active, together: S.together, high: S.high, hw: L.hw && L.hw.nights ? L.hw.avgNight : 0, days: L.days, serious: App.findings.filter((f) => f.sev >= 2).length, grades: G ? G.areas.map((a) => a.grade) : [] }; };

VIEWS.report = {
  name: 'Report', wide: true,
  render(c) {
    const L = courseLabel(c), G = typeof gradeCourse === 'function' ? gradeCourse(c, App.findings) : null, hasSim = typeof simulate === 'function';
    /* The simulated class stops on the last day that has a lesson, so unplanned months do not read as forgetting. */
    let sim = null; if (hasSim && c.goals.length) { try { const ds = courseDays(c); let last = -1; ds.forEach((d) => { if (d.lesson) last = d.i; }); sim = simulate(c, { seed: 7, until: last >= 0 ? last : 0 }); } catch (e) { console.error(e); } }
    const planned = c.units.filter((u) => unitLessons(c, u.id).length), ru = unitOf(c, App.rep.unit) && planned.includes(unitOf(c, App.rep.unit)) ? unitOf(c, App.rep.unit) : planned[0] || null;
    const now = repSummary(c, L, G), pc = (v) => Math.round(v * 100) + '%';
    const head = '<div class="ws-head"><div class="eyebrow">Chapter 8</div><h1>Your course, read back to you</h1><p>This is what an observer would report after sitting in on everything you have planned so far: ' + plural(L.days, 'class day') + ' of ' + L.available + '. It measures the plan, not the room, and it compares the plan with what you said you wanted.</p></div>';
    const grades = G ? '<div class="panel"><h2>Report card <small>' + Math.round(G.built * 100) + '% of the course is built. A dash means there is not enough yet to judge.</small></h2><div class="gradegrid">' + G.areas.map((a) => '<button class="gradebox" data-act="repArea" data-arg="' + a.id + '"><span class="lbl">' + a.name + '</span><b class="' + (a.score == null ? 'na' : a.score >= 90 ? 'good' : a.score < 70 ? 'bad' : '') + '">' + a.grade + '</b><span class="hint">' + esc(a.summary) + '</span></button>').join('') + '</div></div>' : '';
    const fp = '<div class="panel"><h2>Fingerprint <small>One ring per unit, first unit at the centre</small></h2><div class="fpwrap">' + fingerprintSVG(c, 380) + '<div class="stack"><p class="fpread">' + esc(fingerprintReading(c, L)) + '</p><div class="legend">' + FAMILIES.map((f) => '<span><i class="dot" style="background:' + f.color + '"></i>' + f.short + '</span>').join('') + '</div><p class="hint">Color is what students are doing. A thicker ring means more of the time asks for strategic or extended thinking. Black dots are major assessments. Dashed rings are units with no lessons yet.</p></div></div></div>';
    const labels = '<div class="grid2 labels"><div class="stack"><div class="sec-h">The whole course</div>' + labelHTML(L, { title: c.title, c, scope: 'course', serving: plural(L.days, 'class period') + ' planned of ' + L.available }) + '</div><div class="stack"><div class="sec-h">One unit ' + (planned.length > 1 ? '<span style="width:230px">' + pick('rep::unit', planned.map((u) => [u.id, u.title]), ru.id) + '</span>' : '') + '</div>' + (ru ? labelHTML(unitLabel(c, ru.id), { title: ru.title, c, scope: 'unit', serving: plural(plannedDays(c, ru.id), 'class period') + ' planned of ' + ru.days }) : empty('No unit has lessons yet.', '<button class="btn" data-act="go" data-arg="lessons">Plan a lesson</button>')) + '</div></div>';
    const web = '<div class="panel"><h2>The web of ideas <small>A simulated class of ' + (sim ? sim.students.length : c.school.classSize) + ' lives through what you have planned</small></h2>' + (sim ?
      '<div class="row wrap">' + seg('rep::web', [['now', 'On the last planned day'], ['later', 'Eight weeks later'], ['seen', 'What your assessments would show']], App.rep.web) + '<span class="legend"><span><i class="wkey strong"></i>holding</span><span><i class="wkey partial"></i>shaky</span><span><i class="wkey faint"></i>mostly gone</span><span><i class="wkey none"></i>never taught or never seen</span></span></div>' +
      '<div class="webwrap">' + webSVG(c, sim) + '</div><p class="hint">Each dot is a goal; bigger dots are the lasting ones. A line joins a goal to one it builds on, and it is solid when students can connect the two. Facts that stay unconnected fade first.</p>' +
      (sim.notes && sim.notes.length ? '<div class="stack">' + sim.notes.map((n) => '<div class="simnote">' + esc(n) + '</div>').join('') + '</div>' : '') +
      '<div class="row wrap"><button class="btn sm" data-act="repStress">Stress-test the year</button><span class="hint">Takes away the days a real year loses and runs it again.</span></div>' +
      (App.rep.stress ? '<div class="card"><b>' + plural(App.rep.stress.lost.length, 'day') + ' lost: ' + esc(App.rep.stress.lost.slice(0, 8).map((d) => (d.date ? niceDate(d.date) + ' ' : '') + d.what).join(', ')) + (App.rep.stress.lost.length > 8 ? ' and more' : '') + '.</b>' + (App.rep.stress.notes || []).map((n) => '<span class="hint">' + esc(n) + '</span>').join('') + '</div>' : '') +
      '<details><summary>What this simulation assumes, and what it cannot know</summary><ul class="assume">' + (sim.assumptions || []).map((a) => '<li>' + esc(a.text) + '</li>').join('') + '<li>It is an illustration of well-established findings about practice, feedback and forgetting. It is not a forecast of your students.</li></ul></details>' : '<p class="hint">Add some goals and the simulation will have something to follow.</p>') + '</div>';
    const byArea = {}; App.findings.forEach((f) => (byArea[f.area] = byArea[f.area] || []).push(f));
    const checks = '<div class="panel" id="rep-checks"><h2>Every check <small>' + (App.findings.length ? App.findings.length + ' things to look at. Click one to go there.' : 'Nothing flagged') + '</small></h2>' + (App.findings.length ? (G ? G.areas : []).filter((a) => byArea[a.id]).map((a) => '<div class="stack" style="gap:0"><span class="lbl" id="rep-' + a.id + '">' + a.name + '</span>' + byArea[a.id].map((f) => '<button class="finding s' + f.sev + '" data-act="jump" data-arg="' + esc(JSON.stringify(f.where)) + '"><b>' + esc(f.text) + '</b><span>' + esc(f.why || '') + (f.source ? ' <i>' + esc(f.source) + '</i>' : '') + '</span></button>').join('') + '</div>').join('') : '<p class="hint">Either the design is sound or there is not enough of it yet to check.</p>') + '</div>';
    const snaps = '<div class="panel"><h2>Teach it twice <small>Save where you are, change the design, and compare</small></h2>' + (c.snaps.length ? '<div class="scrollx"><table class="tbl"><tr><th>Version</th><th>Days planned</th><th>Students active</th><th>Pairs or groups</th><th>Higher thinking</th><th>Homework a night</th><th>To fix</th><th>Grades</th><th></th></tr>' +
      c.snaps.map((s, k) => '<tr><td><b>' + esc(s.name) + '</b></td><td>' + s.days + '</td><td>' + pc(s.active) + '</td><td>' + pc(s.together) + '</td><td>' + pc(s.high) + '</td><td>' + Math.round(s.hw) + ' min</td><td>' + s.serious + '</td><td>' + s.grades.join(' ') + '</td><td><button class="x" data-act="repSnapDel" data-arg="' + k + '" aria-label="Remove this version">×</button></td></tr>').join('') +
      '<tr class="now"><td><b>Now</b></td><td>' + now.days + '</td><td>' + pc(now.active) + '</td><td>' + pc(now.together) + '</td><td>' + pc(now.high) + '</td><td>' + Math.round(now.hw) + ' min</td><td>' + now.serious + '</td><td>' + now.grades.join(' ') + '</td><td></td></tr></table></div>' : '<p class="hint">A real teacher gets one try at a year. Here you can save a version, redesign, and see the two side by side.</p>') + '<div class="row"><button class="btn sm" data-act="repSnap">Save this version</button></div></div>';
    const docs = typeof DOCS !== 'undefined' ? '<div class="panel"><h2>Take it with you <small>Everything you built, as documents</small></h2><div class="row wrap"><button class="btn pri" data-act="repPacket">Print the whole packet or save it as PDF</button><button class="btn" data-act="repWord">Download for Word or Google Docs</button><button class="btn" data-act="repMd">Download as Markdown</button><button class="btn" data-act="saveFile">Save the course file</button></div><div class="doclist">' + DOCS.map((d) => '<button class="card" data-act="repDoc" data-arg="' + d.id + '"><b>' + esc(d.name) + '</b><span class="hint">' + esc(d.does || 'Open and print') + '</span></button>').join('') + '</div></div>' : '';
    const ban = typeof bannersHTML === 'function' ? bannersHTML(c) : '';
    return '<div class="ws report">' + head + grades + '<div class="grid2 fprow">' + fp + ban + '</div>' + labels + web + checks + snaps + docs + '</div>';
  },
};
ACT.repArea = (a) => { const el = $('rep-' + a) || $('rep-checks'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return false; };
ACT.repStress = (a, c) => { try { App.rep.stress = stressTest(c, { seed: (Date.now() / 1000) | 0 }); } catch (e) { toast('The stress test could not run on this course yet.'); } };
ACT.repSnap = (a, c) => { const L = courseLabel(c), G = typeof gradeCourse === 'function' ? gradeCourse(c, App.findings) : null, s = repSummary(c, L, G); s.name = 'Version ' + (c.snaps.length + 1); c.snaps.push(s); if (c.snaps.length > 8) c.snaps.shift(); toast('Saved. Change the design and come back to compare.'); };
ACT.repSnapDel = (a, c) => { c.snaps.splice(+a, 1); };
ACT.repPacket = (a, c) => { repPrint(packetHTML(c, []), courseFileName(c, '').replace(/\.$/, '') || 'course-packet'); return false; };
ACT.repDoc = (a, c) => { repPrint(packetHTML(c, [a]), a); return false; };
ACT.repWord = (a, c) => { download(courseFileName(c, 'doc'), packetHTML(c, []), 'application/msword'); return false; };
ACT.repMd = (a, c) => { download(courseFileName(c, 'md'), courseMarkdown(c), 'text/markdown'); return false; };
