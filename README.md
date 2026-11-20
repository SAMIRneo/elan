# Élan ⚡ — muscu • cardio • streak

**🌐 En ligne** : https://samirneo.github.io/elan/ (GitHub Pages, dépôt `SAMIRneo/elan`, branche `master`, racine). Le fichier `elan.html` est une copie de `index.html` ; `index.html` reste la page servie par GitHub Pages.

Version 4 — **reconstruite de zéro**. La v3 multi-sport était trop éparpillée : on resserre tout autour de trois piliers — **musculation, cardio, streak** — en gardant ce qui servait vraiment (progression, poids/IMC, exos, défis, nutrition, cycle, Panthéon) et en supprimant les sports variés (padel, escalade, natation, volley…), remplacés par un **onglet Cardio complet** (course, vélo, corde, rameur, HIIT, marche).

> Les données de la v3 sont abandonnées automatiquement au premier lancement : l'app repart d'un onboarding vierge.

## Les 3 piliers

- 🔥 **Streak** — 1 séance (muscu ou cardio) valide le jour. Le bouton 😴 « Jour de repos » protège la série. Bandeau des 7 derniers jours, record personnel.
- 🏋️ **Musculation** — liste d'exercices avec **kg / répétitions / séries**, programmes guidés **Push / Pull / Legs / Full body** (fixes mais modifiables), séance libre, ajout d'exos à la volée, note et avis ⭐. Chaque charge est enregistrée automatiquement dans Progrès, avec détection des records.
- 🏃 **Cardio** — onglet complet : course, vélo, corde, rameur, HIIT/Tabata, marche rapide. Durée, distance (ou nombre de tours), note, avis, historique et records par mode.

## Écrans secondaires

- 📈 **Progrès** — heatmap 16 semaines, minutes sur 7 jours, répartition muscu/cardio, pesée + courbe de poids + IMC, exploration de toutes les mesures par sport → exo → mesure avec courbe.
- 📋 **Exercices** (plus dans le menu ☰ — accessible depuis **Muscu → Programmes → Catalogue d'exercices**) — catalogue coché (échauffement / exercices / étirements), bouton **📊 Mesurer** (kg, reps, séries, temps, distance, vitesse) qui enregistre la mesure **et** compte comme séance, exos personnalisés (CRUD).
- 🍽️ **Nutrition** — Mifflin-St Jeor (+ variantes sèche/prise), 3 modes de saisie (assiettes, plats pesés, direct), compteur d'eau.
- 🎯 **Défis** — **24 défis variés** (pompes, planche, HIIT, burpees, jumping jacks, marche rapide, nage en sec…), **tous réalisables sans équipement**, au poids du corps. Chaque défi a une **explication courte** affichée sur l’écran Défis et sur l’écran Jour (ex. « HIIT : 30 s d’effort intense puis 30 s de repos, à répéter »). Rotation déterministe par date sur un cycle complet de 24 jours (aucun défi répété avant 24 jours). Validation manuelle, **+1 💎 par défi** (une seule fois par défi, pas de ferme).
- 🛍️ **Boutique** (menu ☰) — cosmétiques achetés avec les gems, **aucun avantage sportif** : styles de flamme de streak, titres à côté du prénom, cadres de profil, bannières de profil (12 objets, 8–18 💎). Acheter équipe automatiquement ; chaque catégorie peut être retirée. **Vrais effets visuels** : flamme photo qui vacille avec étincelles montantes, cadres en anneaux SVG à reflets métalliques qui pulsent, titre gravé avec balayage lumineux, bannière animée (haze/dégradé mobile, pulsation néon), et bursts de particules 💎/✨/🌿/⚡ à la validation d'un défi, à l'achat et à l'enregistrement d'une séance. `prefers-reduced-motion` désactive les animations.
- 🌙 **Cycle** — uniquement pour les profils femme : phase du jour, conseil, calendrier mensuel, réglages.
- 🏛️ **Panthéon** — **20 badges dessinés en SVG par discipline** (or & laurier), répartis en 5 catégories de conditions : séances, streak, volume (kg soulevés / km cumulés), records/PR et régularité hebdo. Rangs : Éphèbe → Guerrier → Héros → **Demi-dieu quand un sport est validé en entier (20 badges)** → **Divinité quand les deux le sont (40 badges)**.
- 👤 **Profil** — identité, IMC, rythme hebdo, récap des rangs, export/import JSON, multi-comptes. Le thème clair/sombre et les couleurs se règlent depuis l’en-tête (☀️/🌙 et 🎨).

L'avatar par défaut est une **silhouette vectorielle** (plus d'emoji 👤). Les 12 cosmétiques sont illustrés par des **photos réalistes importées localement** dans `assets/` (sources Pexels, voir `assets/CREDITS.md`). La **bannière photo est affichée en haut de tous les écrans** (en haut de la page, elle défile avec le contenu — pas de sticky —, clic → Profil). Le cadre laurier est une **couronne de laurier dorée dessinée en SVG** autour du compte. **Rendu réaliste à l’équipement pour les 12 cosmétiques** : cadres or/électrique en anneaux SVG aux reflets métalliques (même traitement que la couronne de laurier), flammes issues des photos découpées en forme de flamme, titres sur plaques de métal gravé (or, glace, laurier) et bannières photo. Les effets restent animés (glow, vacillement, balayage) et respectent `prefers-reduced-motion`. La bannière Temple montre un **vrai temple grec au coucher de soleil**.

