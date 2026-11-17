/* The simulated class. Plays the course day by day through a made-up class and reports what is likely to be remembered, connected
   and usable. This is an illustration built on well-established findings (research/03-learning-science-model.md), not a forecast of real
   students. The interface should show it as rough bands. No document, no window, no Math.random: all variation comes from hash(), seeded
   by opts.seed, so the same course and seed always give the same picture.

   simulate(c, opts) -> {
     students: [{ id, name, traits: { prior, pace, attend, hw, speaks, device } }],       traits are 0..1 except speaks and device (true/false)
     goals:    { goalId: { recall, linked, use, seen, low, high, later: { recall, linked, use } } },
        class means at the end of the span. low and high are the 10th and 90th percentile of recall across students.
        seen is what the teacher's assessments would have shown (null if nothing assessed the goal). later is the projection
        opts.weeksAfter weeks past the last day with no further teaching.
     links:    [{ from, to, strength }]  one per `after` link (from = the goal built on, to = the goal that builds on it), 0..1
     days:     [{ i, recall, linked, use }]  class mean over all goals met so far, one entry per class day
     byStudent:[{ id, recall, linked, use }]  each student's mean over the goals taught
     notes:    [string]  at most six plain observations, most important first, each tied to something the teacher can change
     assumptions: [{ id, text }]  the main assumptions, in plain words
   }
   opts: { seed (default 1), n (class size), lost: [day indexes cancelled], until: last day index to play, weeksAfter (default 8) }
   stressTest(c, opts) -> { lost: [{ i, date, what }], result, base, hit: [{ unit, title, lost, days }], notes }

   State per student per goal, all 0..1:
     met     has met the idea
     recall  can bring it back from memory now
     stable  how slowly that recall fades (grows with spaced, successful retrieval)
     linked  understands how it connects to the goals it builds on and that build on it
     use     can use it in a new situation
   Plus per student per day: attention, and a carry-over tiredness from heavy homework nights.

   The rules (number, source, confidence: WE well established, MS moderately supported, PA plausible assumption) are listed in SIM_RULES
   and marked R1..R23 where they act below. */

const SIM_RULES = [
  [1, 'Taught input builds recall, with diminishing returns', 'Rosenshine 2012; Dunlosky 2013', 'MS'],
  [2, 'Prior knowledge scales how much a lesson lands', 'NRC 2000; Rosenshine 2012', 'MS'],
  [3, 'Small steps with a check after each beat long unbroken input', 'Rosenshine 2012', 'MS'],
  [4, 'Making and discussing with no input gives a small, capped gain to novices', 'Kirschner, Sweller and Clark 2006', 'MS'],
  [5, 'A stretch with no chance to respond lowers attention a little, with no fixed minute mark', 'Wilson and Korn 2007; Rowe 1986', 'PA'],
  [6, 'When only volunteers answer, quiet students respond far less', 'Rosenshine 2012 (no verified rates)', 'PA'],
  [7, 'Bringing an idea back from memory beats hearing it again', 'Dunlosky 2013; IES guide 2007; Roediger 2011', 'WE'],
  [8, 'Retrieval helps more with feedback now than later or never', 'Hattie and Timperley 2007; Kluger and DeNisi 1996', 'MS'],
  [9, 'Practice before the idea is understood gains little', 'Rosenshine 2012', 'MS'],
  [10, 'Memory lasts longer when retrieval is spaced; same-day repeats add little', 'Cepeda 2008; IES guide 2007', 'WE'],
  [11, 'Recall fades with time; the rate is set by how stable it has become', 'Cepeda 2008; IES guide 2007', 'MS'],
  [12, 'Connections grow mainly through make-meaning and transfer work at level 2 and above', 'IES guide 2007 (deep questions); Dunlosky 2013', 'MS'],
  [13, 'Connections to earlier goals form only if those goals are held', 'NRC 2000; Rosenshine 2012', 'MS'],
  [14, 'Group and discussion work helps only the students who take part unless each one is accountable', 'Slavin 1995; Johnson and Johnson 2009', 'MS'],
  [15, 'Using an idea in a new situation grows only through transfer work and needs the connections', 'Barnett and Ceci 2002; Perkins and Salomon', 'MS'],
  [16, 'Skills reach near use through practice with success', 'Barnett and Ceci 2002 (near transfer)', 'MS'],
  [17, 'Homework completion falls as nights lengthen and when a device is needed', 'Assumption; no verified figures', 'PA'],
  [18, 'Practice and review homework acts as spaced retrieval; benefit flattens as time grows', 'IES guide 2007; Cooper, Robinson and Patall 2006', 'MS'],
  [19, 'Heavy nights carry over as tiredness and lower next-day attention', 'Galloway et al. 2013', 'PA'],
  [20, 'Taking an assessment is itself a retrieval event', 'Roediger 2011; IES guide 2007', 'WE'],
  [21, 'Studying the night before lifts recall for the test but adds little lasting memory', 'Cepeda 2008; Dunlosky 2013', 'MS'],
  [22, 'An assessment sees only the state its method and level can detect', 'Stiggins and Chappuis; Webb levels', 'MS'],
  [23, 'Absent students miss that day and are otherwise like the rest', 'Assumption', 'PA'],
];

