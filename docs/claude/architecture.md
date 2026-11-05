# Architecture

## Arborescence
```
src/
  main.tsx              bootstrap : SW, ouverture DB, stockage persistant, router
  app/                  shell (AppLayout, nav), router, StatsPage, NotFoundPage — composition root
  db/                   database.ts (schéma Dexie versionné), instance.ts (connexion unique)
  shared/domain/        utilitaires purs : parisDate, formatNumber, id, settings, swapAdjacent
  shared/data/          contrat Observable (compatible liveQuery Dexie)
  shared/ui/            Button, BottomSheet (<dialog>), Stepper, ChipGroup, useObservable
  features/<feature>/   program · workout · body · progress · export · home
    domain/             types + fonctions pures (testées)
    data/               interfaces repository + impl Dexie (factory qui reçoit la DB) + contexte React
    ui/                 pages et composants
  styles/               tokens.css (design tokens), base.css
```
Tests : `*.test.ts` à côté du code.

## Navigation
4 onglets en bas : Accueil `/`, Programmes `/programs`, Corps `/body`, Stats `/stats`.
- Stats = `app/StatsPage` qui assemble `progress/ui/ProgressSection` et `export/ui/ExportSection`. Seul le shell (`app/`) a le droit de combiner deux features.
- Programmes : `/programs` (liste), `/programs/:programId` (éditeur complet, feuilles en bas d'écran), `/programs/exercises` (catalogue).
- Saisie de séance : pas d'onglet. `/workout/start/:programId/:sessionId` (bouton « Démarrer » d'une carte de séance) crée la séance puis redirige vers `/workout/:workoutId` (saisie, puis récap une fois terminée).
- Accueil `/` = `app/HomeRoute` qui assemble `workout/ui/CurrentWorkoutBanner` (séance en cours) et `home/ui/HomePage`.

## Règles de dépendance
- `ui` → `domain` + interface de repository. Jamais `db/` directement.
- `domain` → rien (pur).
- Une feature peut importer le `domain` d'une autre, jamais son `ui` ni son `data`.
- Migration serveur : nouvelles impls de repository, branchées dans le composition root.

## Modèle de données (Dexie, schéma v1)
| Table | Clé / index | Type |
|---|---|---|
| `exercises` | `id`, `name` | `Exercise` |
| `programs` | `id` | `Program` (séances embarquées) |
| `workouts` | `id`, `date`, `*exerciseIds` | `Workout` (exos + séries brouillon/validées + snapshot du plan embarqués) |
| `bodyWeights` | `date` | `BodyWeight` |
| `measurementSites` | `id`, `order` | `MeasurementSite` (archivage au lieu de suppression) |
| `measurements` | `[date+siteId]`, `siteId`, `date` | `Measurement` |
| `settings` | `key` | `mainProgramId`, `lastExportAt` |

Types : `features/*/domain/types.ts`, `shared/domain/settings.ts`.
Conventions : ids UUID ; jours `YYYY-MM-DD` heure de Paris ; horodatages ISO ; poids en kg décimal.

## Injection des repositories
- Chaque feature expose ses interfaces + un contexte (`features/program/data/ProgramRepositoriesContext.tsx`).
- `app/RepositoryProviders.tsx` (composition root) instancie les impls Dexie et monte les providers.
- Les impls Dexie reçoivent la DB en paramètre (tests sur une base `fake-indexeddb` isolée).
- `db/instance.ts` n'est importé que par `main.tsx` et `RepositoryProviders`.

## Feature program
- Domaine pur : `exerciseName` (normalisation, doublons), `searchExercises`, `repRange`, `exerciseStatus` (« not trained anymore »), `sessionEditing` (exos d'une séance + règles superset), `programEditing` (séances), `mainProgram`, `errors`.
- Superset : drapeau `supersetWithNext` sur l'exo du haut. Toute paire dont un membre change (retrait, déplacement) est déliée ; le dernier exo n'a jamais de drapeau.

## Feature workout
- Séance = document `Workout` : snapshot du plan, `previousSetCount` par exo, séries `{ isWarmup, isValidated, segments: { weightKg|null, reps|null }[] }`. En cours = `finishedAt` absent ; une seule à la fois (garanti par `start`).
- Préremplissage au démarrage depuis la dernière séance où l'exo a des séries de travail validées (`lastPerformance`, `prefill`, `createWorkout`), stocké en brouillon.
- Seules les séries **validées et complètes** comptent (`completedWorkingSets`) : base des deltas/PR à venir.
- Saisie : `useWorkoutEditor` = état local + écriture immédiate sérialisée à chaque changement + écriture au passage en arrière-plan.
- Domaine : `setEditing`, `workoutEditing`, `workoutStatus` (skip calculé, proposition « Terminer » d'une séance oubliée), `supersetBlocks`, `formatSet`.

## Flux
Page → hook de feature → interface repository → impl Dexie → IndexedDB.
Calculs (préremplissage, deltas, PR, tendances, exports) = fonctions pures sur données chargées.
Réactivité : `liveQuery` Dexie encapsulé dans des méthodes `watch…` du repository.
