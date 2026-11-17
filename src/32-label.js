/* The Learning Facts label, as an HTML string. Works for one lesson, a unit or a whole course; for the last two it shows an average class period. */
function labelHTML(L, o) {
  o = o || {}; const c = o.c, per = L.days || 1, avg = (v) => v / per, S = shares(L), tot = L.total || 1;
  const f1 = (v) => (v < 9.95 && v % 1 > 0.04 && v % 1 < 0.96 ? v.toFixed(1) : String(Math.round(v)));
  const pc = (v) => Math.round(v * 100) + '%';
  const split = (obj, table, base) => { const b = base || sum(Object.values(obj)) || 1; return table.filter((t) => (obj[t[0]] || 0) / b >= 0.005).map((t) => '<span>' + esc(String(t[1]).toLowerCase()) + ' <b>' + pc((obj[t[0]] || 0) / b) + '</b></span>').join(' · ') || '<span>none yet</span>'; };
  const line = (k, v, cls) => '<div class="lf-row' + (cls ? ' ' + cls : '') + '"><span>' + k + '</span><span>' + v + '</span></div>';
  const one = o.scope === 'lesson' || !o.scope;
  let h = '<div class="lf"><div class="lf-title">Learning Facts</div><div class="lf-name">' + esc(o.title || '') + '</div><div class="lf-serv">' + esc(o.serving || (one ? '1 class period (' + L.period + ' min)' : plural(per, 'class period') + ' planned')) + '</div><div class="lf-bar"></div>';
  if (!L.total) return h + '<div class="lf-empty">Nothing planned yet. Add a block and this fills in.</div></div>';
  if (one) {
    h += line('Blocks add up to', '<b>' + f1(L.planned) + ' min</b>') + line('Likely to run <i>with setup and moving</i>', '<b>' + f1(L.total) + ' min</b>') +
      line(L.over > 0.5 ? 'Past the bell by' : 'Spare before the bell', '<b>' + f1(Math.abs(L.over)) + ' min</b>', L.over > 0.5 ? 'bad' : '');
  } else {
    h += line('Average period likely to run', '<b>' + f1(avg(L.total)) + ' of ' + L.period + ' min</b>') + line('Days likely to run past the bell', '<b>' + (L.overDays || 0) + ' of ' + per + '</b>', L.overDays ? 'bad' : '');
  }
  h += '<div class="lf-bar mid"></div><div class="lf-head"><span>What students are doing' + (one ? '' : ' <i>in an average period</i>') + '</span><span>min</span><span>share</span></div>';
  for (const F of FAMILIES) { const v = L.fam[F.id] || 0; h += '<div class="lf-fam' + (v < 0.05 ? ' zero' : '') + '"><span><i style="background:' + F.color + '"></i>' + F.name + '</span><span>' + f1(avg(v)) + '</span><span>' + pc(v / tot) + '</span><em style="width:' + (100 * v / tot).toFixed(1) + '%;background:' + F.color + '"></em></div>'; }
  h += '<div class="lf-bar mid"></div>';
  const ic = [['P', 'taking it in', '#5d6f89'], ['A', 'working with it', '#1d7d74'], ['C', 'creating', '#e8952f'], ['I', 'building with others', '#c53e6b'], ['N', 'neither', '#b9b2a3']];
  h += '<div class="lf-stack">' + ic.map((x) => '<i style="width:' + (100 * L.icap[x[0]] / tot).toFixed(1) + '%;background:' + x[2] + '" title="' + x[1] + '"></i>').join('') + '</div>';
  h += '<div class="lf-mix">' + ic.filter((x) => L.icap[x[0]] / tot >= 0.005).map((x) => '<span><i style="background:' + x[2] + '"></i>' + x[1] + ' <b>' + pc(L.icap[x[0]] / tot) + '</b></span>').join('') + '</div>';
  h += '<div class="lf-note"><b>Who does the thinking</b> ' + split(L.thinker, THINKERS) + '</div>';
  h += '<div class="lf-note"><b>Students work</b> ' + split(L.group, GROUPINGS) + '</div>';
  h += '<div class="lf-note"><b>Purpose</b> ' + split(L.purpose, PURPOSES.filter((p) => p[0] !== 'N'), (L.purpose.A || 0) + (L.purpose.M || 0) + (L.purpose.T || 0)) + '</div>';
  h += '<div class="lf-note"><b>Thinking level</b> ' + split(L.level, LEVELS) + '</div><div class="lf-bar thin"></div>';
  h += line('Students show what they know', '<b>' + f1(avg(L.show)) + ' min</b>') + line('<i>and get feedback while they can still use it</i>', '<b>' + f1(avg(L.fbNow)) + ' min</b>') +
    line('A typical student speaks for', '<b>' + (avg(L.talk) < 1 ? Math.round(avg(L.talk) * 60) + ' sec' : f1(avg(L.talk)) + ' min') + '</b>') +
    line('Longest stretch in one mode', '<b>' + f1(L.stretch.min) + ' min</b> <i>' + FAMILY_BY[L.stretch.fam].short.toLowerCase() + '</i>') +
    line('Earlier learning brought back from memory', '<b>' + (one ? plural(L.retr, 'time') : f1(L.retr) + ' times in ' + per + ' periods') + '</b>');
  if (L.orphan > 0.5) h += line('Learning time tied to no goal', '<b>' + f1(avg(L.orphan)) + ' min</b>', 'warn');
  if (L.hw) {
    h += '<div class="lf-bar mid"></div><div class="lf-head"><span>Homework</span><span></span><span></span></div>';
    h += L.hw.nights ? line('Set after', '<b>' + L.hw.nights + ' of ' + plural(L.hw.days, 'class day') + '</b>') + line(L.hw.gap > 1 ? 'A night, spread over the ' + L.hw.gap + ' nights before the next class' : 'On those nights', '<b>' + f1(L.hw.avgNight) + ' min</b> <i>longest ' + f1(L.hw.max) + '</i>') +
      '<div class="lf-note"><b>What it is for</b> ' + split(L.hw.purpose, HW_PURPOSES) + '</div>' + line('Needs a device or internet', '<b>' + pc(L.hw.device / (L.hw.total || 1)) + '</b>') : '<div class="lf-note">None set.</div>';
  }
  if (c) {
    const I = c.intent, rows = [['Students active', S.active, I.active / 100, true], ['Working in pairs or groups', S.together, I.together / 100, true], ['Strategic or extended thinking', S.high, I.high / 100, true]];
    h += '<div class="lf-bar"></div><div class="lf-head"><span>Against your intent</span><span>you want</span><span>this is</span></div>';
    /* Within five points of the aim counts as met, the same allowance the checks use. */
    for (const r of rows) h += '<div class="lf-int ' + (r[1] + 0.05 >= r[2] ? 'ok' : 'gap') + '"><span>' + r[0] + '</span><span>' + pc(r[2]) + '+</span><span>' + pc(r[1]) + '</span></div>';
    if (L.hw && L.hw.nights) h += '<div class="lf-int ' + (L.hw.max <= I.hw ? 'ok' : 'gap') + '"><span>Homework a night, at most</span><span>' + I.hw + ' min</span><span>' + f1(L.hw.max) + ' min</span></div>';
  }
  /* House expectations from a school profile, shown beside the teacher's own intent and never in place of it. */
  const E = c && c.profile && c.profile.expect, erows = E ? [['Students active', S.active, E.active, 1], ['Working in pairs or groups', S.together, E.together, 1], ['Strategic or extended thinking', S.high, E.high, 1]].filter((r) => r[2] != null) : [];
  if (E && (erows.length || (E.hw != null && L.hw && L.hw.nights))) {
    h += '<div class="lf-bar mid"></div><div class="lf-head"><span>Against your school\u2019s expectations</span><span>it asks</span><span>this is</span></div>';
    for (const r of erows) h += '<div class="lf-int ' + (r[1] + 0.05 >= r[2] / 100 ? 'ok' : 'gap') + '"><span>' + r[0] + '</span><span>' + r[2] + '%+</span><span>' + pc(r[1]) + '</span></div>';
    if (E.hw != null && L.hw && L.hw.nights) h += '<div class="lf-int ' + (L.hw.max <= E.hw ? 'ok' : 'gap') + '"><span>Homework a night, at most</span><span>' + E.hw + ' min</span><span>' + f1(L.hw.max) + ' min</span></div>';
  }
  return h + '<div class="lf-foot">This measures the plan, not the room. The shares follow how each block is described; change a block and they change.</div></div>';
}
