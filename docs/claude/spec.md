# Spec produit — Gym Tracker

> Source de vérité. Toute évolution produit est reportée ici.

## Contexte
PWA de suivi muscu, mono-utilisateur, utilisée sur iPhone en salle (Safari, ajoutée à l'écran d'accueil).
Le propriétaire décide du produit, de la direction et de l'architecture ; Claude gère la technique et rapporte.

## Stack
- Vite + React + TypeScript (strict)
- IndexedDB via Dexie
- PWA hors ligne obligatoire (vite-plugin-pwa)
- React Router
- Graphiques : librairie légère
- Déploiement statique gratuit sur Vercel
- Pas de backend pour l'instant. Prévu dès maintenant :
  - export/import JSON complet de la base ;
  - migration future vers un serveur self-hosted (HTTPS requis).

## Catalogue d'exos
- Un exo = un id stable + un nom libre (ex. « Curl marteau haltère »). Renommer garde l'historique.
- Autocomplétion à la saisie du nom, pour éviter les doublons.
- Pas de type d'exo. Toujours poids + reps. Poids à 0 autorisé ; le lest se note dans le poids.
- Statut « not trained anymore » : **calculé**, jamais stocké.
  - L'exo n'apparaît dans aucune séance d'aucun programme → mention affichée.
  - Remis dans une séance → la mention disparaît.
  - L'historique n'est jamais supprimé.

## Programmes
- Plusieurs programmes, un seul principal. On peut changer de principal.
- Un programme = liste ordonnée de séances (A, B, C…). Chaque séance a un jour prévu dans la semaine.
- Une séance = liste ordonnée d'exos, avec pour chacun : l'exo, une description optionnelle, le nombre de séries, la fourchette de reps (`4-6` ou `8`).
- Un exo peut être lié au suivant en superset.
- Rotation hebdo :
  - semaine du lundi au dimanche (heure de Paris) ;
  - chaque lundi, le cycle repart de la séance A ;
  - on peut faire une séance avant son jour prévu (ex. B le mardi au lieu du mercredi).

## Accueil
- Séance du programme principal prévue aujourd'hui et pas encore faite → affichée.
- Sinon → « Pas de séance prévue », avec bouton « Faire la prochaine séance (X) » s'il reste une séance non faite cette semaine.
- Rappel de saisir le poids du jour s'il n'est pas saisi.
- Le samedi : rappel des mensurations si pas encore saisies.
- Résumé court de la dernière séance faite.
- Rappel de backup si le dernier export JSON date de plus de 7 jours.

## Saisie de séance
- Utilisable à une main entre deux séries : gros boutons, minimum de frappe.
- Préremplissage poids et reps, série par série, depuis **la dernière fois que cet exo a été fait**, toutes séances confondues.
- Une série = 1 à n segments `{weight, reps}` (dégressive, montée de charge en cours de série). Le changement crée un nouveau segment dans la **même** série.
- Séries de chauffe :
  - ajoutées à la volée, jamais prévues dans le programme ;
  - marquées comme chauffe, facultatives ;
  - exclues des PR, des deltas et du préremplissage ;
  - visibles explicitement dans les résumés et l'export Claude (le saut de charge chauffe → travail sert à repérer un risque de blessure).
- Possible d'ajouter une série en plus ou de sauter un exo.
- Note libre par exo et par séance.
- Sauvegarde à chaque saisie : aucune perte si l'app se ferme en pleine séance.
- Pas de minuteur de repos.
- Unité : kg uniquement, décimales autorisées (17,5).

