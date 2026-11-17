/* Starter kit: United States History. A survey from the first encounters to the present, built around sources, causes and change over time. */
KITS.push({
  id: 'history', subject: 'history', course: 'United States History', grade: '11',
  blurb: 'Eight chronological units from Native America and the colonies to the present, each organized around an argument students make from primary sources, with historical thinking taught inside the content.',
  transfer: 'Read a source or a claim about the past or the present, ask who made it and why, weigh it against other evidence, and make and defend your own argument about what happened and why it mattered.',
  units: [
    { key: 'col', title: 'Encounters and Colonies, to 1763', days: 18, source: 'curate',
      questions: ['How do we know what happened when the only accounts were written by one side?', 'What decided how different the colonies turned out to be?'],
      goals: [
        { key: 'col-u1', text: 'The past is known only through sources that people made for their own purposes, so a historian asks who made a source, when, for whom and why before using it as evidence.', kind: 'understanding', priority: 'lasting', level: 3, after: [] },
        { key: 'col-u2', text: 'When Native peoples, Europeans and Africans met in the Americas, what happened depended on power, disease, trade and choices on every side, and the colonies that formed differed because of their purposes, their geography and the people already living there.', kind: 'understanding', priority: 'lasting', level: 3, after: ['col-u1'] },
        { key: 'col-k1', text: 'Native societies before 1492, the Columbian Exchange, Jamestown and tobacco, the Pilgrims and Puritans, the Middle Passage and the beginning of slavery in English America, and the Middle Colonies.', kind: 'knowledge', priority: 'important', level: 1, after: [] },
        { key: 'col-s1', text: 'Question a source: say who wrote it, when, for whom and why, and what it can and cannot tell us.', kind: 'skill', priority: 'important', level: 3, after: ['col-u1'] },
        { key: 'col-s2', text: 'Write a historical claim that answers a question, supported by evidence from at least two sources, with one piece of evidence that complicates it.', kind: 'skill', priority: 'important', level: 3, after: ['col-s1'] },
        { key: 'col-k2', text: 'The Salem witch trials and Bacon’s Rebellion as signs of tension inside the colonies.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] },
      ],
      major: { title: 'Three panels on Jamestown', method: 'performance', targets: ['reasoning', 'product'], level: 3, goals: ['col-u1', 'col-u2', 'col-s1', 'col-s2'], min: 50, out: 60, fb: 'rubric', rubric: 'analytic', retake: true,
        role: 'A historian preparing a museum exhibit', audience: 'Visitors who know little about the colony', product: 'Three exhibit panels of about 150 words each on the question "What happened when the English and the Powhatan met at Jamestown?", using at least four sources (the Virginia Company’s 1606 instructions, John Smith’s accounts, archaeology and the Powhatan speech Smith reports) and saying what each can and cannot show' },
      minors: [
        { title: 'Key terms and map quiz', method: 'selected', targets: ['knowledge'], level: 1, goals: ['col-k1'], min: 12, fb: 'score' },
        { title: 'Questions for a source', method: 'written', targets: ['reasoning'], level: 3, goals: ['col-s1', 'col-u1'], min: 20, fb: 'comments' },
        { title: 'Claim and evidence paragraph', method: 'written', targets: ['reasoning'], level: 3, goals: ['col-s2', 'col-u2'], min: 20, fb: 'comments' },
      ],
      lessons: [
        { title: 'What can a backpack tell us?', days: 1, blocks: [
            ['entry', 2], ['quickwrite', 5, ['col-u1']], ['gallery', 12, ['col-u1']], ['tps', 8, ['col-u1']], ['mini', 8, ['col-s1']], ['qa', 6, ['col-u1'], { who: 'all' }], ['exit', 4, ['col-u1']]],
          hw: { purpose: 'prepare', kind: 'reading', min: 20, goals: ['col-k1'], fb: 'discussed', graded: 'no', device: false } },
        { title: 'Peoples of the Americas before 1492', days: 1, blocks: [
            ['entry', 2], ['retrieval', 5, ['col-s1']], ['video', 8, ['col-k1'], { task: 'task' }], ['stations', 20, ['col-k1']], ['qa', 6, ['col-k1'], { who: 'all' }], ['exit', 4, ['col-k1']]],
          hw: { purpose: 'practice', kind: 'reading', min: 20, goals: ['col-k1'], fb: 'check', graded: 'completion', device: false } },
        { title: 'The Columbian Exchange: who gained and who lost?', days: 1, blocks: [
            ['entry', 2], ['retrieval', 6, ['col-k1']], ['mini', 8, ['col-k1']], ['task', 14, ['col-u2']], ['seminar', 12, ['col-u2'], { prep: 'notes' }], ['exit', 4, ['col-u2']]],
          hw: { purpose: 'review', kind: 'study', min: 15, goals: ['col-k1'], fb: 'none', graded: 'no', device: false } },
        { title: 'Jamestown through two sources', days: 1, blocks: [
            ['entry', 2], ['retrieval', 5, ['col-s1']], ['worked', 10, ['col-s1']], ['closeread', 15, ['col-s1', 'col-u2']], ['qa', 8, ['col-u1'], { who: 'cold' }], ['reflect', 5, ['col-u1']]],
          hw: { purpose: 'prepare', kind: 'reading', min: 25, goals: ['col-s1'], fb: 'discussed', graded: 'completion', device: false } },
        { title: 'From evidence to a claim', days: 1, blocks: [
            ['entry', 2], ['quiz', 10, ['col-k1'], { fb: 'now' }], ['worked', 8, ['col-s2']], ['indep', 12, ['col-s2'], { fb: 'circulate' }], ['peer', 10, ['col-s2']], ['exit', 4, ['col-s2']]],
          hw: { purpose: 'finish', kind: 'writing', min: 25, goals: ['col-s2'], fb: 'comments', graded: 'completion', device: true } },
      ] },

    { key: 'rev', title: 'Revolution and a New Nation, 1763 to 1800', days: 20, source: 'curate',
      questions: ['When is a government no longer owed obedience?', 'How much power should a national government have, and who should hold the rest?'],
      goals: [
        { key: 'rev-u1', text: 'The American Revolution grew out of disputes over who had the right to tax and govern, and its leaders justified it with ideas of natural rights that the new nation applied unevenly, leaving a gap between its ideals and its practice.', kind: 'understanding', priority: 'lasting', level: 3, after: ['col-u2'] },
        { key: 'rev-u2', text: 'The Constitution was a set of compromises that answered the failures of the Articles of Confederation by dividing power among branches and between nation and states, and where power belongs is an argument every generation continues.', kind: 'understanding', priority: 'lasting', level: 3, after: ['rev-u1'] },
        { key: 'rev-k1', text: 'The French and Indian War and the new taxes, the Stamp Act, the Boston Massacre and Tea Party, Lexington and Concord, the Declaration of Independence, Saratoga and Yorktown, the Articles of Confederation, Shays’ Rebellion, the Convention’s compromises (the Great Compromise and the three-fifths clause), the Federalist Papers and the Bill of Rights.', kind: 'knowledge', priority: 'important', level: 1, after: ['col-k1'] },
        { key: 'rev-s1', text: 'Read the Declaration of Independence closely: its principles, its argument and its list of grievances.', kind: 'skill', priority: 'important', level: 3, after: ['col-s1'] },
        { key: 'rev-s2', text: 'Explain several causes of an event and weigh which mattered most, with reasons.', kind: 'skill', priority: 'important', level: 3, after: ['col-s2', 'rev-k1'] },
        { key: 'rev-k2', text: 'The main campaigns of the war, Valley Forge and the French alliance.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] },
      ],
      major: { title: 'Why replace the Articles?', method: 'written', targets: ['reasoning'], level: 3, goals: ['rev-u2', 'rev-s2', 'rev-k1'], min: 75, out: 15, fb: 'rubric', rubric: 'analytic', retake: true,
        role: '', audience: '', product: '' },
      minors: [
        { title: 'Events and terms sequence quiz', method: 'selected', targets: ['knowledge'], level: 1, goals: ['rev-k1'], min: 12, fb: 'score' },
        { title: 'The Declaration: principle and grievance', method: 'written', targets: ['reasoning'], level: 3, goals: ['rev-s1', 'rev-u1'], min: 20, fb: 'comments' },
        { title: 'Seminar: Federalists and Anti-Federalists', method: 'personal', targets: ['reasoning'], level: 3, goals: ['rev-u2'], min: 25, fb: 'conference' },
      ] },

    { key: 'wst', title: 'Expansion, Reform and Slavery, 1800 to 1860', days: 20, source: 'curate',
      questions: ['Who benefited from the nation’s growth, and who paid for it?', 'How do people use a country’s own ideals to ask it to change?'],
      goals: [
        { key: 'wst-u1', text: 'Growth in land, markets and voters brought opportunity to many, but the same expansion deepened slavery and removed Native nations from their land, and the conflict over slavery grew with the country.', kind: 'understanding', priority: 'lasting', level: 3, after: ['rev-u1', 'col-u2'] },
        { key: 'wst-u2', text: 'Reform movements such as abolition, women’s rights and temperance show citizens using the nation’s own ideals to demand change, and they met organized resistance.', kind: 'understanding', priority: 'lasting', level: 3, after: ['rev-u1'] },
        { key: 'wst-k1', text: 'The Louisiana Purchase, Marbury v. Madison, the Erie Canal and the market revolution, Jacksonian democracy, the Indian Removal Act and the Trail of Tears, the Missouri Compromise, the Second Great Awakening, Seneca Falls, Texas and the Mexican-American War, and the Compromise of 1850.', kind: 'knowledge', priority: 'important', level: 1, after: ['rev-k1'] },
        { key: 'wst-s1', text: 'Use maps and numbers, such as census counts and cotton production, to describe and explain change over time.', kind: 'skill', priority: 'important', level: 3, after: ['col-s1'] },
        { key: 'wst-s2', text: 'Compare two perspectives on one event or policy, such as Cherokee and federal views of removal, and explain why they differ.', kind: 'skill', priority: 'important', level: 3, after: ['col-s1', 'rev-s2'] },
        { key: 'wst-k2', text: 'The writers and artists of the 1830s and 1840s, such as Emerson, Thoreau and the Hudson River painters.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] },
      ],
      major: { title: 'Worcester v. Georgia: the hearing', method: 'performance', targets: ['reasoning', 'skill', 'product'], level: 3, goals: ['wst-u1', 'wst-s2', 'wst-k1'], min: 70, out: 60, fb: 'rubric', rubric: 'analytic', retake: false,
        role: 'A lawyer for the Cherokee Nation or for Georgia, and then a Supreme Court justice', audience: 'A panel of justices made up of classmates and a visiting adult', product: 'An oral argument and a short brief citing the Constitution, treaties and facts of the case, followed by a written opinion explaining how you would decide and why, and what you expect would follow' },
      minors: [
        { title: 'Timeline and geography quiz', method: 'selected', targets: ['knowledge'], level: 1, goals: ['wst-k1'], min: 12, fb: 'score' },
        { title: 'Read the map and the numbers', method: 'performance', targets: ['skill'], level: 3, goals: ['wst-s1'], min: 20, fb: 'comments' },
        { title: 'A reform movement in one paragraph', method: 'written', targets: ['reasoning'], level: 3, goals: ['wst-u2'], min: 20, fb: 'comments' },
      ] },

    { key: 'civ', title: 'Civil War and Reconstruction, 1850 to 1877', days: 20, source: 'curate',
      questions: ['What made compromise impossible in 1860?', 'What did freedom mean in 1865, and who decided?'],
      goals: [
        { key: 'civ-u1', text: 'Slavery was the central cause of secession and war, as the secession declarations and the speeches of Confederate leaders say in their own words, while other factors shaped how and when the conflict came.', kind: 'understanding', priority: 'lasting', level: 3, after: ['wst-u1'] },
        { key: 'civ-u2', text: 'Reconstruction tried to rebuild the nation and to define freedom and citizenship through the 13th, 14th and 15th Amendments, and its limited and contested results shaped American life long after 1877.', kind: 'understanding', priority: 'lasting', level: 3, after: ['wst-u1', 'rev-u1'] },
        { key: 'civ-k1', text: 'Dred Scott, the Lincoln-Douglas debates, the election of 1860, secession, Antietam and the Emancipation Proclamation, Gettysburg, Appomattox, the Freedmen’s Bureau, the Black Codes, the Reconstruction Amendments, and the end of Reconstruction in 1877.', kind: 'knowledge', priority: 'important', level: 1, after: ['wst-k1'] },
        { key: 'civ-s1', text: 'Analyze a primary source, such as a state’s declaration of secession, Lincoln’s Second Inaugural or a Freedmen’s Bureau report, and place it in its context.', kind: 'skill', priority: 'important', level: 3, after: ['col-s1', 'rev-s1'] },
        { key: 'civ-s2', text: 'Explain how historians can reach different interpretations of the same events, and judge which is best supported by evidence.', kind: 'skill', priority: 'important', level: 4, after: ['wst-s2'] },
        { key: 'civ-k2', text: 'The major battles of the war in order and what each changed.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] },
      ],
      major: { title: 'The freedom podcast', method: 'performance', targets: ['reasoning', 'product'], level: 3, goals: ['civ-u2', 'civ-s1', 'civ-u1'], min: 50, out: 90, fb: 'rubric', rubric: 'analytic', retake: true,
        role: 'The host of a history podcast', audience: 'Listeners who know the war but not Reconstruction', product: 'A ten-minute episode and transcript on the question "What did freedom mean to formerly enslaved people between 1865 and 1870, and who decided?", using at least four primary sources such as the January 1865 meeting with General Sherman, the Mississippi Black Codes and the 14th Amendment' },
      minors: [
        { title: 'Events and terms quiz', method: 'selected', targets: ['knowledge'], level: 1, goals: ['civ-k1'], min: 12, fb: 'score' },
        { title: 'Reading the secession declarations', method: 'written', targets: ['reasoning'], level: 3, goals: ['civ-u1', 'civ-s1'], min: 25, fb: 'comments' },
        { title: 'Two interpretations of Reconstruction', method: 'written', targets: ['reasoning'], level: 4, goals: ['civ-s2', 'civ-u2'], min: 25, fb: 'comments' },
      ] },

    { key: 'ind', title: 'Industrial America and Progressive Reform, 1877 to 1914', days: 22, source: 'curate',
      questions: ['Was the Gilded Age an age of progress?', 'What should government do about problems that markets create?'],
      goals: [
        { key: 'ind-u1', text: 'Industrialization created new wealth, new kinds of work and new cities, and it also created new inequality, so Americans disagreed about whether and how government should respond.', kind: 'understanding', priority: 'lasting', level: 3, after: ['wst-u1', 'civ-u2'] },
        { key: 'ind-u2', text: 'The reform arguments of the Progressive Era, over trusts, labor, food safety and the vote, set patterns for later debates about the government’s role in the economy and in society.', kind: 'understanding', priority: 'lasting', level: 3, after: ['ind-u1', 'wst-u2'] },
        { key: 'ind-k1', text: 'The transcontinental railroad, Carnegie and Rockefeller, the Homestead and Pullman strikes, Ellis Island and the Chinese Exclusion Act, the Populists, Plessy v. Ferguson, The Jungle, the Pure Food and Drug Act, the 19th Amendment and the Spanish-American War.', kind: 'knowledge', priority: 'important', level: 1, after: ['civ-k1'] },
        { key: 'ind-s1', text: 'Read tables and graphs of wages, immigration or production and use them as evidence for or against a claim.', kind: 'skill', priority: 'important', level: 3, after: ['wst-s1'] },
        { key: 'ind-s2', text: 'Write an argument with a claim, evidence from several sources and an answered counterclaim in response to a question such as "Was the Gilded Age an age of progress?"', kind: 'skill', priority: 'important', level: 3, after: ['col-s2', 'rev-s2'] },
        { key: 'ind-k2', text: 'Inventors and inventions of the era, such as Edison, Bell and the Wright brothers, and how they changed daily life.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] },
      ],
      major: { title: 'The town hall of 1902', method: 'performance', targets: ['reasoning', 'skill', 'product'], level: 3, goals: ['ind-u1', 'ind-u2', 'ind-s2'], min: 70, out: 60, fb: 'rubric', rubric: 'analytic', retake: false,
        role: 'A person of the time: factory owner, union organizer, immigrant worker, farmer, reformer or newspaper editor', audience: 'A town hall of classmates and a visiting community member', product: 'A written position statement, a three-minute speech and a rebuttal on whether government should regulate the great trusts, using evidence from primary sources and data of the period' },
      minors: [
        { title: 'Events and terms quiz', method: 'selected', targets: ['knowledge'], level: 1, goals: ['ind-k1'], min: 12, fb: 'score' },
        { title: 'What do these numbers show?', method: 'performance', targets: ['skill'], level: 3, goals: ['ind-s1'], min: 20, fb: 'comments' },
        { title: 'Thesis and outline for a progress argument', method: 'written', targets: ['reasoning'], level: 3, goals: ['ind-s2', 'ind-u1'], min: 20, fb: 'comments' },
      ] },

    { key: 'war', title: 'War, Boom and Bust, 1914 to 1945', days: 22, source: 'curate',
      questions: ['How much should a government do when the economy collapses?', 'How should we judge a decision made in a crisis, knowing what we know now?'],
      goals: [
        { key: 'war-u1', text: 'The Great Depression and the New Deal changed what Americans expect from their government, and historians and citizens still argue about how well the New Deal worked and what it cost.', kind: 'understanding', priority: 'lasting', level: 3, after: ['ind-u2'] },
        { key: 'war-u2', text: 'Two world wars made the United States a global power and changed life at home, and they forced hard choices about liberty and security, such as the incarceration of Japanese Americans, and about what a nation owes the world.', kind: 'understanding', priority: 'lasting', level: 3, after: ['rev-u2', 'ind-u1'] },
        { key: 'war-k1', text: 'Entry into World War I and the League of Nations debate, the Great Migration and the Harlem Renaissance, the 1929 crash, the New Deal (Social Security, the FDIC), Pearl Harbor, Executive Order 9066, the Holocaust, D-Day and the atomic bombs.', kind: 'knowledge', priority: 'important', level: 1, after: ['ind-k1'] },
        { key: 'war-s1', text: 'Explain why the Depression was so long and deep by weighing several causes against the evidence.', kind: 'skill', priority: 'important', level: 3, after: ['rev-s2', 'ind-s1'] },
        { key: 'war-s2', text: 'Judge a decision by the information and options the decision makers had then, say what evidence would change your judgment, and say what we know now that they did not.', kind: 'skill', priority: 'important', level: 4, after: ['civ-s2', 'ind-s2'] },
        { key: 'war-k2', text: 'Prohibition and the culture of the 1920s, including jazz and the first flights across the Atlantic.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] },
      ],
      major: { title: 'The decision memo', method: 'performance', targets: ['reasoning', 'product'], level: 4, goals: ['war-u2', 'war-s2', 'war-u1'], min: 60, out: 75, fb: 'rubric', rubric: 'analytic', retake: false,
        role: 'An adviser to a president at a moment of decision: Hoover on relief in 1932, Roosevelt on Japanese Americans in 1942 or Truman on the atomic bomb in 1945', audience: 'The president, played by a panel with the teacher', product: 'A two-page memo setting out the options, what was known then, the costs and risks of each, a recommendation and the evidence that would change it, followed by a three-minute briefing' },
      minors: [
        { title: 'Events and terms quiz', method: 'selected', targets: ['knowledge'], level: 1, goals: ['war-k1'], min: 12, fb: 'score' },
        { title: 'Causes of the Depression, weighed', method: 'written', targets: ['reasoning'], level: 3, goals: ['war-s1'], min: 25, fb: 'comments' },
        { title: 'Then and now: one decision', method: 'personal', targets: ['reasoning'], level: 4, goals: ['war-s2'], min: 15, fb: 'conference' },
      ] },

    { key: 'cld', title: 'The Cold War and the Struggle for Rights, 1945 to 1975', days: 20, source: 'curate',
      questions: ['How did fear of an outside enemy change life inside the country?', 'How does a movement turn a principle into a law?'],
      goals: [
        { key: 'cld-u1', text: 'The Cold War shaped American foreign policy and politics for decades, and the fear it produced affected civil liberties and daily life at home as well as actions abroad.', kind: 'understanding', priority: 'lasting', level: 3, after: ['war-u2'] },
        { key: 'cld-u2', text: 'The civil rights movement used courts, law, protest and organizing together to press the nation to live up to the 14th Amendment, and its gains came from the sustained work of ordinary people as well as famous leaders.', kind: 'understanding', priority: 'lasting', level: 3, after: ['civ-u2', 'ind-u2', 'rev-u1'] },
        { key: 'cld-k1', text: 'Containment, the Marshall Plan and NATO, Korea, the Cuban Missile Crisis, McCarthyism, the Vietnam War and the Tet Offensive.', kind: 'knowledge', priority: 'important', level: 1, after: ['war-k1'] },
        { key: 'cld-k2', text: 'Brown v. Board of Education, the Montgomery bus boycott, Little Rock, the sit-ins, Freedom Summer, the Civil Rights Act of 1964, the Voting Rights Act of 1965 and the Great Society.', kind: 'knowledge', priority: 'important', level: 1, after: ['civ-k1'] },
        { key: 'cld-s1', text: 'Analyze a primary source from the era, such as a speech, a photograph, a court ruling or a song, and explain its purpose and its audience.', kind: 'skill', priority: 'important', level: 3, after: ['civ-s1'] },
        { key: 'cld-s2', text: 'Make a claim about change over time that connects events across decades, such as from Plessy to Brown to the Voting Rights Act, and test it against evidence that does not fit.', kind: 'skill', priority: 'important', level: 4, after: ['ind-s2', 'civ-s2'] },
      ],
      major: { title: 'The movement documentary', method: 'performance', targets: ['reasoning', 'skill', 'product'], level: 4, goals: ['cld-u2', 'cld-s1', 'cld-s2'], min: 60, out: 120, fb: 'rubric', rubric: 'analytic', retake: false,
        role: 'A documentary producer', audience: 'Visitors to a local museum', product: 'An eight-minute film or exhibit on one campaign, such as the Greensboro sit-ins, Freedom Summer or the Delano grape strike, built from primary sources and explaining how organizing, law and protest worked together' },
      minors: [
        { title: 'Events and terms quiz', method: 'selected', targets: ['knowledge'], level: 1, goals: ['cld-k1', 'cld-k2'], min: 12, fb: 'score' },
        { title: 'Source analysis: a speech or a photograph', method: 'written', targets: ['reasoning'], level: 3, goals: ['cld-s1'], min: 20, fb: 'comments' },
        { title: 'Containment at home and abroad', method: 'personal', targets: ['reasoning'], level: 3, goals: ['cld-u1'], min: 15, fb: 'conference' },
      ] },

    { key: 'now', title: 'A Changing Nation, 1975 to Today', days: 16, source: 'build',
      questions: ['How do you write history about events you lived through?', 'What questions does each generation of Americans have to answer again?'],
      goals: [
        { key: 'now-u1', text: 'Recent history is still being interpreted; historians use the same tools of sources, context and evidence on it, but without the distance that time brings, so claims about the present need extra care.', kind: 'understanding', priority: 'lasting', level: 3, after: ['col-u1', 'civ-s2'] },
        { key: 'now-u2', text: 'Across American history the same questions keep returning: how much power belongs to government and at what level, who counts as a full member of the nation, and what role the nation should play in the world, and earlier answers help in judging new ones.', kind: 'understanding', priority: 'lasting', level: 4, after: ['rev-u2', 'civ-u2', 'ind-u1', 'cld-u1'] },
        { key: 'now-k1', text: 'Watergate, the oil shocks, the end of the Cold War, immigration since 1965, the growth of the internet, September 11 and the wars that followed, and the financial crisis of 2008.', kind: 'knowledge', priority: 'important', level: 1, after: ['cld-k1'] },
        { key: 'now-s1', text: 'Compare how a news report and primary sources describe a recent event, and judge which are more reliable and why.', kind: 'skill', priority: 'important', level: 3, after: ['col-s1', 'now-u1'] },
        { key: 'now-s2', text: 'Investigate a question about the recent past using several sources and present a claim with its evidence and its limits.', kind: 'skill', priority: 'important', level: 4, after: ['ind-s2', 'cld-s2'] },
        { key: 'now-k2', text: 'Technologies and cultural moments since 1975, such as the personal computer and the smartphone.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] },
      ],
      major: { title: 'A history of the present', method: 'performance', targets: ['reasoning', 'product'], level: 4, goals: ['now-u1', 'now-u2', 'now-s2'], min: 60, out: 150, fb: 'rubric', rubric: 'analytic', retake: false,
        role: 'A historian in residence at the local library', audience: 'Community members at a public evening', product: 'A researched question about a current issue, an annotated list of sources and a seven-minute talk showing how the issue connects to an earlier period studied this year' },
      minors: [
        { title: 'Events and terms quiz', method: 'selected', targets: ['knowledge'], level: 1, goals: ['now-k1'], min: 12, fb: 'score' },
        { title: 'Source reliability check', method: 'written', targets: ['reasoning'], level: 3, goals: ['now-s1', 'now-u1'], min: 20, fb: 'comments' },
        { title: 'Proposal conference', method: 'personal', targets: ['reasoning'], level: 3, goals: ['now-s2'], min: 10, fb: 'conference' },
      ] },
  ],
});
