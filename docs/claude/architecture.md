# Architecture

## Arborescence
```
src/
  main.tsx              bootstrap : SW, ouverture DB, stockage persistant, router
  app/                  shell (AppLayout, nav), router, StatsPage, NotFoundPage — composition root
  db/                   database.ts (schéma Dexie versionné), instance.ts (connexion unique)
  shared/domain/        utilitaires purs : parisDate, formatNumber, id, settings
  shared/ui/            composants génériques
  features/<feature>/   program · workout · body · progress · export · home
    domain/             types + fonctions pures (testées)
    data/               interface repository + impl Dexie (à partir de la phase 2)
    ui/                 pages et composants
  styles/               tokens.css (design tokens), base.css
```
Tests : `*.test.ts` à côté du code.

## Navigation
4 onglets en bas : Accueil `/`, Programmes `/programs`, Corps `/body`, Stats `/stats`.
- Stats = `app/StatsPage` qui assemble `progress/ui/ProgressSection` et `export/ui/ExportSection`. Seul le shell (`app/`) a le droit de combiner deux features.
- Saisie de séance `/workout…` : pas d'onglet. Lancée depuis l'accueil (séance du jour / prochaine) ou depuis un programme.

## Règles de dépendance
- `ui` → `domain` + interface de repository. Jamais `db/` directement.
- `domain` → rien (pur).
- Une feature peut importer le `domain` d'une autre, jamais son `ui` ni son `data`.
- `db/instance.ts` n'est importé que par les repositories et `main.tsx`.
- Migration serveur : nouvelles impls de repository, branchées dans le composition root.

## Modèle de données (Dexie, schéma v1)
| Table | Clé / index | Type |
|---|---|---|
| `exercises` | `id`, `name` | `Exercise` |
| `programs` | `id` | `Program` (séances embarquées) |
| `workouts` | `id`, `date`, `*exerciseIds` | `Workout` (exos + séries + snapshot du plan embarqués) |
| `bodyWeights` | `date` | `BodyWeight` |
| `measurementSites` | `id`, `order` | `MeasurementSite` (archivage au lieu de suppression) |
| `measurements` | `[date+siteId]`, `siteId`, `date` | `Measurement` |
| `settings` | `key` | `mainProgramId`, `lastExportAt` |

Types : `features/*/domain/types.ts`, `shared/domain/settings.ts`.
Conventions : ids UUID ; jours `YYYY-MM-DD` heure de Paris ; horodatages ISO ; poids en kg décimal.

## Flux
Page → hook de feature → interface repository → impl Dexie → IndexedDB.
Calculs (préremplissage, deltas, PR, tendances, exports) = fonctions pures sur données chargées.
Réactivité : `liveQuery` Dexie encapsulé dans des méthodes `watch…` du repository.
