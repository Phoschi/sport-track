export type NavigationItem = { path: string; label: string };

export const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  { path: '/', label: 'Accueil' },
  { path: '/workout', label: 'Séance' },
  { path: '/programs', label: 'Programmes' },
  { path: '/body', label: 'Corps' },
  { path: '/progress', label: 'Progrès' },
  { path: '/export', label: 'Export' },
];
