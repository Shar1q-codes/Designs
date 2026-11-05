// All portfolio content lives here once. Every design renders from this file,
// so edit it and the change shows up in all nine designs.
// Values marked "EDIT" are stand-ins: replace them with your real details.

export type Area = {
  id: 'web' | 'app' | 'software' | 'game' | 'data' | 'video';
  name: string;
  summary: string;
  tags: string[];
};

export const profile = {
  name: 'Syed Shariq Hussain',
  shortName: 'Shariq',
  initials: 'SH',
  handle: 'shariq',
  role: 'Software engineer & data scientist',
  status: 'Open to opportunities', // EDIT
  headline: ['Software engineer', 'and data scientist.'],
  headlineEmphasis: 'data scientist.',
  lede:
    'I build complete products across web, mobile, desktop and games, make and edit video, and use data science to turn the numbers those products collect into decisions.',
  fact: 'Data Science · Boston Institute of Analytics',
  email: 'hello@shariq.example', // EDIT: your real email
  replyTime: 'Have a product to build or a dataset to understand? Send me a message.',
  socials: [
    { label: 'GitHub', href: 'https://github.com/' }, // EDIT: your profile links
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  ],
};

export const about = {
  paragraphs: [
    'I am a full-stack software engineer. I work across the whole product: web front ends, mobile apps, desktop and back-end software, and the databases and APIs that connect them. I also build games and produce video, from AI-generated footage to the final edit.',
    'Alongside engineering I trained as a data scientist at Boston Institute of Analytics. That means I can build the product and also measure it: cleaning data, finding patterns and building models that answer real questions.',
  ],
  facts: [
    { label: 'Role', value: 'Software engineer' },
    { label: 'Also', value: 'Data scientist' },
    { label: 'Covers', value: 'Web, apps, software, games' },
    { label: 'Media', value: 'Video generation & editing' },
    { label: 'Trained at', value: 'Boston Institute of Analytics' },
  ],
};

export const areas: Area[] = [
  {
    id: 'web',
    name: 'Web development',
    summary: 'Fast, accessible websites and web apps, from the interface down to the API and database.',
    tags: ['Front end', 'Back end', 'APIs'],
  },
  {
    id: 'app',
    name: 'App development',
    summary: 'Mobile apps for Android and iOS that feel native, work offline and stay in sync.',
    tags: ['Android', 'iOS', 'Cross-platform'],
  },
  {
    id: 'software',
    name: 'Software development',
    summary: 'Reliable desktop and server software with clean architecture, tests and room to grow.',
    tags: ['Architecture', 'Testing', 'Automation'],
  },
  {
    id: 'game',
    name: 'Game development',
    summary: 'Playable games with responsive controls, game logic and the systems that keep them running smoothly.',
    tags: ['Gameplay', 'Game logic', '2D & 3D'],
  },
  {
    id: 'data',
    name: 'Data science',
    summary: 'Data cleaning, analysis, visualisation and machine learning models that answer business questions.',
    tags: ['Analysis', 'Machine learning', 'Visualisation'],
  },
  {
    id: 'video',
    name: 'Video generation & editing',
    summary: 'AI-generated video and hands-on editing: cutting, pacing, sound and the final export.',
    tags: ['AI video', 'Editing', 'Sound'],
  },
];

export const process = [
  { step: 'Understand', text: 'Start with the problem and the people who have it. Agree on what success looks like before writing code.' },
  { step: 'Design', text: 'Sketch the flows, data model and architecture so the build has a clear shape.' },
  { step: 'Build', text: 'Ship in small, tested pieces across web, app or back end, with each piece working before the next.' },
  { step: 'Measure', text: 'Use the data the product collects to check what works, then improve the next version.' },
];

export const dataPipeline = [
  { step: 'Collect', text: 'Gather data from files, databases and APIs.' },
  { step: 'Clean', text: 'Fix gaps, duplicates and wrong types.' },
  { step: 'Explore', text: 'Find patterns with statistics and charts.' },
  { step: 'Model', text: 'Train and test machine learning models.' },
  { step: 'Communicate', text: 'Turn results into clear charts and decisions.' },
];

// EDIT: swap in the exact languages and tools you use.
export const toolkit = [
  { group: 'Web', items: ['HTML, CSS, JavaScript', 'TypeScript', 'React', 'Node.js'] },
  { group: 'Apps & software', items: ['Android & iOS apps', 'REST APIs', 'SQL databases', 'Git'] },
  { group: 'Data science', items: ['Python', 'Pandas & NumPy', 'Machine learning', 'Data visualisation'] },
  { group: 'Games & video', items: ['Game development', 'AI video generation', 'Video editing', 'Sound & pacing'] },
];

export const education = [
  {
    when: 'Data Science', // EDIT: add the year, e.g. "2024"
    title: 'Data Science course',
    org: 'Boston Institute of Analytics',
  },
];

export const tickerText = 'Software engineer ✱ Web development ✱ App development ✱ Software development ✱ Game development ✱ Data science ✱ Video generation & editing ✱ ';

export const sections = [
  { id: 'home', label: 'Home', cmd: 'whoami', file: 'welcome' },
  { id: 'expertise', label: 'Expertise', cmd: 'ls ./expertise', file: 'expertise' },
  { id: 'about', label: 'About', cmd: 'cat about.md', file: 'about' },
  { id: 'process', label: 'Process', cmd: 'cat process.md', file: 'process' },
  { id: 'data', label: 'Data science', cmd: 'python pipeline.py', file: 'data-science' },
  { id: 'toolkit', label: 'Toolkit', cmd: 'ls ~/toolkit', file: 'toolkit' },
  { id: 'education', label: 'Education', cmd: 'cat education.txt', file: 'education' },
  { id: 'contact', label: 'Contact', cmd: 'mail --compose', file: 'contact' },
] as const;

export type SectionId = (typeof sections)[number]['id'];
