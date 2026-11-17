/* The vocabulary: what an observer could record, and the classroom moves a teacher plans with.
   The eighteen codes are a synthesis of published observation instruments (COPUS, Stallings, ICAP, Laurillard); see research/01. */

/* What a student is doing at a given minute. icap: P receiving, A working with it, C creating, I building with others, N neither. */
const CODES = {
  listen: { name: 'Listening to the teacher', fam: 'take', icap: 'P' },
  watch: { name: 'Watching a demonstration or video', fam: 'take', icap: 'P' },
  read: { name: 'Reading', fam: 'read', icap: 'P' },
  notes: { name: 'Taking notes', fam: 'notes', icap: 'A' },
  practice: { name: 'Practising alone', fam: 'practice', icap: 'A' },
  skill: { name: 'Physical or performance practice', fam: 'practice', icap: 'A' },
  speak: { name: 'Speaking practice with a partner', fam: 'practice', icap: 'I' },
  make: { name: 'Writing or making something', fam: 'make', icap: 'C' },
  lab: { name: 'Hands-on investigation', fam: 'make', icap: 'C' },
  project: { name: 'Group project work', fam: 'make', icap: 'I' },
  qa: { name: 'Answering or asking in whole class', fam: 'talk', icap: 'A' },
  discuss: { name: 'Whole-class discussion', fam: 'talk', icap: 'I' },
  pair: { name: 'Talking with a partner or group', fam: 'talk', icap: 'I' },
  present: { name: 'Presenting or performing', fam: 'show', icap: 'C' },
  assess: { name: 'Being assessed', fam: 'show', icap: 'A' },
  revise: { name: 'Using feedback to revise', fam: 'revise', icap: 'C' },
  admin: { name: 'Setting up, moving, packing up', fam: 'over', icap: 'N' },
  wait: { name: 'Waiting', fam: 'over', icap: 'N' },
};
/* The nine lines of the label, in order. Colors are fixed so a strip, a classroom and a fingerprint all read the same way.
   `text` is the color for words set on that fill; every pair reaches a contrast of 4.5 to 1. */
const FAMILIES = [
  { id: 'take', name: 'Listening and watching', short: 'Listening', color: '#5d6f89', text: '#fff' },
  { id: 'read', name: 'Reading', short: 'Reading', color: '#7d5ca9', text: '#fff' },
  { id: 'notes', name: 'Taking notes', short: 'Notes', color: '#c79a66', text: '#17171b' },
  { id: 'practice', name: 'Practising', short: 'Practising', color: '#1d7d74', text: '#fff' },
  { id: 'make', name: 'Making and investigating', short: 'Making', color: '#e8952f', text: '#17171b' },
  { id: 'talk', name: 'Discussing', short: 'Discussing', color: '#c53e6b', text: '#fff' },
  { id: 'show', name: 'Presenting and being assessed', short: 'Showing', color: '#2d62ad', text: '#fff' },
  { id: 'revise', name: 'Using feedback', short: 'Feedback', color: '#417d26', text: '#fff' },
  { id: 'over', name: 'Setup, moving, waiting', short: 'Overhead', color: '#b9b2a3', text: '#17171b' },
];
const FAMILY_BY = {}; FAMILIES.forEach((f) => (FAMILY_BY[f.id] = f));
const ICAP = [['P', 'Taking it in'], ['A', 'Working with it'], ['C', 'Creating'], ['I', 'Building with others'], ['N', 'Neither']];
const THINKERS = [['teacher', 'The teacher'], ['shared', 'Shared'], ['together', 'Students together'], ['alone', 'Each student']];
const GROUPINGS = [['alone', 'Alone'], ['pair', 'Pairs'], ['group', 'Groups'], ['class', 'Whole class']];
/* Purpose of a block or goal: take in something new, make sense of it, or use it somewhere new. */
const PURPOSES = [['A', 'Take in and practise', 'New knowledge or a skill is introduced and practised.'], ['M', 'Make meaning', 'Students work out why, compare, explain or connect.'], ['T', 'Transfer', 'Students use it on their own in a situation they have not seen.'], ['N', 'Routine', 'Not aimed at a goal.']];
/* Thinking level, after Webb's Depth of Knowledge. */
const LEVELS = [[1, 'Recall', 'Remember a fact, term or procedure.'], [2, 'Skill or concept', 'Apply a procedure, organize, compare, explain how.'], [3, 'Strategic thinking', 'Reason, plan, justify with evidence; more than one sound answer.'], [4, 'Extended thinking', 'Investigate, connect and create over time.']];
const LEVEL_NAME = { 1: 'Recall', 2: 'Skill or concept', 3: 'Strategic thinking', 4: 'Extended thinking' };

