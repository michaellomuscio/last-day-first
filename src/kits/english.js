/* Starter kit: English 10. Reading, writing, argument and discussion across a year, built around widely taught texts. */
KITS.push({
  id: 'english', subject: 'english', course: 'English 10', grade: '10',
  blurb: 'Eight units that move from reading closely to arguing, writing and researching, with a core text in each: short stories, poems, a speech and a letter, a novel, a Shakespeare tragedy and a personal essay.',
  transfer: 'Read a hard text closely, decide what you think about it and why, and say it in writing or in conversation so that a fair-minded reader could be persuaded or could disagree with specifics.',
  units: [
    { key: 'nar', title: 'Who Is Telling the Story?', days: 18, source: 'curate',
      questions: ['Can you trust the person telling you what happened?', 'What does a reader owe a story, and what does a story owe a reader?'],
      goals: [
        { key: 'nar-u1', text: 'Who tells a story, and what that narrator can and cannot see, shapes what the reader believes is true.', kind: 'understanding', priority: 'lasting', level: 3, after: [] },
        { key: 'nar-u2', text: 'A claim about a text is only as strong as the specific words that support it and the reasoning that connects them.', kind: 'understanding', priority: 'lasting', level: 3, after: ['nar-u1'] },
        { key: 'nar-k1', text: 'Point of view (first person, third person limited, third person omniscient), narrator and unreliable narrator.', kind: 'knowledge', priority: 'important', level: 1, after: [] },
        { key: 'nar-s1', text: 'Annotate a passage while reading: mark what is surprising, what repeats and what the narrator seems to leave out.', kind: 'skill', priority: 'important', level: 2, after: [] },
        { key: 'nar-s2', text: 'Write a paragraph that makes a claim about a story, supports it with a short quotation and explains how the quotation proves the claim.', kind: 'skill', priority: 'important', level: 3, after: ['nar-s1', 'nar-k1'] },
        { key: 'nar-k2', text: 'Verbal, situational and dramatic irony, and how to tell them apart.', kind: 'knowledge', priority: 'familiar', level: 2, after: [] },
      ],
      major: { title: 'The narrator case file', method: 'performance', targets: ['reasoning', 'product'], level: 3, goals: ['nar-u1', 'nar-u2', 'nar-s2'], min: 50, out: 60, fb: 'rubric', rubric: 'analytic', retake: true,
        role: 'An investigator reviewing the testimony of a narrator', audience: 'A classmate who has not read the story', product: 'A two-page case file arguing whether the narrator of one story (such as "The Tell-Tale Heart" or "An Occurrence at Owl Creek Bridge") can be trusted, with quoted evidence and an explanation of each quotation' },
      minors: [
        { title: 'Point of view sort', method: 'selected', targets: ['knowledge'], level: 1, goals: ['nar-k1'], min: 10, fb: 'score' },
        { title: 'Claim, quotation, explanation paragraph', method: 'written', targets: ['reasoning'], level: 3, goals: ['nar-s2', 'nar-u2'], min: 20, fb: 'comments' },
        { title: 'Pair conversation: can we trust her?', method: 'personal', targets: ['reasoning'], level: 3, goals: ['nar-u1'], min: 10, fb: 'conference' },
      ],
      lessons: [
        { title: 'Who is speaking in "The Tell-Tale Heart"?', days: 1, blocks: [
            ['entry', 2], ['quickwrite', 6, ['nar-u1']], ['readaloud', 14, ['nar-s1'], { follow: 'annotate' }], ['tps', 8, ['nar-u1']], ['mini', 6, ['nar-k1']], ['qa', 6, ['nar-k1'], { who: 'all' }], ['exit', 4, ['nar-u1']]],
          hw: { purpose: 'prepare', kind: 'reading', min: 20, goals: ['nar-s1'], fb: 'discussed', graded: 'completion', device: false } },
        { title: 'What does she know? "The Story of an Hour"', days: 1, blocks: [
            ['entry', 2], ['retrieval', 6, ['nar-k1']], ['sread', 10, ['nar-s1'], { task: 'task' }], ['closeread', 12, ['nar-u1']], ['qa', 8, ['nar-u1'], { who: 'cold' }], ['quickwrite', 6, ['nar-u1']], ['exit', 4, ['nar-k1']]],
          hw: { purpose: 'practice', kind: 'writing', min: 15, goals: ['nar-s1', 'nar-u1'], fb: 'check', graded: 'completion', device: false } },
        { title: 'From claim to evidence', days: 1, blocks: [
            ['entry', 2], ['retrieval', 6, ['nar-s1', 'nar-k1']], ['worked', 10, ['nar-s2'], { fade: 'they' }], ['partner', 10, ['nar-s2']], ['indep', 12, ['nar-s2'], { fb: 'circulate' }], ['exit', 4, ['nar-s2']]],
          hw: { purpose: 'prepare', kind: 'reading', min: 25, goals: ['nar-s1'], fb: 'discussed', graded: 'no', device: false } },
        { title: 'What is the town in "The Lottery" hiding?', days: 1, blocks: [
            ['entry', 2], ['retrieval', 6, ['nar-s2']], ['mini', 6, ['nar-k2']], ['seminar', 20, ['nar-u1', 'nar-u2'], { prep: 'notes' }], ['reflect', 6, ['nar-u1']], ['exit', 4, ['nar-k2']]],
          hw: { purpose: 'extend', kind: 'writing', min: 25, goals: ['nar-s2', 'nar-u2'], fb: 'comments', graded: 'completion', device: true } },
        { title: 'Check-in and launching the case file', days: 1, blocks: [
            ['entry', 2], ['quiz', 10, ['nar-k1'], { fb: 'now' }], ['goover', 8, ['nar-s2'], { redo: 'redo' }], ['directions', 4], ['studio', 18, ['nar-u1', 'nar-u2', 'nar-s2']], ['reflect', 4, ['nar-u1']]],
          hw: { purpose: 'finish', kind: 'writing', min: 25, goals: ['nar-s2'], fb: 'comments', graded: 'completion', device: true } },
      ] },

    { key: 'poe', title: 'Poetry: Saying More with Less', days: 18, source: 'curate',
      questions: ['Why would anyone say it in a poem when they could say it plainly?', 'What can a poem know that an essay cannot?'],
      goals: [
        { key: 'poe-u1', text: 'In a poem, form, sound and word choice are not decoration; they carry part of the meaning, and changing them changes what the poem says.', kind: 'understanding', priority: 'lasting', level: 3, after: ['nar-u2'] },
        { key: 'poe-k1', text: 'Poetic terms: metaphor, simile, imagery, symbol, tone, stanza, line break, rhyme and meter.', kind: 'knowledge', priority: 'important', level: 1, after: [] },
        { key: 'poe-s1', text: 'Paraphrase a poem line by line in plain prose, then name what the paraphrase leaves out.', kind: 'skill', priority: 'important', level: 2, after: ['nar-s1'] },
        { key: 'poe-s2', text: 'Explain how a specific choice, such as a line break or a repeated sound, changes the meaning, tone or feeling at one moment in a poem.', kind: 'skill', priority: 'important', level: 3, after: ['poe-k1', 'nar-s2'] },
        { key: 'poe-k2', text: 'Sonnet, ballad and free verse as forms, with an example of each, such as Shakespeare’s Sonnet 130, Dickinson and Whitman.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] },
        { key: 'poe-s3', text: 'Read a poem aloud so that the sound shows how you understand it.', kind: 'skill', priority: 'familiar', level: 2, after: [] },
      ],
      major: { title: 'Two poems, one argument', method: 'performance', targets: ['reasoning', 'product'], level: 3, goals: ['poe-u1', 'poe-s2', 'poe-s1'], min: 45, out: 90, fb: 'rubric', rubric: 'analytic', retake: true,
        role: 'The editor of a school poetry anthology', audience: 'Ninth graders who say they do not like poetry', product: 'A 600-word introduction to two poems you choose from a list (for example Hughes’s "Harlem" and Owen’s "Dulce et Decorum Est"), arguing how form creates meaning in one of them, with a recorded reading of that poem' },
      minors: [
        { title: 'Poetry terms match and spot', method: 'selected', targets: ['knowledge'], level: 1, goals: ['poe-k1'], min: 12, fb: 'score' },
        { title: 'Paraphrase and the gap', method: 'written', targets: ['reasoning'], level: 2, goals: ['poe-s1'], min: 20, fb: 'comments' },
        { title: 'Two versions: what changed?', method: 'written', targets: ['reasoning'], level: 3, goals: ['poe-u1', 'poe-s2'], min: 15, fb: 'comments' },
      ] },

    { key: 'rhe', title: 'Argument: How Writers Persuade', days: 20, source: 'curate',
      questions: ['When is persuasion honest, and when is it manipulation?', 'What would it take to change your mind?'],
      goals: [
        { key: 'rhe-u1', text: 'An argument is a claim backed by reasons and evidence, shaped for a particular audience, and the strongest ones answer the best objection.', kind: 'understanding', priority: 'lasting', level: 3, after: ['nar-u2'] },
        { key: 'rhe-u2', text: 'Language can persuade without proving anything, so a careful reader separates what a text shows from what it makes them feel.', kind: 'understanding', priority: 'lasting', level: 3, after: ['nar-u1', 'poe-u1'] },
        { key: 'rhe-k1', text: 'Claim, reason, evidence, counterargument and rebuttal; ethos, pathos and logos; audience, purpose and context.', kind: 'knowledge', priority: 'important', level: 1, after: [] },
        { key: 'rhe-s1', text: 'Analyze a speech or essay, such as Lincoln’s Second Inaugural Address or King’s "Letter from Birmingham Jail": find its claim, its audience and how particular choices aim at that audience.', kind: 'skill', priority: 'important', level: 3, after: ['rhe-k1', 'nar-s1'] },
        { key: 'rhe-s2', text: 'Write an argument with a clear claim, organized reasons, accurate evidence and a fair answer to the strongest opposing view.', kind: 'skill', priority: 'important', level: 3, after: ['rhe-u1', 'nar-s2'] },
        { key: 'rhe-k2', text: 'Common logical fallacies, such as false dilemma, slippery slope and ad hominem.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] },
      ],
      major: { title: 'The op-ed for readers who disagree', method: 'performance', targets: ['reasoning', 'product'], level: 3, goals: ['rhe-u1', 'rhe-s2'], min: 60, out: 120, fb: 'rubric', rubric: 'analytic', retake: true,
        role: 'An opinion writer for a local newspaper’s youth page', audience: 'Adult readers of the paper who disagree with you', product: 'An 800-word op-ed on a local issue you research, with accurate evidence, one real counterargument answered fairly and a source list' },
      minors: [
        { title: 'Claim, counterclaim and fallacy quiz', method: 'selected', targets: ['knowledge'], level: 1, goals: ['rhe-k1', 'rhe-k2'], min: 12, fb: 'score' },
        { title: 'Analysis of one paragraph of the King letter', method: 'written', targets: ['reasoning'], level: 3, goals: ['rhe-s1', 'rhe-u2'], min: 25, fb: 'comments' },
        { title: 'Argue the other side', method: 'personal', targets: ['reasoning'], level: 3, goals: ['rhe-u1'], min: 10, fb: 'conference' },
      ] },

    { key: 'nov', title: 'The Novel: Conscience and Community', days: 22, source: 'adopt',
      questions: ['When is it right to stand alone, and what does it cost?', 'What do we owe people who are different from us, or who cannot defend themselves?'],
      goals: [
        { key: 'nov-u1', text: 'A novel makes an argument about how people live together, and a reader finds it by tracing what characters choose, how they change and what the story rewards or punishes.', kind: 'understanding', priority: 'lasting', level: 3, after: ['nar-u1', 'rhe-u2'] },
        { key: 'nov-u2', text: 'A narrator who looks back on events, like Scout in To Kill a Mockingbird, understands more than she did then, and the gap between the two is part of the story.', kind: 'understanding', priority: 'important', level: 3, after: ['nar-u1'] },
        { key: 'nov-k1', text: 'The setting of To Kill a Mockingbird: Alabama in the 1930s, the Great Depression and segregation under the law, and the terms theme, motif, symbol and conflict. (Of Mice and Men, Animal Farm or Fahrenheit 451 fit the same goals.)', kind: 'knowledge', priority: 'important', level: 1, after: [] },
        { key: 'nov-s1', text: 'Trace a theme or a character’s change across a whole book, gathering evidence from the beginning, middle and end.', kind: 'skill', priority: 'important', level: 3, after: ['nar-s2'] },
        { key: 'nov-s2', text: 'Write a multi-paragraph literary essay with an arguable thesis, organized evidence and explanation of each piece of evidence.', kind: 'skill', priority: 'important', level: 3, after: ['nar-s2', 'rhe-s2'] },
        { key: 'nov-k2', text: 'The life of Harper Lee and how the novel was received when it appeared in 1960.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] },
      ],
      major: { title: 'The in-class literary essay', method: 'written', targets: ['reasoning'], level: 3, goals: ['nov-u1', 'nov-s2', 'nov-s1'], min: 100, out: 30, fb: 'rubric', rubric: 'analytic', retake: true,
        role: '', audience: '', product: '' },
      minors: [
        { title: 'Reading checks, chapters 1 to 11', method: 'selected', targets: ['knowledge'], level: 1, goals: ['nov-k1'], min: 12, fb: 'score' },
        { title: 'Theme tracker entries', method: 'written', targets: ['reasoning'], level: 3, goals: ['nov-s1', 'nov-u2'], min: 15, fb: 'comments' },
        { title: 'Seminar: what does Atticus choose, and why?', method: 'personal', targets: ['reasoning'], level: 3, goals: ['nov-u1'], min: 25, fb: 'conference' },
      ] },

    { key: 'dra', title: 'Macbeth: A Play Made to Be Performed', days: 22, source: 'adopt',
      questions: ['How does a good person become someone who does terrible things?', 'Who is responsible for a downfall: the person, the people around them, or fate?'],
      goals: [
        { key: 'dra-u1', text: 'A play is a script for performance, so its meaning depends on choices of voice, movement and staging that every actor and director must make.', kind: 'understanding', priority: 'lasting', level: 3, after: ['poe-u1'] },
        { key: 'dra-u2', text: 'A tragedy shows a person’s own choices, made under pressure from others and from their own wants, bringing on their ruin, so we judge the person and the pressures together.', kind: 'understanding', priority: 'lasting', level: 3, after: ['nov-u1'] },
        { key: 'dra-k1', text: 'The plot and main characters of Macbeth, and the terms soliloquy, aside, blank verse, tragic hero and foil.', kind: 'knowledge', priority: 'important', level: 1, after: [] },
        { key: 'dra-s1', text: 'Read Shakespeare’s language by using footnotes and context to restate a speech in modern English.', kind: 'skill', priority: 'important', level: 2, after: ['poe-s1'] },
        { key: 'dra-s2', text: 'Make and defend a choice about how to stage a scene by pointing to specific lines.', kind: 'skill', priority: 'important', level: 3, after: ['dra-u1', 'nar-s2'] },
        { key: 'dra-k2', text: 'The Elizabethan theatre and the Globe, and King James’s interest in witchcraft and kingship at the time Macbeth was written.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] },
      ],
      major: { title: 'Direct a scene', method: 'performance', targets: ['reasoning', 'skill', 'product'], level: 3, goals: ['dra-u1', 'dra-s2', 'dra-s1'], min: 60, out: 90, fb: 'rubric', rubric: 'analytic', retake: false,
        role: 'A director pitching a staging of one scene to a theatre company', audience: 'A panel of classmates acting as the artistic team', product: 'A three-minute staged performance of a scene (the dagger soliloquy, the banquet or the sleepwalking scene) with a one-page director’s note defending three choices by line' },
      minors: [
        { title: 'Act-by-act plot and terms check', method: 'selected', targets: ['knowledge'], level: 1, goals: ['dra-k1'], min: 12, fb: 'score' },
        { title: 'Say it plainly: one soliloquy', method: 'performance', targets: ['skill'], level: 2, goals: ['dra-s1'], min: 15, fb: 'comments' },
        { title: 'Who is to blame? Journal entry', method: 'written', targets: ['reasoning'], level: 3, goals: ['dra-u2'], min: 20, fb: 'comments' },
      ] },

    { key: 'res', title: 'Research: Finding Out and Saying What You Found', days: 20, source: 'build',
      questions: ['How do you know that what you read is true?', 'What makes a question worth a month of research?'],
      goals: [
        { key: 'res-u1', text: 'Knowing something means being able to say where the claim comes from and why that source deserves trust.', kind: 'understanding', priority: 'lasting', level: 3, after: ['rhe-u2'] },
        { key: 'res-u2', text: 'Good research starts with a question that has no ready answer and ends by combining what several sources say, including where they disagree, into a claim of your own.', kind: 'understanding', priority: 'lasting', level: 3, after: ['rhe-u1', 'nov-u1'] },
        { key: 'res-k1', text: 'How to judge a source (author, purpose, date, evidence and who benefits) and the difference between primary, secondary, scholarly and popular sources.', kind: 'knowledge', priority: 'important', level: 2, after: ['rhe-k1'] },
        { key: 'res-s1', text: 'Search a library database and the open web with good search terms and keep a record of every source.', kind: 'skill', priority: 'important', level: 2, after: [] },
        { key: 'res-s2', text: 'Summarize, paraphrase and quote accurately, and cite every source in MLA format so a reader can find it.', kind: 'skill', priority: 'important', level: 2, after: ['nar-s2'] },
        { key: 'res-k2', text: 'Other citation styles (APA, Chicago) and when each is used.', kind: 'knowledge', priority: 'familiar', level: 1, after: ['res-s2'] },
      ],
      major: { title: 'The researched inquiry report', method: 'performance', targets: ['reasoning', 'product'], level: 4, goals: ['res-u1', 'res-u2', 'res-s2'], min: 40, out: 240, fb: 'rubric', rubric: 'analytic', retake: false,
        role: 'A researcher reporting to an informed audience', audience: 'A panel of adults from the community who work in the field', product: 'A 1,500-word report answering your own research question, with an annotated bibliography of at least six sources and a five-minute talk' },
      minors: [
        { title: 'Judge three sources', method: 'written', targets: ['reasoning'], level: 3, goals: ['res-k1', 'res-u1'], min: 25, fb: 'comments' },
        { title: 'Paraphrase and cite', method: 'performance', targets: ['skill'], level: 2, goals: ['res-s2'], min: 20, fb: 'score' },
        { title: 'Research question conference', method: 'personal', targets: ['reasoning'], level: 3, goals: ['res-u2'], min: 10, fb: 'conference' },
      ] },

    { key: 'cra', title: 'Craft: Writing Your Own Story', days: 16, source: 'curate',
      questions: ['What makes a small moment worth telling?', 'How do you know when a piece of writing is finished?'],
      goals: [
        { key: 'cra-u1', text: 'A personal story matters to a reader when the writer shows what the moment meant, not only what happened, and finds a larger idea inside a small event.', kind: 'understanding', priority: 'lasting', level: 3, after: ['nar-u1'] },
        { key: 'cra-u2', text: 'Revision is where writing gets good: it means rereading the draft as a stranger would, not only fixing mistakes.', kind: 'understanding', priority: 'lasting', level: 3, after: ['rhe-s2'] },
        { key: 'cra-k1', text: 'Narrative techniques: scene and summary, dialogue, sensory detail, pacing and reflection, seen in mentor texts such as Orwell’s "Shooting an Elephant" and Cisneros’s The House on Mango Street.', kind: 'knowledge', priority: 'important', level: 2, after: ['poe-s2'] },
        { key: 'cra-s1', text: 'Draft a narrative that puts the reader inside a specific moment with concrete detail and dialogue.', kind: 'skill', priority: 'important', level: 3, after: ['cra-k1'] },
        { key: 'cra-s2', text: 'Revise using readers’ responses: decide what to keep, cut, move and add, say why, and then edit for punctuation and sentence boundaries.', kind: 'skill', priority: 'important', level: 3, after: ['cra-u2'] },
        { key: 'cra-s3', text: 'Imitate one sentence pattern from a mentor writer to try a move you have not used before.', kind: 'skill', priority: 'familiar', level: 2, after: [] },
      ],
      major: { title: 'The personal narrative and its revision letter', method: 'performance', targets: ['reasoning', 'product'], level: 3, goals: ['cra-u1', 'cra-u2', 'cra-s1'], min: 60, out: 120, fb: 'rubric', rubric: 'analytic', retake: false,
        role: 'A writer submitting to a student literary magazine', audience: 'Readers of the magazine who do not know you', product: 'A 1,000-word personal narrative with every draft kept and a one-page letter explaining the three biggest changes between first and final draft' },
      minors: [
        { title: 'Narrative techniques check', method: 'selected', targets: ['knowledge'], level: 2, goals: ['cra-k1'], min: 10, fb: 'score' },
        { title: 'One moment in one page', method: 'performance', targets: ['skill', 'product'], level: 3, goals: ['cra-s1'], min: 25, fb: 'comments' },
        { title: 'Peer response letter', method: 'written', targets: ['reasoning'], level: 3, goals: ['cra-s2', 'cra-u2'], min: 20, fb: 'comments' },
      ] },

    { key: 'syn', title: 'Ideas in Conversation', days: 20, source: 'curate',
      questions: ['What did the year’s texts teach you about how people use power and truth?', 'What would it take to change your mind, and how would you know you had?'],
      goals: [
        { key: 'syn-u1', text: 'Texts from different times and places can answer the same human question differently, and putting them in conversation shows what each one sees and misses.', kind: 'understanding', priority: 'lasting', level: 4, after: ['nov-u1', 'rhe-u1', 'dra-u2'] },
        { key: 'syn-u2', text: 'Restating another person’s view fairly before answering it is part of how you reason well, not a courtesy added afterward.', kind: 'understanding', priority: 'lasting', level: 3, after: ['res-u1', 'rhe-u1'] },
        { key: 'syn-k1', text: 'The questions that recur across the year (power, conscience, truth and voice) and where each appeared in the texts studied, with a new pair such as Le Guin’s "The Ones Who Walk Away from Omelas" and Adichie’s "The Danger of a Single Story".', kind: 'knowledge', priority: 'important', level: 2, after: ['nov-k1', 'dra-k1'] },
        { key: 'syn-s1', text: 'Compare two or more texts on one question, with evidence from each, and reach a conclusion that neither text states by itself.', kind: 'skill', priority: 'important', level: 4, after: ['nov-s1', 'res-u2'] },
        { key: 'syn-s2', text: 'Lead and take part in a discussion: ask real questions, build on others’ points and disagree with reasons.', kind: 'skill', priority: 'important', level: 3, after: ['rhe-s1'] },
        { key: 'syn-s3', text: 'Reflect on your growth as a reader and writer, using pieces from your own portfolio as evidence.', kind: 'skill', priority: 'familiar', level: 2, after: ['cra-s2'] },
      ],
      major: { title: 'The year-end forum and synthesis essay', method: 'performance', targets: ['reasoning', 'skill', 'product'], level: 4, goals: ['syn-u1', 'syn-u2', 'syn-s1', 'syn-s2'], min: 100, out: 120, fb: 'rubric', rubric: 'analytic', retake: false,
        role: 'A panelist at a school forum on a question from the year', audience: 'Ninth graders and teachers who attend and ask questions', product: 'A six-minute prepared statement drawing on three texts, answers to audience questions, and a 1,000-word written synthesis' },
      minors: [
        { title: 'Two quotations, one conversation', method: 'written', targets: ['reasoning'], level: 3, goals: ['syn-s1'], min: 20, fb: 'comments' },
        { title: 'Seminar notes and self-assessment', method: 'personal', targets: ['reasoning', 'skill'], level: 3, goals: ['syn-s2', 'syn-u2'], min: 15, fb: 'conference' },
        { title: 'Portfolio reflection', method: 'written', targets: ['reasoning'], level: 2, goals: ['syn-s3'], min: 20, fb: 'comments' },
      ] },
  ],
});