const SIM_NAMES = ['Amara', 'Mateo', 'Linh', 'Priya', 'Jamal', 'Sofia', 'Kenji', 'Nadia', 'Tomasz', 'Imani', 'Diego', 'Hana', 'Omar', 'Chloe', 'Rafael', 'Yara', 'Dmitri', 'Aisha', 'Lucas', 'Mei', 'Zainab', 'Callum', 'Ximena', 'Kofi', 'Freya', 'Arjun', 'Noor', 'Elena', 'Tyrese', 'Sakura', 'Idris', 'Marisol', 'Anders', 'Fatima', 'Joaquin', 'Thandi', 'Bao', 'Ingrid', 'Samir', 'Leilani', 'Cormac', 'Soraya', 'Emeka', 'Pilar', 'Haruto', 'Beatrix', 'Dev', 'Nia'];
const SIM_OTHER_HW = 60;   // minutes a night the student gets from other classes: an assumption, steady for everyone

const SIM_ASSUMPTIONS = [
  { id: 'picture', text: 'This is an illustration built on well-established findings about memory and learning. It is not a forecast for real students.' },
  { id: 'class', text: 'The class is made up. Names and traits are invented, and the traits are set by chance within plausible ranges.' },
  { id: 'plan', text: 'The model reads your plan, not your teaching. It cannot see how clearly you explain or what questions you ask.' },
  { id: 'fade', text: 'How fast memory fades, and how much spacing slows the fading, are rough settings. They are not measurements of any real class.' },
  { id: 'attention', text: 'A stretch with no chance to respond lowers attention a little. No fixed number of minutes is assumed.' },
  { id: 'speak', text: 'How many students answer when only volunteers do, and how many take part in group work without a defined role, are guesses.' },
  { id: 'homework', text: 'Homework completion falling as nights get longer, or when a device is needed, is an assumption. So is a steady hour a night from other classes.' },
  { id: 'links', text: 'Connections between ideas grow mainly through discussion, explaining and new tasks, and only when the earlier idea is held.' },
  { id: 'use', text: 'Using an idea in a new situation is treated as hard. Far transfer is not claimed.' },
  { id: 'wrong', text: 'Wrong ideas are not tracked. The model follows whether an idea can be recalled, connected and used.' },
];

/* Seen-weights for an assessment: how much of recall, linked and use its method and level can detect (R22). */
function simDetect(a) {
  const lv = a.level || 2, m = a.method;
  let r, l, u;
  if (m === 'selected') { if (lv <= 1) { r = 1; l = 0; u = 0; } else if (lv === 2) { r = 0.8; l = 0.2; u = 0; } else { r = 0.6; l = 0.4; u = 0; } }
  else if (m === 'written') { if (lv <= 1) { r = 1; l = 0; u = 0; } else if (lv === 2) { r = 0.6; l = 0.3; u = 0.1; } else { r = 0.3; l = 0.5; u = 0.2; } }
  else if (m === 'performance') { if (lv <= 2) { r = 0.4; l = 0.3; u = 0.3; } else { r = 0.05; l = 0.45; u = 0.5; } }
  else { r = 0.3; l = 0.4; u = 0.3; }
  if ((a.targets || []).indexOf('skill') >= 0 && u < 0.5) { const sh = Math.min(r, 0.3); r -= sh; u += sh; }
  return [r, l, u];
}

function simShort(t) {
  t = String(t || 'a goal').replace(/\s+/g, ' ').trim();
  if (t.length <= 48) return '"' + t + '"';
  const cut = t.slice(0, 48), sp = cut.lastIndexOf(' ');
  return '"' + (sp > 24 ? cut.slice(0, sp) : cut) + '..."';
}

/* A made-up class. Traits are drawn from hash() so the same seed gives the same students. */
function simStudents(n, seed) {
  const out = [], start = Math.floor(hash(seed, 1, 99) * SIM_NAMES.length);
  for (let i = 0; i < n; i++) {
    const base = SIM_NAMES[(start + i * 7) % SIM_NAMES.length], round = Math.floor(i / SIM_NAMES.length);
    const h = (k) => hash(seed, i + 1, k);
    out.push({ id: 's' + (i + 1), name: round ? base + ' ' + String.fromCharCode(65 + round) : base, traits: {
      prior: Math.round((0.1 + 0.6 * h(11)) * 100) / 100,          // what they already knew coming in
      pace: Math.round((0.75 + 0.5 * h(12)) * 100) / 100,          // how quickly new things land
      attend: Math.round((0.88 + 0.11 * h(13)) * 100) / 100,       // share of days present
      hw: Math.round((0.3 + 0.68 * Math.pow(h(14), 0.7)) * 100) / 100,   // how reliably they do homework
      speaks: h(15) < 0.4,                                         // speaks up when only volunteers answer
      device: h(16) > 0.1,                                         // has a device at home
    } });
  }
  return out;
}

