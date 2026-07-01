# Audit écoconception RGESN 2024 - Pédago'Up

Date : 1er juillet 2026  
Référentiel utilisé : PDF RGESN 2024 fourni pour l'audit, non versionné dans le repository  
Périmètre audité : `index.html`, `css/style.css`, `js/app.js`, dossier `assets/`

## Synthèse

Le site est déjà sur une bonne base pour l'écoconception : il est statique, sans framework lourd, sans backend, sans tracking visible, sans vidéo, avec des images principales en AVIF et une structure HTML plutôt sobre.

Les principaux écarts restants ne sont pas dans la complexité applicative, mais dans la mise en production : ressources inutilisées dans `assets`, absence de budget de poids/requêtes documenté, absence de stratégie cache/compression/hébergement, et absence de déclaration d'écoconception.

Mesure locale actuelle :

| Mesure | Valeur |
|---|---:|
| Taille totale du workspace audité | 224 879 octets |
| Taille du dossier `assets/` | 129 655 octets |
| Ressources first-party réellement appelées par la page | 209 323 octets |
| PDF RGESN dans `assets/` | Absent |
| PNG sources non utilisés par `index.html` | 0 octet |

Conclusion : la page appelée par l'utilisateur est légère. Le PDF du référentiel n'est plus dans le repository, et les images PNG sources non utilisées ont été retirées du dossier public. Les SVG décoratifs restent présents comme demandé.

## Ce qui est déjà correct

| Point | Critères RGESN concernés | Statut |
|---|---|---|
| Site statique en HTML/CSS/JS sans framework lourd | 1.9, 3.1, 4.5 | Bon |
| Images affichées en AVIF pour les contenus bitmap appelés par la page | 5.1 | Bon |
| Pas de vidéo, pas d'audio, pas de notification, pas de scroll infini | 4.1, 4.2, 4.13, 5.3 à 5.6 | Bon |
| FAQ en `details/summary`, formulaire HTML natif, composants simples | 4.5 | Bon |
| Pas de requêtes serveur pendant la saisie du formulaire | 4.9, 4.10 | Bon |
| Respect de `prefers-reduced-motion` dans le CSS et le carrousel | 4.1 | Bon |
| Pas de collecte analytique visible, pas de cookies visibles | 1.6 | Bon, à documenter |
| Polices servies sans appel à Google Fonts | 4.8, 6.7, 2.10 | Corrigé dans le code |
| Carrousel de témoignages en pause par défaut | 4.1, 4.15 | Corrigé dans le code |

## Corrections appliquées le 1er juillet 2026

| Correction | Critères concernés | Fichiers modifiés |
|---|---|---|
| Suppression des appels externes à `fonts.googleapis.com` et `fonts.gstatic.com`; remplacement par des piles de polices système. | RGESN 4.8, 6.7, 2.10 | `index.html`, `css/style.css` |
| Carrousel des témoignages en pause au chargement : l'utilisateur choisit explicitement de lancer le défilement. | RGESN 4.1, 4.15 | `js/app.js` |
| Bulles de la section "Notre démarche" rendues survolables et masquables avec la touche `Escape`. | RGAA 4.1.2 - critère 10.13 | `css/style.css`, `js/app.js` |
| Remplacement des textes lorem ipsum des bulles par un contenu métier court, lié aux étapes de collaboration. | Qualité éditoriale, RGAA 9.1 | `index.html` |
| Remplacement de l'illustration de première section par `illustrationFormation.avif` et suppression de l'ancienne image hero inutilisée ainsi que du PNG source après conversion. | RGESN 5.1, 5.2, 6.5 | `index.html`, `assets/` |
| Ajout d'une section "Réseaux" en défilement manuel, sans autoplay, avec logos locaux convertis en AVIF et sources PNG/JPG supprimées. | RGESN 4.1, 5.1, 5.2, 6.5 ; RGAA navigation clavier | `index.html`, `css/style.css`, `js/app.js`, `assets/` |

## Tâches prioritaires

### P0 - À faire avant mise en ligne