/* Goals. */
const GOAL_KINDS = [['understanding', 'Understanding', 'A big idea students should still hold years later.'], ['knowledge', 'Knowledge', 'Facts, terms and concepts students should know.'], ['skill', 'Skill', 'Something students should be able to do.']];
const PRIORITIES = [['lasting', 'Lasting', 'Worth understanding for life. The heart of the course.'], ['important', 'Important', 'Needed to reach the lasting ideas.'], ['familiar', 'Worth meeting', 'Good to have seen. First to go when time is short.']];

/* Assessments (methods and targets after Stiggins and Chappuis; see research/02). */
const METHODS = [['selected', 'Selected response', 'Multiple choice, matching, true or false, fill in the blank.'], ['written', 'Written response', 'Short answer, explanation, essay.'], ['performance', 'Performance', 'A product or a performance judged against criteria.'], ['personal', 'Personal communication', 'Conference, oral exam, questioning, observation with notes.']];
const TARGETS = [['knowledge', 'Knowledge'], ['reasoning', 'Reasoning'], ['skill', 'Skill'], ['product', 'Product']];
const FEEDBACKS = [['none', 'None'], ['score', 'A score'], ['rubric', 'A marked rubric'], ['comments', 'Written comments'], ['conference', 'A conversation']];
const RUBRICS = [['none', 'No rubric'], ['holistic', 'Holistic'], ['analytic', 'Analytic'], ['single', 'Single-point']];

/* Homework. */
const HW_PURPOSES = [['practice', 'Practice', 'More of what was taught today.'], ['review', 'Review', 'Bring back something from earlier units.'], ['prepare', 'Prepare', 'Get ready for the next class.'], ['extend', 'Extend', 'Take the idea further or somewhere new.'], ['finish', 'Finish', 'Complete what was started in class.']];
const HW_KINDS = [['problems', 'Problems or exercises'], ['reading', 'Reading'], ['writing', 'Writing'], ['watch', 'Watch or listen'], ['project', 'Project work'], ['study', 'Study']];
const HW_FEEDBACK = [['none', 'None'], ['check', 'Checked for completion'], ['discussed', 'Gone over in class'], ['scored', 'Scored'], ['comments', 'Written comments']];
const HW_GRADING = [['no', 'Not graded'], ['completion', 'Graded for completion'], ['accuracy', 'Graded for accuracy']];

/* Curriculum source for a unit, with a rough cost in your own preparation hours per class day. */
const SOURCES = [['adopt', 'Adopt the textbook', 0.4, 'Fastest. Fit to your goals depends on the book.'], ['curate', 'Curate from several sources', 1.0, 'Good fit if you choose well. Takes searching and trimming.'], ['borrow', 'Borrow a colleague’s unit', 0.6, 'Tested in this building. Built for their goals, so check the fit.'], ['build', 'Build it yourself', 2.0, 'Exactly yours. Costs the most hours by far.']];

const SUBJECTS = [['english', 'English'], ['math', 'Mathematics'], ['science', 'Science'], ['history', 'History and Social Studies'], ['language', 'World Languages'], ['arts', 'Arts'], ['cs', 'Computer Science'], ['health', 'Health and PE'], ['other', 'Something else']];

/* ---------- classroom moves ---------- */
/* mix: share of student time in each code. g grouping, th who is doing the thinking, pu purpose, lv thinking level,
   show: share of the time students are showing what they know, fb: feedback on that (none, later, now),
   talk: share of the time a typical student is speaking in a pair or group, floor: share of the time students (not the teacher)
   hold the floor in front of the whole class, which the observer divides by the class size, setup: minutes lost getting into it, arr: room arrangement,
   retr: students pull earlier learning from memory, think: students who are listening, reading or watching have a task that makes them work with it.
   sw: switches a teacher can flip; each option patches the fields above. The first option is the default. */
