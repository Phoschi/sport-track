# Journal des décisions

Format : date — choix — pourquoi — alternatives écartées.

- **2026-11-05 — Séances, programmes = documents embarqués** (séances dans le programme ; exos/séries dans la séance faite). Lecture/écriture atomique, sauvegarde continue simple, export JSON naturel. Écarté : tables normalisées (jointures manuelles en IndexedDB).
- **2026-11-05 — Snapshot du plan dans chaque séance faite.** Modifier un programme ne réécrit pas l'historique ni l'export PMH. Écarté : lire le programme courant à l'export.
- **2026-11-05 — Programme principal stocké dans `settings`.** Garantit l'unicité. Écarté : booléen `isMain` par programme.
- **2026-11-05 — `exerciseIds` dénormalisé + index multi-entry** pour retrouver vite « la dernière fois que cet exo a été fait ».
- **2026-11-05 — Dates jour en `YYYY-MM-DD` Paris, calculs en UTC minuit.** Évite les bugs DST. Pas de lib de dates (Intl suffit).
- **2026-11-05 — Ids UUID avec fallback `getRandomValues`.** `randomUUID` absent en contexte non sécurisé (test iPhone en HTTP sur le LAN).
- **2026-11-05 — CSS Modules** pour les styles de composants (natif Vite, zéro dépendance), tokens globaux dans `tokens.css`.
- **2026-11-05 — SW en `autoUpdate`.** Les nouvelles versions s'appliquent seules ; sans risque grâce à la sauvegarde à chaque saisie.
- **2026-11-05 — Dépendances** : react, react-router-dom, dexie (prod) ; vite, @vitejs/plugin-react, typescript, vite-plugin-pwa + workbox-window, vitest, fake-indexeddb (tests Dexie sous Node), @types/*. Pas d'ESLint/Prettier (tsc strict suffit pour l'instant).
- **2026-11-05 — Graphiques : uPlot (phase 7).** ~45 ko, sans dépendance. Écarté : Chart.js (plus lourd), Recharts (D3).
- **2026-11-05 — Backup JSON remonté en phase 4** (validé) : protéger les données dès la saisie réelle.
- **2026-11-05 — Icônes générées depuis `public/favicon.svg`** via le Chromium de l'environnement (pas de dépendance). PNG pleins bords : iOS arrondit lui-même.
