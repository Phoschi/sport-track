# Questions ouvertes

Choix provisoires pris pendant le dev, à valider par le propriétaire. Une fois tranché : déplacer dans `decisions.md` (et `spec.md` si produit), supprimer d'ici.

Format : **[phase] Question** — choix provisoire / proposition.

## À valider

### Phase 4 — choix provisoires
- **Restauration = remplacement total** (pas de fusion avec les données actuelles). Simple et prévisible ; une fusion serait utile pour réunir deux appareils, pas le cas ici.
- **Sauvegarde via la feuille de partage iOS** (Enregistrer dans Fichiers, iCloud, AirDrop…), téléchargement en repli. Pas de bouton « copier » pour le backup (fichier trop gros pour le presse-papiers ; le « copier » reste prévu pour les exports Claude/PMH).
- **Backup marqué fait dès que la feuille de partage est validée**, quelle que soit la destination choisie.
- **État du backup visible dans Stats › Exports** ; le rappel sur l'accueil arrive en phase 5.

### Phase 5 — accueil + rotation
- **Séance « faite » cette semaine** = séance terminée entre lundi et dimanche (Paris) avec cette séance du programme principal. Une séance en cours ne compte pas encore. Proposition : oui.
- **« Prochaine séance (X) »** = première séance non faite de la semaine dans l'ordre du programme, même si son jour est passé. Proposition : oui.
- **Séance du jour déjà faite plus tôt dans la semaine** (B faite mardi, prévue mercredi) → mercredi : « Pas de séance prévue » + bouton prochaine séance. Proposition : oui.
- **Changement de programme principal en milieu de semaine** : les séances faites avec l'ancien ne comptent pas, le nouveau repart de A. Proposition : oui.
- **Résumé de la dernière séance sur l'accueil** : nom, date, et par exo `Squat 60kg × 8-7-8` (chauffe exclue, skip indiqué). Proposition : oui.

### Phase 6 — corps
- **Mensurations saisissables un autre jour que samedi** (rattachées à leur date) ? Proposition : oui, le samedi n'est que le jour du rappel.
- **Seuil de tendance du poids** : |Δ moyenne hebdo| < 0,2 kg → stagne.

### Phase 7 — progression
- **Delta quand le nombre de séries diffère** : série sans équivalent la dernière fois → « nouvelle ».
- **Delta d'une série à segments** : calculé sur le résumé (poids max + reps totales).
- **PR à poids égal** : reps du segment à ce poids (pas les reps totales de la série).
- **Tendance sur 4 séances** : meilleur résumé (poids max, puis reps) de la plus récente vs la plus ancienne des 4 ; plus haut = progression, égal = stagnation, plus bas = baisse ; < 4 séances = pas assez de données.

### Plus tard
- **Synchro serveur self-hosted** : à planifier après la phase 8 ? Le format de backup versionné servira de base à la migration.
