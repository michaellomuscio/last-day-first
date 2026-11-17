/* Starter kit: Algebra 1. Equations as statements, then the families of functions (linear, exponential, quadratic) and how to choose among them. */
KITS.push({
  id: 'math', subject: 'math', course: 'Algebra 1', grade: '9',
  blurb: 'Eight units that build algebra around two ideas, that an equation is a statement to be made true and that each family of functions is a different kind of change, with a performance task at the end of each unit.',
  transfer: 'Take a quantitative situation you have not seen, decide what kind of relationship it is, write it as an equation or function, solve it, and say what the answer means and where the model stops being trustworthy.',
  units: [
    { key: 'eq', title: 'What an Equation Says', days: 18, source: 'curate',
      questions: ['What does it mean to say that two things are equal?', 'When can you trust that a step in solving did not change the answer?'],
      goals: [
        { key: 'eq-u1', text: 'An equation is a statement that two expressions have the same value; to solve it is to find every value of the variable that makes the statement true, and there may be none, one, several or infinitely many.', kind: 'understanding', priority: 'lasting', level: 3, after: [] },
        { key: 'eq-u2', text: 'A step in solving is safe only if it replaces the equation or inequality with an equivalent one, one with exactly the same solutions. Adding the same number to both sides, or multiplying or dividing both sides by the same nonzero number, keeps the solutions exactly because the step can be undone; multiplying by 0 or squaring can add false solutions, and dividing by an expression that might be zero can lose one. Multiplying or dividing an inequality by a negative number reverses it, because a negative number reverses order on the number line.', kind: 'understanding', priority: 'lasting', level: 3, after: ['eq-u1'] },
        { key: 'eq-k1', text: 'Variable, expression, term, coefficient, constant, equation, inequality and solution, and the properties of real numbers (commutative, associative and distributive) that justify rewriting an expression.', kind: 'knowledge', priority: 'important', level: 1, after: [] },
        { key: 'eq-s1', text: 'Solve linear equations and inequalities in one variable, including variables on both sides; check an equation by substituting its answer, and an inequality by testing one value inside and one outside the solution set; and show the solution set of an inequality on a number line.', kind: 'skill', priority: 'important', level: 2, after: ['eq-k1', 'eq-u2'] },
        { key: 'eq-s2', text: 'Translate a situation into an equation or inequality, say what the variable stands for, and interpret the solution in context, with its units.', kind: 'skill', priority: 'important', level: 3, after: ['eq-s1', 'eq-u1'] },
        { key: 'eq-s3', text: 'Rearrange a formula to solve for a chosen variable, such as solving A = ½bh for h.', kind: 'skill', priority: 'familiar', level: 2, after: ['eq-s1'] },
      ],
      major: { title: 'The solution-set guide', method: 'performance', targets: ['reasoning', 'product'], level: 3, goals: ['eq-u1', 'eq-u2', 'eq-s1', 'eq-s2'], min: 50, out: 45, fb: 'rubric', rubric: 'analytic', retake: true,
        role: 'A tutor writing a worked-solution guide', audience: 'A student who missed the unit', product: 'A guide with five equations (one with exactly one solution, one with none and one with infinitely many) each solved with every step justified and checked, an inequality solved with a negative multiplier and tested, an example that shows why multiplying both sides by 0 is not a safe step, and a story problem you write and solve whose answer is explained in context' },
      minors: [
        { title: 'Terms and properties check', method: 'selected', targets: ['knowledge'], level: 1, goals: ['eq-k1'], min: 10, fb: 'score' },
        { title: 'True, false or depends?', method: 'written', targets: ['reasoning'], level: 3, goals: ['eq-u1'], min: 10, fb: 'comments' },
        { title: 'Solve and check', method: 'performance', targets: ['skill'], level: 2, goals: ['eq-s1'], min: 15, fb: 'comments' },
      ],
      lessons: [
        { title: 'What does an equals sign claim?', days: 1, blocks: [
            ['entry', 2], ['quickwrite', 5, ['eq-u1']], ['demo', 9, ['eq-u1'], { predict: 'predict' }], ['tps', 8, ['eq-u1']], ['guided', 12, ['eq-u1', 'eq-k1']], ['qa', 6, ['eq-u1'], { who: 'all' }], ['exit', 4, ['eq-u1']]],
          hw: { purpose: 'practice', kind: 'problems', min: 20, goals: ['eq-u1', 'eq-k1'], fb: 'discussed', graded: 'completion', device: false } },
        { title: 'Equivalent equations: keeping a statement true', days: 1, blocks: [
            ['entry', 2], ['retrieval', 5, ['eq-u1']], ['worked', 10, ['eq-u2'], { fade: 'they' }], ['partner', 12, ['eq-s1']], ['indep', 12, ['eq-s1'], { fb: 'circulate' }], ['exit', 4, ['eq-u2']]],
          hw: { purpose: 'practice', kind: 'problems', min: 20, goals: ['eq-s1'], fb: 'check', graded: 'completion', device: false } },
        { title: 'No solution, or every number', days: 1, blocks: [
            ['entry', 2], ['retrieval', 5, ['eq-s1']], ['task', 20, ['eq-u1']], ['qa', 8, ['eq-u1'], { who: 'cold' }], ['mini', 6, ['eq-u1', 'eq-u2']], ['exit', 4, ['eq-u1']]],
          hw: { purpose: 'review', kind: 'problems', min: 15, goals: ['eq-s1', 'eq-u1'], fb: 'check', graded: 'completion', device: false } },
        { title: 'Inequalities and the negative number', days: 1, blocks: [
            ['entry', 2], ['retrieval', 5, ['eq-s1', 'eq-u1']], ['task', 14, ['eq-u2']], ['qa', 6, ['eq-u2'], { who: 'cold' }], ['worked', 8, ['eq-s1'], { fade: 'they' }], ['indep', 8, ['eq-s1'], { fb: 'key' }], ['exit', 4, ['eq-s1']]],
          hw: { purpose: 'practice', kind: 'problems', min: 20, goals: ['eq-s1'], fb: 'discussed', graded: 'completion', device: false } },
        { title: 'Equations from stories, and a check-in', days: 1, blocks: [
            ['entry', 2], ['quiz', 8, ['eq-k1'], { fb: 'now' }], ['worked', 8, ['eq-s2']], ['task', 16, ['eq-s2']], ['gallery', 6, ['eq-s2']], ['exit', 4, ['eq-s2']]],
          hw: { purpose: 'extend', kind: 'writing', min: 20, goals: ['eq-s2'], fb: 'comments', graded: 'completion', device: false } },
      ] },

    { key: 'lin', title: 'Linear Functions and Constant Change', days: 24, source: 'curate',
      questions: ['When is it reasonable to say two quantities change at a constant rate?', 'What does a graph tell you that a formula hides, and the reverse?'],
      goals: [
        { key: 'lin-u1', text: 'A function is a dependable relationship that gives each input exactly one output, and a table, a graph, a rule and a description are four views of it, each showing something the others hide.', kind: 'understanding', priority: 'lasting', level: 3, after: ['eq-u1'] },
        { key: 'lin-u2', text: 'A linear function changes by equal amounts for equal changes in input, so its rate of change, the slope, is the same between any two points and its graph is a straight line; the points on that line are exactly the pairs (x, y) that make y = mx + b true.', kind: 'understanding', priority: 'lasting', level: 3, after: ['lin-u1', 'eq-u1'] },
        { key: 'lin-k1', text: 'Domain (the inputs allowed), range (the outputs that result), function notation f(x), slope (a vertical line has undefined slope and is not the graph of a function), intercepts, and the slope-intercept, point-slope and standard forms of a line.', kind: 'knowledge', priority: 'important', level: 1, after: [] },
        { key: 'lin-s1', text: 'Find the slope from two points, a table, a graph or an equation, and interpret it with its units in a situation.', kind: 'skill', priority: 'important', level: 2, after: ['lin-k1'] },
        { key: 'lin-s2', text: 'Write an equation for a line from a graph, a table, two points or a description, and graph a line from its equation.', kind: 'skill', priority: 'important', level: 2, after: ['lin-s1', 'eq-s2'] },
        { key: 'lin-k2', text: 'Two different non-vertical lines are parallel when their slopes are equal and perpendicular when the product of their slopes is −1; a vertical line is perpendicular to a horizontal one.', kind: 'knowledge', priority: 'familiar', level: 2, after: ['lin-s1'] },
      ],
      major: { title: 'How tall is the stack?', method: 'performance', targets: ['reasoning', 'skill', 'product'], level: 3, goals: ['lin-u1', 'lin-u2', 'lin-s1', 'lin-s2'], min: 50, out: 45, fb: 'rubric', rubric: 'analytic', retake: true,
        role: 'A product tester for a paper-cup maker', audience: 'The purchasing manager of a cafeteria, who must fit stacks into a cupboard', product: 'A one-page report with measured data for the height of a stack of nested cups, a table, a graph and an equation, a prediction for 100 cups, what the slope and intercept mean in physical terms (and whether the intercept describes anything real), why only whole numbers of cups make sense, and where the model would stop being sensible' },
      minors: [
        { title: 'Vocabulary, forms and slopes check', method: 'selected', targets: ['knowledge'], level: 2, goals: ['lin-k1', 'lin-k2'], min: 10, fb: 'score' },
        { title: 'Slope from anywhere', method: 'performance', targets: ['skill'], level: 2, goals: ['lin-s1'], min: 15, fb: 'comments' },
        { title: 'Four views of one function', method: 'written', targets: ['reasoning'], level: 3, goals: ['lin-u1', 'lin-u2'], min: 20, fb: 'comments' },
      ] },

    { key: 'sys', title: 'Systems: Where Two Conditions Hold at Once', days: 20, source: 'curate',
      questions: ['How can two different rules both be true at the same moment?', 'When you must meet several requirements at once, how do you know a solution exists?'],
      goals: [
        { key: 'sys-u1', text: 'The graph of an equation is the set of all pairs that make it true, so a solution of a system is a point on every graph at once; two lines in a plane can therefore meet once, never (parallel) or everywhere (the same line).', kind: 'understanding', priority: 'lasting', level: 3, after: ['eq-u1', 'lin-u2'] },
        { key: 'sys-u2', text: 'Substituting, or adding a multiple of one equation to another, turns a system into a simpler one with exactly the same solutions, because each such step keeps true equations true and can be undone.', kind: 'understanding', priority: 'lasting', level: 3, after: ['eq-u2', 'sys-u1'] },
        { key: 'sys-k1', text: 'System of equations, solution of a system, and the three cases (one solution, none, infinitely many); the solution region of a system of inequalities.', kind: 'knowledge', priority: 'important', level: 1, after: [] },
        { key: 'sys-s1', text: 'Solve a system of two linear equations by graphing, by substitution and by elimination, and choose the method that fits.', kind: 'skill', priority: 'important', level: 2, after: ['eq-s1', 'lin-s2'] },
        { key: 'sys-s2', text: 'Model a situation with a system, solve it, and say what the solution means and whether it makes sense.', kind: 'skill', priority: 'important', level: 3, after: ['eq-s2', 'sys-s1'] },
        { key: 'sys-s3', text: 'Graph the solution region of a linear inequality in two variables or of a system of them, and test a point to check it.', kind: 'skill', priority: 'important', level: 2, after: ['eq-s1', 'lin-s2'] },
      ],
      major: { title: 'The fundraiser decision', method: 'performance', targets: ['reasoning', 'product'], level: 3, goals: ['sys-u1', 'sys-u2', 'sys-s1', 'sys-s2', 'sys-s3'], min: 50, out: 45, fb: 'rubric', rubric: 'analytic', retake: true,
        role: 'A business consultant for a student club selling shirts', audience: 'The club’s officers', product: 'A recommendation choosing between two vendors (each with a set-up fee and a price per shirt), with both cost equations, a graph, the break-even point found by two methods, a statement of when each vendor is cheaper, and the club’s budget limit written as an inequality with the order sizes that fit it shaded on a graph of cost against shirts' },
      minors: [
        { title: 'Terms and cases check', method: 'selected', targets: ['knowledge'], level: 1, goals: ['sys-k1'], min: 10, fb: 'score' },
        { title: 'Solve it two ways', method: 'performance', targets: ['skill'], level: 2, goals: ['sys-s1'], min: 20, fb: 'comments' },
        { title: 'One, none or infinitely many?', method: 'written', targets: ['reasoning'], level: 3, goals: ['sys-u1', 'sys-u2'], min: 15, fb: 'comments' },
      ] },

    { key: 'dat', title: 'Fitting Lines to Data', days: 14, source: 'curate',
      questions: ['When does a line tell the truth about data?', 'If two things move together, does one cause the other?'],
      goals: [
        { key: 'dat-u1', text: 'A line fitted to data can describe a pattern and predict inside the range of the data, but a pattern alone cannot show that one thing causes another; only how the data were gathered, such as a randomized experiment, can.', kind: 'understanding', priority: 'lasting', level: 3, after: ['lin-u2'] },
        { key: 'dat-u2', text: 'A line is a good model only if the points scatter around it with no pattern left over; a high correlation alone does not show this, and a residual plot can reveal a curve or an outlier that the correlation hides.', kind: 'understanding', priority: 'lasting', level: 3, after: ['dat-u1', 'dat-k1'] },
        { key: 'dat-k1', text: 'Scatter plot, line of best fit, residual (actual value minus predicted value), correlation coefficient r (between −1 and 1; it measures only how closely points follow a straight line), interpolation, extrapolation, outlier, and the difference between correlation and causation.', kind: 'knowledge', priority: 'important', level: 1, after: [] },
        { key: 'dat-s1', text: 'Make a scatter plot, fit a line by eye and with technology, and interpret its slope and intercept in context, saying when the intercept has no real meaning.', kind: 'skill', priority: 'important', level: 2, after: ['lin-s2'] },
        { key: 'dat-s2', text: 'Use a residual plot and the correlation coefficient to judge a line as a model, and decide whether a prediction can be trusted.', kind: 'skill', priority: 'important', level: 3, after: ['dat-s1', 'dat-u2'] },
        { key: 'dat-s3', text: 'Read a two-way frequency table, including relative frequencies, to describe an association between two categories.', kind: 'skill', priority: 'familiar', level: 2, after: [] },
      ],
      major: { title: 'The claim check', method: 'performance', targets: ['reasoning', 'product'], level: 3, goals: ['dat-u1', 'dat-u2', 'dat-s1', 'dat-s2'], min: 50, out: 45, fb: 'rubric', rubric: 'analytic', retake: true,
        role: 'A data journalist checking a claim', audience: 'Readers of a school news site', product: 'A one-page fact-check on a real data set you choose (for example winning times in the Olympic 100 meters), with scatter plot, fitted line, residual plot, a prediction inside the range of the data and one outside it with its limits, and a verdict on what the data can and cannot say about cause' },
      minors: [
        { title: 'Data vocabulary check', method: 'selected', targets: ['knowledge'], level: 1, goals: ['dat-k1'], min: 10, fb: 'score' },
        { title: 'Fit a line and read it', method: 'performance', targets: ['skill'], level: 2, goals: ['dat-s1'], min: 20, fb: 'comments' },
        { title: 'Can we trust this prediction?', method: 'written', targets: ['reasoning'], level: 3, goals: ['dat-u1', 'dat-u2', 'dat-s2'], min: 15, fb: 'comments' },
      ] },

    { key: 'exp', title: 'Exponents and Exponential Growth', days: 20, source: 'curate',
      questions: ['Why do some things grow slowly at first and then seem to explode?', 'How can a quantity that grows by a small percent each time become enormous?'],
      goals: [
        { key: 'exp-u1', text: 'A linear function adds the same amount each step, while an exponential function multiplies by the same factor each step, so a quantity that starts above zero and is multiplied by a factor greater than 1 each step eventually passes any linear quantity, however slowly it starts.', kind: 'understanding', priority: 'lasting', level: 3, after: ['lin-u2'] },
        { key: 'exp-u2', text: 'Exponent rules follow from what an exponent means: for whole numbers m and n, a^m · a^n = a^(m+n) just counts factors, and defining a^0 = 1 and a^(−n) = 1/a^n, for a not zero, is the only choice that keeps those rules true.', kind: 'understanding', priority: 'lasting', level: 3, after: ['eq-k1'] },
        { key: 'exp-k1', text: 'Exponent, base, growth factor, decay factor, initial value, percent change and scientific notation.', kind: 'knowledge', priority: 'important', level: 1, after: [] },
        { key: 'exp-s1', text: 'Simplify expressions with integer exponents using the product, quotient and power rules, and write numbers in scientific notation.', kind: 'skill', priority: 'important', level: 2, after: ['exp-u2'] },
        { key: 'exp-s2', text: 'Write and graph y = a·b^x (with a not zero, b positive and b not 1) from a table or a situation, say what a and b mean, and use it to answer questions about growth, decay and compound interest.', kind: 'skill', priority: 'important', level: 3, after: ['lin-s2', 'eq-s2'] },
        { key: 'exp-s3', text: 'Find when an exponential quantity reaches a target value by a table or graph, without logarithms.', kind: 'skill', priority: 'familiar', level: 2, after: ['exp-s2'] },
      ],
      major: { title: 'The growth report', method: 'performance', targets: ['reasoning', 'product'], level: 3, goals: ['exp-u1', 'exp-u2', 'exp-s2'], min: 50, out: 60, fb: 'rubric', rubric: 'analytic', retake: true,
        role: 'A public-health analyst', audience: 'A town council deciding how early to act', product: 'A report using data from a spreading experiment you run with dice (start with 30 dice; after each roll, add one die for every 6 shown), modeled by an exponential function and compared with the best linear fit, with a prediction, a percent-change explanation, a table extended backward from the start that shows why b^0 = 1 and b^(−1) = 1/b follow from the same growth factor, and an account of where the model must break down' },
      minors: [
        { title: 'Exponent and growth terms check', method: 'selected', targets: ['knowledge'], level: 1, goals: ['exp-k1'], min: 10, fb: 'score' },
        { title: 'Simplify and explain a rule', method: 'performance', targets: ['skill'], level: 2, goals: ['exp-s1'], min: 15, fb: 'comments' },
        { title: 'Linear or exponential, and how do you know?', method: 'written', targets: ['reasoning'], level: 3, goals: ['exp-u1'], min: 15, fb: 'comments' },
      ] },

    { key: 'pol', title: 'Polynomials and Factoring', days: 18, source: 'curate',
      questions: ['What does it mean for two expressions that look different to be the same?', 'Why would you write a sum as a product?'],
      goals: [
        { key: 'pol-u1', text: 'Two expressions are the same only if they have the same value for every input, and multiplying out and factoring are the same equality read in opposite directions: (x + 3)² = x² + 6x + 9 for every x, but (x + 3)² and x² + 9 agree only when x = 0.', kind: 'understanding', priority: 'lasting', level: 3, after: ['eq-k1', 'eq-u2'] },
        { key: 'pol-u2', text: 'A product is zero exactly when at least one factor is zero, so writing an expression as a product turns the question of where it is zero into several simple ones.', kind: 'understanding', priority: 'lasting', level: 3, after: ['eq-u1', 'pol-u1'] },
        { key: 'pol-k1', text: 'Monomial, binomial, trinomial, degree, standard form, leading coefficient and greatest common factor, and the fact that the sum, difference and product of polynomials are polynomials.', kind: 'knowledge', priority: 'important', level: 1, after: [] },
        { key: 'pol-s1', text: 'Add, subtract and multiply polynomials, using the distributive property and an area model.', kind: 'skill', priority: 'important', level: 2, after: ['eq-k1', 'pol-k1'] },
        { key: 'pol-s2', text: 'Factor out a common factor and factor trinomials x² + bx + c and ax² + bx + c, checking by multiplying back, and recognize when a trinomial has no factors with whole-number coefficients, such as x² + x + 1.', kind: 'skill', priority: 'important', level: 3, after: ['pol-s1', 'pol-u1'] },
        { key: 'pol-s3', text: 'Recognize and factor a difference of two squares and a perfect square trinomial, and know that a sum of squares such as x² + 9 does not factor into real linear factors.', kind: 'skill', priority: 'familiar', level: 2, after: ['pol-s2'] },
      ],
      major: { title: 'The garden bed and the polynomial', method: 'performance', targets: ['reasoning', 'skill', 'product'], level: 3, goals: ['pol-u1', 'pol-u2', 'pol-s1', 'pol-s2'], min: 50, out: 30, fb: 'rubric', rubric: 'analytic', retake: true,
        role: 'A designer for a community garden', audience: 'The garden committee, who will check your numbers', product: 'A report on a rectangular bed with sides x + 3 and x + 4 feet: an area model and the expanded area, a check by substituting three values of x, a test of (x + 3)² against x² + 9 and x² + 6x + 9 that finds where each pair agrees, four expressions you factor (one that has no whole-number factors, with the reason), and the break-even number of plants from a profit expression such as x² − 5x − 14 found from its factors, with what each answer means or why one is rejected' },
      minors: [
        { title: 'Terms and degree quiz', method: 'selected', targets: ['knowledge'], level: 1, goals: ['pol-k1'], min: 10, fb: 'score' },
        { title: 'Multiply with an area model', method: 'performance', targets: ['skill'], level: 2, goals: ['pol-s1'], min: 15, fb: 'comments' },
        { title: 'Factor and check', method: 'performance', targets: ['skill'], level: 3, goals: ['pol-s2'], min: 15, fb: 'score' },
      ] },

    { key: 'qua', title: 'Quadratic Functions and Equations', days: 26, source: 'curate',
      questions: ['Why does a thrown ball trace a curve, and what does the curve tell you about where it lands?', 'When does an equation have two answers, one answer, or none?'],
      goals: [
        { key: 'qua-u1', text: 'A quadratic changes at a changing rate: equal steps in the input give changes in the output that themselves change by a constant amount, so its graph is a parabola with one vertex, where the quantity stops rising and starts falling (or the reverse), and a line of symmetry through it.', kind: 'understanding', priority: 'lasting', level: 3, after: ['lin-u2', 'exp-u1'] },
        { key: 'qua-u2', text: 'Solving ax² + bx + c = 0 (with a not zero) means finding where the graph of y = ax² + bx + c meets the x-axis; completing the square on the general equation gives the quadratic formula, and the sign of the discriminant b² − 4ac under its square root says whether the graph crosses the axis twice, touches it once or misses it.', kind: 'understanding', priority: 'lasting', level: 3, after: ['pol-u1', 'pol-u2', 'eq-u2'] },
        { key: 'qua-s1', text: 'Solve quadratic equations by factoring, taking square roots (keeping both the positive and negative root), completing the square and the quadratic formula, leaving exact answers such as 1 ± √3 or rounding sensibly, and choose among the methods.', kind: 'skill', priority: 'important', level: 2, after: ['pol-s2', 'eq-s1'] },
        { key: 'qua-s2', text: 'Move between standard, vertex and factored forms and say what each shows at a glance: the y-intercept (standard), the vertex (vertex form) or the x-intercepts (factored), and whether the parabola opens up or down.', kind: 'skill', priority: 'important', level: 3, after: ['qua-u1', 'pol-s2', 'pol-s3'] },
        { key: 'qua-s3', text: 'Model a situation such as a thrown ball or a rectangle with fixed perimeter by a quadratic, solve it, and decide which solutions make sense in context.', kind: 'skill', priority: 'important', level: 3, after: ['eq-s2', 'sys-s2'] },
        { key: 'qua-k1', text: 'A line y = mx + b and a parabola can meet twice, once or never, found with a graphing tool.', kind: 'knowledge', priority: 'familiar', level: 2, after: ['sys-u1'] },
      ],
      major: { title: 'Will the shot go in?', method: 'performance', targets: ['reasoning', 'skill', 'product'], level: 3, goals: ['qua-u1', 'qua-u2', 'qua-s2', 'qua-s3'], min: 50, out: 60, fb: 'rubric', rubric: 'analytic', retake: true,
        role: 'A sports analyst', audience: 'A basketball coach who wants to adjust a player’s release', product: 'A report using ball positions read from a video of a free throw, a quadratic model in vertex form, the maximum height, an equation solved to decide whether the ball passes through the hoop (with both roots interpreted), the discriminant used to say whether the ball ever reaches hoop height, and what changing the launch speed or angle would do' },
      minors: [
        { title: 'Solve four ways', method: 'performance', targets: ['skill'], level: 2, goals: ['qua-s1'], min: 20, fb: 'comments' },
        { title: 'Forms: what each one shows', method: 'written', targets: ['reasoning'], level: 3, goals: ['qua-s2', 'qua-u1'], min: 15, fb: 'comments' },
        { title: 'Two, one or none?', method: 'written', targets: ['reasoning'], level: 3, goals: ['qua-u2'], min: 15, fb: 'comments' },
      ] },

    { key: 'mod', title: 'Choosing a Model', days: 16, source: 'build',
      questions: ['How do you decide what kind of function a situation calls for?', 'What do you give up when you use a model?'],
      goals: [
        { key: 'mod-u1', text: 'A model is a deliberate simplification, so using one means saying what it assumes, how far from the data it can be trusted and what would show it wrong.', kind: 'understanding', priority: 'lasting', level: 3, after: ['dat-u1', 'dat-u2'] },
        { key: 'mod-u2', text: 'Each family of functions leaves a fingerprint: equal differences mean linear, equal ratios mean exponential and equal second differences mean quadratic when the inputs are equally spaced, and testing for these, allowing for the scatter in real data, is how you choose a model.', kind: 'understanding', priority: 'lasting', level: 3, after: ['lin-u2', 'exp-u1', 'qua-u1'] },
        { key: 'mod-k1', text: 'How linear, exponential and quadratic functions grow, where they cross the axes and what happens for very large inputs.', kind: 'knowledge', priority: 'important', level: 2, after: ['lin-k1', 'exp-k1', 'qua-u1'] },
        { key: 'mod-s1', text: 'Given a table, a graph or a description, decide whether a relationship is linear, exponential or quadratic, and justify the choice with differences or ratios.', kind: 'skill', priority: 'important', level: 3, after: ['mod-u2', 'exp-s2'] },
        { key: 'mod-s2', text: 'Build a model from real data with technology, state its assumptions and limits, and explain the result to someone who has not studied algebra.', kind: 'skill', priority: 'important', level: 4, after: ['dat-s2', 'qua-s3'] },
        { key: 'mod-s3', text: 'Compare the average rate of change of two functions over an interval.', kind: 'skill', priority: 'familiar', level: 2, after: ['lin-s1'] },
      ],
      major: { title: 'The model brief', method: 'performance', targets: ['reasoning', 'skill', 'product'], level: 4, goals: ['mod-u1', 'mod-u2', 'mod-s1', 'mod-s2'], min: 60, out: 90, fb: 'rubric', rubric: 'analytic', retake: false,
        role: 'An analyst for a science magazine', audience: 'General readers', product: 'A two-page brief on one of three real data sets (carbon dioxide at Mauna Loa, a cooling cup of coffee, using its temperature above room temperature, or the stopping distance of a car at different speeds), comparing at least two candidate models, choosing one by the fingerprints in the data, and stating its limits' },
      minors: [
        { title: 'Which family? Sort with reasons', method: 'written', targets: ['reasoning'], level: 3, goals: ['mod-s1', 'mod-k1'], min: 20, fb: 'comments' },
        { title: 'From table to rule', method: 'performance', targets: ['skill'], level: 3, goals: ['mod-s1'], min: 15, fb: 'comments' },
        { title: 'Model critique conversation', method: 'personal', targets: ['reasoning'], level: 3, goals: ['mod-u1'], min: 10, fb: 'conference' },
      ] },
  ],
});
