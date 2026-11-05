# Gym Tracker — CLAUDE.md

PWA de suivi muscu mono-utilisateur (iPhone, Safari, écran d'accueil), hors ligne, données en IndexedDB.
Le propriétaire décide du produit et de l'architecture ; Claude gère la technique et fait des rapports clairs.

Production : https://sport-track-ten.vercel.app

**Lire en début de session :** ce fichier, puis `docs/claude/progress.md` et `docs/claude/roadmap.md`.

## Règles
- Code, noms, fichiers, commits : anglais. Interface : français.
- Commits conventionnels (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`), petits et atomiques.
- Fichiers courts (~150 lignes max), une responsabilité par fichier.
- Commentaires seulement quand le *pourquoi* n'est pas évident.
- Architecture par feature : `program`, `workout`, `body`, `progress`, `export`, `home`.
  - UI séparée de la logique ; logique métier en fonctions pures testées (Vitest).
  - Accès aux données uniquement via la couche repository (migration future IndexedDB → serveur sans toucher l'UI).
  - Une feature ne dépend pas des internes d'une autre.
- Aucune dépendance sans justification (la noter dans `decisions.md`). Simple > malin.
- Fonctionnel > joli. Thème sombre via design tokens CSS centralisés.
- Point produit ambigu → demander. Ne jamais trancher seul.
- Fin de chaque tâche : mettre à jour `roadmap.md` et `progress.md` (+ `decisions.md`, `bugs.md`, `tech-debt.md` si pertinent). Concis.

## Workflow git
- `dev` = production : chaque push est déployé automatiquement sur Vercel.
- **Ne jamais pusher directement sur `dev`.**
- Une branche par phase ou par tâche, au nom explicite (`feat/programs`, `fix/…`, `chore/…`).
- Fin de phase/tâche : PR vers `dev`. Le propriétaire relit et merge lui-même.
- Chaque PR a une URL de preview Vercel : c'est elle qu'on teste sur iPhone.

## Commandes
```bash
npm install
npm run dev        # serveur de dev
npm run build      # typecheck + build de prod
npm run preview    # sert le build (test PWA hors ligne)
npm test           # Vitest
npm run typecheck
```

## Docs (`docs/claude/`)
- `spec.md` — spec produit, source de vérité
- `architecture.md` — arborescence, modèle de données, flux
- `decisions.md` — journal des choix
- `roadmap.md` — phases + todo
- `progress.md` — journal de session
- `bugs.md` — bugs connus
- `tech-debt.md` — raccourcis à reprendre
