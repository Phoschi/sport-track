# Dette technique

- **Vulnérabilités npm audit (6, low/moderate)** dans `workbox-build` → glob/minimatch. Outil de build uniquement, absent du bundle. Le fix proposé rétrograde vite-plugin-pwa : à revoir à la prochaine version.
- **Nav bas à 6 onglets** serrée sur iPhone (390 px). À revoir avec le redesign (ex. regrouper Export dans un menu).
- **Bundle JS ~131 ko gzip** en un seul chunk. OK pour l'instant ; découpage par route si ça grossit.
- **Pages placeholder** (`shared/ui/PagePlaceholder`) à supprimer au fur et à mesure des phases.
