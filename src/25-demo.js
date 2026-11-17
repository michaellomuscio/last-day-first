/* A small, complete course used by the warm-up, the tests and the preview hooks. Biology, four units, one built out day by day. */
function demoCourse() {
  const c = newCourse({ title: 'Biology', subject: 'science', grade: '9' });
  c.transfer = 'Explain how living things work, and weigh a claim about health or the environment against the evidence for it.';
  const U = [['Cells and their boundaries', 14, ['How does something get into a cell, and what decides?', 'Why are cells so small?']], ['Energy in living things', 18, ['Where does the mass of a tree come from?']], ['Inheritance', 22, ['Why do relatives look alike, but not the same?']], ['Evolution', 20, ['How can a population change when no individual does?']]]
    .map((x) => addUnit(c, { title: x[0], days: x[1], questions: x[2], source: 'curate' }));
  const G = (u, text, kind, priority, level, after) => addGoal(c, { text, kind, priority, level, unit: U[u].id, after: (after || []).map((g) => g.id) });
  const g1 = G(0, 'A cell’s membrane controls what enters and leaves, and that control is what keeps the cell alive.', 'understanding', 'lasting', 3);
  const g2 = G(0, 'Name the parts of a cell and what each does.', 'knowledge', 'important', 1);
  const g3 = G(0, 'Diffusion and osmosis move substances from where there is more to where there is less.', 'knowledge', 'important', 2, [g2]);
  const g4 = G(0, 'Use a microscope to observe and draw cells.', 'skill', 'important', 2);
  const g5 = G(0, 'Surface area limits how big a cell can be.', 'understanding', 'important', 3, [g3]);
  const g6 = G(0, 'The history of cell theory.', 'knowledge', 'familiar', 1);
  const g7 = G(1, 'Living things get the matter and energy they need by rearranging molecules, not by creating them.', 'understanding', 'lasting', 3, [g1]);
  const g8 = G(1, 'Write and explain the equations for photosynthesis and respiration.', 'knowledge', 'important', 2, [g7]);
  const g9 = G(2, 'Genes are passed on as separate units and shuffled each generation, though most traits depend on many genes and on surroundings.', 'understanding', 'lasting', 3);
  const g10 = G(2, 'Predict offspring ratios with a Punnett square.', 'skill', 'important', 2, [g9]);
  const g11 = G(3, 'Populations change over generations because some inherited traits help individuals leave more offspring.', 'understanding', 'lasting', 3, [g9]);
  const major = addAssess(c, U[0].id, { title: 'The dialysis clinic brief', kind: 'major', method: 'performance', targets: ['reasoning', 'product'], level: 3, goals: [g1.id, g3.id], min: 50, out: 60, fb: 'rubric', back: 5, rubric: 'analytic', retake: true, role: 'A science writer for a kidney clinic', audience: 'New patients and their families', product: 'A one-page illustrated explainer of how a dialysis machine does the work of a membrane' });
  const quiz = addAssess(c, U[0].id, { title: 'Cell parts quiz', kind: 'minor', method: 'selected', targets: ['knowledge'], level: 1, goals: [g2.id], min: 12, fb: 'score', back: 1 });
  const L = (title, blocks, hw, days) => { const l = addLesson(c, U[0].id, { title, days: days || 1, hw: hw || null }); blocks.forEach((b) => { const k = addBlock(c, l, b[0], b[1]); k.goals = (b[2] || []).map((g) => g.id); if (b[3]) k.sw = b[3]; if (b[4]) k.assess = b[4]; }); return l; };
  L('What is inside a cell', [['entry', 3], ['lecture', 30, [g2]], ['qa', 8, [g2]], ['video', 6, [g2]]], { purpose: 'practice', kind: 'reading', min: 25, goals: [g2.id], fb: 'none', graded: 'no', device: false });
  L('Looking at cells', [['retrieval', 5, [g2]], ['demo', 8, [g4]], ['lab', 28, [g4, g2]], ['exit', 4, [g2]]], { purpose: 'finish', kind: 'writing', min: 15, goals: [g4.id], fb: 'check', graded: 'completion', device: false });
  L('The membrane as a gatekeeper', [['retrieval', 5, [g2]], ['demo', 8, [g3], { predict: 'predict' }], ['mini', 10, [g3, g1]], ['tps', 8, [g1]], ['guided', 10, [g3]], ['exit', 4, [g3]]], { purpose: 'practice', kind: 'problems', min: 20, goals: [g3.id], fb: 'discussed', graded: 'completion', device: false });
  L('Osmosis in an egg', [['directions', 4], ['lab', 34, [g3, g1], { kind: 'designed' }], ['quickwrite', 6, [g1]]], { purpose: 'review', kind: 'problems', min: 15, goals: [g2.id, g3.id], fb: 'discussed', graded: 'no', device: false });
  L('Cell parts quiz and why cells are small', [['quiz', 12, [g2], null, quiz.id], ['task', 20, [g5]], ['qa', 8, [g5], { who: 'all' }], ['mini', 6, [g5]]]);
  L('Drafting the clinic brief', [['mini', 8, [g1]], ['studio', 30, [g1, g3]], ['peer', 10, [g1]]], { purpose: 'finish', kind: 'writing', min: 30, goals: [g1.id], fb: 'comments', graded: 'accuracy', device: true }, 2);
  L('The clinic brief', [['directions', 3], ['ptask', 42, [g1, g3], null, major.id]]);
  c.syllabus.about = 'Biology is the study of how living things work. This year we ask a small number of big questions and gather evidence to answer them.';
  return c;
}
