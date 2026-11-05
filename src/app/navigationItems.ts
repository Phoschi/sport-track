export type NavigationItem = { path: string; label: string };

// Workout entry has no tab: it is started from Home or from a program.
export const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  { path: '/', label: 'Accueil' },
  { path: '/programs', label: 'Programmes' },
  { path: '/body', label: 'Corps' },
  { path: '/stats', label: 'Stats' },
];