### Règles de saisie (validées le 2026-11-05)
- Pas de séance libre : une séance se lance toujours depuis une séance d'un programme.
- Le programme est figé pendant une séance lancée : pas d'ajout/remplacement d'exo. Restent possibles : série en plus, série de chauffe, sauter un exo.
- Valeurs préremplies = suggestions. Une série ne compte que validée d'un tap sur ✓.
- Saisie poids et reps : un simple champ chacun (pas de boutons +/−).
- Série en plus par rapport à la dernière fois : reprend les valeurs de la dernière série connue, avec un rappel de la fourchette de reps prévue.
- Nouveau segment : reprend le poids du segment précédent, à ajuster.
- Superset : exos liés affichés groupés dans un même bloc.
- Une seule séance en cours à la fois. App fermée → l'accueil propose « Reprendre ». Bouton « Annuler la séance » pour supprimer une séance lancée par erreur.
- « Terminer » = séance finie, même incomplète : les exos sans série validée sont marqués « skip » dans le récap.
- Séance d'un jour précédent encore en cours à l'ouverture : l'app propose de la terminer seulement si tous les exos sont remplis ; sinon rien.
- Date d'une séance = date de début (heure de Paris).
- Préremplissage et deltas : depuis la dernière séance où l'exo a des séries de travail validées (une séance où il est skip est ignorée).
- Corriger une séance terminée : plus tard, via l'historique (pas en phase 3).

## Progression
- Résumé d'une série de travail : poids max (segment le plus lourd) + reps totales.
- Delta série par série vs la dernière fois que l'exo a été fait. Format : `+2,5kg`, `+0rep`, `-1rep`.
- PR = poids max soulevé, chauffe exclue. À poids égal, le plus de reps l'emporte. Le PR est daté.
- Tendance par exo sur les 4 dernières séances : progression / stagnation / baisse (règle simple à proposer).
- Graphique par exo : poids max par séance dans le temps.

## Corps
- Poids quotidien.
- Moyenne hebdo + tendance vs semaine précédente : hausse / stagne / baisse (seuil à proposer).
- Mensurations hebdo, le samedi matin, en cm, avec delta vs mesure précédente.
- Liste modifiable (ajout, suppression, renommage) sans perte d'historique. Liste initiale : cou, épaules, poitrine, bras droit, hanches, cuisse droite, mollet droit.

## Exports
Méthode : téléchargement d'un fichier **et** bouton « copier ». Période : la semaine, ou une plage de dates libre.

### 1. Export Claude — JSON et Markdown
Hiérarchie :
- période ;
- séances : date, nom, notes ;
  - exos ;
    - séries : chauffe ou travail, segments, deltas ;
- poids du corps : quotidien, moyenne, tendance ;
- mensurations + deltas.

### 2. Export PMH — texte pour le coach
Format exact :

```
PMH A

HACK SQUAT (MACHINE)
3 séries de 6 répétitions
kg : 5-5-7,5kg reps : 6-6-6

ROWING POULIE ASSIS
3 séries de 4-6 répétitions
kg : 60kg reps : 6-4-5

EXTENSION TRICEPS (HALTÈRE)
2 séries de 8 répétitions
kg : 16-20kg reps : 8-8
SS
CURL MARTEAU (HALTÈRE)
2 séries de 8 répétitions
kg : 16kg reps : 8-8

SOULEVÉ DE TERRE (BARRE)
1 série de 5 répétitions
kg : 90kg reps : 5
```

Règles :
- Nom de l'exo en majuscules.
- « N séries de X répétitions » vient du programme. Singulier si 1 série.
- Ligne kg : même poids partout → une seule valeur (`60kg`) ; sinon liste séparée par `-` ; décimales avec virgule.
- Séries de chauffe exclues.
- Série à segments : poids `50/45`, reps `3+3`.
- `SS` entre deux exos en superset.
- Une ligne vide entre les exos, deux entre les séances.

Mensurations au format PMH :

```
### Mensurations
- **Tour de cou :** 37 cm (same)
- **Tour d'épaules :** 116 cm (+2 cm)
```

### 3. Historique global des charges
Couvre tous les exos jamais faits, y compris ceux qui ne sont plus programmés :

```
DÉVELOPPÉ COUCHÉ (BARRE)
  Last training 06/11/2026 : 40-40-37,5kg reps : 8-7-8
  PR 02/11/2026 : 50kg × 2
  Trend (4 last) : stagnation
  [not trained anymore]
```

## Backup
- Export et import JSON complet de la base.
- Plus tard : synchro vers serveur self-hosted (HTTPS requis depuis la PWA).