/* How much of a memory is left after `gap` days (R11). Stability stretches the time scale; understanding outlasts detail. */
/* R11 (moderately supported): isolated recall fades on a time scale that stretches with stability. R11b (plausible assumption):
   connected understanding and use fade far more slowly, and being connected puts a floor under recall (an idea that fits into others is
   easier to rebuild). The rates are rough settings chosen so a fact heard once is mostly gone in two months while a well-connected idea
   mostly stays (Cepeda 2008, IES guide 2007 for the direction; NRC 2000 for the protective role of connections). */
const simTau = (st) => 28 + 170 * st * st;
const simTauL = (tau) => 150 + 3 * tau, simTauU = (tau) => 120 + 2.5 * tau, SIM_FLOOR = 0.6;
function simFade(r, l, u, st, gap, out) {
  const tau = simTau(st), l2 = l * Math.exp(-gap / simTauL(tau)); let r2 = r * Math.exp(-gap / (tau * (1 + 1.0 * l)));   // connected ideas are slower to fade
  const fl = Math.min(r, SIM_FLOOR * l2); if (r2 < fl) r2 = fl;
  out[0] = r2; out[1] = l2; out[2] = u * Math.exp(-gap / simTauU(tau));
}

function simulate(c, opts) {
  opts = opts || {};
  const seed = opts.seed == null ? 1 : opts.seed | 0, S = opts.n || (c.school && c.school.classSize) || 18, G = c.goals.length;
  const weeks = opts.weeksAfter == null ? 8 : opts.weeksAfter, lostSet = new Set(opts.lost || []), until = opts.until == null ? 1e9 : opts.until;
  const students = simStudents(S, seed), N = S * G;
  const gIdx = {}; c.goals.forEach((g, i) => (gIdx[g.id] = i));
  const pre = c.goals.map((g) => (g.after || []).map((a) => gIdx[a]).filter((x) => x != null));
  const gSkill = c.goals.map((g) => g.kind === 'skill');
  const prior = new Float64Array(S), pace = new Float64Array(S), attend = new Float64Array(S), hwRel = new Float64Array(S), speaks = new Float64Array(S), device = new Float64Array(S);
  students.forEach((s, i) => { const t = s.traits; prior[i] = t.prior; pace[i] = t.pace; attend[i] = t.attend; hwRel[i] = t.hw; speaks[i] = t.speaks ? 1 : 0; device[i] = t.device ? 1 : 0; });
  const met = new Float64Array(N), rec = new Float64Array(N), stab = new Float64Array(N), lnk = new Float64Array(N), use = new Float64Array(N), last = new Float64Array(N).fill(-1e9), pg = new Float64Array(N);
  for (let s = 0; s < S; s++) for (let g = 0; g < G; g++) pg[s * G + g] = clamp(prior[s] + (hash(seed, s * 131 + g, 7) - 0.5) * 0.3, 0, 1);
  const inMin = new Float64Array(G), actMin = new Float64Array(G), seenSum = new Float64Array(G), seenN = new Float64Array(G), taughtDays = new Float64Array(G);
  const fat = new Float64Array(S), pres = new Float64Array(S), att = new Float64Array(S);
  const hwDone = new Float64Array(S), hwAsk = new Float64Array(S);
  const gsR = new Float64Array(G), gsL = new Float64Array(G), gsU = new Float64Array(G), gsM = new Float64Array(G);
  const K = { input: 0, disc: 0, ret: 0, fbF: 1, lw: 0, uw: 0, check: 1, vol: false, grp: false, acct: true, passive: 0, resp: 0, fbNow: false, th: 'teacher' };
  const volBlocks = new Set(), cache = new Map(); let passiveMin = 0, learnMin = 0, hwNights = 0, hwMinSum = 0;

  const eff = (b) => { let e = cache.get(b); if (!e) { e = blockEff(b); cache.set(b, e); } return e; };
  const fbMap = { now: 1, later: 0.75, none: 0.5 };

  /* One learning event for one present student and one goal. dose and dR are how much teaching and how much retrieval it carries. */
  function apply(s, gi, dose, dR, a, t) {
    const ix = s * G + gi, pr = pg[ix], lrn = pace[s] * a, pf = 0.65 + 0.7 * pr;          // R2
    const gap = t - last[ix], spF = gap > 1e8 ? 0 : 0.25 + 0.75 * (1 - Math.exp(-gap / 6)), r0 = rec[ix];   // R10, massed repeats keep a small floor
    let touched = false;
    if (K.input > 0.12 && dose > 0) {                                                        // R1, R3
      const u = dose * K.input * K.check * pf * lrn;
      met[ix] = 1 - (1 - met[ix]) * (1 - Math.min(0.95, u * 1.5));
      rec[ix] += Math.min(1 - rec[ix], 0.55 * u);
      stab[ix] += (0.06 * u + (r0 > 0.2 ? 0.05 * spF * Math.min(u, 1) : 0)) * (1 - stab[ix]);  // understanding makes memory a little more durable; re-meeting it after a gap more so
      touched = true;
    } else if (K.disc > 0.05 && dose > 0) {                                                  // R4: no input, so small and capped
      const cap = 0.15 + 0.3 * pr + (K.fbNow ? 0.1 : 0), u = dose * K.disc * 0.25 * pf * lrn * (K.th === 'shared' ? 1.3 : 1);
      if (rec[ix] < cap) { rec[ix] += Math.min(cap - rec[ix], 0.5 * u * (1 - rec[ix])); met[ix] = Math.max(met[ix], Math.min(0.5, 1 - (1 - met[ix]) * (1 - u))); touched = true; /* never fully met */ }
    }
    if (K.ret > 0 && dR > 0 && met[ix] > 0.1) {                                              // R7 to R10
      const p = rec[ix], rr = K.ret * (K.vol ? (speaks[s] ? 1 : 0.25) : 1), w = rr * dR * K.fbF * lrn;   // R6, R8
      rec[ix] += Math.min(1 - rec[ix], 0.55 * w * (0.2 + 0.8 * p));                          // R9: success matters
      stab[ix] += 0.45 * rr * dR * (0.3 + 0.7 * p) * spF * K.fbF * a * (1 - stab[ix]);
      if (gSkill[gi]) use[ix] += 0.4 * w * (0.2 + 0.8 * p) * (1 - use[ix]);                  // R16
      touched = true;
    }
    if (K.lw > 0 && dose > 0 && met[ix] > 0.2) {                                             // R12, R13, R14
      const pl = pre[gi]; let H;
      if (!pl.length) H = 0.55 + 0.4 * pr; else { let h = 0; for (let k = 0; k < pl.length; k++) h += rec[s * G + pl[k]]; H = 0.9 * h / pl.length + 0.1 * pr; }
      const part = K.vol ? 0.65 + 0.35 * speaks[s] : K.grp && !K.acct ? 0.85 + 0.15 * speaks[s] : 1;
      const gL = 0.6 * dose * K.lw * H * Math.min(1, rec[ix] * 1.6) * met[ix] * part * lrn * (1 - lnk[ix]);
      lnk[ix] += gL;
      for (let k = 0; k < pl.length; k++) { const jx = s * G + pl[k]; if (rec[jx] > 0.3) lnk[jx] += 0.35 * gL * (1 - lnk[jx]); }   // the older idea gains a link too
      touched = true;
    }
    if (K.uw > 0 && dose > 0 && met[ix] > 0.2) {                                             // R15
      const part = 1;
      use[ix] += 0.4 * dose * K.uw * lnk[ix] * (0.3 + 0.7 * rec[ix]) * met[ix] * part * lrn * (1 - use[ix]);
    }
    const capU = 0.9 * lnk[ix] + (gSkill[gi] ? 0.9 * rec[ix] : 0);
    if (use[ix] > capU) use[ix] = capU;
    if (rec[ix] > 1) rec[ix] = 1; if (lnk[ix] > 1) lnk[ix] = 1; if (stab[ix] > 1) stab[ix] = 1; if (use[ix] > 1) use[ix] = 1;
    if (touched) last[ix] = t;
  }

  /* Reads a block's move into the shared parameters K. Returns false for routine blocks. */
  function readBlock(e, blk) {
    if (e.pu === 'N') return false;
    const m = e.mix, g = (k) => m[k] || 0;
    const tk = g('listen') + g('watch'), notes = g('notes'), rd = g('read'), pr = g('practice') + g('skill') + g('speak'), ds = g('qa') + g('discuss') + g('pair'), dead = g('admin') + g('wait');
    const retr = e.retr && blk.min >= 3;                                                    // the observer counts a retrieval block only from 3 minutes
    const tkW = e.th === 'teacher' ? 1 : e.th === 'shared' ? 0.8 : 0.35;                  // listening to peers brings less new input
    const nW = e.th === 'together' ? 0.15 : 1;                                             // reading peers' posted work or notes in a group is not new input
    /* R1b: a move that is not input is never treated as input. Review games and warm-ups bring back what was taught; they teach nothing new. */
    K.input = retr ? 0 : clamp(tk * tkW * (e.th === 'together' ? 0.4 : 1) + (0.8 * notes + 0.7 * rd) * nW + (e.th === 'teacher' || e.th === 'shared' ? 0.35 * (pr + ds) : 0), 0, 1);
    K.disc = retr ? 0 : clamp(1 - tk - notes - rd - dead, 0, 1);
    K.check = 0.7 + 0.3 * Math.min(1, e.show * 3);                                        // R3
    const raw = (e.show + 0.35 * pr) * (retr ? 1.25 : 1);
    K.ret = blk.assess || raw <= 0 ? 0 : Math.min(1, 0.15 + 0.85 * raw);                   // a little response still counts for something, but switches do not swing it wildly
    K.fbF = fbMap[e.fb] || 0.5; K.fbNow = e.fb === 'now'; K.th = e.th; K.retr = retr;
    /* R12b: take-in-and-practise at level 2 or above builds some connection when students work with the idea in the block
       (answer, finish steps, get a response from the teacher), and much less when they only listen. Moderately supported (Rosenshine 2012; Kirschner et al. 2006; IES guide R7). */
    const work = !!e.think || (e.th !== 'teacher' && e.show >= 0.2 && e.fb === 'now' && g('assess') < 0.5);
    const act = clamp(1 - tk, 0, 1), lvF = e.lv <= 1 ? 0.2 : e.lv === 2 ? 0.6 : 1, puW = e.pu === 'M' ? 0.4 : e.pu === 'T' ? 0.4 : work ? 0.36 : 0.15;
    K.lw = retr ? 0 : lvF * puW * (e.pu === 'A' ? (work ? Math.max(act, 0.6) : 1) : act);
    K.uw = e.pu === 'T' ? (e.lv >= 3 ? 1 : 0.6) * act : 0;
    K.vol = e.g === 'class' && !e.think && g('qa') + g('discuss') > 0.05 && e.th !== 'teacher';
    K.volNote = K.vol && g('qa') >= 0.05 && g('discuss') < g('qa');                       // seminars and discussions are exempt from the note
    K.grp = e.g === 'group' || e.g === 'pair'; K.acct = e.show >= 0.25 || !!e.think;
    K.passive = tk; K.resp = clamp(e.show * 1.6 + e.talk + 0.5 * pr, 0, 1);
    return true;
  }

  const fo = new Float64Array(3);
  function forget(gap) {                                                                   // R11
    for (let ix = 0; ix < N; ix++) {
      if (met[ix] <= 0) continue;
      simFade(rec[ix], lnk[ix], use[ix], stab[ix], gap, fo);
      rec[ix] = fo[0]; lnk[ix] = fo[1]; use[ix] = fo[2];
    }
  }

  const days = courseDays(c), dayOut = [], dayMs = 86400000;
  let prevT = null, endT = 0;
  for (let di = 0; di < days.length; di++) {
    const d = days[di]; if (d.i > until) break;
    let t = d.date ? Math.round(dateOf(d.date).getTime() / dayMs) : prevT == null ? 0 : prevT + 1;
    if (prevT != null && t <= prevT) t = prevT + 1;
    if (prevT != null) forget(t - prevT);
    prevT = t; endT = t;
    const teach = !lostSet.has(d.i) && d.lesson;
    if (teach) {
      for (let s = 0; s < S; s++) { pres[s] = hash(seed, s + 1000, d.i) < attend[s] ? 1 : 0; att[s] = (0.8 + 0.2 * hash(seed, s + 2000, d.i)) * (1 - 0.25 * fat[s]); }   // R23, R19
      for (const blk of d.lesson.blocks) {
        const e = eff(blk), gl = (blk.goals || []).map((x) => gIdx[x]).filter((x) => x != null), a = blk.assess ? assessOf(c, blk.assess) : null;
        if (!readBlock(e, blk)) continue;
        const em = blk.min * (1 - (e.mix.admin || 0) - (e.mix.wait || 0));
        if (gl.length) {
          if (K.passive > 0.5) passiveMin += blk.min; learnMin += blk.min;
          if (K.volNote && K.ret > 0) volBlocks.add(blk.id);
          { const lm = blk.min / gl.length; for (let k = 0; k < gl.length; k++) { if (K.input > 0.12) inMin[gl[k]] += lm; else if (!K.retr) actMin[gl[k]] += lm; } }
          const dose = Math.min(1.5, em / gl.length / 20), dR = Math.min(1, em / gl.length / 4);
          for (let k = 0; k < gl.length; k++) {
            taughtDays[gl[k]]++;
            for (let s = 0; s < S; s++) {
              if (!pres[s]) continue;
              const rs = K.vol ? K.resp * (speaks[s] ? 1 : 0.25) : K.resp;
              apply(s, gl[k], dose, dR, att[s] * (1 - 0.2 * K.passive * (1 - Math.min(1, rs * 2))), t);   // R5
            }
          }
        }
        if (a) simAssess(a, blk, t);
      }
      if (d.hw) doHomework(d, t); else for (let s = 0; s < S; s++) fat[s] *= 0.5;
    } else for (let s = 0; s < S; s++) fat[s] *= 0.5;
    /* a line for the little chart */
    gsR.fill(0); gsL.fill(0); gsU.fill(0); gsM.fill(0);
    for (let s = 0; s < S; s++) for (let g = 0, ix = s * G; g < G; g++, ix++) { gsM[g] += met[ix]; gsR[g] += rec[ix]; gsL[g] += lnk[ix]; gsU[g] += use[ix]; }
    let n = 0, r = 0, l = 0, u = 0;
    for (let g = 0; g < G; g++) if (gsM[g] / S > 0.05) { n++; r += gsR[g] / S; l += gsL[g] / S; u += gsU[g] / S; }
    dayOut.push({ i: d.i, recall: n ? r / n : 0, linked: n ? l / n : 0, use: n ? u / n : 0 });
  }

  /* R17 to R19: the night's homework. */
  function doHomework(d, t) {
    const h = d.hw, l = d.lesson; let gl = (h.goals || []).map((x) => gIdx[x]).filter((x) => x != null);
    if (!gl.length) { const seen = {}; for (const b of l.blocks) for (const x of b.goals || []) if (gIdx[x] != null && !seen[x]) { seen[x] = 1; gl.push(gIdx[x]); } }
    const mn = h.min, total = mn + SIM_OTHER_HW; hwNights++; hwMinSum += mn;
    const pRet = { practice: 0.7, review: 1, finish: 0.6, prepare: 0, extend: 0.2 }[h.purpose] || 0, kRet = { problems: 1, study: 0.8, reading: 0.15, writing: 0.4, watch: 0.1, project: 0.2 }[h.kind] || 0.3;
    const q = 1 / (1 + Math.max(0, total - 120) / 60);                                     // R18: benefit flattens past about two hours in all
    const dRaw = 1 - Math.exp(-mn / 25);
    K.input = (h.kind === 'reading' || h.kind === 'watch') ? (h.purpose === 'prepare' ? 0.5 : 0.3) : 0; K.disc = 0; K.check = 0.8;
    K.ret = pRet * kRet; K.fbF = { none: 0.5, check: 0.6, discussed: 1, scored: 0.8, comments: 1 }[h.fb] || 0.5; K.fbNow = false; K.th = 'alone';
    K.lw = (h.purpose === 'extend' ? 0.5 : 0) + (h.kind === 'writing' ? 0.15 : 0); K.uw = (h.purpose === 'extend' || h.kind === 'project') ? 0.45 : 0;
    K.vol = false; K.grp = false; K.acct = true;
    for (let s = 0; s < S; s++) {
      const rel = hwRel[s]; let p = rel - (1 - rel) * Math.max(0, (mn - 30) / 60) * 1.2;      // R17: those who struggle to finish struggle more as nights grow
      p += (hash(seed, s + 3000, d.i) - 0.5) * 0.16; if (h.device && !device[s]) p *= 0.7;
      p = clamp(p, 0.03, 1); hwAsk[s]++; hwDone[s] += p;
      const dose = dRaw * p * q / Math.max(1, gl.length * 0.7);
      const dRh = (1 - Math.exp(-mn / gl.length / 6)) * p * q;                              // a few minutes of questions per goal is a full retrieval
      for (let k = 0; k < gl.length; k++) apply(s, gl[k], dose, dRh, 0.9, t + 0.5);
      fat[s] = 0.5 * fat[s] + 0.5 * clamp((total - 100) / 120, 0, 1);                      // R19
    }
  }

  /* R20 to R22: an assessment carried by a block. */
  function simAssess(a, blk, t) {
    const gl = (a.goals || []).map((x) => gIdx[x]).filter((x) => x != null); if (!gl.length) return;
    const w = simDetect(a), fbF = ({ none: 0.5, score: 0.65, rubric: 0.85, comments: 0.9, conference: 1 }[a.fb] || 0.6) * (a.back > 3 ? 0.85 : 1);
    for (let s = 0; s < S; s++) {
      if (!pres[s]) continue;
      for (let k = 0; k < gl.length; k++) {
        const ix = s * G + gl[k];
        if (a.method === 'performance' && a.out > 0) {                                    // out-of-class making is transfer work
          K.input = 0; K.disc = 0; K.ret = 0; K.fbNow = false; K.th = 'alone'; K.check = 1; K.vol = false; K.grp = false; K.acct = true;
          K.lw = (a.level >= 3 ? 1 : 0.6) * 0.8; K.uw = a.level >= 3 ? 1 : 0.6;
          apply(s, gl[k], Math.min(1.5, a.out / 45) * hwRel[s], 0, 0.9, t - 0.5);
        } else if (a.out > 0 || a.kind === 'major') {                                    // R21: cramming is a bump, not lasting
          const cd = clamp((a.kind === 'major' ? 0.35 : 0) + (a.out || 0) / 90, 0, 1) * hwRel[s];
          if (met[ix] > 0.2) { rec[ix] += 0.5 * cd * (1 - rec[ix]); stab[ix] += 0.02 * cd * (1 - stab[ix]); }
        }
        const v = w[0] * rec[ix] + w[1] * lnk[ix] + w[2] * use[ix];
        seenSum[gl[k]] += v; seenN[gl[k]]++;
        K.input = 0; K.disc = 0; K.ret = 1; K.fbF = fbF; K.fbNow = false; K.lw = 0; K.uw = 0; K.vol = false; K.grp = false; K.acct = true;
        apply(s, gl[k], 0, 0.6, 0.9, t);                                                  // R20
      }
    }
  }

  /* ---------- results ---------- */
  const tmp = new Float64Array(S), later = weeks * 7, goals = {}, GR = new Float64Array(G), GL = new Float64Array(G), GU = new Float64Array(G), GM = new Float64Array(G);
  const lr = new Float64Array(G), ll = new Float64Array(G), lu = new Float64Array(G);
  for (let g = 0; g < G; g++) {
    for (let s = 0; s < S; s++) {
      const ix = s * G + g; GM[g] += met[ix]; GR[g] += rec[ix]; GL[g] += lnk[ix]; GU[g] += use[ix]; tmp[s] = rec[ix];
      simFade(rec[ix], lnk[ix], use[ix], stab[ix], later, fo); lr[g] += fo[0]; ll[g] += fo[1]; lu[g] += fo[2];
    }
    tmp.sort();
    const q = (f) => tmp[Math.min(S - 1, Math.max(0, Math.round(f * (S - 1))))];
    goals[c.goals[g].id] = { recall: GR[g] / S, linked: GL[g] / S, use: GU[g] / S, seen: seenN[g] ? seenSum[g] / seenN[g] : null, low: q(0.1), high: q(0.9), later: { recall: lr[g] / S, linked: ll[g] / S, use: lu[g] / S } };
  }
  const links = [];
  c.goals.forEach((g, gi) => pre[gi].forEach((pj) => links.push({ from: c.goals[pj].id, to: g.id, strength: Math.sqrt((GL[pj] / S) * (GL[gi] / S)) })));
  const byStudent = students.map((st, s) => {
    let n = 0, r = 0, l = 0, u = 0;
    for (let g = 0; g < G; g++) if (GM[g] / S > 0.05) { const ix = s * G + g; n++; r += rec[ix]; l += lnk[ix]; u += use[ix]; }
    return { id: st.id, recall: n ? r / n : 0, linked: n ? l / n : 0, use: n ? u / n : 0 };
  });

  /* ---------- plain observations, ranked ---------- */
  const cand = [], taught = [], untaught = [];
  c.goals.forEach((g, gi) => { if (GM[gi] / S > 0.15) taught.push(gi); else if (!taughtDays[gi]) untaught.push(gi); });
  if (untaught.length && days.some((d) => d.lesson)) cand.push([95, untaught.length === 1 ? 'The goal ' + simShort(c.goals[untaught[0]].text) + ' is not taught in any planned lesson yet. Add it to a block, or decide it is not needed.' : untaught.length + ' goals are not taught in any planned lesson yet, for example ' + simShort(c.goals[untaught[0]].text) + '. Add them to blocks, or decide they are not needed.']);
  { const act = c.goals.map((g, gi) => gi).filter((gi) => inMin[gi] + actMin[gi] >= 40 && inMin[gi] <= 0.2 * (inMin[gi] + actMin[gi]));
    if (act.length) cand.push([88, 'Most of the time on ' + simShort(c.goals[act[0]].text) + (act.length > 1 ? ' (and ' + (act.length - 1) + ' other goal' + (act.length > 2 ? 's' : '') + ')' : '') + ' is activity with little or no teaching of the idea itself. In this model, making, discussing or playing does not build knowledge students have not yet been given; a clear explanation first would probably help.']); }
  if (taught.length) {
    const weak = taught.filter((gi) => lr[gi] / S < 0.2 && ll[gi] / S < 0.25);
    if (weak.length >= Math.max(1, 0.3 * taught.length)) cand.push([90, (weak.length > taught.length / 2 ? 'Most of what is taught' : 'Some of what is taught') + ' is likely, in this model, to be mostly gone ' + weeks + ' weeks after teaching stops, with neither practice spread over time nor connections to hold it (' + weak.length + ' of ' + taught.length + ' goals). Short warm-up questions from memory, review homework in later weeks, and a block where students explain or compare are the usual remedies.']);
    const bridge = taught.filter((gi) => pre[gi].length && Math.sqrt((GL[gi] / S) * (GL[pre[gi][0]] / S)) < 0.25 && GR[pre[gi].reduce((b, x) => (GM[x] < GM[b] ? x : b), pre[gi][0])] / S < 0.3);
    if (bridge.length) { const gi = bridge[0], low = pre[gi].reduce((b, x) => (GR[x] < GR[b] ? x : b), pre[gi][0]); cand.push([85, simShort(c.goals[gi].text) + ' builds on ' + simShort(c.goals[low].text) + ', which students may not be holding by then, so in this model the link tends to stay weak. Teaching or revisiting the earlier idea first would probably help.']); }
    const lone = taught.filter((gi) => (c.goals[gi].kind === 'understanding' || c.goals[gi].priority === 'lasting') && GR[gi] / S > 0.4 && GL[gi] / S < 0.25);
    if (lone.length) cand.push([80, 'Students may be able to answer questions on ' + simShort(c.goals[lone[0]].text) + ' without seeing how it connects' + (lone.length > 1 ? ' (and ' + (lone.length - 1) + ' similar goal' + (lone.length > 2 ? 's' : '') + ')' : '') + '. In this model, ideas that are practised but not connected tend to fade faster than connected ones. A block where they explain, compare or discuss it, after you have taught it, usually helps the connection form.']);
    const held = taught.filter((gi) => ll[gi] / S >= 0.3);
    if (held.length) cand.push([40, held.length + (held.length === 1 ? ' goal is' : ' goals are') + ' likely to be well connected, which in this model tends to be the part of learning that lasts longest after teaching stops.']);
    const gap = taught.filter((gi) => seenN[gi] && seenSum[gi] / seenN[gi] > 0.55 && GL[gi] / S < 0.3);
    if (gap.length) cand.push([70, 'The quiz results for ' + simShort(c.goals[gap[0]].text) + ' may look strong while connecting and using it is still weak. A written explanation or a task at level 3 would probably show more of what students can do.']);
    if (hwNights >= 4 && hwMinSum / hwNights >= 55) {
      let lo = 0, loN = 0; for (let s = 0; s < S; s++) if (hwRel[s] < 0.55 && hwAsk[s]) { lo += hwDone[s] / hwAsk[s]; loN++; }
      if (loN) cand.push([65, 'Nights of an hour or more may be more than the students who find homework hardest can finish. Shorter nights, or one focused task, may help them most.']);
    }
    if (volBlocks.size >= 2) cand.push([60, 'In ' + volBlocks.size + ' activities only volunteers answer, so quieter students may get less practice bringing ideas back. The model assumes this; having everyone respond (whiteboards, cards, a partner first) would avoid it.']);
    if (learnMin > 0 && passiveMin / learnMin > 0.6) cand.push([50, 'Most class time is spent listening or watching, with few chances to respond. Questions to every student along the way may help attention and memory.']);
    let maxU = 0; for (const gi of taught) maxU = Math.max(maxU, GU[gi] / S);
    if (maxU < 0.3 && taught.length >= 3) cand.push([45, 'Few goals reach the point of students using them in a new situation. In this model that usually takes a task they have not seen, after they have been taught and have discussed the idea.']);
  }
  cand.sort((a, b) => b[0] - a[0]);
  return { students, goals, links, days: dayOut, byStudent, notes: cand.slice(0, 6).map((x) => x[1]), assumptions: SIM_ASSUMPTIONS.map((x) => ({ id: x.id, text: x.text })) };
}

