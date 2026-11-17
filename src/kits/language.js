/* Starter kit: Spanish 2. Communication first (interpreting, speaking with others, presenting), with culture in every unit. */
KITS.push({
  id: 'language', subject: 'language', course: 'Spanish 2', grade: '8-10',
  blurb: 'Eight units that move from talking about your own day to planning a trip, with a speaking task, an authentic text and a cultural question in every unit.',
  transfer: 'Understand and talk with Spanish speakers about everyday life, repair a conversation when words fail, and meet an unfamiliar culture with curiosity rather than judgment.',
  units: [
    { key: 'day', title: 'Our days', days: 20, source: 'curate',
      questions: ['What can a person’s daily routine tell you about the place they live?', 'What do you do when you do not know the word you need?'],
      goals: [
        { key: 'dayU1', text: 'A conversation works when both people keep trying to be understood, so a missing word is a problem to work around and not a reason to stop.', kind: 'understanding', priority: 'lasting', level: 3, after: [] },
        { key: 'dayU2', text: 'Daily schedules reflect values and climate: when people eat, rest and see family differs across Spanish-speaking places for reasons that make sense to them.', kind: 'understanding', priority: 'lasting', level: 3, after: [] },
        { key: 'dayK1', text: 'Reflexive verbs (me levanto, te duchas, se acuesta) and the present tense of common stem-changing verbs (me despierto, prefiero, duermo).', kind: 'knowledge', priority: 'important', level: 2, after: [] },
        { key: 'dayS1', text: 'Describe your own day and ask a partner about theirs, using time, order words (primero, luego, después) and how often you do things (siempre, a veces, nunca).', kind: 'skill', priority: 'important', level: 2, after: ['dayK1'] },
        { key: 'dayS2', text: 'Use circumlocution, gestures, cognates and clarifying questions (¿Cómo se dice...? ¿Puedes repetir?) to keep a conversation going.', kind: 'skill', priority: 'important', level: 3, after: [] },
        { key: 'dayK2', text: 'The names of the school subjects and the usual school day in two Spanish-speaking countries.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] }
      ],
      major: { title: 'A video message to an exchange partner', method: 'performance', targets: ['skill', 'product'], level: 3, goals: ['dayU1', 'dayU2', 'dayS1', 'dayS2'], min: 20, out: 40, fb: 'rubric', rubric: 'analytic', retake: true, role: 'An exchange student about to host a visitor from Mexico or Spain', audience: 'The partner student, who will watch it before arriving', product: 'A two-minute recorded message describing your usual school day and weekend, then three questions about theirs, followed by a short live exchange with a classmate playing the partner', },
      minors: [
        { title: 'Listen to a teenager describe her day', method: 'selected', targets: ['knowledge'], level: 2, goals: ['dayK1', 'dayK2'], min: 12, fb: 'score' },
        { title: 'Two-minute talk with a partner, no notes', method: 'personal', targets: ['skill', 'reasoning'], level: 2, goals: ['dayS1', 'dayS2'], min: 10, fb: 'comments' },
        { title: 'Compare two daily schedules', method: 'written', targets: ['reasoning'], level: 3, goals: ['dayU2'], min: 15, fb: 'comments' }
      ],
      lessons: [
        { title: 'Getting up: reflexive verbs', days: 1, blocks: [['entry', 2, []], ['retrieval', 6, ['dayK1']], ['video', 6, ['dayK1', 'dayU2'], { task: 'task' }], ['mini', 8, ['dayK1']], ['drill', 10, ['dayK1', 'dayS1']], ['partner', 8, ['dayK1']], ['exit', 6, ['dayK1']]], hw: { purpose: 'practice', kind: 'writing', min: 15, goals: ['dayK1'], fb: 'check', graded: 'completion', device: false } },
        { title: 'Order and frequency: telling my day', days: 1, blocks: [['entry', 2, []], ['retrieval', 5, ['dayK1']], ['guided', 8, ['dayS1']], ['tps', 8, ['dayS1']], ['drill', 10, ['dayS1']], ['quickwrite', 8, ['dayS1']], ['exit', 5, ['dayK1', 'dayS1']]], hw: null },
        { title: 'When you do not know the word', days: 1, blocks: [['entry', 2, []], ['retrieval', 5, ['dayK1']], ['demo', 8, ['dayS2', 'dayU1'], { predict: 'predict' }], ['drill', 10, ['dayS2']], ['simulate', 12, ['dayS2', 'dayU1']], ['reflect', 6, ['dayU1']], ['exit', 3, ['dayS2']]], hw: null },
        { title: 'Two schedules, two countries', days: 1, blocks: [['entry', 2, []], ['retrieval', 6, ['dayK1']], ['closeread', 12, ['dayU2', 'dayK2'], null], ['tps', 8, ['dayU2']], ['partner', 10, ['dayS1']], ['quickwrite', 8, ['dayU2']]], hw: { purpose: 'prepare', kind: 'watch', min: 15, goals: ['dayU2'], fb: 'discussed', graded: 'no', device: true } },
        { title: 'Practice conversation and feedback', days: 1, blocks: [['entry', 2, []], ['retrieval', 5, ['dayK1']], ['partner', 8, ['dayS1', 'dayS2']], ['perform', 14, ['dayS1', 'dayS2']], ['goover', 8, ['dayS1']], ['reflect', 8, ['dayS2', 'dayU1']]], hw: { purpose: 'finish', kind: 'project', min: 20, goals: ['dayS1', 'dayU2'], fb: 'none', graded: 'no', device: true } }
      ]
    },
    { key: 'food', title: 'Food and eating together', days: 19, source: 'curate',
      questions: ['What does a meal say about a family, a place and its history?', 'How polite is polite enough, and who decides?'],
      goals: [
        { key: 'foodU1', text: 'Food is a record of history and trade: many everyday dishes in Spanish-speaking countries come from the meeting of cultures, so one dish can tell a long story.', kind: 'understanding', priority: 'lasting', level: 3, after: ['dayU2'] },
        { key: 'foodU2', text: 'Politeness is built from small choices (greeting, tone, the formal or friendly you) and the choices that count differ between cultures.', kind: 'understanding', priority: 'important', level: 3, after: ['dayU1'] },
        { key: 'foodK1', text: 'Food and meal vocabulary, plus gustar and similar verbs (me gusta, le encantan, nos falta).', kind: 'knowledge', priority: 'important', level: 2, after: ['dayK1'] },
        { key: 'foodK2', text: 'Direct object pronouns (lo, la, los, las) so that you can say “I want it” or “we order them” without repeating the noun.', kind: 'knowledge', priority: 'important', level: 2, after: ['foodK1'] },
        { key: 'foodS1', text: 'Order, ask for a recommendation, ask about ingredients and pay, in an unscripted exchange with a server (Quisiera..., ¿Qué me recomienda?, ¿Lleva carne?, La cuenta, por favor).', kind: 'skill', priority: 'important', level: 3, after: ['dayS2', 'foodK1'] },
        { key: 'foodK3', text: 'The main regional dishes of two or three countries, such as the tortilla española, the arepa and the ceviche.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] }
      ],
      major: { title: 'The unscripted restaurant', method: 'performance', targets: ['skill', 'reasoning'], level: 3, goals: ['foodU2', 'foodS1', 'foodK2'], min: 15, out: 20, fb: 'rubric', rubric: 'single', retake: true, role: 'A customer at a family restaurant in Oaxaca or Madrid, with a server who adds a surprise (the dish is sold out, or you are vegetarian)', audience: 'The server, played by a classmate or the teacher', product: 'A live conversation of about four minutes with no script, recorded for the partner to score and for you to review' },
      minors: [
        { title: 'Read a menu and match the order', method: 'selected', targets: ['knowledge'], level: 2, goals: ['foodK1', 'foodK2'], min: 12, fb: 'score' },
        { title: 'Pronoun replacement: say it a shorter way', method: 'written', targets: ['knowledge', 'skill'], level: 2, goals: ['foodK2'], min: 10, fb: 'comments' },
        { title: 'Order from a menu with a partner', method: 'personal', targets: ['skill'], level: 2, goals: ['foodS1'], min: 8, fb: 'comments' }
      ]
    },
    { key: 'town', title: 'Getting around town', days: 18, source: 'curate',
      questions: ['How do you find your way when you cannot read the signs?', 'How does the shape of a town show what its people value?'],
      goals: [
        { key: 'townU1', text: 'Towns built around a central plaza organize life differently from towns built around roads and cars, and the layout shapes how people meet.', kind: 'understanding', priority: 'lasting', level: 3, after: ['foodU1'] },
        { key: 'townK1', text: 'Places in town, transport and prepositions of place (cerca de, al lado de, enfrente de, entre).', kind: 'knowledge', priority: 'important', level: 1, after: ['foodK1'] },
        { key: 'townK2', text: 'Informal (tú) and formal (usted) commands for giving directions: sigue, dobla, cruza; siga, doble, cruce.', kind: 'knowledge', priority: 'important', level: 2, after: ['dayK1'] },
        { key: 'townS1', text: 'Ask for and give directions to a place, and check you understood by repeating them back.', kind: 'skill', priority: 'important', level: 2, after: ['townK1', 'townK2', 'dayS2'] },
        { key: 'townS2', text: 'Read a transit map, a schedule or a street sign and say where it would take you.', kind: 'skill', priority: 'important', level: 3, after: ['townK1'] },
        { key: 'townK3', text: 'Names of famous plazas and landmarks, such as the Zócalo, Plaza Mayor and Plaza de Mayo.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] }
      ],
      major: { title: 'Welcome tour for a visiting family', method: 'performance', targets: ['skill', 'product'], level: 3, goals: ['townU1', 'townS1', 'townS2'], min: 25, out: 30, fb: 'rubric', rubric: 'analytic', retake: false, role: 'A local student welcoming a visiting family from Colombia to your town', audience: 'The family, who need to find three places on their first day', product: 'A hand-drawn map with labels in Spanish and a live conversation in which a classmate, holding only the map and a transit schedule, is guided to three places' },
      minors: [
        { title: 'Follow spoken directions on a map', method: 'selected', targets: ['knowledge'], level: 2, goals: ['townK1', 'townK2'], min: 10, fb: 'score' },
        { title: 'Give a command for each situation', method: 'written', targets: ['knowledge', 'skill'], level: 2, goals: ['townK2'], min: 10, fb: 'comments' },
        { title: 'Which stop do you get off at?', method: 'performance', targets: ['skill'], level: 3, goals: ['townS2'], min: 12, fb: 'comments' }
      ]
    },
    { key: 'past', title: 'Telling what happened', days: 22, source: 'curate',
      questions: ['How does telling a story change what happened?', 'Why does a good story need more than a list of events?'],
      goals: [
        { key: 'pastU1', text: 'A story needs a beginning, a turning point and an ending, and a narrator chooses which events to include, so the same weekend can be told in many ways.', kind: 'understanding', priority: 'lasting', level: 3, after: ['dayU1'] },
        { key: 'pastK1', text: 'The preterite of regular verbs, and of common irregular verbs such as ir, ser, hacer, tener, estar, poder and decir (fui, hice, tuve, estuve, pude, dije).', kind: 'knowledge', priority: 'important', level: 2, after: ['dayK1'] },
        { key: 'pastK2', text: 'Time expressions that signal the past (ayer, anoche, el año pasado, hace dos días) and connectors (primero, entonces, de repente, por fin).', kind: 'knowledge', priority: 'important', level: 1, after: ['dayS1'] },
        { key: 'pastS1', text: 'Tell a short story about a past event aloud, in order, with details and a reaction.', kind: 'skill', priority: 'important', level: 3, after: ['pastK1', 'pastK2', 'foodS1'] },
        { key: 'pastS2', text: 'Read a short narrative and answer who, what, when and why, and what the writer felt.', kind: 'skill', priority: 'important', level: 2, after: ['pastK1', 'townS2'] },
        { key: 'pastK3', text: 'Spelling changes in the preterite (busqué, pagué, empecé, leyó).', kind: 'knowledge', priority: 'familiar', level: 1, after: ['pastK1'] }
      ],
      major: { title: 'The story of a trip', method: 'performance', targets: ['skill', 'product'], level: 3, goals: ['pastU1', 'pastS1', 'pastK1'], min: 15, out: 40, fb: 'rubric', rubric: 'analytic', retake: true, role: 'A travel blogger who has just come home', audience: 'Readers of a class travel blog, and a classmate who must retell one part to show she understood', product: 'A written story of at least eight sentences about a real or imagined trip, told aloud to a partner, with photographs or drawings' },
      minors: [
        { title: 'Verb forms in short contexts', method: 'selected', targets: ['knowledge'], level: 1, goals: ['pastK1', 'pastK2'], min: 12, fb: 'score' },
        { title: 'What happened to Mateo?', method: 'written', targets: ['reasoning'], level: 2, goals: ['pastS2'], min: 15, fb: 'comments' },
        { title: 'Tell me about your weekend', method: 'personal', targets: ['skill'], level: 2, goals: ['pastS1'], min: 8, fb: 'comments' }
      ]
    },
    { key: 'then', title: 'When I was younger', days: 20, source: 'curate',
      questions: ['How do memories of childhood shape who we say we are?', 'What changes when you hear a story from the person who lived it?'],
      goals: [
        { key: 'thenU1', text: 'A person’s life is told with two kinds of past, what was going on and what happened, and Spanish makes that difference in every verb.', kind: 'understanding', priority: 'lasting', level: 3, after: ['pastU1'] },
        { key: 'thenU2', text: 'Listening to someone older tells you what a textbook cannot: the same event looks different to the person who lived it.', kind: 'understanding', priority: 'important', level: 3, after: ['townU1'] },
        { key: 'thenK1', text: 'The imperfect tense, with its three irregular verbs (era, iba, veía), used for habits, descriptions and the background of a story.', kind: 'knowledge', priority: 'important', level: 2, after: ['pastK1'] },
        { key: 'thenS1', text: 'Choose between the preterite and the imperfect and explain the choice in terms of what the speaker means.', kind: 'skill', priority: 'important', level: 3, after: ['thenK1', 'pastK1'] },
        { key: 'thenS2', text: 'Ask follow-up questions in an interview and keep notes in Spanish on what the other person said.', kind: 'skill', priority: 'important', level: 3, after: ['dayS2', 'pastS2'] },
        { key: 'thenK2', text: 'Words for childhood, games, family members and holidays.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] }
      ],
      major: { title: 'A life in three paragraphs', method: 'performance', targets: ['skill', 'reasoning', 'product'], level: 4, goals: ['thenU1', 'thenU2', 'thenS1', 'thenS2'], min: 20, out: 45, fb: 'rubric', rubric: 'analytic', retake: true, role: 'A community interviewer, working with a Spanish-speaking relative, neighbour or guest', audience: 'The person interviewed, and the class, who will hear a short oral summary', product: 'An interview of ten minutes, with a profile of three paragraphs in Spanish that tells what the person’s childhood was like and one event that changed it' },
      minors: [
        { title: 'Pick the tense and say why', method: 'written', targets: ['reasoning'], level: 3, goals: ['thenS1', 'thenK1'], min: 15, fb: 'comments' },
        { title: 'Listen to a grandmother’s story', method: 'selected', targets: ['knowledge', 'reasoning'], level: 2, goals: ['thenK1', 'thenU1'], min: 12, fb: 'score' },
        { title: 'Practice interview with a classmate', method: 'personal', targets: ['skill'], level: 3, goals: ['thenS2'], min: 10, fb: 'comments' }
      ]
    },
    { key: 'care', title: 'Taking care of ourselves', days: 18, source: 'curate',
      questions: ['How do you ask for help in a language you are still learning?', 'What does it mean to be healthy, and who gets to say?'],
      goals: [
        { key: 'careU1', text: 'Speaking up clearly matters most when stakes are high, so it is worth learning how to describe a problem and ask for what you need.', kind: 'understanding', priority: 'lasting', level: 3, after: ['dayU1'] },
        { key: 'careK1', text: 'Parts of the body, common symptoms and doler (me duele la cabeza, le duelen los oídos), plus tener and estar for how you feel (tengo fiebre, estoy cansado).', kind: 'knowledge', priority: 'important', level: 1, after: ['foodK1'] },
        { key: 'careK2', text: 'Advice using commands and expressions such as debes, necesitas, tienes que and es importante (Descansa. Toma agua.).', kind: 'knowledge', priority: 'important', level: 2, after: ['townK2'] },
        { key: 'careS1', text: 'Explain a symptom, answer a health worker’s questions and understand the advice you are given.', kind: 'skill', priority: 'important', level: 3, after: ['careK1', 'careK2', 'thenS1'] },
        { key: 'careS2', text: 'Read a label, a flyer or a short article about health and find the main advice.', kind: 'skill', priority: 'important', level: 2, after: ['pastS2', 'townS2'] },
        { key: 'careK3', text: 'How health care and pharmacies work in some Spanish-speaking countries, for example the farmacia that gives advice without a visit.', kind: 'knowledge', priority: 'familiar', level: 1, after: ['townU1'] }
      ],
      major: { title: 'At the clinic and the pharmacy', method: 'performance', targets: ['skill', 'reasoning'], level: 3, goals: ['careU1', 'careS1', 'careS2'], min: 20, out: 20, fb: 'rubric', rubric: 'single', retake: true, role: 'A traveler who feels ill while visiting Costa Rica, then a volunteer who helps another traveler', audience: 'A doctor and a pharmacist, played by classmates holding a card with the diagnosis and advice', product: 'Two linked live conversations, one explaining symptoms and one passing the advice on in Spanish to a friend, followed by a one-paragraph summary' },
      minors: [
        { title: 'Match the problem to the advice', method: 'selected', targets: ['knowledge'], level: 1, goals: ['careK1', 'careK2'], min: 10, fb: 'score' },
        { title: 'Read a label and answer questions', method: 'written', targets: ['skill', 'reasoning'], level: 2, goals: ['careS2'], min: 15, fb: 'comments' },
        { title: 'Describe how you feel to a partner', method: 'personal', targets: ['skill'], level: 2, goals: ['careS1'], min: 8, fb: 'comments' }
      ]
    },
    { key: 'fiesta', title: 'Celebrations around the Spanish-speaking world', days: 20, source: 'curate',
      questions: ['Why do communities keep traditions that are expensive, tiring or hard to explain?', 'How do you describe a tradition that is not yours without turning it into a stereotype?'],
      goals: [
        { key: 'fiU1', text: 'A tradition holds a community’s values and memory, and the people inside it understand it differently from the way outsiders first describe it.', kind: 'understanding', priority: 'lasting', level: 3, after: ['foodU1', 'thenU2'] },
        { key: 'fiU2', text: 'Spanish-speaking countries are many cultures and not one, so a generalization about all of them is usually wrong.', kind: 'understanding', priority: 'lasting', level: 3, after: ['dayU2'] },
        { key: 'fiK1', text: 'Key facts about three or four celebrations, such as Día de Muertos in Mexico, Las Fallas in Valencia, the Inti Raymi in Cusco and a local celebration of a Spanish-speaking community near you.', kind: 'knowledge', priority: 'important', level: 2, after: ['foodK3'] },
        { key: 'fiS1', text: 'Compare a tradition from a Spanish-speaking community with one of your own, using comparisons (más... que, tan... como) and describing the past and the present in the same piece.', kind: 'skill', priority: 'important', level: 3, after: ['thenS1', 'pastS1'] },
        { key: 'fiS2', text: 'Read or listen to authentic sources (a news clip, a festival schedule, a family video) and pull out the main idea and key details without knowing every word.', kind: 'skill', priority: 'important', level: 3, after: ['careS2', 'pastS2'] },
        { key: 'fiK2', text: 'The comparative and superlative (más grande que, el mejor, tan rápido como).', kind: 'knowledge', priority: 'familiar', level: 1, after: ['foodK1'] }
      ],
      major: { title: 'A celebration, explained to outsiders', method: 'performance', targets: ['skill', 'reasoning', 'product'], level: 4, goals: ['fiU1', 'fiU2', 'fiS1', 'fiS2'], min: 25, out: 50, fb: 'rubric', rubric: 'analytic', retake: false, role: 'A cultural guide for a museum exhibit on one celebration', audience: 'Visitors who have never seen it, and a Spanish-speaking community member who is asked whether the exhibit gets it right', product: 'A presentation of three minutes in Spanish with a poster or slides, using at least two authentic sources, and a comparison with a tradition of your own' },
      minors: [
        { title: 'Authentic text: what is this festival?', method: 'written', targets: ['skill', 'reasoning'], level: 3, goals: ['fiS2', 'fiK1'], min: 15, fb: 'comments' },
        { title: 'Check for a stereotype', method: 'written', targets: ['reasoning'], level: 3, goals: ['fiU2'], min: 10, fb: 'comments' },
        { title: 'Explain a tradition in one minute', method: 'personal', targets: ['skill'], level: 2, goals: ['fiS1'], min: 8, fb: 'comments' }
      ]
    },
    { key: 'trip', title: 'Planning a trip together', days: 20, source: 'curate',
      questions: ['What would you need to know before you could really live in another place for a month?', 'What have you learned this year that you can do with Spanish and could not before?'],
      goals: [
        { key: 'trU1', text: 'Using a language is the best way to learn it, and every task you can carry out in Spanish (ordering, asking, telling, explaining) makes the next one easier.', kind: 'understanding', priority: 'lasting', level: 3, after: ['dayU1', 'careU1'] },
        { key: 'trU2', text: 'Travel changes when you can talk to people: the places you visit stay the same, but what you learn from them depends on your ability to ask.', kind: 'understanding', priority: 'important', level: 3, after: ['fiU1'] },
        { key: 'trK1', text: 'Plans and wishes with ir a + infinitive and querer, pensar and esperar + infinitive (voy a visitar, quiero ver, pienso quedarme).', kind: 'knowledge', priority: 'important', level: 2, after: ['pastK1', 'thenK1'] },
        { key: 'trS1', text: 'Plan a trip using authentic sources (a hotel page, a bus schedule, a weather forecast), compare options and choose one with reasons.', kind: 'skill', priority: 'important', level: 3, after: ['fiS2', 'townS2', 'fiK2'] },
        { key: 'trS2', text: 'Hold a conversation of several minutes that moves from the past to the future, handling a question you did not expect.', kind: 'skill', priority: 'important', level: 3, after: ['foodS1', 'careS1', 'pastS1', 'thenS2'] },
        { key: 'trK2', text: 'A few of the places a visitor might choose, such as Machu Picchu, Granada, Cartagena and the Galápagos.', kind: 'knowledge', priority: 'familiar', level: 1, after: ['townK3'] }
      ],
      major: { title: 'The trip proposal and the interview', method: 'performance', targets: ['skill', 'reasoning', 'product'], level: 4, goals: ['trU1', 'trS1', 'trS2'], min: 30, out: 30, fb: 'rubric', rubric: 'analytic', retake: false, role: 'A student on a team planning a school exchange trip of a week', audience: 'A panel of the teacher and two other adults who ask questions in Spanish, with the class as a committee voting on proposals', product: 'A trip proposal with a day-by-day plan, a budget and two authentic sources, presented in Spanish for five minutes, followed by five minutes of unrehearsed questions' },
      minors: [
        { title: 'Read the schedule and the weather, then choose', method: 'written', targets: ['skill', 'reasoning'], level: 3, goals: ['trS1'], min: 15, fb: 'comments' },
        { title: 'Future plans in short contexts', method: 'selected', targets: ['knowledge'], level: 1, goals: ['trK1'], min: 10, fb: 'score' },
        { title: 'Three-minute conversation across the year', method: 'personal', targets: ['skill'], level: 3, goals: ['trS2'], min: 10, fb: 'conference' }
      ]
    }
  ]
});
