# Roadmap

## Phase 1 — Setup ✅
- [x] Vite + React + TypeScript strict
- [x] PWA hors ligne (manifest, icônes, service worker)
- [x] Dexie : schéma v1 complet + stockage persistant demandé
- [x] React Router : shell + nav bas + pages vides par feature
- [x] Design tokens (sombre, mauve/bleu + marron)
- [x] Vitest (dates Paris, nombres, ids, schéma DB)
- [x] `vercel.json` (rewrite SPA)
- [x] Docs
- [x] Déploiement Vercel (prod : branche `dev`)

## Phase 2 — Catalogue + programmes ✅ (PR vers `dev`)
- [x] Repositories exercise / program (+ tests fake-indexeddb)
- [x] CRUD exos, autocomplétion anti-doublon, renommage, suppression gardée
- [x] Mention « not trained anymore » (calculée)
- [x] CRUD programmes, séances (nom, jour), exos planifiés (description, séries, fourchette reps), ordre
- [x] Superset (suivant à l'édition, précédent à l'ajout)
- [x] Programme principal (auto au premier, changeable, non supprimable)

## Phase 3 — Saisie de séance
- [ ] Bouton « Démarrer cette séance » depuis un programme
- [ ] Préremplissage série par série (dernière fois, chauffe exclue)
- [ ] Segments, chauffe, série en plus, saut d'exo, notes
- [ ] Sauvegarde continue

## Plus tard
- [ ] Corriger une séance terminée (historique)

## Phase 4 — Backup JSON
- [ ] Export complet + import (+ `lastExportAt`)

## Phase 5 — Accueil + rotation hebdo
## Phase 6 — Corps (poids, moyenne, mensurations)
## Phase 7 — Progression (deltas, PR, tendances, graphiques)
## Phase 8 — Exports Claude / PMH / historique

## Questions produit ouvertes
- Prochaine séance = première non faite de la semaine dans l'ordre, même si son jour est passé ? (phase 5)
- Mensurations saisissables un autre jour que samedi ? (phase 6)
- Seuil poids du corps : proposé |Δ| < 0,2 kg = stagne (phase 6)
- Delta si nombre de séries différent ; delta d'une série à segments (proposé : sur le résumé) (phase 7)
- PR à poids égal : reps du segment (proposé) ou reps totales ? (phase 7)
- Tendance 4 séances : proposé = meilleur résumé récent vs le plus ancien des 4 (phase 7)