| ID | Critère RGESN | Problème constaté | Correction claire | Fichiers concernés | Validation |
|---|---|---|---|---|---|
| ECO-01 | 5.7, 6.5 | Corrigé : le PDF RGESN n'est plus présent dans `assets` et n'est pas versionné dans le repository. | Maintenir cette règle : les PDF de travail et référentiels d'audit restent hors dossier public ou exclus du déploiement. | Repository, configuration de déploiement | Aucun fichier `.pdf` n'est présent dans `assets/` ni accessible depuis l'URL publique. |
| ECO-02 | 6.5, 5.8 | Corrigé pour les bitmaps : les PNG sources et AVIF non appelés par la page ont été supprimés. Les SVG sont conservés volontairement. | Maintenir cette règle : ne garder en production que les assets appelés par `index.html`, sauf SVG décoratifs explicitement conservés. | `assets/` | `Select-String index.html` ne référence que les images bitmap présentes dans le dossier public. |
| ECO-03 | 4.8, 6.7, 2.10 | Corrigé : les polices Google ne sont plus chargées. | Maintenir cette règle : ne pas réintroduire de police externe sans justification. Si une police de marque est nécessaire, l'auto-héberger et limiter les variantes. | `index.html`, `css/style.css`, éventuellement `assets/fonts/` | Plus aucun appel à `fonts.googleapis.com` ou `fonts.gstatic.com` dans l'onglet réseau. |
| ECO-04 | 6.1 | Aucun budget de poids/requêtes n'est défini. | Ajouter un budget mesurable : page initiale <= 250 Ko compressés hors cache, page complète <= 500 Ko, <= 20 requêtes au premier chargement, 0 ressource inutilisée volontaire. | Documentation projet | Lighthouse ou DevTools Network respecte le budget sur une navigation privée sans cache. |
| ECO-05 | 6.2, 6.3 | La stratégie cache/compression dépend de l'hébergement et n'est pas documentée. | Configurer en production : HTML avec cache court, assets versionnés avec cache long, Brotli ou Gzip pour HTML/CSS/JS/SVG. | Configuration hébergeur | Réponses HTTP avec `cache-control` cohérent et `content-encoding: br` ou `gzip`. |

### P1 - Fort impact, à faire ensuite

| ID | Critère RGESN | Problème constaté | Correction claire | Fichiers concernés | Validation |
|---|---|---|---|---|---|
| ECO-06 | 1.1, 1.2 | L'utilité, les cibles et les besoins sont visibles dans le contenu, mais pas documentés. | Créer une courte fiche : cibles, besoins principaux, fonctionnalités nécessaires, fonctionnalités volontairement absentes. | Nouveau fichier `declaration-ecoconception.md` ou section README | La fiche existe et justifie le périmètre du site. |
| ECO-07 | 1.3, 1.4, 1.5 | Aucun référent, aucune revue périodique, aucun objectif de réduction n'est formalisé. | Nommer un référent écoconception, fixer une revue trimestrielle, suivre poids page, nombre de requêtes, poids images, services tiers. | Documentation projet | Une date de prochaine revue et des indicateurs sont écrits. |
| ECO-08 | 2.1, 2.2, 2.3, 2.4 | La compatibilité bas débit, vieux terminaux et anciens navigateurs n'est pas prouvée. | Définir la cible minimale : mobile 360px, connexion 3G lente ou 512 Kbit/s, navigateurs majeurs sur 2 ans, ordinateur vieux de 10 ans. Tester ces cibles. | Documentation + QA | Tests notés avec résultats et captures si possible. |
| ECO-09 | 5.2, 6.4 | Les images AVIF sont légères, mais les cartes services chargent des images déclarées 480x320 pour un affichage autour de 148 px de haut. | Générer des variantes réellement adaptées aux usages : icône/carte autour de 240-320 px de large, portrait autour de 400 px, logo exact. Ajouter `srcset/sizes` si plusieurs tailles sont gardées. | `assets/`, `index.html` | Aucune image bitmap n'est significativement plus grande que son contexte d'affichage principal. |
| ECO-10 | 4.1, 4.15 | Corrigé : le carrousel d'avis est en pause par défaut. | Conserver le lancement explicite par l'utilisateur. Si l'autoplay est réintroduit, mémoriser le choix utilisateur et garder un délai long. | `js/app.js`, `index.html` | En première visite, aucun mouvement automatique. |
| ECO-11 | 4.7, 5.1 | Les grandes illustrations de cartes sont décoratives. Elles sont légères, mais le texte seul suffit à comprendre les services. | Garder les images seulement si elles renforcent vraiment la compréhension. Sinon remplacer par icônes SVG sobres ou proposer un mode sobre sans images de cartes. | `index.html`, `css/style.css`, `assets/` | Les images restantes ont une justification claire ou sont retirées du chargement initial. |
| ECO-12 | 7.3 | Le formulaire `mailto:` ne lance pas de traitement serveur, mais l'utilisateur n'a pas de retour si son client mail ne s'ouvre pas. | Ajouter un texte d'aide sobre après validation : "Si votre client e-mail ne s'ouvre pas, écrivez à ...". Ne pas ajouter de service tiers de formulaire sans besoin réel. | `index.html`, `js/app.js` | Soumission valide : message clair, pas de requête externe inutile. |

### P2 - À vérifier selon l'hébergement réel

| ID | Critère RGESN | Problème constaté | Correction claire | Validation |
|---|---|---|---|---|
| ECO-13 | 8.1 | L'hébergeur n'est pas connu dans le dépôt. | Choisir ou documenter un hébergeur avec démarche de réduction d'empreinte, indicateurs publiés et méthode vérifiable. | Nom de l'hébergeur et justificatifs dans la déclaration. |
| ECO-14 | 8.2 | Politique de gestion durable des équipements inconnue. | Demander ou documenter durée de vie, réemploi, réparation, gestion DEEE. | Lien ou justificatif hébergeur. |
| ECO-15 | 8.3, 8.4 | PUE et WUE inconnus. | Documenter PUE réel ou by design, WUE si disponible, méthode de calcul. | Valeurs présentes dans la déclaration. |
| ECO-16 | 8.5, 8.6 | Origine électrique et localisation inconnues. | Privilégier un hébergement proche des utilisateurs, dans un pays à électricité bas carbone, avec mix énergétique documenté. | Pays/ville et mix énergétique documentés. |
| ECO-17 | 8.9 | Duplication des données inconnue. | Éviter de dupliquer inutilement les fichiers statiques dans plusieurs stockages/CDN si le trafic ne le justifie pas. | Architecture de déploiement décrite simplement. |