/* A plausible year of lost days (weather, assemblies, a drill, testing), picked from the seed. */
function stressTest(c, opts) {
  opts = opts || {}; const seed = opts.seed == null ? 1 : opts.seed | 0, days = courseDays(c), D = days.length;
  const target = clamp((c.school.lost || 0) + Math.floor(hash(seed, 5, 41) * 5) - 2, 0, Math.max(0, D - 1)), taken = new Set(), lost = [];
  const month = (d) => (d.date ? +d.date.slice(5, 7) : 0);
  const take = (what, k, ok, run) => {
    let tries = 0;
    while (run > 0 && tries++ < 60 && lost.length < target) {
      const i = Math.floor(hash(seed, k * 17 + tries, 43) * D); let fit = true;
      for (let j = 0; j < run; j++) if (!days[i + j] || taken.has(i + j) || !ok(days[i + j])) fit = false;
      if (!fit) continue;
      for (let j = 0; j < run && lost.length < target; j++) { taken.add(i + j); lost.push({ i: i + j, date: days[i + j].date, what }); }
      return;
    }
  };
  const winter = (d) => [12, 1, 2, 3].indexOf(month(d)) >= 0, spring = (d) => [4, 5].indexOf(month(d)) >= 0, any = () => true;
  if (target >= 6) take('Testing', 1, spring, 2);
  take('Snow day', 2, winter, 1 + (hash(seed, 3, 44) < 0.5 ? 1 : 0));
  if (target >= 7) take('Snow day', 3, winter, 1);
  take('Fire drill', 4, any, 1);
  for (let k = 5; lost.length < target && k < 80; k++) take(k % 3 ? 'Assembly' : 'Early dismissal', k, any, 1);
  lost.sort((a, b) => a.i - b.i);
  const idx = lost.map((x) => x.i), result = simulate(c, Object.assign({}, opts, { lost: idx })), base = simulate(c, Object.assign({}, opts, { lost: [] }));
  const hit = [];
  for (const u of c.units) { const ud = days.filter((d) => d.unit === u.id), n = ud.filter((d) => taken.has(d.i)).length; if (n) hit.push({ unit: u.id, title: u.title, lost: n, days: ud.length }); }
  hit.sort((a, b) => b.lost / b.days - a.lost / a.days);
  const notes = [];
  const mean = (r, f) => { let s = 0, n = 0; for (const g in r.goals) if (r.goals[g].recall > 0.02 || base.goals[g].recall > 0.02) { s += r.goals[g].later[f]; n++; } return n ? s / n : 0; };
  if (lost.length) notes.push('About ' + lost.length + ' class days are lost in this made-up year (' + [...new Set(lost.map((x) => x.what.toLowerCase()))].join(', ') + '). Which days go is a guess; the pattern is what matters.');
  const dr = mean(base, 'recall') - mean(result, 'recall');
  if (lost.length && dr > 0.02) notes.push('Memory of the goals is likely to be somewhat weaker after those losses. Review homework and warm-up questions in later lessons let students recover ground without a full lesson.');
  else if (lost.length && mean(base, 'recall') > 0.15) notes.push('This plan holds up fairly well to these losses, probably because ideas come back in several places.');
  if (hit.length) notes.push(hit[0].title + ' loses ' + plural(hit[0].lost, 'day') + ' of ' + hit[0].days + '. Decide now what you would cut first there, so a lost day does not take the most important idea.');
  const dropped = c.goals.filter((g) => { const gd = days.filter((d) => d.lesson && d.lesson.blocks.some((b) => (b.goals || []).indexOf(g.id) >= 0)); return gd.length && gd.every((d) => taken.has(d.i)); });
  if (dropped.length) notes.push(simShort(dropped[0].text).replace(/^"/, 'The goal "') + ' is taught only on days that are lost' + (dropped.length > 1 ? ', as are ' + (dropped.length - 1) + ' other' + (dropped.length > 2 ? 's' : '') : '') + '. Teaching it in a second place would protect it.');
  return { lost, result, base, hit, notes: notes.slice(0, 4) };
}
