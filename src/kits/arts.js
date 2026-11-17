/* Starter kit: Studio Art 1. A year of making, looking and talking about work, ending in a show. */
KITS.push({
  id: 'arts', subject: 'arts', course: 'Studio Art 1', grade: '9-12',
  blurb: 'Eight studio units, from drawing what you see to a class exhibition, each built around a made piece, a critique and a sketchbook habit.',
  transfer: 'Look closely at an image or object, make deliberate choices to say something with materials, and give and use honest feedback on work in progress.',
  units: [
    { key: 'draw', title: 'Learning to see: observational drawing', days: 22, source: 'build',
      questions: ['Why is it so hard to draw what is really in front of you?', 'When is a drawing finished?'],
      goals: [
        { key: 'drU1', text: 'Drawing is a way of seeing: when you look at the thing more than at the paper, you draw what is there and not what you think is there.', kind: 'understanding', priority: 'lasting', level: 3, after: [] },
        { key: 'drU2', text: 'Skill grows through deliberate practice and revision, so a first attempt is where the work starts and not where it is judged.', kind: 'understanding', priority: 'important', level: 3, after: [] },
        { key: 'drK1', text: 'The elements of art (line, shape, form, value, texture, space) and the words to describe them.', kind: 'knowledge', priority: 'important', level: 1, after: [] },
        { key: 'drS1', text: 'Draw from observation using contour line, gesture and shading from light to dark (hatching, cross-hatching, blending) to describe form.', kind: 'skill', priority: 'important', level: 2, after: ['drK1'] },
        { key: 'drS2', text: 'Check proportion by sighting: hold up a pencil, compare lengths and angles, and fix what is off.', kind: 'skill', priority: 'important', level: 2, after: ['drS1'] },
        { key: 'drK2', text: 'Drawings by Leonardo da Vinci, Käthe Kollwitz and Jean-Michel Basquiat, and how each uses line to different effect.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] }
      ],
      major: { title: 'A still life of things that matter', method: 'performance', targets: ['skill', 'product'], level: 3, goals: ['drU1', 'drU2', 'drS1', 'drS2'], min: 100, out: 0, fb: 'rubric', rubric: 'analytic', retake: true, role: 'An artist submitting work to the school gallery', audience: 'The gallery committee and the artist you were on day one, since this is compared with the drawing you made at the start of the year', product: 'A shaded drawing from observation, about 12 by 18 inches, of three objects you chose, with three thumbnail plans and a short written reflection set beside your day-one drawing' },
      minors: [
        { title: 'Blind contour and gesture warm-ups', method: 'performance', targets: ['skill'], level: 2, goals: ['drS1'], min: 20, fb: 'comments' },
        { title: 'Value scale and a shaded sphere', method: 'performance', targets: ['skill', 'product'], level: 2, goals: ['drS1', 'drK1'], min: 40, fb: 'rubric' },
        { title: 'Elements of art vocabulary', method: 'selected', targets: ['knowledge'], level: 1, goals: ['drK1'], min: 10, fb: 'score' }
      ],
      lessons: [
        { title: 'Day-one drawing and what we see', days: 1, blocks: [['entry', 2, []], ['directions', 3, ['drU1']], ['ptask', 12, ['drU1', 'drU2']], ['demo', 8, ['drU1', 'drS1'], { predict: 'predict' }], ['studio', 15, ['drS1', 'drU1']], ['reflect', 6, ['drU1', 'drU2']]], hw: null },
        { title: 'Contour line: the blind drawing', days: 1, blocks: [['entry', 2, []], ['retrieval', 4, ['drK1']], ['demo', 8, ['drS1']], ['skillp', 10, ['drS1']], ['studio', 14, ['drS1', 'drU1']], ['gallery', 6, ['drS1', 'drK1']]], hw: { purpose: 'practice', kind: 'project', min: 15, goals: ['drS1'], fb: 'check', graded: 'completion', device: false } },
        { title: 'Gesture and form: thirty seconds at a time', days: 1, blocks: [['entry', 2, []], ['retrieval', 5, ['drS1', 'drK1']], ['skillp', 10, ['drS1']], ['mini', 8, ['drS1', 'drK1']], ['studio', 16, ['drS1']], ['turn', 5, ['drK1', 'drU1']]], hw: null },
        { title: 'Value: from light to dark', days: 1, blocks: [['entry', 2, []], ['retrieval', 5, ['drS1']], ['worked', 8, ['drS1', 'drK1'], { fade: 'they' }], ['studio', 20, ['drS1', 'drK1']], ['peer', 8, ['drS1', 'drU2']], ['exit', 3, ['drK1']]], hw: null },
        { title: 'Sighting proportion and the first critique', days: 1, blocks: [['entry', 2, []], ['retrieval', 4, ['drK1', 'drS1']], ['demo', 8, ['drS2']], ['studio', 18, ['drS2', 'drS1']], ['perform', 10, ['drS2', 'drU2']], ['reflect', 4, ['drU2']]], hw: { purpose: 'prepare', kind: 'project', min: 20, goals: ['drS1', 'drS2'], fb: 'comments', graded: 'no', device: false } }
      ]
    },
    { key: 'comp', title: 'Composition: deciding where the eye goes', days: 18, source: 'build',
      questions: ['What makes one arrangement of the same shapes feel calm and another feel tense?', 'Who decides what a picture is about, the artist or the viewer?'],
      goals: [
        { key: 'coU1', text: 'Composition is a set of decisions that steer where a viewer looks first, next and last, and those decisions can be changed on purpose.', kind: 'understanding', priority: 'lasting', level: 3, after: ['drU1'] },
        { key: 'coK1', text: 'The principles of design (balance, contrast, emphasis, rhythm, unity) and the terms positive space, negative space, focal point and cropping.', kind: 'knowledge', priority: 'important', level: 2, after: ['drK1'] },
        { key: 'coS1', text: 'Plan a piece with thumbnail sketches, try several arrangements of the same shapes, and choose one with a reason.', kind: 'skill', priority: 'important', level: 3, after: ['drU2', 'coK1'] },
        { key: 'coS2', text: 'Cut, arrange and glue paper with clean edges to build a black, white and gray design in which every shape is a deliberate choice.', kind: 'skill', priority: 'important', level: 2, after: ['drS1'] },
        { key: 'coS3', text: 'Describe and analyze a classmate’s work using the vocabulary of art, and give a suggestion the artist can act on.', kind: 'skill', priority: 'important', level: 3, after: ['coK1', 'drS2'] },
        { key: 'coK2', text: 'The rule of thirds and the golden ratio, as habits that many artists and designers use and break.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] }
      ],
      major: { title: 'A cut-paper poster for the library', method: 'performance', targets: ['skill', 'reasoning', 'product'], level: 3, goals: ['coU1', 'coS1', 'coS2'], min: 60, out: 0, fb: 'rubric', rubric: 'analytic', retake: false, role: 'A designer for the school library’s reading week', audience: 'Students walking past in the hallway, and the librarian who chooses which poster goes up', product: 'A cut-paper poster in black, white and gray, about 12 by 18 inches, with six thumbnails and a short statement of where you want the eye to travel and why' },
      minors: [
        { title: 'Six thumbnails for one idea', method: 'performance', targets: ['skill', 'product'], level: 3, goals: ['coS1'], min: 20, fb: 'comments' },
        { title: 'Principles of design: name it in the picture', method: 'selected', targets: ['knowledge'], level: 2, goals: ['coK1'], min: 10, fb: 'score' },
        { title: 'Where does your eye go?', method: 'personal', targets: ['reasoning'], level: 3, goals: ['coU1', 'coS3'], min: 10, fb: 'conference' }
      ]
    },
    { key: 'color', title: 'Color and paint', days: 22, source: 'build',
      questions: ['Why does the same gray look warm next to blue and cool next to orange?', 'Can a color be wrong?'],
      goals: [
        { key: 'clU1', text: 'No color is seen alone: its look depends on what is beside it, and a painter uses those relationships to build mood, depth and light.', kind: 'understanding', priority: 'lasting', level: 3, after: ['coU1'] },
        { key: 'clK1', text: 'Hue, value and saturation; primary, secondary and tertiary colors; warm and cool; complementary and analogous schemes; and tints, tones and shades.', kind: 'knowledge', priority: 'important', level: 2, after: ['drK1', 'coK1'] },
        { key: 'clS1', text: 'Mix a target color from three primaries plus white, and record the recipe so it can be repeated.', kind: 'skill', priority: 'important', level: 2, after: ['clK1'] },
        { key: 'clS2', text: 'Paint with control: even coverage, clean edges, wet-on-wet and dry brush, and brush care at cleanup.', kind: 'skill', priority: 'important', level: 2, after: ['coS2'] },
        { key: 'clS3', text: 'Plan a color scheme for a mood and test it on a small study before committing to the final piece.', kind: 'skill', priority: 'important', level: 3, after: ['clU1', 'coS1'] },
        { key: 'clK2', text: 'Josef Albers’s experiments with color and how Impressionist painters (Monet, Morisot) painted light in patches of color.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] }
      ],
      major: { title: 'One scene, two moods', method: 'performance', targets: ['skill', 'reasoning', 'product'], level: 3, goals: ['clU1', 'clS1', 'clS2', 'clS3'], min: 90, out: 0, fb: 'rubric', rubric: 'analytic', retake: false, role: 'An illustrator working on a book of two poems that describe the same place in opposite moods', audience: 'The editor, played by a small panel of classmates who must say which poem each painting belongs to without being told', product: 'Two paintings of the same composition, about 9 by 12 inches, in two different color schemes, with a mixing chart and a paragraph explaining your color choices' },
      minors: [
        { title: 'Color wheel and mixing chart', method: 'performance', targets: ['skill', 'product'], level: 2, goals: ['clS1', 'clK1'], min: 40, fb: 'rubric' },
        { title: 'Match this color', method: 'performance', targets: ['skill'], level: 2, goals: ['clS1'], min: 15, fb: 'comments' },
        { title: 'Which mood is this, and how can you tell?', method: 'personal', targets: ['reasoning'], level: 3, goals: ['clU1'], min: 5, fb: 'conference' }
      ]
    },
    { key: 'print', title: 'Printmaking: one block, many prints', days: 18, source: 'build',
      questions: ['What is the value of a copy?', 'What do you gain when you can only cut away, and never add?'],
      goals: [
        { key: 'prU1', text: 'Repetition and variation create rhythm and meaning, and printmaking makes you plan ahead because every mark you cut is permanent and every print is reversed.', kind: 'understanding', priority: 'lasting', level: 3, after: ['coU1'] },
        { key: 'prK1', text: 'How relief printing works: carve away what should stay white, ink what is left and press it to paper; the image comes out reversed.', kind: 'knowledge', priority: 'important', level: 2, after: ['coK1'] },
        { key: 'prK2', text: 'Edition numbers (3/10), a trial proof, registration marks and the practice of signing in pencil.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] },
        { key: 'prS1', text: 'Carve a block safely and with control, cutting away from your body and hands, using a bench hook or a clamp.', kind: 'skill', priority: 'important', level: 2, after: ['coS2'] },
        { key: 'prS2', text: 'Roll an even layer of ink and pull a set of prints that look the same.', kind: 'skill', priority: 'important', level: 2, after: ['clS2', 'prK1'] },
        { key: 'prS3', text: 'Design for the print: draw the image in reverse, simplify to a few bold values and plan what will be cut.', kind: 'skill', priority: 'important', level: 3, after: ['coS1', 'drS1'] }
      ],
      major: { title: 'A small edition for the art fair', method: 'performance', targets: ['skill', 'product'], level: 3, goals: ['prU1', 'prS1', 'prS2', 'prS3'], min: 60, out: 0, fb: 'rubric', rubric: 'analytic', retake: false, role: 'A printmaker preparing a limited edition for the school art fair', audience: 'Buyers at the art fair, who will compare several prints from the same edition', product: 'An edition of five matching prints from your carved block, numbered and signed in pencil, with a trial proof and a short explanation of what you changed after it' },
      minors: [
        { title: 'Reverse it: a drawing that will print correctly', method: 'performance', targets: ['skill'], level: 3, goals: ['prS3', 'prK1'], min: 20, fb: 'comments' },
        { title: 'Safe cutting and a test carve', method: 'performance', targets: ['skill'], level: 2, goals: ['prS1'], min: 15, fb: 'comments' },
        { title: 'Printmaking terms and steps', method: 'selected', targets: ['knowledge'], level: 1, goals: ['prK1', 'prK2'], min: 10, fb: 'score' }
      ]
    },
    { key: 'clay', title: 'Making in three dimensions', days: 22, source: 'build',
      questions: ['How does an object made to be held differ from one made to be looked at?', 'What does a material allow, and what does it refuse?'],
      goals: [
        { key: 'cyU1', text: 'A three-dimensional work has to succeed from every side, and the way it is built decides what it can do, whether it stands, holds or breaks.', kind: 'understanding', priority: 'lasting', level: 3, after: ['coU1'] },
        { key: 'cyK1', text: 'The hand-building methods of pinch, coil and slab, and the stages clay passes through: wet, leather-hard, bone-dry, bisque fired and glaze fired.', kind: 'knowledge', priority: 'important', level: 2, after: ['prK1'] },
        { key: 'cyS1', text: 'Join pieces so they stay joined: score the surfaces, add slip, press and smooth the seam.', kind: 'skill', priority: 'important', level: 2, after: ['cyK1'] },
        { key: 'cyS2', text: 'Build with even wall thickness, hollow forms and a vent hole, so that the piece survives drying and firing.', kind: 'skill', priority: 'important', level: 2, after: ['cyK1', 'prS1'] },
        { key: 'cyS3', text: 'Draw a form from three views and plan how to build it before touching the clay.', kind: 'skill', priority: 'important', level: 3, after: ['drS2', 'coS1'] },
        { key: 'cyK2', text: 'Examples of vessels from several traditions, such as Greek vases, Pueblo pottery and Japanese tea bowls, and how each shape fits its use.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] }
      ],
      major: { title: 'A vessel for a purpose', method: 'performance', targets: ['skill', 'reasoning', 'product'], level: 3, goals: ['cyU1', 'cyS1', 'cyS2', 'cyS3'], min: 80, out: 0, fb: 'rubric', rubric: 'analytic', retake: false, role: 'A potter making one piece for a café that wants handmade mugs, bowls or planters', audience: 'The café owner, who will test it by holding, filling and washing it', product: 'A hand-built vessel in clay (or cardboard and paper if there is no kiln) that holds what it is made to hold, with a three-view drawing and a note on how you built it' },
      minors: [
        { title: 'Pinch pot and coil test', method: 'performance', targets: ['skill'], level: 2, goals: ['cyS1', 'cyS2'], min: 40, fb: 'comments' },
        { title: 'Three-view drawing and plan', method: 'performance', targets: ['skill', 'product'], level: 3, goals: ['cyS3'], min: 20, fb: 'comments' },
        { title: 'Stages of clay and how to join it', method: 'selected', targets: ['knowledge'], level: 1, goals: ['cyK1'], min: 10, fb: 'score' }
      ]
    },
    { key: 'ctx', title: 'Art in its time and place', days: 16, source: 'curate',
      questions: ['Does it matter who made a work and why?', 'When should an artist borrow from another culture, and when should they not?'],
      goals: [
        { key: 'cxU1', text: 'Art is made by people in a particular time and place for particular reasons, and knowing that context changes what you see in the work.', kind: 'understanding', priority: 'lasting', level: 3, after: ['coU1', 'clU1'] },
        { key: 'cxK1', text: 'Key works from different cultures, such as Hokusai’s Great Wave, Jacob Lawrence’s Migration Series, Picasso’s Guernica and Maya Lin’s Vietnam Veterans Memorial, and what each was made to do.', kind: 'knowledge', priority: 'important', level: 2, after: ['prK1'] },
        { key: 'cxS1', text: 'Look at a work in four steps (describe, analyze, interpret, judge) and support each statement with something you can point to in the work.', kind: 'skill', priority: 'important', level: 3, after: ['coS3'] },
        { key: 'cxS2', text: 'Research one artist and find where the sources come from, what is fact and what is opinion.', kind: 'skill', priority: 'important', level: 3, after: ['cxK1'] },
        { key: 'cxS3', text: 'Make a work that responds to another artist’s ideas without copying it, and say what you took and what you changed.', kind: 'skill', priority: 'important', level: 3, after: ['cxS1', 'clS3', 'cyS3'] },
        { key: 'cxK2', text: 'The names and main ideas of several art movements, such as Impressionism, Cubism and Surrealism.', kind: 'knowledge', priority: 'familiar', level: 1, after: ['clK2'] }
      ],
      major: { title: 'A work in conversation', method: 'performance', targets: ['reasoning', 'product'], level: 4, goals: ['cxU1', 'cxS2', 'cxS3'], min: 60, out: 60, fb: 'rubric', rubric: 'analytic', retake: false, role: 'A young artist and curator preparing a pair of works for a museum wall', audience: 'Museum visitors who will read your label, and a classmate who must say what you took and what you changed', product: 'A new artwork that responds to a work you studied, plus a wall label of about 100 words that names the artist, the context and your choices' },
      minors: [
        { title: 'Four-step look at an unfamiliar work', method: 'written', targets: ['reasoning'], level: 3, goals: ['cxS1', 'cxU1'], min: 20, fb: 'comments' },
        { title: 'Where did this fact come from?', method: 'written', targets: ['skill', 'reasoning'], level: 3, goals: ['cxS2'], min: 15, fb: 'comments' },
        { title: 'Works and movements', method: 'selected', targets: ['knowledge'], level: 1, goals: ['cxK1', 'cxK2'], min: 10, fb: 'score' }
      ]
    },
    { key: 'series', title: 'An idea in a series', days: 22, source: 'build',
      questions: ['Where do artists get their ideas?', 'What is the difference between a piece that looks good and a piece that says something?'],
      goals: [
        { key: 'seU1', text: 'An idea grows through a series: each work asks a question the one before it raised, so one piece is rarely enough to find out what you mean.', kind: 'understanding', priority: 'lasting', level: 3, after: ['drU2', 'cxU1'] },
        { key: 'seU2', text: 'Material is part of the meaning: the same idea says something different in charcoal, paint, clay or print.', kind: 'understanding', priority: 'lasting', level: 3, after: ['clU1', 'prU1', 'cyU1'] },
        { key: 'seS1', text: 'Choose a theme you care about, test it in the sketchbook and list questions it could ask.', kind: 'skill', priority: 'important', level: 3, after: ['coS1', 'cxS3'] },
        { key: 'seS2', text: 'Make three related works that develop the idea, using at least one technique from the year and choosing the medium on purpose.', kind: 'skill', priority: 'important', level: 4, after: ['drS1', 'clS2', 'prS2', 'cyS2'] },
        { key: 'seS3', text: 'Use feedback from a critique to change a piece, and record what you changed and why.', kind: 'skill', priority: 'important', level: 3, after: ['coS3', 'cxS1'] },
        { key: 'seK1', text: 'Examples of artists who work in series, such as Monet’s haystacks, Kara Walker’s silhouettes and Alma Thomas’s color paintings.', kind: 'knowledge', priority: 'familiar', level: 1, after: ['cxK1'] }
      ],
      major: { title: 'Three works, one idea', method: 'performance', targets: ['reasoning', 'skill', 'product'], level: 4, goals: ['seU1', 'seU2', 'seS2', 'seS3'], min: 100, out: 60, fb: 'rubric', rubric: 'analytic', retake: false, role: 'An emerging artist preparing a small series for a group show', audience: 'A visiting local artist, who will give a critique, and the class, who will see the series installed', product: 'A series of three related works with sketchbook pages showing how the idea developed, and a short conversation about what changed after the critique' },
      minors: [
        { title: 'Proposal and ten sketchbook ideas', method: 'performance', targets: ['reasoning', 'product'], level: 3, goals: ['seS1'], min: 20, fb: 'comments' },
        { title: 'Work in progress critique', method: 'personal', targets: ['reasoning', 'skill'], level: 3, goals: ['seS3', 'seU2'], min: 15, fb: 'conference' },
        { title: 'Why this medium?', method: 'written', targets: ['reasoning'], level: 3, goals: ['seU2'], min: 10, fb: 'comments' }
      ]
    },
    { key: 'show', title: 'Portfolio and exhibition', days: 18, source: 'build',
      questions: ['Which of your pieces should you show, and who decides?', 'What does a viewer need to know before they can see your work?'],
      goals: [
        { key: 'shU1', text: 'Choosing, presenting and explaining work is part of the making: how a piece is framed, hung and labeled changes what a viewer sees.', kind: 'understanding', priority: 'lasting', level: 3, after: ['seU2', 'cxU1'] },
        { key: 'shS1', text: 'Select a portfolio of work that shows range and growth, and explain the choices.', kind: 'skill', priority: 'important', level: 3, after: ['seU1', 'drU2'] },
        { key: 'shS2', text: 'Photograph flat work straight on in even light, and mat or mount work so it is ready to hang.', kind: 'skill', priority: 'important', level: 2, after: ['cyS2', 'coS2'] },
        { key: 'shS3', text: 'Write an artist statement of about 100 words that says what the work is about, how it was made and why, in plain language.', kind: 'skill', priority: 'important', level: 3, after: ['seS2', 'cxS3'] },
        { key: 'shS4', text: 'Talk with visitors about your work: say what you meant, listen to what they saw and respond without being defensive.', kind: 'skill', priority: 'important', level: 3, after: ['seS3', 'coS3'] },
        { key: 'shK1', text: 'The jobs around art, such as curator, conservator, illustrator, ceramicist and designer, and how people train for them.', kind: 'knowledge', priority: 'familiar', level: 1, after: [] }
      ],
      major: { title: 'The class exhibition', method: 'performance', targets: ['skill', 'reasoning', 'product'], level: 4, goals: ['shU1', 'shS1', 'shS3', 'shS4'], min: 90, out: 30, fb: 'rubric', rubric: 'analytic', retake: false, role: 'An artist and a co-curator of the end-of-year show', audience: 'Families, teachers and students who walk through the show, with a conference in which a teacher reviews your portfolio', product: 'An installed show of three or four works with labels and artist statements, a portfolio of eight to ten pieces with photographs, and a ten-minute portfolio conference' },
      minors: [
        { title: 'Select and sequence the portfolio', method: 'performance', targets: ['reasoning', 'product'], level: 3, goals: ['shS1', 'shU1'], min: 20, fb: 'comments' },
        { title: 'Draft artist statement', method: 'written', targets: ['reasoning', 'product'], level: 3, goals: ['shS3'], min: 20, fb: 'comments' },
        { title: 'Practice talking to a visitor', method: 'personal', targets: ['skill'], level: 3, goals: ['shS4'], min: 8, fb: 'conference' }
      ]
    }
  ]
});