const MOVE_GROUPS = [['teach', 'Teacher-led'], ['ask', 'Questions and discussion'], ['practice', 'Practice'], ['readwrite', 'Reading and writing'], ['make', 'Making and investigating'], ['show', 'Showing and feedback'], ['routine', 'Routines']];
const COACH_SW = { id: 'coach', label: 'While they work, you', opts: [{ id: 'manage', label: 'Keep things moving' }, { id: 'respond', label: 'Circulate and respond to their thinking', fb: 'now' }] };
const mx = (s) => { const o = {}; s.split(',').forEach((p) => { const a = p.split(':'); o[a[0]] = +a[1]; }); return o; };
const MOVES = [
  { id: 'lecture', grp: 'teach', name: 'Lecture', does: 'You explain; students listen and take notes.', mix: mx('listen:.8,notes:.2'), g: 'class', th: 'teacher', pu: 'A', lv: 1, arr: 'rows',
    sw: [{ id: 'checks', label: 'Checks along the way', opts: [{ id: 'none', label: 'Straight through' }, { id: 'pause', label: 'Stop every few minutes for a question to a partner', mix: mx('listen:.6,notes:.15,pair:.2,qa:.05'), talk: 0.1, floor: 0.05, th: 'shared', show: 0.05, think: true }] }] },
  { id: 'mini', grp: 'teach', name: 'Mini-lesson', does: 'A short, focused explanation of one idea.', mix: mx('listen:.75,notes:.25'), g: 'class', th: 'teacher', pu: 'A', lv: 1, arr: 'rows' },
  { id: 'worked', grp: 'teach', name: 'Worked example', does: 'You think aloud through a problem while students follow.', mix: mx('listen:.6,notes:.4'), g: 'class', th: 'teacher', pu: 'A', lv: 2, arr: 'rows',
    sw: [{ id: 'fade', label: 'Who finishes it', opts: [{ id: 'you', label: 'You work every step' }, { id: 'they', label: 'Students complete the last steps', mix: mx('listen:.4,notes:.2,practice:.4'), th: 'shared', show: 0.2, fb: 'now' }] }] },
  { id: 'demo', grp: 'teach', name: 'Demonstration', does: 'You show a phenomenon, a technique or a process.', mix: mx('watch:.9,notes:.1'), g: 'class', th: 'teacher', pu: 'A', lv: 1, arr: 'front',
    sw: [{ id: 'predict', label: 'Before you start', opts: [{ id: 'show', label: 'Just show it' }, { id: 'predict', label: 'Students predict and explain first', mix: mx('watch:.55,pair:.25,notes:.2'), pu: 'M', lv: 2, talk: 0.12, th: 'shared', show: 0.1, think: true }] }] },
  { id: 'video', grp: 'teach', name: 'Video or audio', does: 'Students watch or listen to a recording.', mix: mx('watch:1'), g: 'class', th: 'teacher', pu: 'A', lv: 1, arr: 'rows', setup: 1,
    sw: [{ id: 'task', label: 'While it plays', opts: [{ id: 'none', label: 'Just watch' }, { id: 'task', label: 'A viewing task to complete', mix: mx('watch:.7,notes:.3'), think: true }] }] },
  { id: 'readaloud', grp: 'teach', name: 'Read-aloud', does: 'You read a text aloud to the class.', mix: mx('listen:1'), g: 'class', th: 'teacher', pu: 'A', lv: 1, arr: 'rows',
    sw: [{ id: 'follow', label: 'Students', opts: [{ id: 'listen', label: 'Listen' }, { id: 'annotate', label: 'Follow along and annotate', mix: mx('listen:.5,read:.3,notes:.2'), lv: 2, think: true }] }] },
  { id: 'directions', grp: 'teach', name: 'Giving directions', does: 'You explain what happens next and how.', mix: mx('listen:1'), g: 'class', th: 'teacher', pu: 'N', lv: 1, arr: 'rows' },

  { id: 'qa', grp: 'ask', name: 'Whole-class questions', does: 'You ask; students answer one at a time.', mix: mx('listen:.9,qa:.1'), g: 'class', th: 'shared', pu: 'A', lv: 2, arr: 'rows', floor: 0.35, show: 0.1, fb: 'now',
    sw: [{ id: 'who', label: 'Who answers', opts: [{ id: 'volunteers', label: 'Volunteers' }, { id: 'cold', label: 'Anyone may be called on, after think time', mix: mx('listen:.8,qa:.2'), floor: 0.4, show: 0.2, think: true }, { id: 'all', label: 'Everyone responds (whiteboards, polls, cards)', mix: mx('qa:.6,listen:.4'), floor: 0.15, show: 0.6, think: true }] }] },
  { id: 'tps', grp: 'ask', name: 'Think-pair-share', does: 'Think alone, talk to a partner, then share out.', mix: mx('notes:.2,pair:.5,listen:.3'), g: 'pair', th: 'together', pu: 'M', lv: 2, arr: 'pairs', talk: 0.25, setup: 0.5, show: 0.1 },
  { id: 'turn', grp: 'ask', name: 'Turn and talk', does: 'A quick exchange with the person beside you.', mix: mx('pair:1'), g: 'pair', th: 'together', pu: 'M', lv: 2, arr: 'pairs', talk: 0.5 },
  { id: 'seminar', grp: 'ask', name: 'Seminar discussion', does: 'Students discuss a text or question with each other, in a circle.', mix: mx('discuss:1'), g: 'class', th: 'together', pu: 'M', lv: 3, arr: 'circle', floor: 0.85, setup: 2, show: 0.1,
    sw: [{ id: 'prep', label: 'Students arrive with', opts: [{ id: 'none', label: 'Nothing required' }, { id: 'notes', label: 'Written questions or notes to speak from', show: 0.3, floor: 0.9 }] },
      { id: 'coach', label: 'During it, you', opts: [{ id: 'manage', label: 'Stay out of it' }, { id: 'respond', label: 'Press students to back up and build on what is said', fb: 'now' }] }] },
  { id: 'debate', grp: 'ask', name: 'Structured debate', does: 'Teams prepare and argue assigned positions.', mix: mx('discuss:.55,pair:.45'), g: 'group', th: 'together', pu: 'M', lv: 3, arr: 'groups', talk: 0.1, floor: 0.5, setup: 2, show: 0.2, fb: 'now' },
  { id: 'simulate', grp: 'ask', name: 'Simulation or role-play', does: 'Students take roles and act out a situation.', mix: mx('discuss:.5,pair:.3,listen:.2'), g: 'group', th: 'together', pu: 'M', lv: 3, arr: 'free', talk: 0.1, floor: 0.4, setup: 3 },

  { id: 'retrieval', grp: 'practice', name: 'Retrieval warm-up', does: 'A few questions from memory on earlier material. Low stakes.', mix: mx('practice:1'), g: 'alone', th: 'alone', pu: 'A', lv: 1, arr: 'rows', show: 0.8, fb: 'now', retr: true },
  { id: 'guided', grp: 'practice', name: 'Guided practice', does: 'The class works examples together, with you steering.', mix: mx('practice:.6,qa:.2,listen:.2'), g: 'class', th: 'shared', pu: 'A', lv: 2, arr: 'rows', floor: 0.25, show: 0.3, fb: 'now',
    sw: [{ id: 'who', label: 'Who answers', opts: [{ id: 'some', label: 'A few students' }, { id: 'all', label: 'Everyone responds (whiteboards, cards)', mix: mx('practice:.6,qa:.3,listen:.1'), floor: 0.15, show: 0.5, think: true }] }] },
  { id: 'indep', grp: 'practice', name: 'Independent practice', does: 'Each student works problems or exercises alone.', mix: mx('practice:1'), g: 'alone', th: 'alone', pu: 'A', lv: 2, arr: 'rows', show: 0.2, fb: 'later',
    sw: [{ id: 'fb', label: 'Feedback during', opts: [{ id: 'later', label: 'Collected and returned later' }, { id: 'circulate', label: 'You circulate and respond', show: 0.4, fb: 'now' }, { id: 'key', label: 'Answers available to self-check', show: 0.4, fb: 'now' }] }] },
  { id: 'partner', grp: 'practice', name: 'Partner practice', does: 'Pairs work exercises and check each other.', mix: mx('practice:.6,pair:.4'), g: 'pair', th: 'together', pu: 'A', lv: 2, arr: 'pairs', talk: 0.3, setup: 1, show: 0.3, fb: 'now' },
  { id: 'stations', grp: 'practice', name: 'Station rotation', does: 'Groups rotate through several short tasks.', mix: mx('practice:.55,pair:.2,lab:.25'), g: 'group', th: 'together', pu: 'A', lv: 2, arr: 'stations', talk: 0.15, setup: 3, sw: [COACH_SW] },
  { id: 'drill', grp: 'practice', name: 'Speaking drill', does: 'Pairs practise speaking in a set pattern.', mix: mx('speak:1'), g: 'pair', th: 'together', pu: 'A', lv: 1, arr: 'pairs', talk: 0.45, setup: 0.5, show: 0.2, fb: 'now' },
  { id: 'skillp', grp: 'practice', name: 'Skill practice', does: 'Repetition of a physical, musical or technical skill.', mix: mx('skill:.9,wait:.1'), g: 'alone', th: 'alone', pu: 'A', lv: 1, arr: 'free', setup: 2, show: 0.3, fb: 'now' },
  { id: 'game', grp: 'practice', name: 'Review game', does: 'Teams compete to answer questions on earlier material.', mix: mx('qa:.4,listen:.35,pair:.25'), g: 'group', th: 'shared', pu: 'A', lv: 1, arr: 'groups', talk: 0.06, floor: 0.3, setup: 2, show: 0.3, fb: 'now', retr: true },

  { id: 'sread', grp: 'readwrite', name: 'Silent reading', does: 'Students read on their own.', mix: mx('read:1'), g: 'alone', th: 'alone', pu: 'A', lv: 1, arr: 'rows',
    sw: [{ id: 'task', label: 'With', opts: [{ id: 'none', label: 'No task' }, { id: 'task', label: 'A purpose question or annotation task', mix: mx('read:.75,notes:.25'), lv: 2, think: true }] }] },
  { id: 'closeread', grp: 'readwrite', name: 'Close reading in pairs', does: 'Pairs work slowly through a short, hard passage.', mix: mx('read:.5,pair:.5'), g: 'pair', th: 'together', pu: 'M', lv: 3, arr: 'pairs', talk: 0.22, setup: 1, think: true },
  { id: 'quickwrite', grp: 'readwrite', name: 'Quick-write', does: 'A few minutes of writing to think something through.', mix: mx('make:1'), g: 'alone', th: 'alone', pu: 'M', lv: 2, arr: 'rows', show: 0.3 },
  { id: 'write', grp: 'readwrite', name: 'Extended writing time', does: 'Sustained drafting of a longer piece.', mix: mx('make:1'), g: 'alone', th: 'alone', pu: 'T', lv: 3, arr: 'rows', show: 0.3, fb: 'later' },
  { id: 'reflect', grp: 'readwrite', name: 'Reflection', does: 'Students write about what they learned and what is still unclear.', mix: mx('make:1'), g: 'alone', th: 'alone', pu: 'M', lv: 2, arr: 'rows', show: 0.4, fb: 'later' },

  { id: 'lab', grp: 'make', name: 'Lab or investigation', does: 'Groups gather and make sense of evidence.', mix: mx('lab:.88,notes:.12'), g: 'group', th: 'together', pu: 'M', lv: 2, arr: 'lab', talk: 0.2, setup: 4, cleanup: 3, show: 0.2,
    sw: [{ id: 'kind', label: 'The method is', opts: [{ id: 'given', label: 'Given step by step' }, { id: 'designed', label: 'Designed by the students', lv: 3, pu: 'T', mix: mx('lab:.78,pair:.22'), talk: 0.25 }] }, COACH_SW] },
  { id: 'task', grp: 'make', name: 'Problem-solving task', does: 'Groups take on a rich problem they have not seen before.', mix: mx('pair:.5,practice:.5'), g: 'group', th: 'together', pu: 'T', lv: 3, arr: 'groups', talk: 0.25, setup: 2, show: 0.2, sw: [COACH_SW] },
  { id: 'studio', grp: 'make', name: 'Workshop time', does: 'Each student writes or makes their own work while you confer with them one at a time.', mix: mx('make:.9,revise:.1'), g: 'alone', th: 'alone', pu: 'T', lv: 3, arr: 'free', setup: 2, cleanup: 2, show: 0.3, fb: 'now' },
  { id: 'projwork', grp: 'make', name: 'Group project time', does: 'Teams work on a shared product.', mix: mx('project:.75,wait:.25'), g: 'group', th: 'together', pu: 'T', lv: 3, arr: 'groups', talk: 0.18, setup: 2, show: 0.1,
    sw: [{ id: 'acct', label: 'Within each team', opts: [{ id: 'loose', label: 'Roles are left to the team' }, { id: 'roles', label: 'Each student has a role and a piece they answer for', mix: mx('project:1'), talk: 0.22, show: 0.25 }] }, COACH_SW] },
  { id: 'research', grp: 'make', name: 'Research time', does: 'Students find and read sources for their own question.', mix: mx('read:.6,notes:.3,wait:.1'), g: 'alone', th: 'alone', pu: 'M', lv: 2, arr: 'rows', setup: 1, think: true, sw: [COACH_SW] },
  { id: 'peer', grp: 'make', name: 'Peer review', does: 'Students read each other’s work and respond against criteria.', mix: mx('revise:.5,pair:.3,read:.2'), g: 'pair', th: 'together', pu: 'M', lv: 3, arr: 'pairs', talk: 0.15, setup: 1, show: 0.3, fb: 'now', think: true },
  { id: 'gallery', grp: 'make', name: 'Gallery walk', does: 'Students circulate, read posted work and respond.', mix: mx('read:.5,pair:.3,notes:.2'), g: 'group', th: 'together', pu: 'M', lv: 2, arr: 'free', talk: 0.15, setup: 2, think: true },

  { id: 'present', grp: 'show', name: 'Student presentations', does: 'Students present one after another; the rest watch.', mix: mx('listen:.9,present:.1'), g: 'class', th: 'alone', pu: 'T', lv: 3, arr: 'front', floor: 0.9, show: 0.1, fb: 'later', setup: 1,
    sw: [{ id: 'aud', label: 'The audience', opts: [{ id: 'watch', label: 'Watches' }, { id: 'task', label: 'Gives written feedback against criteria', mix: mx('listen:.6,notes:.3,present:.1'), show: 0.2, think: true, fb: 'now' }] }] },
  { id: 'perform', grp: 'show', name: 'Performance or critique', does: 'Students perform or show work and the group responds.', mix: mx('present:.3,watch:.5,pair:.2'), g: 'class', th: 'together', pu: 'T', lv: 3, arr: 'circle', talk: 0.05, floor: 0.6, show: 0.3, fb: 'now', setup: 2, think: true },
  { id: 'quiz', grp: 'show', name: 'Quiz', does: 'A short check, taken alone.', mix: mx('assess:1'), g: 'alone', th: 'alone', pu: 'A', lv: 2, arr: 'rows', show: 1, fb: 'later', setup: 1,
    sw: [{ id: 'fb', label: 'Afterwards', opts: [{ id: 'later', label: 'Returned another day' }, { id: 'now', label: 'Gone over straight away', fb: 'now' }] }] },
  { id: 'test', grp: 'show', name: 'Test or exam', does: 'A longer assessment, taken alone.', mix: mx('assess:1'), g: 'alone', th: 'alone', pu: 'A', lv: 2, arr: 'rows', show: 1, fb: 'later', setup: 2 },
  { id: 'exit', grp: 'show', name: 'Exit ticket', does: 'One or two questions answered on the way out.', mix: mx('assess:1'), g: 'alone', th: 'alone', pu: 'A', lv: 2, arr: 'rows', show: 1, fb: 'later' },
  { id: 'ptask', grp: 'show', name: 'Performance task', does: 'Students carry out an assessed task in class.', mix: mx('assess:.6,make:.4'), g: 'alone', th: 'alone', pu: 'T', lv: 3, arr: 'rows', show: 1, fb: 'later', setup: 2 },
  { id: 'confer', grp: 'show', name: 'Conferences', does: 'You meet students one at a time while the rest work.', mix: mx('practice:.8,revise:.2'), g: 'alone', th: 'alone', pu: 'M', lv: 2, arr: 'rows', talk: 0.04, show: 0.2, fb: 'now' },
  { id: 'goover', grp: 'show', name: 'Going over work', does: 'You return work and walk through it.', mix: mx('listen:.6,revise:.4'), g: 'class', th: 'shared', pu: 'M', lv: 2, arr: 'rows', show: 0, fb: 'now',
    sw: [{ id: 'redo', label: 'Students', opts: [{ id: 'listen', label: 'Follow along' }, { id: 'redo', label: 'Correct their own work and hand it back', mix: mx('revise:.8,listen:.2'), th: 'alone', show: 0.5 }] }] },

  { id: 'entry', grp: 'routine', name: 'Entry routine', does: 'Attendance, materials out, agenda on the board.', mix: mx('admin:1'), g: 'class', th: 'teacher', pu: 'N', lv: 1, arr: 'rows' },
  { id: 'announce', grp: 'routine', name: 'Announcements', does: 'Housekeeping, reminders, returning papers.', mix: mx('admin:.5,listen:.5'), g: 'class', th: 'teacher', pu: 'N', lv: 1, arr: 'rows' },
  { id: 'break', grp: 'routine', name: 'Movement break', does: 'A minute or two to stand, stretch and reset.', mix: mx('admin:1'), g: 'class', th: 'teacher', pu: 'N', lv: 1, arr: 'free' },
  { id: 'cleanup', grp: 'routine', name: 'Cleanup and pack-up', does: 'Materials away, room reset, homework noted.', mix: mx('admin:1'), g: 'class', th: 'teacher', pu: 'N', lv: 1, arr: 'rows' },
];
const MOVE_BY = {}; MOVES.forEach((m) => (MOVE_BY[m.id] = m));