## Déclaration d'écoconception à créer

Créer un fichier public ou semi-public, par exemple `declaration-ecoconception.md`, avec ces rubriques :

1. Objectif du site : présenter Pédago'Up et permettre la prise de contact.
2. Cibles : organismes de formation, établissements, PME, partenaires pédagogiques.
3. Fonctionnalités essentielles : présentation, services, témoignages, démarche, FAQ, contact.
4. Fonctionnalités volontairement absentes : tracking publicitaire, vidéo, audio, notifications, chatbot, animations lourdes, backend de formulaire.
5. Budget environnemental : poids maximum, nombre de requêtes, politique image, politique police.
6. Services tiers : polices, LinkedIn en lien externe, hébergeur.
7. Cache et compression : règles appliquées en production.
8. Compatibilité : terminaux, navigateurs, bas débit.
9. Maintenance : référent, fréquence de revue, date du dernier audit.

## Contrôles techniques à exécuter

Ces commandes et vérifications doivent être faites avant publication :

```powershell
Select-String -Path index.html -Pattern "googleapis|gstatic|\.png|\.pdf"
Get-ChildItem assets -File | Sort-Object Length -Descending
node --check js\app.js
```

Dans Chrome DevTools, onglet Network, navigation privée sans cache :

- vérifier le poids total transféré ;
- vérifier le nombre de requêtes ;
- vérifier que les images non visibles au premier écran sont chargées en différé ;
- vérifier les en-têtes `cache-control` ;
- vérifier `content-encoding: br` ou `gzip` pour HTML/CSS/JS ;
- simuler "Slow 3G" et contrôler que le contenu principal reste utilisable.

Dans Lighthouse ou équivalent :

- Performance ;
- Accessibility ;
- Best Practices ;
- SEO ;
- diagnostics "unused JavaScript/CSS", "properly size images", "efficient cache policy".

## Critères non applicables au site actuel

| Critères | Raison |
|---|---|
| 5.3, 5.4, 5.5 | Pas de vidéo. |
| 5.6 | Pas d'audio. |
| 6.6 | Aucun capteur terminal utilisé. |
| 7.1, 7.2 | Pas de backend applicatif ni base de données dans le site actuel. |
| 7.4 | Pas de blockchain ni mécanisme de consensus. |
| 8.8 | Pas de données chaudes/froides gérées par l'application. |
| 8.10 | Pas de calcul ou transfert asynchrone côté serveur connu. |
| 9.1 à 9.7 | Pas d'IA, pas d'entraînement, pas d'inférence. |

## Ordre d'exécution recommandé

1. Garder le PDF RGESN hors repository public et retirer du déploiement les assets non utilisés.
2. Remplacer Google Fonts par polices système ou polices auto-hébergées réduites.
3. Définir le budget de page et mesurer le site en conditions réelles.
4. Configurer cache HTTP et Brotli/Gzip chez l'hébergeur.
5. Adapter les tailles d'images ou ajouter `srcset/sizes`.
6. Créer la déclaration d'écoconception.
7. Tester bas débit, vieux navigateur, mobile, clavier et lecteur d'écran.
8. Documenter l'hébergement et les indicateurs environnementaux disponibles.

## Niveau de conformité estimé

Sans connaître l'hébergement et sans mesure réseau en production, il serait incorrect d'annoncer une conformité RGESN complète.

Estimation actuelle :

- Bon niveau sur sobriété fonctionnelle et simplicité technique.
- Bon niveau sur formats d'images utilisés par la page.
- Niveau incomplet sur documentation, objectifs, déclaration, hébergement, cache, compression et maîtrise des services tiers.
- Risque principal : confondre "site léger en local" avec "service écoconçu documenté et vérifiable".

Le site peut devenir très solide sur l'écoconception avec peu de changements techniques, à condition de traiter les tâches P0 et de documenter les choix.

## Note RGAA sur les bulles de la démarche

Les bulles de la section "Notre démarche" sont des contenus additionnels affichés au survol et à la prise de focus. Elles relèvent du RGAA 4.1.2, critère 10.13.

État après correction :

- affichage au survol et au focus clavier ;
- contenu additionnel survolable sans disparition immédiate ;
- fermeture possible avec `Escape` sans déplacer le focus ;
- réapparition possible au prochain survol ou à la prochaine prise de focus ;
- relation exposée avec `aria-describedby`.

Point à vérifier manuellement : au zoom 200 % et 400 %, contrôler que les bulles ne masquent pas une information indispensable ou que la fermeture avec `Escape` reste évidente au clavier.
