/* Starter kit: Health and Wellness, a one-year course that combines health education with physical education.
   Topics follow mainstream national guidance; a teacher should check the sexual health and substance units against district and state rules. */
KITS.push({
  id: 'health', subject: 'health', course: 'Health and Wellness', grade: '9',
  blurb: 'Nine units that pair health topics with movement, built around the skills of checking information, making decisions and getting help, so students can keep using them long after the facts change.',
  transfer: 'Check whether health information can be trusted, make and carry out a decision about their own health, and know when and how to ask for help for themselves or a friend.',
  units: [
    { key: 'skills', title: 'Being a health detective', days: 16, source: 'build',
      questions: ['How do you know what is true about your health?', 'What does being healthy mean, and who gets to say?'],
      goals: [
        { key: 'inU1', text: 'Health information is only as good as its source, so a claim that sounds sure is not the same as a claim that is true, and a careful reader asks who says it, who pays them and what the evidence is.', kind: 'understanding', priority: 'lasting', level: 3, after: [] },
        { key: 'inU2', text: 'Decisions made calmly, before the moment of pressure, are usually better than decisions made in it, so it pays to name the options, weigh what could happen to you and to others, and rehearse your choice ahead of time.', kind: 'understanding', priority: 'lasting', level: 3, after: [] },
        { key: 'inK1', text: 'The health triangle (physical, mental and emotional, and social health) and the things that shape health: sleep, food, activity, relationships, safety, money, the places people live and access to care.', kind: 'knowledge', priority: 'important', level: 2, after: [] },
        { key: 'inS1', text: 'Check a health claim by finding who made it, looking for the same claim from independent reliable sources (such as the CDC, NIH, a hospital or a medical association) and telling an opinion from evidence.', kind: 'skill', priority: 'important', level: 3, after: ['inU1'] },
        { key: 'inS2', text: 'Use a decision-making process (state the problem, list options, weigh outcomes, choose, review) on a realistic situation, and say what would change your choice.', kind: 'skill', priority: 'important', level: 3, after: ['inU2', 'inK1'] },
        { key: 'inK2', text: 'How John Snow’s map of cholera cases in London in 1854 helped show that a water pump was spreading the disease.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] }
      ],
      major: { title: 'The claim check', method: 'performance', targets: ['reasoning', 'product'], level: 3, goals: ['inU1', 'inS1'], min: 30, out: 45, fb: 'rubric', rubric: 'analytic', retake: true, role: 'A fact-checker for the school newspaper’s health column', audience: 'Student readers who saw the claim on social media or heard it from a friend', product: 'A one-page check of one real health claim (such as energy drinks, detox plans, sleeping less, or a supplement ad) with a verdict, the best evidence on each side, a rating of each source and what would change your mind' },
      minors: [
        { title: 'What shapes health', method: 'selected', targets: ['knowledge'], level: 2, goals: ['inK1'], min: 10, fb: 'score' },
        { title: 'Rate three sources for one claim', method: 'written', targets: ['reasoning'], level: 3, goals: ['inS1'], min: 12, fb: 'comments' },
        { title: 'Conclusion from the class pulse data', method: 'written', targets: ['reasoning'], level: 3, goals: ['inU1'], min: 12, fb: 'comments' },
        { title: 'Decision on a scenario card', method: 'performance', targets: ['reasoning', 'skill'], level: 3, goals: ['inS2', 'inU2'], min: 15, fb: 'comments' }
      ],
      lessons: [
        { title: 'What do we mean by healthy?', days: 1, blocks: [['entry', 2, []], ['quickwrite', 6, ['inK1']], ['tps', 8, ['inK1']], ['mini', 10, ['inK1']], ['task', 14, ['inK1', 'inU2']], ['exit', 5, ['inK1']]], hw: null },
        { title: 'Who is saying that?', days: 1, blocks: [['entry', 2, []], ['retrieval', 5, ['inK1']], ['demo', 8, ['inS1', 'inU1'], { predict: 'predict' }], ['closeread', 16, ['inS1', 'inU1']], ['tps', 8, ['inS1']], ['exit', 6, ['inS1']]], hw: { purpose: 'extend', kind: 'writing', min: 15, goals: ['inS1'], fb: 'discussed', graded: 'no', device: false } },
        { title: 'Pulse lab: testing a claim with pooled class data', days: 1, blocks: [['entry', 2, []], ['mini', 6, ['inU1']], ['lab', 24, ['inU1']], ['tps', 8, ['inU1']], ['exit', 4, ['inU1']]], hw: null },
        { title: 'Deciding before the moment', days: 1, blocks: [['entry', 2, []], ['retrieval', 6, ['inU1', 'inS1']], ['mini', 8, ['inS2']], ['simulate', 18, ['inS2', 'inU2']], ['quickwrite', 6, ['inU2']], ['exit', 6, ['inS2']]], hw: null },
        { title: 'Fact-checking workshop', days: 1, blocks: [['entry', 2, []], ['retrieval', 5, ['inS1', 'inS2']], ['research', 18, ['inS1', 'inU1']], ['peer', 12, ['inS1', 'inU1']], ['confer', 8, ['inU1']]], hw: { purpose: 'finish', kind: 'writing', min: 20, goals: ['inS1', 'inU1'], fb: 'comments', graded: 'completion', device: false } }
      ]
    },
    { key: 'fit', title: 'Fitness: how bodies adapt', days: 22, source: 'build',
      questions: ['Why do people who know what to do still not do it?', 'What counts as being fit?'],
      goals: [
        { key: 'ftU1', text: 'The body adapts to the demands placed on it, so steady, gradually increased effort over weeks is what builds fitness, and no single workout, product or trick does.', kind: 'understanding', priority: 'lasting', level: 3, after: ['ftK1'] },
        { key: 'ftU2', text: 'The best plan for being active is the one a person will keep doing, so it has to fit their body, interests, schedule and friends.', kind: 'understanding', priority: 'important', level: 3, after: ['inU2', 'inK1'] },
        { key: 'ftK1', text: 'The five parts of health-related fitness (heart and lung endurance, muscle strength, muscle endurance, flexibility and body composition, which is taught as an idea and is not measured or graded in class), the FITT idea (how often, how hard, how long, what type) and the principles of overload, progression and specificity. National guidance for ages 6 to 17 is about 60 minutes a day of moderate to vigorous activity, mostly aerobic, with muscle-strengthening and bone-strengthening activity on at least three days a week.', kind: 'knowledge', priority: 'important', level: 2, after: [] },
        { key: 'ftS1', text: 'Warm up and cool down properly, and perform basic strength movements (squat, hip hinge, push-up, plank) with safe form, using the version that fits your body.', kind: 'skill', priority: 'important', level: 2, after: ['ftK1'] },
        { key: 'ftS2', text: 'Test a baseline of fitness (not body weight or size), set a goal that is specific, measurable and realistic, record progress and change the plan when the data say to.', kind: 'skill', priority: 'important', level: 3, after: ['ftU1', 'inS2'] },
        { key: 'ftK3', text: 'Fitness fads over the last century and the claims made for them.', kind: 'knowledge', priority: 'familiar', level: 1, after: ['inS1'] }
      ],
      major: { title: 'My four-week plan', method: 'performance', targets: ['reasoning', 'skill', 'product'], level: 4, goals: ['ftU1', 'ftU2', 'ftS2'], min: 40, out: 120, fb: 'rubric', rubric: 'analytic', retake: false, role: 'A personal trainer designing a plan for yourself, then for a made-up person who has different goals and limits', audience: 'The person who will follow it, and a classmate who checks that the plan follows the principles', product: 'A baseline test, a goal, a weekly schedule with FITT details, a log of what you did over four weeks with a midpoint change and a retest, a second plan for the made-up person, and a page on what you would change. It is judged on how well the plan follows the principles and uses your data, never on how fit you are or whether the goal was met' },
      minors: [
        { title: 'Technique check: squat, hinge, push-up, plank', method: 'performance', targets: ['skill'], level: 2, goals: ['ftS1'], min: 20, fb: 'comments' },
        { title: 'Parts of fitness and the principles', method: 'selected', targets: ['knowledge'], level: 2, goals: ['ftK1'], min: 12, fb: 'score' },
        { title: 'Baseline testing and goal', method: 'performance', targets: ['skill', 'product'], level: 3, goals: ['ftS2'], min: 30, fb: 'comments' }
      ]
    },
    { key: 'play', title: 'Playing and leading: games and lifetime activities', days: 20, source: 'curate',
      questions: ['What makes a good teammate, and a good opponent?', 'Which activity could you still be doing at forty?'],
      goals: [
        { key: 'spU1', text: 'Games are learned by making decisions under pressure, and playing well with others depends on fair play, communication and shared rules as much as on skill.', kind: 'understanding', priority: 'lasting', level: 3, after: ['ftU2', 'inS2'] },
        { key: 'spK1', text: 'The rules, scoring and positions of one invasion game (such as ultimate, soccer or basketball) and one net game (such as pickleball or volleyball).', kind: 'knowledge', priority: 'important', level: 1, after: [] },
        { key: 'spS1', text: 'Perform the main skills of the games (passing, shooting, serving, cutting) with correct technique at game speed.', kind: 'skill', priority: 'important', level: 2, after: [] },
        { key: 'spS2', text: 'Make tactical decisions in play by creating space and supporting a teammate (when to pass, where to move, how to defend), and explain the reason afterward.', kind: 'skill', priority: 'important', level: 3, after: ['spK1', 'inS2'] },
        { key: 'spS3', text: 'Officiate, keep score and settle a disagreement fairly, and coach a teammate with two specific, kind cues.', kind: 'skill', priority: 'important', level: 3, after: ['spU1'] },
        { key: 'spK2', text: 'The history of one sport or the Olympic movement, and how access to sport has changed for different groups of people.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] }
      ],
      major: { title: 'The class tournament', method: 'performance', targets: ['skill', 'reasoning'], level: 3, goals: ['spU1', 'spS2', 'spS3'], min: 90, out: 0, fb: 'rubric', rubric: 'single', retake: false, role: 'A player, an official and a coach in a tournament the class runs itself', audience: 'Your team and the teams you play, with the teacher observing and, if your school allows filming, a clip for you to review', product: 'Play and officiate modified games, coach a teammate using two cues, and write a short reflection on one decision you made in play and what you would do next time. It is judged on decisions, fair play and use of cues, not on athletic skill, and every student has a role that suits them' },
      minors: [
        { title: 'Skills at game speed', method: 'performance', targets: ['skill'], level: 2, goals: ['spS1'], min: 20, fb: 'comments' },
        { title: 'Rules and positions', method: 'selected', targets: ['knowledge'], level: 1, goals: ['spK1'], min: 10, fb: 'score' },
        { title: 'Why did you move there?', method: 'personal', targets: ['reasoning'], level: 3, goals: ['spS2'], min: 5, fb: 'conference' }
      ]
    },
    { key: 'food', title: 'Food and energy', days: 18, source: 'build',
      questions: ['Why is it so hard to know what to eat?', 'Who decides what is in the food you can afford?'],
      goals: [
        { key: 'nuU1', text: 'Food is both fuel and a daily choice shaped by culture, cost and marketing, so eating well is about patterns over time and not about single foods, no food is simply good or bad, and rigid rules usually backfire.', kind: 'understanding', priority: 'lasting', level: 3, after: ['inK1', 'inU1'] },
        { key: 'nuK1', text: 'The nutrients (carbohydrate, protein, fat, vitamins, minerals and water), what a Calorie measures, why teenagers, who are still growing, need regular meals and enough food, and the food groups in the current federal Dietary Guidelines for Americans (the graphic has changed more than once, so use the current one). Any worry about eating or body image is a reason to talk to a trusted adult or a doctor.', kind: 'knowledge', priority: 'important', level: 2, after: [] },
        { key: 'nuK2', text: 'How to read a Nutrition Facts label: serving size comes first, and 5 percent Daily Value or less is a little while 20 percent or more is a lot.', kind: 'knowledge', priority: 'important', level: 2, after: ['nuK1'] },
        { key: 'nuS1', text: 'Compare two products using the label and cost, and judge a claim such as “natural” or “detox” against the evidence.', kind: 'skill', priority: 'important', level: 3, after: ['nuK2', 'inS1'] },
        { key: 'nuS2', text: 'Plan a day or three days of meals that meet a goal within a realistic budget and fit a person’s tastes, customs and needs, without counting calories.', kind: 'skill', priority: 'important', level: 3, after: ['nuK1', 'nuU1', 'inS2'] },
        { key: 'nuK3', text: 'How federal food guides have changed, from the Food Guide Pyramid of 1992 to MyPlate in 2011 and the later versions.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] }
      ],
      major: { title: 'Three days of meals on a budget', method: 'performance', targets: ['reasoning', 'product'], level: 3, goals: ['nuU1', 'nuS1', 'nuS2'], min: 30, out: 60, fb: 'rubric', rubric: 'analytic', retake: false, role: 'A nutrition advisor for a made-up family of four who have a grocery budget and different needs (an athlete, a vegetarian, a young child)', audience: 'The family, who need a plan they can afford and will eat', product: 'A three-day meal plan with a shopping list and total cost, two label comparisons, and a paragraph explaining how the plan fits each person' },
      minors: [
        { title: 'Nutrients and food groups', method: 'selected', targets: ['knowledge'], level: 2, goals: ['nuK1'], min: 10, fb: 'score' },
        { title: 'Two labels, one choice', method: 'performance', targets: ['reasoning', 'skill'], level: 3, goals: ['nuK2', 'nuS1'], min: 15, fb: 'comments' },
        { title: 'Check the claim on the package', method: 'written', targets: ['reasoning'], level: 3, goals: ['nuS1', 'nuU1'], min: 12, fb: 'comments' }
      ]
    },
    { key: 'mind', title: 'Stress, sleep and mental health', days: 20, source: 'build',
      questions: ['When is stress useful and when is it harmful?', 'Why is it hard to ask for help, and what would make it easier?'],
      goals: [
        { key: 'msU1', text: 'Everyone’s mood goes up and down, mental health is part of health like any other, and noticing early signs in yourself and others and asking for help is a skill and a strength.', kind: 'understanding', priority: 'lasting', level: 3, after: ['inK1'] },
        { key: 'msU2', text: 'Stress is a normal response that helps in short bursts and wears the body down when it never lets up, so what you do after you notice it matters more than whether you feel it.', kind: 'understanding', priority: 'lasting', level: 3, after: ['msK1'] },
        { key: 'msK1', text: 'The stress response (the body releases adrenaline and cortisol to prepare to fight, flee or freeze), and how sleep works: teens need about 8 to 10 hours, and their body clocks shift later during adolescence.', kind: 'knowledge', priority: 'important', level: 2, after: ['inK1'] },
        { key: 'msK2', text: 'Common signs that a problem needs more than self-care: it lasts for weeks, interferes with school, sleep, eating or friends, or includes thoughts of self-harm or suicide, which always mean getting help right away. These are warning signs, not a diagnosis, and they are taught with safe-messaging guidance (no methods or details).', kind: 'knowledge', priority: 'important', level: 2, after: ['msK1'] },
        { key: 'msS1', text: 'Try several coping strategies (slow breathing, movement, writing, talking, planning), keep a private record of what helps you and choose a few that work.', kind: 'skill', priority: 'important', level: 3, after: ['ftS2', 'msU2'] },
        { key: 'msS2', text: 'Help a friend who is struggling by listening, not promising secrecy when safety is at risk, and getting a trusted adult; know where to turn, including a school counselor, a doctor and the 988 Suicide and Crisis Lifeline (call, text or chat 988 in the United States), and 911 if someone is in immediate danger.', kind: 'skill', priority: 'important', level: 3, after: ['msK2', 'msU1'] }
      ],
      major: { title: 'A guide for the next ninth grader', method: 'performance', targets: ['reasoning', 'product'], level: 3, goals: ['msU1', 'msU2', 'msS1', 'msS2'], min: 40, out: 40, fb: 'rubric', rubric: 'analytic', retake: false, role: 'A peer guide for incoming students', audience: 'Students about to start ninth grade, and a school counselor who checks that the advice is sound', product: 'A one-page guide or short video with facts about stress and sleep, three coping strategies with what reliable sources say about each and how you would fairly test one, who to ask for help in your school, and how to help a friend. Trying a strategy yourself is private: what you record is not collected, and nothing in the guide is about your own feelings or health' },
      minors: [
        { title: 'Stress, sleep and warning signs', method: 'selected', targets: ['knowledge'], level: 2, goals: ['msK1', 'msK2'], min: 10, fb: 'score' },
        { title: 'Plan a fair test of a coping strategy', method: 'written', targets: ['reasoning'], level: 3, goals: ['msS1'], min: 15, fb: 'comments' },
        { title: 'What would you say to a friend?', method: 'personal', targets: ['skill', 'reasoning'], level: 3, goals: ['msS2', 'msU1'], min: 8, fb: 'conference' }
      ]
    },
    { key: 'rel', title: 'Relationships, boundaries and sexual health', days: 18, source: 'curate',
      questions: ['How can you tell the difference between caring and controlling?', 'What do you need to know about your body, and who can you ask?'],
      goals: [
        { key: 'rlU1', text: 'In any relationship, friend, family or dating, health rests on respect, honest talk and each person’s right to set limits, and consent means a clear, free yes that either person can take back at any time and that cannot be given by someone who is pressured, asleep, intoxicated or too young under the law.', kind: 'understanding', priority: 'lasting', level: 3, after: ['rlK1'] },
        { key: 'rlU2', text: 'It is easier to hold to your own values and limits when you have thought them through before the moment arrives.', kind: 'understanding', priority: 'important', level: 3, after: ['inU2'] },
        { key: 'rlK1', text: 'What separates healthy, unhealthy and abusive relationships, including controlling behavior and online pressure, and the fact that sharing sexual images of anyone under 18 can break the law as well as hurt people; if an image is shared without consent, the step is to tell a trusted adult.', kind: 'knowledge', priority: 'important', level: 2, after: ['inK1'] },
        { key: 'rlK2', text: 'Medically accurate facts, in line with your district’s curriculum, about how pregnancy and sexually transmitted infections happen and how risk is reduced: abstinence is the only method that is fully effective, condoms used correctly every time lower the risk of both, other methods of birth control work to different degrees, testing and treatment are available, and vaccines prevent some infections such as HPV and hepatitis B. Check what your state allows.', kind: 'knowledge', priority: 'important', level: 2, after: [] },
        { key: 'rlS1', text: 'Say what you want and do not want clearly and calmly, using “I” statements, and respond respectfully when someone else sets a limit.', kind: 'skill', priority: 'important', level: 3, after: ['rlU1'] },
        { key: 'rlS2', text: 'Find reliable and confidential help for questions about health and relationships (a school counselor or nurse, a doctor, a trusted adult, a reputable health site).', kind: 'skill', priority: 'important', level: 3, after: ['inS1', 'msS2'] }
      ],
      major: { title: 'A scene that shows it', method: 'performance', targets: ['skill', 'reasoning', 'product'], level: 3, goals: ['rlU1', 'rlS1', 'rlK1', 'rlS2'], min: 40, out: 30, fb: 'rubric', rubric: 'analytic', retake: false, role: 'A peer educator writing and performing a short scene for ninth graders', audience: 'Younger students and a teacher who checks that the content is accurate and respectful', product: 'A recorded or live scene of about three minutes in which one person sets a boundary or helps a friend (about a group chat, a sleepover or a request for a photo, with no violence or sexual content), ending with where a person can get confidential help, and an annotated script that shows where each skill is used' },
      minors: [
        { title: 'Healthy, unhealthy or abusive', method: 'selected', targets: ['knowledge', 'reasoning'], level: 2, goals: ['rlK1'], min: 10, fb: 'score' },
        { title: 'Facts check', method: 'selected', targets: ['knowledge'], level: 2, goals: ['rlK2'], min: 10, fb: 'score' },
        { title: 'Practice saying it, with pushback', method: 'performance', targets: ['skill'], level: 3, goals: ['rlS1'], min: 10, fb: 'comments' }
      ]
    },
    { key: 'sub', title: 'Alcohol, tobacco, vaping and other drugs', days: 16, source: 'curate',
      questions: ['Why do people use substances that they know can harm them?', 'What is the line between a personal choice and a public health problem?'],
      goals: [
        { key: 'sbU1', text: 'How a substance affects a person depends on what it is, how much and how often it is used, and who is using it, and a teenage brain that is still developing is more open to harm and to addiction, so deciding ahead of time what you will do protects you.', kind: 'understanding', priority: 'lasting', level: 3, after: ['inU2', 'rlU2'] },
        { key: 'sbK1', text: 'What nicotine, alcohol, cannabis, opioids and misused prescription drugs do to the body; that vapes deliver nicotine and other chemicals and are not just water vapor; that counterfeit pills can contain fentanyl; and that most teenagers do not use these substances.', kind: 'knowledge', priority: 'important', level: 2, after: [] },
        { key: 'sbK2', text: 'Addiction is a condition that changes the brain’s reward and control systems, which is why stopping is hard, why treatment works better than blame and why recovery is possible.', kind: 'knowledge', priority: 'important', level: 2, after: ['sbK1', 'msK2'] },
        { key: 'sbS1', text: 'Use refusal skills in a real-sounding situation: say no clearly, give a reason or a joke, suggest something else, and leave or get a ride from a trusted adult if you need to.', kind: 'skill', priority: 'important', level: 3, after: ['rlS1', 'inS2'] },
        { key: 'sbS2', text: 'Recognize an emergency (cannot be woken, very slow or no breathing, blue or gray lips), call 911, stay with the person, and know that the medicine naloxone can reverse an opioid overdose for a short time, so help is still needed.', kind: 'skill', priority: 'important', level: 2, after: ['msS2'] },
        { key: 'sbK3', text: 'How tobacco was marketed to young people and what advertising rules and taxes have changed.', kind: 'knowledge', priority: 'familiar', level: 1, after: ['inS1'] }
      ],
      major: { title: 'What I would tell a friend', method: 'performance', targets: ['reasoning', 'product'], level: 3, goals: ['sbU1', 'sbS1', 'sbK1', 'sbS2'], min: 30, out: 40, fb: 'rubric', rubric: 'analytic', retake: false, role: 'A public health communicator preparing material for eighth graders', audience: 'Eighth graders, who will be shown it, and a school nurse who checks the facts', product: 'A poster, audio piece or video of up to two minutes that gives accurate facts from reliable sources, without scare tactics or invented numbers, shows a refusal in a real-sounding scene and says what to do in an emergency and where to get help' },
      minors: [
        { title: 'Facts versus myths', method: 'selected', targets: ['knowledge'], level: 2, goals: ['sbK1', 'sbK2'], min: 10, fb: 'score' },
        { title: 'Refusal scene with pushback', method: 'performance', targets: ['skill'], level: 3, goals: ['sbS1'], min: 10, fb: 'comments' },
        { title: 'Check a claim about vaping', method: 'written', targets: ['reasoning'], level: 3, goals: ['sbK1', 'sbU1'], min: 12, fb: 'comments' }
      ]
    },
    { key: 'safe', title: 'Safety and first aid', days: 14, source: 'curate',
      questions: ['How much of an injury can be prevented?', 'Why do people so often freeze or hold back when someone needs help, and what makes it easier to act?'],
      goals: [
        { key: 'sfU1', text: 'Most injuries can be reduced by preparation, and in an emergency a calm person who knows a few steps can make the difference.', kind: 'understanding', priority: 'lasting', level: 3, after: ['inU2'] },
        { key: 'sfK1', text: 'The steps of hands-only CPR for an adult or teen who suddenly collapses: check the scene and whether the person responds and breathes normally, call 911, push hard and fast in the center of the chest (100 to 120 pushes a minute, about 2 inches deep) and use an AED as soon as one arrives.', kind: 'knowledge', priority: 'important', level: 2, after: [] },
        { key: 'sfK2', text: 'First aid for choking (abdominal thrusts for a conscious adult or teen), heavy bleeding (firm direct pressure and a call to 911), burns (cool running water, never ice or butter) and a head injury: a person with a suspected concussion stops playing and returns only after a health professional clears them.', kind: 'knowledge', priority: 'important', level: 2, after: ['sfK1'] },
        { key: 'sfS1', text: 'Perform hands-only CPR on a manikin at the right rate and depth, and use a training AED.', kind: 'skill', priority: 'important', level: 2, after: ['sfK1'] },
        { key: 'sfS2', text: 'Look at a place or activity (a team practice, a car, a lake, a phone) and name the hazards and how to lower each risk.', kind: 'skill', priority: 'important', level: 3, after: ['sfU1', 'spS3'] },
        { key: 'sfK3', text: 'How seat belts, helmets and graduated licenses reduced injuries and deaths.', kind: 'knowledge', priority: 'familiar', level: 1, after: ['inS1'] }
      ],
      major: { title: 'The emergency scenario', method: 'performance', targets: ['skill', 'reasoning'], level: 3, goals: ['sfU1', 'sfS1', 'sfK1'], min: 30, out: 10, fb: 'rubric', rubric: 'single', retake: true, role: 'A bystander at a school game where someone has collapsed', audience: 'An observer who plays the 911 dispatcher, and your classmates who watch and give notes', product: 'A staged response with a spoken call to 911, two minutes of correct hands-only CPR on a manikin, use of a training AED and a handoff to responders (a student who cannot do compressions can lead the call and coach)' },
      minors: [
        { title: 'CPR rate and depth', method: 'performance', targets: ['skill'], level: 2, goals: ['sfS1'], min: 10, fb: 'comments' },
        { title: 'First aid steps', method: 'selected', targets: ['knowledge'], level: 2, goals: ['sfK1', 'sfK2'], min: 10, fb: 'score' },
        { title: 'Risk review of a place', method: 'written', targets: ['reasoning'], level: 3, goals: ['sfS2', 'sfU1'], min: 12, fb: 'comments' }
      ]
    },
    { key: 'plan', title: 'Taking charge of my health', days: 14, source: 'build',
      questions: ['How much of your health is up to you?', 'What would you want to change in your community to make healthy choices easier?'],
      goals: [
        { key: 'plU1', text: 'Health is shaped by choices and also by conditions a person does not choose, such as income, neighborhood and access to care, so staying healthy means caring for yourself and working for conditions that make it easier for everyone.', kind: 'understanding', priority: 'lasting', level: 3, after: ['inK1', 'nuU1'] },
        { key: 'plK1', text: 'How health care works: the difference between a regular doctor, urgent care and the emergency room, and the meaning of premium, deductible and copay.', kind: 'knowledge', priority: 'important', level: 2, after: ['rlS2'] },
        { key: 'plK2', text: 'The vaccines and checkups that doctors and medical groups such as the American Academy of Pediatrics recommend for teenagers and young adults (schedules are updated, so use the current one), and why health records are private, with some rules that vary by state.', kind: 'knowledge', priority: 'important', level: 1, after: ['rlK2', 'inS1'] },
        { key: 'plS1', text: 'Get ready for an appointment: write your questions, describe symptoms clearly and ask what the advice means in plain words.', kind: 'skill', priority: 'important', level: 2, after: ['inS1', 'msS2'] },
        { key: 'plS2', text: 'Write a health plan for a person your age, yourself or a made-up person you choose and keep private, with goals in at least three areas from this year, using evidence to choose them, and say how you will check progress.', kind: 'skill', priority: 'important', level: 4, after: ['ftS2', 'msS1', 'nuS2', 'inS2'] },
        { key: 'plK3', text: 'Examples of community health work, such as clean water, vaccination campaigns and safer roads.', kind: 'knowledge', priority: 'familiar', level: 1, after: ['inK2', 'sfK3'] }
      ],
      major: { title: 'My health plan and conference', method: 'performance', targets: ['reasoning', 'skill', 'product'], level: 4, goals: ['plU1', 'plS1', 'plS2'], min: 40, out: 40, fb: 'rubric', rubric: 'analytic', retake: false, role: 'A person in charge of their own health, planning with a trusted adult as adviser (the person can be made up)', audience: 'A teacher and a classmate, who listen to your plan and ask questions; a family member may join if you choose', product: 'A health plan of one to two pages with goals in three areas, the evidence behind each, how you will measure progress and one thing about the community that makes it easier or harder, plus a ten-minute conference including a practice appointment. It is judged on reasoning and use of evidence, and you never have to share personal or family health details' },
      minors: [
        { title: 'Where to go for what', method: 'selected', targets: ['knowledge'], level: 2, goals: ['plK1', 'plK2'], min: 10, fb: 'score' },
        { title: 'Appointment role-play', method: 'performance', targets: ['skill'], level: 2, goals: ['plS1'], min: 10, fb: 'comments' },
        { title: 'Draft plan check-in', method: 'personal', targets: ['reasoning'], level: 3, goals: ['plU1'], min: 8, fb: 'conference' }
      ]
    }
  ]
});
