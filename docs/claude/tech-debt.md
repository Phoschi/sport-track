# Dette technique

- **Vulnérabilités npm audit (6, low/moderate)** dans `workbox-build` → glob/minimatch. Outil de build uniquement, absent du bundle. Le fix proposé rétrograde vite-plugin-pwa : à revoir à la prochaine version.
- **Bundle JS ~131 ko gzip** en un seul chunk. OK pour l'instant ; découpage par route si ça grossit.
- **Pages placeholder** (`shared/ui/PagePlaceholder`) à supprimer au fur et à mesure des phases.
- **Pas de tests de composants UI** (seulement domaine + repositories + parcours Playwright manuel). À ajouter si l'UI se complexifie (Testing Library = nouvelle dépendance à justifier).
- **Erreurs affichées en texte brut** (message de l'exception). Pas de système de notifications.
- **`window.confirm`** pour les suppressions : fonctionnel sur iOS mais natif et peu joli. À remplacer au redesign.
- **`watchAll` des exos recharge toute la table** à chaque changement : OK pour < 200 exos.
- **Parcours e2e Playwright non versionné** (script dans le scratchpad de session). À intégrer au repo si on veut l'automatiser (dépendance `@playwright/test`).
- **Récap = même route que la saisie** ; pas encore d'historique des séances (liste) ni de correction après coup (prévu plus tard).
- **`window.confirm`** aussi pour Terminer/Annuler la séance.
- **Pas d'avertissement si deux onglets éditent la même séance** (cas improbable sur iPhone).
- **Récap sans deltas** : arrivent en phase 7.
