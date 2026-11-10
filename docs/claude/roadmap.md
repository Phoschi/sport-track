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

## Phase 3 — Saisie de séance ✅ (PR vers `dev`)
- [x] Bouton « Démarrer » sur chaque séance ; une seule séance en cours (Reprendre / Supprimer et démarrer)
- [x] Préremplissage série par série (dernière séance réellement faite, chauffe/skip/brouillons exclus)
- [x] Validation ✓ par série ; segments ; chauffe ; série en plus avec rappel de fourchette ; saut d'exo ; notes exo et séance
- [x] Sauvegarde continue (chaque saisie + passage en arrière-plan)
- [x] Terminer (skip marqué), Annuler, récap
- [x] Accueil minimal : bandeau séance en cours + « Terminer » d'une séance oubliée entièrement remplie

## Plus tard
- [ ] Corriger une séance terminée (historique)

## Phase 4 — Backup JSON ✅ (PR vers `dev`)
- [x] Format versionné (`format`, `schemaVersion`, `exportedAt`, toutes les tables)
- [x] Sauvegarde via la feuille de partage iOS (repli : téléchargement) + `lastExportAt`
- [x] Restauration : validation du fichier, résumé, remplacement atomique (tout ou rien)
- [x] Âge du dernier backup (règle des 7 jours prête pour l'accueil)

## Phase 5 — Accueil + rotation hebdo
## Phase 6 — Corps (poids, moyenne, mensurations)
## Phase 7 — Progression (deltas, PR, tendances, graphiques)
## Phase 8 — Exports Claude / PMH / historique

Questions ouvertes : voir `questions.md`.
