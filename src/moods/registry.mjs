// The mood registry. One line per mood.
//
// This list feeds the switcher, the head snippet, the URL handling and the
// checks. Adding a mood is one stylesheet in this folder and one line here.
// No content file changes.
//
//   id          the value of ?mood= and of <html data-mood>
//   name        shown by the switcher
//   stands      the side of Tucker the mood stands for (docs and specimen)
//   scheme      'light' or 'dark': sets color-scheme for form controls
//   auto        'light' or 'dark' if this mood is what a visitor gets with no
//               choice made, under that system colour scheme; otherwise null
//   themeToken  the custom property whose value becomes <meta name=theme-color>

export const moods = [
  { id: 'still', name: 'Still Water', stands: 'The steady presence', scheme: 'light', auto: 'light', themeToken: '--paper' },
  { id: 'deep', name: 'Deep Water', stands: 'The depth underneath', scheme: 'dark', auto: 'dark', themeToken: '--ground' },
  { id: 'cyber', name: 'Cyber', stands: 'The gamer', scheme: 'dark', auto: null, themeToken: '--void' },
];

export const param = 'mood';
export const storageKey = 'mood';