/* Ready-made lesson shapes, as [move, share of the period]. A teacher drops one in and adjusts. */
const PATTERNS = [
  { id: 'direct', name: 'Explain, then practise', does: 'Review, teach in small steps, practise together, practise alone, check.', blocks: [['retrieval', 0.1], ['mini', 0.2], ['guided', 0.25], ['indep', 0.3], ['exit', 0.1]] },
  { id: 'workshop', name: 'Workshop', does: 'A short lesson, a long stretch of making with conferences, a share.', blocks: [['mini', 0.2], ['studio', 0.6], ['turn', 0.1]] },
  { id: 'labday', name: 'Lab day', does: 'Set the question, investigate, make sense of results.', blocks: [['directions', 0.1], ['lab', 0.6], ['tps', 0.15], ['exit', 0.08]] },
  { id: 'seminarday', name: 'Seminar day', does: 'Write to prepare, discuss, write to consolidate.', blocks: [['quickwrite', 0.15], ['seminar', 0.6], ['reflect', 0.15]] },
  { id: 'lectureday', name: 'Lecture day', does: 'Mostly explanation, with a few questions.', blocks: [['lecture', 0.75], ['qa', 0.15]] },
  { id: 'reviewday', name: 'Review day', does: 'Bring earlier material back and find the gaps.', blocks: [['retrieval', 0.15], ['game', 0.4], ['indep', 0.3], ['goover', 0.1]] },
  { id: 'testday', name: 'Test day', does: 'A full-period assessment.', blocks: [['directions', 0.06], ['test', 0.86]] },
  { id: 'projectday', name: 'Project work day', does: 'Check in, work in teams, report progress.', blocks: [['directions', 0.08], ['projwork', 0.75], ['turn', 0.08]] },
  { id: 'problemday', name: 'Problem first', does: 'Students wrestle with a problem, then you name what they found.', blocks: [['task', 0.45], ['qa', 0.15], ['mini', 0.2], ['exit', 0.1]] },
];
