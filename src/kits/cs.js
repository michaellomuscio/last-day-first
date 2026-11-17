/* Starter kit: Introduction to Computer Science, taught in Python 3. */
KITS.push({
  id: 'cs', subject: 'cs', course: 'Introduction to Computer Science', grade: '9-12',
  blurb: 'Nine units that go from exact instructions to a capstone program for a real user, with Python as the language and unplugged tasks, testing and ethics alongside the code.',
  transfer: 'Take a problem nobody has solved for you, break it into parts a computer can follow, build and test a solution, and judge honestly what the solution does to the people who use it.',
  units: [
    { key: 'algo', title: 'Exact instructions and first programs', days: 20, source: 'curate',
      questions: ['Why is it so hard to tell something exactly what to do?', 'What can a computer do that you cannot, and what can you do that it cannot?'],
      goals: [
        { key: 'alU1', text: 'A computer follows instructions exactly as written and not as meant, so an algorithm has to be precise enough for something with no common sense to carry out.', kind: 'understanding', priority: 'lasting', level: 3, after: [] },
        { key: 'alU2', text: 'A running program has a state, the current value of each variable, and every line changes that state in order, so to understand a program you follow the state line by line instead of reading it as a whole.', kind: 'understanding', priority: 'important', level: 3, after: ['alU1'] },
        { key: 'alK1', text: 'Variables and assignment, the types int, float, str and bool, and the operators + - * / // % ** (17 // 5 is 3, division rounded down; 17 % 5 is 2, the remainder; 17 / 5 is 3.4, and / always gives a float, so 6 / 3 is 2.0), and that input() always gives a str.', kind: 'knowledge', priority: 'important', level: 2, after: [] },
        { key: 'alS1', text: 'Write an algorithm as numbered steps precise enough for someone else to follow, then turn it into a Python program that runs and prints the right answer.', kind: 'skill', priority: 'important', level: 3, after: ['alU1', 'alK1'] },
        { key: 'alS2', text: 'Read a short program and say what it prints without running it, by keeping a table of each variable’s value line by line.', kind: 'skill', priority: 'important', level: 2, after: ['alK1', 'alU2'] },
        { key: 'alK2', text: 'Early programmers such as Ada Lovelace and Grace Hopper, and what each of them contributed.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] }
      ],
      major: { title: 'Instructions a stranger can follow', method: 'performance', targets: ['reasoning', 'skill', 'product'], level: 3, goals: ['alU1', 'alS1', 'alS2'], min: 45, out: 30, fb: 'rubric', rubric: 'analytic', retake: true, role: 'A junior programmer for a lunchroom that wants its cashier’s change-giving written down exactly', audience: 'A classmate who plays the computer and follows every step literally, then the Python interpreter', product: 'An algorithm in numbered steps for making change from a bill, tested by the classmate until it runs without help, then a Python program for it that works in whole cents (and a sentence on why, since decimals such as 0.1 cannot be stored exactly), a trace table for one purchase, and a note on each place where the steps had to be fixed' },
      minors: [
        { title: 'What does this program print?', method: 'selected', targets: ['knowledge', 'reasoning'], level: 2, goals: ['alK1', 'alS2'], min: 12, fb: 'score' },
        { title: 'Trace a program that does not do what it seems to', method: 'written', targets: ['reasoning'], level: 3, goals: ['alS2', 'alU2'], min: 12, fb: 'comments' },
        { title: 'Write the steps, then the program', method: 'performance', targets: ['skill'], level: 3, goals: ['alS1', 'alK1'], min: 25, fb: 'comments' }
      ],
      lessons: [
        { title: 'Instructions for a robot', days: 1, blocks: [['entry', 2, []], ['task', 18, ['alU1']], ['qa', 8, ['alU1'], { who: 'all' }], ['mini', 10, ['alU1']], ['exit', 6, ['alU1']]], hw: null },
        { title: 'First programs: print and variables', days: 1, blocks: [['entry', 2, []], ['retrieval', 5, ['alU1']], ['demo', 8, ['alU2', 'alK1'], { predict: 'predict' }], ['guided', 10, ['alK1']], ['partner', 15, ['alK1', 'alS1']], ['exit', 6, ['alK1']]], hw: { purpose: 'practice', kind: 'problems', min: 15, goals: ['alK1'], fb: 'check', graded: 'completion', device: false } },
        { title: 'Input and types', days: 1, blocks: [['entry', 2, []], ['retrieval', 5, ['alK1']], ['worked', 8, ['alK1', 'alS1']], ['indep', 15, ['alK1', 'alS1'], { fb: 'circulate' }], ['goover', 8, ['alK1'], { redo: 'redo' }], ['exit', 6, ['alK1']]], hw: null },
        { title: 'Arithmetic: // and %', days: 1, blocks: [['entry', 2, []], ['retrieval', 5, ['alK1']], ['demo', 8, ['alK1'], { predict: 'predict' }], ['task', 17, ['alS1', 'alK1', 'alU1']], ['tps', 8, ['alS1']], ['exit', 5, ['alK1']]], hw: { purpose: 'review', kind: 'problems', min: 15, goals: ['alK1'], fb: 'discussed', graded: 'no', device: false } },
        { title: 'Trace it, then write it', days: 1, blocks: [['entry', 2, []], ['retrieval', 6, ['alK1', 'alS2']], ['worked', 8, ['alS2'], { fade: 'they' }], ['partner', 12, ['alS2', 'alU2']], ['task', 12, ['alS1']], ['exit', 6, ['alS2', 'alS1']]], hw: { purpose: 'practice', kind: 'problems', min: 15, goals: ['alS2'], fb: 'discussed', graded: 'completion', device: false } }
      ]
    },
    { key: 'cond', title: 'Making decisions', days: 16, source: 'curate',
      questions: ['How does a program decide what to do?', 'How many cases are there, and how do you know you have thought of them all?'],
      goals: [
        { key: 'coU1', text: 'Every decision in a program comes down to a condition that is either true or false, and the hard part is thinking of every case, especially at the edges.', kind: 'understanding', priority: 'lasting', level: 3, after: ['alU1'] },
        { key: 'coK1', text: 'Comparison operators (==, !=, <, <=, >, >=), the Boolean operators and, or and not, and the difference between = (store a value) and == (ask whether two values are equal).', kind: 'knowledge', priority: 'important', level: 2, after: ['alK1'] },
        { key: 'coK2', text: 'The if, elif and else structure: only the first branch whose condition is true runs, so the order of the conditions matters.', kind: 'knowledge', priority: 'important', level: 2, after: ['coK1', 'alU2'] },
        { key: 'coS1', text: 'Turn a set of written rules into code, and test it with values at, just below and just above each boundary.', kind: 'skill', priority: 'important', level: 3, after: ['alS1', 'coK2'] },
        { key: 'coS2', text: 'Use a truth table to decide whether two conditions mean the same thing, for example not (a and b) and (not a) or (not b), and use it to find the error in a condition that mishandles a case.', kind: 'skill', priority: 'important', level: 3, after: ['coK1', 'alS2'] },
        { key: 'coK3', text: 'George Boole and where the Boolean type gets its name.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] }
      ],
      major: { title: 'The ticket price rules', method: 'performance', targets: ['reasoning', 'skill', 'product'], level: 3, goals: ['coU1', 'coS1', 'coK2'], min: 40, out: 30, fb: 'rubric', rubric: 'analytic', retake: true, role: 'A developer for a small theater whose price rules are written on a card by the box-office window (children under 13, seniors 65 and over, students with ID, matinee discounts)', audience: 'The box-office manager, who will try your program with her own tricky cases', product: 'A Python program that asks questions and prints the price, plus a table of test cases that covers every branch and each age boundary, with a note on what you found and fixed' },
      minors: [
        { title: 'Which branch runs?', method: 'selected', targets: ['knowledge', 'reasoning'], level: 2, goals: ['coK1', 'coK2'], min: 12, fb: 'score' },
        { title: 'Truth tables', method: 'written', targets: ['reasoning'], level: 3, goals: ['coS2'], min: 12, fb: 'comments' },
        { title: 'Rules to code, with boundary tests: a grading scale', method: 'performance', targets: ['skill'], level: 3, goals: ['coS1', 'coK2'], min: 25, fb: 'comments' }
      ]
    },
    { key: 'loop', title: 'Repeating', days: 18, source: 'curate',
      questions: ['When is repeating a task worth giving to a computer?', 'How do you know a loop will end?'],
      goals: [
        { key: 'lpU1', text: 'A loop lets a short program handle any amount of data, but it is correct only if it starts in the right state, changes that state on each pass toward the stopping condition and stops at the right moment.', kind: 'understanding', priority: 'lasting', level: 3, after: ['coU1', 'alU2'] },
        { key: 'lpK1', text: 'The while loop (repeat as long as a condition is true) and the for loop with range: range(5) gives 0, 1, 2, 3, 4 and range(1, 6) gives 1, 2, 3, 4, 5.', kind: 'knowledge', priority: 'important', level: 2, after: ['coK1'] },
        { key: 'lpK2', text: 'An accumulator is a variable updated inside a loop to build up a total, a count, a largest value or a string.', kind: 'knowledge', priority: 'important', level: 2, after: ['alU2'] },
        { key: 'lpS1', text: 'Write loops that count, total and find the largest value, and that stop when the user types a chosen end value (a sentinel) such as -1.', kind: 'skill', priority: 'important', level: 2, after: ['lpK1', 'lpK2', 'coS1'] },
        { key: 'lpS2', text: 'Find off-by-one errors and endless loops by tracing the first pass and the last pass by hand.', kind: 'skill', priority: 'important', level: 3, after: ['alS2', 'coS1'] },
        { key: 'lpK3', text: 'Nested loops, used to print grids and multiplication tables.', kind: 'knowledge', priority: 'familiar', level: 2, after: ['lpK1'] }
      ],
      major: { title: 'The score summary', method: 'performance', targets: ['skill', 'reasoning', 'product'], level: 3, goals: ['lpU1', 'lpS1', 'lpS2'], min: 40, out: 30, fb: 'rubric', rubric: 'analytic', retake: true, role: 'A developer for a teacher who types in quiz scores until she is done', audience: 'The teacher, who needs the count, the total, the average and the highest score and will enter her own surprises (no scores at all, one score, a score of zero)', product: 'A Python program that reads scores until the user types -1 and then prints the results, with a trace of the first and last pass of your loop and a test table' },
      minors: [
        { title: 'Predict the loop', method: 'selected', targets: ['knowledge'], level: 2, goals: ['lpK1', 'lpK2'], min: 12, fb: 'score' },
        { title: 'Guess the number', method: 'performance', targets: ['skill'], level: 2, goals: ['lpS1'], min: 25, fb: 'comments' },
        { title: 'Why does this loop never end?', method: 'written', targets: ['reasoning'], level: 3, goals: ['lpS2', 'lpU1'], min: 10, fb: 'comments' }
      ]
    },
    { key: 'func', title: 'Breaking problems into functions', days: 18, source: 'curate',
      questions: ['How do you decide where one piece of a program ends and the next begins?', 'Why do people reuse other people’s code, and when should they not?'],
      goals: [
        { key: 'fnU1', text: 'Breaking a big problem into named pieces that each do one job makes a program possible to understand, test and change.', kind: 'understanding', priority: 'lasting', level: 3, after: ['alU1', 'lpU1'] },
        { key: 'fnK1', text: 'Defining and calling functions, parameters and arguments, and the difference between a function that prints a result and one that returns it (a function with no return gives back None).', kind: 'knowledge', priority: 'important', level: 2, after: ['alK1', 'lpK2'] },
        { key: 'fnK2', text: 'Variables made inside a function exist only while it runs (local scope), and assigning to a name inside a function makes a new local variable even if the same name exists outside, so information goes in through parameters and comes out through the return value.', kind: 'knowledge', priority: 'important', level: 2, after: ['alU2', 'fnK1'] },
        { key: 'fnS1', text: 'Plan on paper before coding: split a problem into functions, name each by what it does and say what goes in and what comes out.', kind: 'skill', priority: 'important', level: 3, after: ['alS1', 'coS1', 'fnU1'] },
        { key: 'fnS2', text: 'Write a docstring and short comments that tell a reader what a function expects and returns.', kind: 'skill', priority: 'important', level: 2, after: ['fnK1'] },
        { key: 'fnK3', text: 'Built-in functions and standard modules such as len, round (round(2.5) is 2, because exact halves go to the nearest even number), abs, random and math, and how to look one up in the documentation.', kind: 'knowledge', priority: 'familiar', level: 1, after: ['fnK1'] }
      ],
      major: { title: 'The converter toolkit', method: 'performance', targets: ['reasoning', 'skill', 'product'], level: 3, goals: ['fnU1', 'fnS1', 'fnK1', 'fnS2'], min: 40, out: 40, fb: 'rubric', rubric: 'analytic', retake: false, role: 'A developer for a science club that keeps converting units by hand (Celsius to Fahrenheit, miles to kilometers, pounds to kilograms)', audience: 'A classmate on another team, who will read your code and use it without asking you any questions', product: 'A program with at least five functions that each do one job, a menu that calls them, a docstring for each, each function taking its inputs as parameters and returning its result (only the menu prints), and a short plan written before you started' },
      minors: [
        { title: 'Print or return?', method: 'selected', targets: ['knowledge', 'reasoning'], level: 2, goals: ['fnK1', 'fnK2'], min: 10, fb: 'score' },
        { title: 'Split this problem into functions', method: 'written', targets: ['reasoning'], level: 3, goals: ['fnS1', 'fnU1'], min: 15, fb: 'comments' },
        { title: 'Write and call a function', method: 'performance', targets: ['skill'], level: 2, goals: ['fnK1', 'fnS2'], min: 25, fb: 'comments' }
      ]
    },
    { key: 'debug', title: 'Testing and fixing', days: 10, source: 'build',
      questions: ['How do you know a program works?', 'What do you do when you are stuck?'],
      goals: [
        { key: 'dbU1', text: 'Testing can show that a bug exists but almost never that there are none, because there are too many possible inputs to try them all, so good tests are chosen to break the code at its edges, and debugging means forming a guess about the cause and testing that guess instead of changing things at random.', kind: 'understanding', priority: 'lasting', level: 3, after: ['coS1', 'fnU1'] },
        { key: 'dbK1', text: 'Three kinds of errors: syntax errors (the code is not valid Python and will not run), runtime errors (the program stops with an exception such as ZeroDivisionError, ValueError or IndexError) and logic errors (it runs but gives the wrong answer).', kind: 'knowledge', priority: 'important', level: 2, after: ['alS2'] },
        { key: 'dbS1', text: 'Read a traceback from the bottom: the last line names the error and the lines above show where it happened.', kind: 'skill', priority: 'important', level: 2, after: ['dbK1', 'lpS2'] },
        { key: 'dbS2', text: 'Write tests as a table of inputs and expected outputs, using assert statements, with a normal case, the edges and an invalid input (saying what the function should do with it); for decimals, compare with a small tolerance, because 0.1 + 0.2 is not exactly 0.3.', kind: 'skill', priority: 'important', level: 3, after: ['coS1', 'fnK1'] },
        { key: 'dbS3', text: 'Use print statements and tracing to see what a program is really doing, and change one thing at a time.', kind: 'skill', priority: 'important', level: 2, after: ['alS2', 'lpS2'] },
        { key: 'dbK2', text: 'The moth found in a relay of the Harvard Mark II in 1947, and why the word “bug” was already in use for engineering faults.', kind: 'knowledge', priority: 'familiar', level: 1, after: ['alK2'] }
      ],
      major: { title: 'The bug hunt', method: 'performance', targets: ['reasoning', 'skill', 'product'], level: 3, goals: ['dbU1', 'dbS1', 'dbS2', 'dbS3'], min: 50, out: 20, fb: 'rubric', rubric: 'analytic', retake: false, role: 'A quality-assurance engineer who has been handed a 40-line program with five bugs (one syntax error, one runtime error and three logic errors, two of which show only for edge-case inputs)', audience: 'The development team, who will read your report and rerun your tests', product: 'A bug report that gives, for each bug, what you saw, your guess, how you tested the guess and the fix; the corrected program; and at least eight assert tests that failed before and pass now' },
      minors: [
        { title: 'Which kind of error is it?', method: 'selected', targets: ['knowledge'], level: 2, goals: ['dbK1', 'dbS1'], min: 10, fb: 'score' },
        { title: 'Fix this program and write down how you found it', method: 'performance', targets: ['skill', 'reasoning'], level: 3, goals: ['dbS3', 'dbS1'], min: 20, fb: 'comments' },
        { title: 'Test table for a given function', method: 'performance', targets: ['reasoning', 'skill'], level: 3, goals: ['dbS2'], min: 15, fb: 'comments' }
      ]
    },
    { key: 'data', title: 'Lists, strings and dictionaries', days: 22, source: 'curate',
      questions: ['How should a program remember many things at once?', 'When is it better to look something up by name than to search for it?'],
      goals: [
        { key: 'dsU1', text: 'How you organize data decides how easy a problem is to solve and how fast the program runs: the right structure often turns a long tangled program into a short one, and finding a key in a dictionary takes about the same time however many entries it holds, while searching a list takes longer as the list grows.', kind: 'understanding', priority: 'lasting', level: 3, after: ['fnU1', 'lpU1'] },
        { key: 'dsK1', text: 'Lists and strings are ordered and indexed from 0, and can be sliced (s[1:4] gives positions 1, 2 and 3, and s[-1] is the last item); lists can be changed after they are made, strings cannot, and giving a list a second name does not copy it, so a change through either name shows through both.', kind: 'knowledge', priority: 'important', level: 2, after: ['lpK1', 'alK1'] },
        { key: 'dsK2', text: 'A dictionary stores key and value pairs that you look up by key, each key appears only once, and a key must be a value that cannot change, such as a string, a number or a tuple, not a list.', kind: 'knowledge', priority: 'important', level: 2, after: ['dsK1'] },
        { key: 'dsS1', text: 'Loop through a list, a string or a dictionary to search, filter, count and total.', kind: 'skill', priority: 'important', level: 2, after: ['lpS1', 'dsK1', 'dsK2', 'dbS3'] },
        { key: 'dsS2', text: 'Choose between a list and a dictionary for a given problem and give a reason.', kind: 'skill', priority: 'important', level: 3, after: ['dsK2', 'fnS1'] },
        { key: 'dsK3', text: 'Common methods such as append, pop, sort, split, strip, upper and join, the difference between sort (changes the list and returns None) and sorted (returns a new list), and reading the lines of a text file with open and a for loop.', kind: 'knowledge', priority: 'familiar', level: 1, after: ['fnK3'] }
      ],
      major: { title: 'What the data says', method: 'performance', targets: ['reasoning', 'skill', 'product'], level: 4, goals: ['dsU1', 'dsS1', 'dsS2'], min: 45, out: 40, fb: 'rubric', rubric: 'analytic', retake: false, role: 'A data assistant for the school newspaper, working from a text file of fifty survey answers or a list of a week’s weather readings', audience: 'The newspaper editor, who wants three questions answered and the choice of structure explained', product: 'A Python program that reads the data and answers three questions (for example the most common answer, the average and the highest value), with a paragraph on why each question was solved with a list or a dictionary' },
      minors: [
        { title: 'Index and slice', method: 'selected', targets: ['knowledge'], level: 2, goals: ['dsK1'], min: 10, fb: 'score' },
        { title: 'Count the words', method: 'performance', targets: ['skill'], level: 3, goals: ['dsS1', 'dsK2'], min: 25, fb: 'comments' },
        { title: 'List or dictionary?', method: 'written', targets: ['reasoning'], level: 3, goals: ['dsS2', 'dsU1'], min: 12, fb: 'comments' }
      ]
    },
    { key: 'bits', title: 'How computers store and send information', days: 16, source: 'curate',
      questions: ['How can a machine that only has on and off hold a photograph?', 'Who is in charge of the internet?'],
      goals: [
        { key: 'btU1', text: 'All digital information is numbers written in bits, and what the bits mean depends on a shared agreement about how to read them, so the same pattern can be a number, a letter or a color.', kind: 'understanding', priority: 'lasting', level: 3, after: ['alK1', 'dsU1'] },
        { key: 'btU2', text: 'The internet works because everyone follows shared rules, called protocols, which lets billions of different devices cooperate without any one company running all of it.', kind: 'understanding', priority: 'important', level: 3, after: ['fnU1', 'btU1'] },
        { key: 'btK1', text: 'Binary place values (1, 2, 4, 8, 16 and so on), the fact that n bits make 2 to the power n different patterns (8 bits make 256), and how to convert between binary and decimal.', kind: 'knowledge', priority: 'important', level: 2, after: ['alK1'] },
        { key: 'btK2', text: 'Text is stored as numbers by an encoding such as ASCII or Unicode; a pixel is stored as red, green and blue values from 0 to 255; and compression makes files smaller either by describing repeated patterns more briefly, so nothing is lost (lossless), or by discarding detail people are unlikely to notice (lossy).', kind: 'knowledge', priority: 'important', level: 2, after: ['btK1', 'dsK1'] },
        { key: 'btS1', text: 'Explain step by step how a photo gets from one phone to another through a messaging service: stored as bytes, split into packets, sent to the service’s server whose IP address was found from its name by DNS, passed along router by router (packets may take different routes and arrive out of order), reassembled in order, with lost packets sent again.', kind: 'skill', priority: 'important', level: 3, after: ['btU2', 'btK2'] },
        { key: 'btK3', text: 'Hexadecimal and why a web color is written like #FF8800.', kind: 'knowledge', priority: 'familiar', level: 2, after: ['btK1'] }
      ],
      major: { title: 'From my phone to yours', method: 'performance', targets: ['reasoning', 'product'], level: 4, goals: ['btU1', 'btU2', 'btS1'], min: 40, out: 40, fb: 'rubric', rubric: 'analytic', retake: false, role: 'A technology writer for a magazine for eleven-year-olds', audience: 'Eleven-year-olds, who will try the activity themselves and tell you whether they can follow it', product: 'An illustrated explainer, a poster or a three-minute video, of what happens to one photo between taking it and seeing it on a friend’s screen, showing how one pixel’s color is stored as three numbers, why phones and servers need shared rules, and a binary-to-decimal activity the reader can do' },
      minors: [
        { title: 'Binary and decimal', method: 'selected', targets: ['knowledge'], level: 2, goals: ['btK1'], min: 12, fb: 'score' },
        { title: 'What does this pattern of bits mean?', method: 'written', targets: ['reasoning'], level: 3, goals: ['btU1', 'btK2'], min: 12, fb: 'comments' },
        { title: 'Follow one packet through the network', method: 'personal', targets: ['reasoning'], level: 3, goals: ['btS1', 'btU2'], min: 10, fb: 'conference' }
      ]
    },
    { key: 'soc', title: 'Computers and people', days: 12, source: 'curate',
      questions: ['Who should decide what a program is allowed to know about you?', 'If a program is unfair, who is responsible?'],
      goals: [
        { key: 'scU1', text: 'People write programs and choose what data to collect, who is counted and what counts as success, so a program can be unfair even when no one meant harm.', kind: 'understanding', priority: 'lasting', level: 3, after: ['coU1', 'dsU1'] },
        { key: 'scK1', text: 'Programs that learn from examples (machine learning) copy the patterns in their examples, including unfair or accidental ones, and find correlations, not causes or reasons.', kind: 'knowledge', priority: 'important', level: 2, after: ['dsU1', 'btK2'] },
        { key: 'scK2', text: 'What personal data is, how it is collected and sold, and the basic protections: long and different passwords, two-factor authentication and thinking before you share.', kind: 'knowledge', priority: 'important', level: 2, after: ['btU2'] },
        { key: 'scS1', text: 'Ask four questions of any system: who built it, what data does it use, who benefits and who could be harmed.', kind: 'skill', priority: 'important', level: 3, after: ['scU1', 'btS1'] },
        { key: 'scS2', text: 'Argue both sides of a real case and say what evidence would change your mind.', kind: 'skill', priority: 'important', level: 3, after: ['scS1'] },
        { key: 'scK3', text: 'How copyright and open-source licenses decide what you may do with other people’s code.', kind: 'knowledge', priority: 'familiar', level: 1, after: ['fnK3'] }
      ],
      major: { title: 'The impact review', method: 'performance', targets: ['reasoning', 'product'], level: 4, goals: ['scU1', 'scS1', 'scS2'], min: 30, out: 40, fb: 'rubric', rubric: 'analytic', retake: false, role: 'An ethics reviewer at a company about to release a feature, such as face unlock, a recommendation feed or an attendance tracker for a school', audience: 'The product team, who must decide whether to ship and have to hear a real objection', product: 'A written or spoken review of two to three pages that answers the four questions, names the people most likely to be harmed and recommends a change, with at least two sources' },
      minors: [
        { title: 'Spot the unfair pattern', method: 'written', targets: ['reasoning'], level: 3, goals: ['scK1', 'scU1'], min: 12, fb: 'comments' },
        { title: 'Data and protections', method: 'selected', targets: ['knowledge'], level: 2, goals: ['scK2'], min: 10, fb: 'score' },
        { title: 'Structured academic controversy', method: 'personal', targets: ['reasoning'], level: 3, goals: ['scS2'], min: 15, fb: 'comments' }
      ]
    },
    { key: 'cap', title: 'Capstone: a program for a real user', days: 24, source: 'build',
      questions: ['What is worth building?', 'How do you know when it is good enough to give to someone?'],
      goals: [
        { key: 'cpU1', text: 'The first version of anything built for someone else is a guess about what they need, and a small working version in their hands early shows what the guess got wrong faster than more planning does.', kind: 'understanding', priority: 'lasting', level: 4, after: ['fnU1', 'dbU1', 'scU1'] },
        { key: 'cpS1', text: 'Interview a user, write a short list of what the program must do and choose what to leave out.', kind: 'skill', priority: 'important', level: 3, after: ['cpU1', 'scS1'] },
        { key: 'cpS2', text: 'Plan the program as functions with a test table, build in small steps and keep a working version at every step.', kind: 'skill', priority: 'important', level: 3, after: ['fnS1', 'dbS2', 'dsS2'] },
        { key: 'cpS3', text: 'Read a classmate’s code and give specific, kind suggestions, and use theirs to improve your own.', kind: 'skill', priority: 'important', level: 3, after: ['fnS2', 'dbS3'] },
        { key: 'cpS4', text: 'Write a README that says what the program does, how to run it and what it cannot do.', kind: 'skill', priority: 'important', level: 2, after: ['fnS2'] },
        { key: 'cpK1', text: 'Version control in brief: saving snapshots of your code with a short message so that you can go back to a version that worked and see what changed.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] }
      ],
      major: { title: 'The finished program and its first user', method: 'performance', targets: ['skill', 'reasoning', 'product'], level: 4, goals: ['cpU1', 'cpS1', 'cpS2', 'cpS4'], min: 60, out: 90, fb: 'rubric', rubric: 'analytic', retake: false, role: 'A developer who builds a program for a real person, such as a coach who needs a score tracker, a teacher who needs a flashcard quiz or a sibling who wants a text adventure', audience: 'The person you built it for, who will try it while you watch, and the class at a demonstration day', product: 'A working Python program with at least four functions, tests and a README, a note on what the user asked for and what you changed after watching them use it, and a five-minute demo' },
      minors: [
        { title: 'Interview notes and the must-have list', method: 'performance', targets: ['skill', 'product'], level: 3, goals: ['cpS1'], min: 15, fb: 'comments' },
        { title: 'Plan and test table', method: 'performance', targets: ['skill', 'product'], level: 3, goals: ['cpS2'], min: 20, fb: 'comments' },
        { title: 'Code review conference', method: 'personal', targets: ['reasoning', 'skill'], level: 3, goals: ['cpS3'], min: 10, fb: 'conference' }
      ]
    }
  ]
});
