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
- **2026-11-05 — Navigation à 4 onglets** (Accueil, Programmes, Corps, Stats) — décision du propriétaire. 6 onglets trop serrés en 390 px. Stats regroupe progression + exports ; la saisie de séance se lance depuis l'accueil ou un programme, pas d'onglet.
- **2026-11-05 — Workflow git** : `dev` = production Vercel ; une branche par phase/tâche ; PR vers `dev` relue et mergée par le propriétaire ; jamais de push direct sur `dev`.
- **2026-11-05 — Phase 2, règles produit (propriétaire)** : suppression d'un exo seulement s'il n'est utilisé nulle part (programme ou séance faite) ; renommage vers un nom existant bloqué (sans casse/accents/espaces) ; programme principal non supprimable ; nom de séance libre, défaut = lettre suivante, rotation selon l'ordre de la liste.
- **2026-11-05 — Premier programme créé = principal automatiquement.** Évite un état « aucun principal » inutile.
- **2026-11-05 — Éditeur de programme sur une seule page + feuilles en bas d'écran** (`<dialog>` natif). Peu d'écrans, tout à portée de pouce. Écarté : un écran par séance.
- **2026-11-05 — Saisie rapide** : puces de fourchettes de reps, stepper de séries (défaut 3), reps par défaut = celles du dernier exo de la séance, « Superset avec l'exo précédent » proposé à l'ajout. Clavier texte pour les reps (le pavé numérique iOS n'a pas de tiret).
- **2026-11-05 — Réordonnancement par boutons ↑ ↓.** Pas de lib de drag & drop.
- **2026-11-05 — Sauvegarde immédiate** dans l'éditeur (nom au blur, jour au tap) : pas de bouton « Enregistrer » à oublier.
- **2026-11-05 — Réactivité via `liveQuery` derrière un contrat `Observable` maison** : l'UI ne connaît pas Dexie ; une impl serveur pourra fournir le même contrat.
- **2026-11-05 — Doublons et recherche calculés en mémoire** (catalogue < 200 exos). Pas de nom normalisé stocké.
- **2026-11-05 — Phase 3, règles produit (propriétaire)** : voir `spec.md` § Règles de saisie. Exo sauté volontairement = rempli pour la proposition « Terminer » ; « Démarrer » sur toutes les séances de tous les programmes.
- **2026-11-05 — Préremplissage stocké en brouillon** dans la séance (`isValidated: false`) plutôt que recalculé à l'affichage : survit à la fermeture de l'app, une seule source de vérité.
- **2026-11-05 — Segments en `number | null`** pour représenter les champs vides ; seuls les helpers de séries validées exposent des valeurs non-nullables aux calculs.
- **2026-11-05 — État local + écriture à chaque saisie** (file sérialisée) plutôt que `liveQuery` pendant la saisie : pas de saut de curseur, pas d'écritures désordonnées.
- **2026-11-05 — Séance en cours détectée par scan** (`finishedAt` absent) : quelques centaines de séances par an, pas besoin d'index.
- **2026-11-05 — Le repository workout lit `programs` et `exercises` directement** (impl Dexie) pour le snapshot et les noms : l'UI workout ne dépend pas de la feature program.