**Photo de profil** : dans Profil, **galerie persistante** — jusqu'à 8 photos importées uniquement (plus aucun avatar fourni ; import multiple, redimensionnement 256×256 via canvas, stockage localStorage, aucun envoi réseau). Chaque photo importée reste sélectionnable, avec suppression individuelle ou totale, plus retour à la silhouette.

**Couleurs — système simplifié** : **2 couleurs seulement** — le fond (`--bg`) et les boutons/actions (`--ac`). Tout le reste (cartes, bordures, textes, contours) est dérivé automatiquement, avec des détails dorés. Le bouton 🎨 de l’en-tête ouvre une modale avec **6 thèmes prédéfinis** (Rouge & or par défaut, Marbre & or, Nuit étoilée, Pourpre royal, Émeraude, Acier) et **2 sélecteurs libres** (fond, boutons). Les couleurs sont **enregistrées séparément pour le mode sombre et le mode clair** ; le bouton « Basculer » de la modale permet de régler l’autre mode sans quitter la modale. Anciens réglages (swatches, duos, contour) supprimés ; les anciennes données sont migrées automatiquement vers le nouveau format `settings.pal`.

**Surcharge** : dans la séance muscu, chaque exo ayant un historique affiche « Dernière fois : … » et un bouton **⚡ Surcharge** qui ouvre une saisie **manuelle** (kg / répétitions / séries) pré-remplie avec tes valeurs en cours — c'est toi qui indiques ce que tu as réellement fait.

Les animations CSS (flamme, cadres, titres, sweeps) restent appliquées par-dessus. Navigation basse sur 5 entrées (Jour / Muscu / ＋ / Cardio / Progrès) ; le menu ☰ donne accès aux écrans secondaires.

## Design

Dark-first : fond `#0a0a0c`, cartes `#16161a`, **lime électrique `#ccff00`** réservé aux actions et à la progression. Mode clair complet en miroir ; l'accent est automatiquement assombri en clair pour garder le contraste, et la couleur du texte d'action est choisie d'après la luminance WCAG. DA Olympe limitée au Panthéon, aux badges et aux rangs. Cibles tactiles ≥ 44 px, français tutoyé.

## Contraintes (à respecter pour toute modification)

1. Tout dans `index.html` — pas de fichiers CSS/JS séparés, zéro dépendance
2. Zéro backend, données en localStorage (`el-v1:<compte>`), comptes dans `sg-accounts`
3. Version de données `v:4` — toute structure plus ancienne déclenche une remise à zéro
4. Toute nouvelle couleur a sa déclinaison light **et** dark dans les tokens
5. **Incrémenter `CACHE` dans `sw.js` à chaque modification** (actuellement `elan-v54`) — la page est network-first avec `cache:"no-store"` pour éviter les 304 masquant une nouvelle version, mais retombe sur le cache si la réponse n'est pas ok
6. Cibles tactiles ≥ 44 px
7. L'onglet Cycle n'apparaît que si `profile.sexe === "femme"`

## Test local

```powershell
python -m http.server 8000
# → http://localhost:8000
```

Checklist : onboarding → séance muscu (kg/reps/séries + ⭐) → séance cardio (durée + distance) → streak + jour de repos → défi + humeur → mesure d'exo → poids → Progrès (heatmap, courbes) → Exos perso → Nutrition → Défis → Panthéon → Profil (thèmes, couleurs, export/import, comptes) → dark/light → reload (persistance) → offline (couper le serveur, recharger).

## Audit (5 reviewers, nov. 2026)

Audit croisé **code / sécurité / UI-accessibilité / QA fonctionnelle / perf-propreté**, puis corrections appliquées :

- **Records** : la détection comparait des champs inexistants → chaque mesure était un record. Désormais, une record n'est compté que s'il bat une mesure **antérieure** du même exo (la 1ʳᵉ mesure sert de référence).
- **Streak** : le jour en cours non validé ne fait plus tomber la série à 0.
- **Import / stockage** : schéma strict (`sanitizeData()`), limite 2 Mo, reconstruction d'un objet propre, whitelist des badges/cosmétiques, `safeGet/safeSet` avec `try/catch` → plus de XSS ni d'écran blanc sur fichier corrompu.
- **Migration v4** : ne supprime plus que les comptes réellement anciens.
- **Navigation** : le « ＋ » central ouvre bien « Nouvelle activité », le menu « Changer de compte » ouvre le sélecteur.
- **Cardio** : durée/distance/tours conservés lors d'un redessin ; champ tours enfin éditable en HIIT/corde.
- **Compte démo** : supprimé — plus de bouton démo, et tout ancien compte `demo` est nettoyé au démarrage.
- **Panthéon** : faute de frappe `olymppe` corrigée → la DA or/laurier s'applique de nouveau.
- **Contraste clair** : token `--ac-text` dédié au foreground (le fond lime reste inchangé), `--dim` renforcé, `--ol-shine` pour les rangs.
- **ARIA / tactile** : `role=dialog`, focus, `aria-live`, `aria-pressed`, `aria-current`, cibles ≥ 44 px, `:focus-visible`.
- **SW** : same-origin, pas de fallback HTML sur les assets, purge limitée aux caches `elan-`, installation tolérante, revalidation en arrière-plan.
- **Divers** : suppression des records fantômes, compteur d'eau quotidien, vocabulaire de mesures unifié, validation des bornes profil, manifest v4, OG tags, `.gitattributes`, suppression du code mort.
