/* Starter kit: Biology. From how we know things about living systems, through cells, energy, ecosystems, genes and evolution, to how an organism stays stable. */
KITS.push({
  id: 'science', subject: 'science', course: 'Biology', grade: '9-10',
  blurb: 'Eight units that run from experimental thinking through cells, energy, ecosystems, genetics and evolution to homeostasis, with a lab or an evidence task at the center of each.',
  transfer: 'Explain how a living system works using evidence and models, and judge a claim about health, food or the environment by asking what the evidence is and whether it supports the claim.',
  units: [
    { key: 'inq', title: 'Asking Questions About Living Things', days: 14, source: 'curate',
      questions: ['How can you tell whether a change in something living was caused by what you did?', 'What counts as evidence, and when is it enough?'],
      goals: [
        { key: 'inq-u1', text: 'A scientific claim is only as good as its evidence, and an experiment can support a cause only if it changes one thing, keeps everything else the same, compares against a control and is repeated enough that chance is an unlikely explanation.', kind: 'understanding', priority: 'lasting', level: 3, after: [] },
        { key: 'inq-u2', text: 'No single trait makes something alive; living things carry out a set of processes, such as using energy, responding to their surroundings, growing and reproducing, and borderline cases such as fire, crystals and viruses show where any definition strains.', kind: 'understanding', priority: 'important', level: 3, after: [] },
        { key: 'inq-k1', text: 'Hypothesis, independent and dependent variable, control, constant, sample size, replication, mean, and the difference between an observation and an inference.', kind: 'knowledge', priority: 'important', level: 1, after: [] },
        { key: 'inq-s1', text: 'Design a controlled experiment, collect measurements with correct units, and show the results in a table and a graph.', kind: 'skill', priority: 'important', level: 3, after: ['inq-k1'] },
        { key: 'inq-s2', text: 'Write a claim backed by evidence and reasoning that says what the data show and what they do not.', kind: 'skill', priority: 'important', level: 3, after: ['inq-u1', 'inq-s1'] },
        { key: 'inq-k2', text: 'Metric units and scientific notation for very small and very large sizes.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] },
      ],
      major: { title: 'The yeast experiment report', method: 'performance', targets: ['reasoning', 'skill', 'product'], level: 3, goals: ['inq-u1', 'inq-s1', 'inq-s2'], min: 50, out: 60, fb: 'rubric', rubric: 'analytic', retake: true,
        role: 'A food scientist at a bakery', audience: 'The head baker, who wants to know whether a change will help the dough rise', product: 'A lab report on an experiment you design to test how temperature or the type of sugar affects carbon dioxide production by yeast, with a controlled design, a graph of your data and a claim backed by evidence and reasoning' },
      minors: [
        { title: 'Variables sort', method: 'selected', targets: ['knowledge'], level: 1, goals: ['inq-k1'], min: 10, fb: 'score' },
        { title: 'Fix this experiment', method: 'written', targets: ['reasoning'], level: 3, goals: ['inq-u1'], min: 15, fb: 'comments' },
        { title: 'Graph the data and write the claim', method: 'performance', targets: ['skill'], level: 3, goals: ['inq-s1', 'inq-s2'], min: 20, fb: 'comments' },
      ],
      lessons: [
        { title: 'Alive or not? Yeast, a seed, a flame and a crystal', days: 1, blocks: [
            ['entry', 2], ['quickwrite', 5, ['inq-u2']], ['demo', 10, ['inq-u2'], { predict: 'predict' }], ['tps', 8, ['inq-u2']], ['mini', 10, ['inq-u2']], ['qa', 6, ['inq-u2'], { who: 'all' }], ['exit', 4, ['inq-u2']]],
          hw: { purpose: 'prepare', kind: 'reading', min: 20, goals: ['inq-k1'], fb: 'discussed', graded: 'no', device: false } },
        { title: 'What makes a test fair? Paper towels', days: 1, blocks: [
            ['entry', 2], ['mini', 8, ['inq-k1']], ['lab', 30, ['inq-u1', 'inq-s1'], { kind: 'designed' }], ['exit', 4, ['inq-k1']]],
          hw: { purpose: 'finish', kind: 'writing', min: 15, goals: ['inq-s1'], fb: 'check', graded: 'completion', device: false } },
        { title: 'Fix the flawed experiment', days: 1, blocks: [
            ['entry', 2], ['retrieval', 5, ['inq-k1']], ['worked', 8, ['inq-s1']], ['task', 20, ['inq-u1']], ['qa', 6, ['inq-u1'], { who: 'cold' }], ['exit', 4, ['inq-u1']]],
          hw: { purpose: 'practice', kind: 'problems', min: 20, goals: ['inq-s1'], fb: 'discussed', graded: 'completion', device: false } },
        { title: 'From data to a claim', days: 1, blocks: [
            ['entry', 2], ['retrieval', 5, ['inq-k1', 'inq-u1']], ['worked', 8, ['inq-s2'], { fade: 'they' }], ['partner', 14, ['inq-s2']], ['indep', 14, ['inq-s2'], { fb: 'circulate' }], ['exit', 4, ['inq-s2']]],
          hw: { purpose: 'practice', kind: 'writing', min: 20, goals: ['inq-s2'], fb: 'comments', graded: 'completion', device: false } },
        { title: 'Plan the yeast investigation', days: 1, blocks: [
            ['entry', 2], ['quiz', 8, ['inq-k1'], { fb: 'now' }], ['directions', 3], ['studio', 18, ['inq-s1', 'inq-u1']], ['peer', 9, ['inq-u1', 'inq-s2']], ['reflect', 4, ['inq-u1']]],
          hw: { purpose: 'finish', kind: 'writing', min: 25, goals: ['inq-s1'], fb: 'comments', graded: 'completion', device: false } },
      ] },

    { key: 'cel', title: 'Cells: The Smallest Living Units', days: 20, source: 'curate',
      questions: ['What is a cell most like, a factory, a city or a bag, and where does each comparison fail?', 'How does something so small stay alive and stay different from its surroundings?'],
      goals: [
        { key: 'cel-u1', text: 'The cell is the basic unit of life, every cell comes from an earlier cell, and each cell structure has a job that helps keep the whole cell alive, so a cell’s structures fit what that cell does.', kind: 'understanding', priority: 'lasting', level: 3, after: ['inq-u2', 'cel-k1'] },
        { key: 'cel-u2', text: 'A cell stays alive by controlling what crosses its membrane: particles move from higher to lower concentration without the cell spending energy, water follows by osmosis, and the cell spends energy to move substances the other way.', kind: 'understanding', priority: 'lasting', level: 3, after: ['cel-u1'] },
        { key: 'cel-u3', text: 'Because a cell’s volume grows faster than its surface area as it gets bigger, cells stay small, or fold their membranes, so that materials can reach the inside and wastes can leave fast enough.', kind: 'understanding', priority: 'important', level: 3, after: ['cel-u2'] },
        { key: 'cel-k1', text: 'Cell theory; the nucleus, mitochondria, chloroplasts, ribosomes, endoplasmic reticulum, Golgi, vacuole, cell wall and membrane; prokaryotic and eukaryotic cells.', kind: 'knowledge', priority: 'important', level: 1, after: [] },
        { key: 'cel-s1', text: 'Use a light microscope to focus a slide, estimate the size of what you see and make an accurate labeled drawing.', kind: 'skill', priority: 'important', level: 2, after: ['inq-k2'] },
        { key: 'cel-s2', text: 'Predict which way water and small dissolved particles will move across a membrane, given what the membrane lets through, and test the prediction with a model such as dialysis tubing or potato cores.', kind: 'skill', priority: 'important', level: 3, after: ['inq-s1', 'cel-u2'] },
      ],
      major: { title: 'Why you are not one giant cell', method: 'performance', targets: ['reasoning', 'product'], level: 3, goals: ['cel-u2', 'cel-u3', 'cel-s2'], min: 50, out: 60, fb: 'rubric', rubric: 'analytic', retake: true,
        role: 'A science writer for a children’s museum', audience: 'Visitors aged 10 to 14', product: 'An exhibit panel and scale model explaining why cells are small, using your own data from the agar-cube diffusion lab (agar cubes of different sizes) and the surface area to volume numbers, and what a cell does to bring materials across its membrane' },
      minors: [
        { title: 'Design a cell for a job', method: 'performance', targets: ['reasoning', 'product'], level: 3, goals: ['cel-u1', 'cel-k1'], min: 20, fb: 'comments' },
        { title: 'Microscope practical', method: 'performance', targets: ['skill'], level: 2, goals: ['cel-s1'], min: 15, fb: 'comments' },
        { title: 'Which way will it move?', method: 'written', targets: ['reasoning'], level: 3, goals: ['cel-s2', 'cel-u2'], min: 15, fb: 'comments' },
      ] },

    { key: 'enr', title: 'Energy and Matter in Living Things', days: 24, source: 'curate',
      questions: ['Where does the mass of a tree come from?', 'When the body uses fat or sugar for energy, where does the matter go, and why do so many people guess wrong?'],
      goals: [
        { key: 'enr-u1', text: 'Living things cannot create matter or energy: photosynthesis uses light energy to rearrange carbon dioxide and water into sugar and oxygen, respiration (in plants as well as animals) rearranges sugar and oxygen into carbon dioxide and water and transfers some of the sugar’s stored energy to ATP and the rest to heat, and atoms are conserved at every step.', kind: 'understanding', priority: 'lasting', level: 3, after: ['cel-u1'] },
        { key: 'enr-u2', text: 'Energy is never used up, but at each step some of it spreads out as heat that cells cannot use again, so life needs a steady supply of energy (for most life, sunlight), while matter cycles between living things and their surroundings, so the same atoms are used again and again.', kind: 'understanding', priority: 'lasting', level: 3, after: ['enr-u1'] },
        { key: 'enr-k1', text: 'Carbohydrates, lipids, proteins and nucleic acids as the four kinds of large molecules in cells, what each is made of and does; ATP as the cell’s energy currency; enzymes as catalysts.', kind: 'knowledge', priority: 'important', level: 1, after: ['cel-k1'] },
        { key: 'enr-s1', text: 'Trace atoms of carbon, hydrogen and oxygen through the balanced equations for photosynthesis and cellular respiration, and use them to account for where the mass goes, as when a plant grows or a fat is used as fuel.', kind: 'skill', priority: 'important', level: 3, after: ['enr-u1'] },
        { key: 'enr-s2', text: 'Design and run an investigation of a process such as yeast fermentation, enzyme activity or plant gas exchange, and interpret the results.', kind: 'skill', priority: 'important', level: 3, after: ['inq-s1', 'inq-s2'] },
        { key: 'enr-k2', text: 'The steps inside photosynthesis (light reactions and the Calvin cycle) and cellular respiration (glycolysis, the Krebs cycle and the electron transport chain).', kind: 'knowledge', priority: 'familiar', level: 1, after: ['enr-u1'] },
      ],
      major: { title: 'Where did the mass go?', method: 'performance', targets: ['reasoning', 'product'], level: 3, goals: ['enr-u1', 'enr-u2', 'enr-s1'], min: 50, out: 60, fb: 'rubric', rubric: 'analytic', retake: true,
        role: 'A science explainer for a health podcast', audience: 'Listeners who think fat is burned off, sweated out or turned into energy', product: 'A five-minute audio script and diagram showing, atom by atom, what happens to 10 kilograms of body fat that is used as fuel over time (about 8.4 kilograms of it leave as carbon dioxide you breathe out and about 1.6 kilograms as water, with oxygen from the air taking part), and why energy and matter behave differently. The piece is about where atoms go and gives no advice about weight' },
      minors: [
        { title: 'Molecules, ATP and enzymes quiz', method: 'selected', targets: ['knowledge'], level: 1, goals: ['enr-k1'], min: 12, fb: 'score' },
        { title: 'Atom bookkeeping', method: 'written', targets: ['reasoning'], level: 3, goals: ['enr-s1', 'enr-u1'], min: 20, fb: 'comments' },
        { title: 'Enzyme or yeast lab data', method: 'performance', targets: ['skill'], level: 3, goals: ['enr-s2'], min: 20, fb: 'comments' },
      ] },

    { key: 'eco', title: 'Ecosystems and Interdependence', days: 20, source: 'curate',
      questions: ['What happens to a community when one species is removed or added?', 'How much change can an ecosystem take before it becomes a different ecosystem?'],
      goals: [
        { key: 'eco-u1', text: 'Organisms in an ecosystem depend on one another and on their physical surroundings, so a change in one part can spread through the whole system, sometimes in ways nobody predicted.', kind: 'understanding', priority: 'lasting', level: 3, after: ['enr-u2'] },
        { key: 'eco-u2', text: 'Populations are limited by resources, by other organisms such as predators and disease, and by the physical environment, which is why they grow, level off or crash instead of growing forever.', kind: 'understanding', priority: 'lasting', level: 3, after: ['eco-u1'] },
        { key: 'eco-k1', text: 'Producer, consumer, decomposer, trophic level, food web, niche, habitat, biotic and abiotic factors, carrying capacity, and the carbon and nitrogen cycles.', kind: 'knowledge', priority: 'important', level: 1, after: ['enr-u1'] },
        { key: 'eco-s1', text: 'Read and make graphs of population data and explain what limits a population at each stage of the curve.', kind: 'skill', priority: 'important', level: 3, after: ['inq-s1'] },
        { key: 'eco-s2', text: 'Use a food web or model to predict what happens when a species is removed or added, and weigh the prediction against evidence, such as the debated effects of wolves in Yellowstone.', kind: 'skill', priority: 'important', level: 3, after: ['eco-u1', 'inq-s2'] },
        { key: 'eco-k2', text: 'The major biomes of the world and their typical climates and species.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] },
      ],
      major: { title: 'The advisory report', method: 'performance', targets: ['reasoning', 'product'], level: 3, goals: ['eco-u1', 'eco-u2', 'eco-s2'], min: 50, out: 75, fb: 'rubric', rubric: 'analytic', retake: false,
        role: 'A consultant to a state wildlife agency', audience: 'A public hearing on a proposal such as managing invasive lionfish or zebra mussels', product: 'A written report and a five-minute presentation with a food web, a population graph and a recommendation that names its trade-offs and the evidence that would change it' },
      minors: [
        { title: 'Ecology terms and cycles quiz', method: 'selected', targets: ['knowledge'], level: 1, goals: ['eco-k1'], min: 12, fb: 'score' },
        { title: 'What limits this population?', method: 'written', targets: ['reasoning'], level: 3, goals: ['eco-s1', 'eco-u2'], min: 20, fb: 'comments' },
        { title: 'Food web: what if it were removed?', method: 'personal', targets: ['reasoning'], level: 3, goals: ['eco-s2'], min: 15, fb: 'conference' },
      ] },

    { key: 'gen', title: 'Genes: DNA, Proteins and Cell Division', days: 20, source: 'curate',
      questions: ['How does one cell become a body with hundreds of kinds of cells?', 'How can a small change in a molecule change a whole organism?'],
      goals: [
        { key: 'gen-u1', text: 'DNA holds instructions as a sequence of bases, cells read it to build proteins, and proteins do most of the work that makes an organism what it is, so a change in the sequence can change the organism, though many changes do nothing.', kind: 'understanding', priority: 'lasting', level: 3, after: ['cel-u1', 'enr-k1'] },
        { key: 'gen-u2', text: 'Nearly every cell in your body came from one fertilized egg by copying DNA and dividing, and cells with the same DNA become different kinds because different genes are switched on.', kind: 'understanding', priority: 'lasting', level: 3, after: ['cel-u1', 'gen-u1'] },
        { key: 'gen-k1', text: 'Nucleotide, base pairing (A with T and C with G in DNA; A with U in RNA), double helix, gene, chromosome, mRNA, codon, amino acid, replication, transcription, translation and the stages of mitosis.', kind: 'knowledge', priority: 'important', level: 1, after: [] },
        { key: 'gen-s1', text: 'Use a codon table to transcribe a DNA sequence into mRNA and translate it into amino acids, and predict the effect of a substitution, insertion or deletion.', kind: 'skill', priority: 'important', level: 2, after: ['gen-k1'] },
        { key: 'gen-s2', text: 'Explain with a model why a mutation (a change in DNA) can be harmless, harmful or, rarely, helpful, and how mutations in genes that control cell division can lead to cancer.', kind: 'skill', priority: 'important', level: 3, after: ['gen-u1', 'gen-s1', 'gen-u2'] },
        { key: 'gen-k2', text: 'How the structure of DNA was worked out, including the X-ray images made by Rosalind Franklin and the work of Wilkins, Chargaff, Watson and Crick.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] },
      ],
      major: { title: 'One base, one protein, one disease', method: 'performance', targets: ['reasoning', 'product'], level: 3, goals: ['gen-u1', 'gen-s1', 'gen-s2'], min: 50, out: 60, fb: 'rubric', rubric: 'analytic', retake: true,
        role: 'A genetic counselor’s educator', audience: 'A community education session on sickle cell disease', product: 'A one-page explainer and an annotated sequence showing how one base change in the hemoglobin gene (the DNA codon GAG becomes GTG, so the mRNA codon GAG becomes GUG) changes one amino acid (glutamic acid to valine), changes how the hemoglobin protein behaves when oxygen is low and bends red blood cells out of shape' },
      minors: [
        { title: 'DNA and mitosis terms quiz', method: 'selected', targets: ['knowledge'], level: 1, goals: ['gen-k1'], min: 12, fb: 'score' },
        { title: 'DNA to protein practice', method: 'performance', targets: ['skill'], level: 2, goals: ['gen-s1'], min: 15, fb: 'comments' },
        { title: 'Same DNA, different cells: build the model', method: 'performance', targets: ['reasoning', 'product'], level: 3, goals: ['gen-u2'], min: 20, fb: 'comments' },
      ] },

    { key: 'inh', title: 'Inheritance and Variation', days: 18, source: 'curate',
      questions: ['Why do siblings look alike but not identical?', 'How much of who we are is inherited and how much is shaped by what happens to us?'],
      goals: [
        { key: 'inh-u1', text: 'An offspring gets one copy of each gene from each parent, and meiosis shuffles those copies, so each child is a new combination and inheritance follows probability, not certainty.', kind: 'understanding', priority: 'lasting', level: 3, after: ['gen-u2', 'gen-k1'] },
        { key: 'inh-u2', text: 'Traits come from genes interacting with each other and with the environment, so most traits cannot be traced to one gene and a gene is not destiny.', kind: 'understanding', priority: 'lasting', level: 3, after: ['gen-u1', 'inh-u1'] },
        { key: 'inh-k1', text: 'Gene, allele, dominant, recessive, genotype, phenotype, homozygous, heterozygous, meiosis, crossing over, codominance, incomplete dominance and sex-linked trait; dominant does not mean most common or best.', kind: 'knowledge', priority: 'important', level: 1, after: ['gen-k1'] },
        { key: 'inh-s1', text: 'Predict offspring ratios for one trait with a Punnett square, state the probability as a fraction, and explain why each birth is independent of the last.', kind: 'skill', priority: 'important', level: 2, after: ['inh-u1', 'inh-k1'] },
        { key: 'inh-s2', text: 'Read a pedigree to work out whether a trait is dominant, recessive or sex-linked and how likely it is to be passed on.', kind: 'skill', priority: 'important', level: 3, after: ['inh-s1'] },
        { key: 'inh-s3', text: 'Weigh the benefits and the questions raised by genetic technologies such as genetic testing and gene editing, with evidence.', kind: 'skill', priority: 'familiar', level: 3, after: ['gen-s2', 'inh-u2'] },
      ],
      major: { title: 'The family case file', method: 'performance', targets: ['reasoning', 'product'], level: 3, goals: ['inh-u1', 'inh-u2', 'inh-s1', 'inh-s2'], min: 50, out: 45, fb: 'rubric', rubric: 'analytic', retake: true,
        role: 'An assistant to a genetic counselor, preparing a case file for a made-up family', audience: 'The clinic team that reviews the file', product: 'A case file with a pedigree you analyze, Punnett squares that give the chance of the trait in the next child, and a written explanation of why those chances are only chances (and not a forecast for any one child) and why a trait such as height cannot be predicted from one gene' },
      minors: [
        { title: 'Heredity terms quiz', method: 'selected', targets: ['knowledge'], level: 1, goals: ['inh-k1'], min: 10, fb: 'score' },
        { title: 'Coin-flip Punnett lab', method: 'performance', targets: ['skill', 'reasoning'], level: 3, goals: ['inh-s1', 'inh-u1'], min: 25, fb: 'comments' },
        { title: 'Pedigree puzzle', method: 'written', targets: ['reasoning'], level: 3, goals: ['inh-s2'], min: 15, fb: 'comments' },
      ] },

    { key: 'evo', title: 'Evolution by Natural Selection', days: 24, source: 'curate',
      questions: ['How can a population change when no individual in it does?', 'How do we know about events that no one saw?'],
      goals: [
        { key: 'evo-u1', text: 'Populations change over generations because individuals vary in inherited traits, some traits help individuals survive and reproduce in a particular environment, and those traits become more common; the variation comes from chance, not need, and individuals do not change themselves to fit.', kind: 'understanding', priority: 'lasting', level: 3, after: ['inh-u1', 'eco-u2', 'gen-s2'] },
        { key: 'evo-u2', text: 'Many independent lines of evidence, from fossils, anatomy, DNA and direct observation, point to common ancestry of living things, and a scientific theory is a well-tested explanation, not a guess.', kind: 'understanding', priority: 'lasting', level: 3, after: ['inq-u1', 'gen-u1'] },
        { key: 'evo-k1', text: 'Variation, adaptation, fitness, selective pressure, speciation, homologous and vestigial structures, the fossil record and common ancestor.', kind: 'knowledge', priority: 'important', level: 1, after: ['inh-k1'] },
        { key: 'evo-s1', text: 'Use data about a real population, such as peppered moths, Galápagos finch beaks or antibiotic-resistant bacteria, to explain a change by natural selection.', kind: 'skill', priority: 'important', level: 3, after: ['evo-u1', 'inq-s2', 'eco-s1'] },
        { key: 'evo-s2', text: 'Read a cladogram to decide which species share a more recent common ancestor.', kind: 'skill', priority: 'important', level: 2, after: ['evo-k1', 'evo-u2'] },
        { key: 'evo-k2', text: 'Examples from the fossil record such as Tiktaalik and early whales, and how Darwin and Wallace each reached the idea of natural selection.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] },
      ],
      major: { title: 'Resistance in the hospital', method: 'performance', targets: ['reasoning', 'product'], level: 3, goals: ['evo-u1', 'evo-s1'], min: 50, out: 60, fb: 'rubric', rubric: 'analytic', retake: true,
        role: 'An infectious disease adviser', audience: 'Hospital administrators who must decide on rules for antibiotic use', product: 'A briefing that uses data from a selection simulation and a graph of resistant bacteria over generations to explain how resistance arises and spreads (and why a person does not become resistant, the bacteria do), with a recommendation and its limits' },
      minors: [
        { title: 'Evolution terms quiz', method: 'selected', targets: ['knowledge'], level: 1, goals: ['evo-k1'], min: 12, fb: 'score' },
        { title: 'Beak selection lab analysis', method: 'performance', targets: ['skill'], level: 3, goals: ['evo-s1'], min: 25, fb: 'comments' },
        { title: 'Build the whale family tree', method: 'performance', targets: ['reasoning', 'skill'], level: 3, goals: ['evo-u2', 'evo-s2'], min: 30, fb: 'comments' },
      ] },

    { key: 'hom', title: 'Staying Stable: Feedback and Homeostasis', days: 16, source: 'curate',
      questions: ['How does your body stay the same when everything around it changes?', 'When does a system that keeps things steady fail?'],
      goals: [
        { key: 'hom-u1', text: 'Living systems keep inner conditions within a narrow range through feedback, in which a change is sensed and a response pushes it back, and most of the body’s regulation is negative feedback.', kind: 'understanding', priority: 'lasting', level: 3, after: ['cel-u2', 'hom-k1'] },
        { key: 'hom-u2', text: 'Body systems depend on one another, so a failure in one, such as too little insulin, changes conditions in others, and staying well takes many systems working together.', kind: 'understanding', priority: 'important', level: 3, after: ['cel-u1', 'enr-u1'] },
        { key: 'hom-k1', text: 'Stimulus, receptor, control center, effector, negative and positive feedback, and the roles of the nervous, endocrine, circulatory, respiratory and digestive systems in keeping the body stable.', kind: 'knowledge', priority: 'important', level: 2, after: ['cel-k1'] },
        { key: 'hom-s1', text: 'Draw a feedback loop for body temperature or blood sugar and use it to explain what goes wrong when one part fails, as in type 1 diabetes.', kind: 'skill', priority: 'important', level: 3, after: ['hom-u1', 'enr-u1'] },
        { key: 'hom-s2', text: 'Evaluate a health claim in the news by checking its source, the size and design of the study, and whether the evidence shows cause.', kind: 'skill', priority: 'important', level: 3, after: ['inq-u1', 'inq-s2'] },
        { key: 'hom-k2', text: 'The major organs of each body system and what each does.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] },
      ],
      major: { title: 'The health claim review', method: 'performance', targets: ['reasoning', 'product'], level: 4, goals: ['hom-u1', 'hom-s1', 'hom-s2'], min: 50, out: 75, fb: 'rubric', rubric: 'analytic', retake: false,
        role: 'A health reporter', audience: 'Readers of a school newspaper', product: 'An article and an annotated feedback-loop diagram that evaluate a popular health claim (for example about sports drinks or "detox" products), saying what the evidence shows and what it does not' },
      minors: [
        { title: 'Feedback and body systems quiz', method: 'selected', targets: ['knowledge'], level: 2, goals: ['hom-k1'], min: 12, fb: 'score' },
        { title: 'Draw the loop', method: 'performance', targets: ['skill'], level: 3, goals: ['hom-s1', 'hom-u2'], min: 15, fb: 'comments' },
        { title: 'Spot the flaw in the study', method: 'written', targets: ['reasoning'], level: 3, goals: ['hom-s2'], min: 20, fb: 'comments' },
      ] },
  ],
});
