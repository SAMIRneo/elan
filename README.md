# Élan ⚡ — carnet sportif multi-sport

Version 3, reconstruite de zéro. Remplace « Suivi salle » (v1 dans `ilane`, v2 écrasée ici).

**Un seul principe : tout ce que tu bouges, quel que soit le sport, se suit dans une seule app.**

## Écrans

- ⚡ **Aujourd'hui** : streak 🔥 + 7 derniers jours (bouton **😴 Jour de repos** : le jour compte comme objectif atteint et garde la streak), **carte Objectifs** à gros chiffres (**objectif du jour = 1 séance**, statut hebdo en secondaire, objectif principal, bouton ✏️ vers Profil), 🎯 **défi du jour** (bouton **✓ Valider** manuel même pour les défis auto), humeur du jour (5 émojis), raccourcis de tes sports favoris **avec ton rang affiché**, gros bouton « ＋ Nouvelle activité », dernières activités
- 🏋️ **Muscu & Street workout** : la séance depuis Aujourd'hui liste **tous les exercices de la discipline** (kg / rép / séries par exo) et enregistre automatiquement chaque charge dans Progrès ; détection auto des records
- 🏃 **Tous les sports** (course, vélo, natation, padel, 🏐 volley, escalade, rando, foot, HIIT, maison, + sports custom) : séance avec durée, distance, exercices minutés (total auto) et note — **durée et distance enregistrées automatiquement pour tous les exercices du sport** dans Progrès
- ⭐ **Avis sur la séance** : à chaque enregistrement, note de 1 à 5 étoiles
- 🎯 **Défis** : défi du jour (10 défis généraux + défis quotidiens par sport, validable manuellement) + défi par sport (2 séances/semaine) → 💎
- 📈 **Progrès** : heatmap 16 semaines, minutes/semaine, répartition par sport, **⚖️ Mon poids** (pesée + courbe), **📈 Progression exercice** (sport → exo → mesure : poids, reps, temps, vitesse km/h, distance, séries ; toutes les mesures)
- 🍽️ **Nutrition** : calculateur Mifflin-St Jeor + 3 modes (🥘 assiettes-types, 🍽️ plats pesés en g ou en assiettes, ⌨️ direct) + eau 💧
- 🏋️ **Exos** : listes d'exercices **cohérentes et dédupliquées** par discipline (21 en muscu, dont curl biceps ; natation corrigée), échauffement/exercices/étirements cochables, **📊 Mesurer** sur chaque exo (kg, reps, séries, temps mm:ss, distance → vitesse km/h auto, note), exos personnalisés créables/modifiables/supprimables. Chaque mesure compte comme une séance (streak/badges)
- 🌙 **Cycle** (profils femme) : phase du jour + conseil, calendrier prévisionnel mensuel (‹ ›), humeur par jour, réglages + historique
- 👤 **Profil** : identité + IMC, objectifs globaux et par sport, résumé des **rangs** par sport, sports favoris + création, **thème & couleurs** (accents, 6 duos, couleurs libres), export/import JSON, multi-comptes
- 🏛️ **Panthéon** (nouvel onglet) : quête de l'Olympe — **50 badges par sport** (10 séances de 10 à 100, 10 régularité streak + hebdo, 10 charge de travail adaptée au sport, 20 insignes de rang), **5 rangs grecs** (Éphèbe · Guerrier · Héros · Demi-dieu · Olympien, +1 rang tous les 10 badges), **rang Olympe global** (13 dieux éveillés à chaque sport finalisé 50/50, thème Or au complet), liste des 💎 gagnés. Anciens badges réinitialisés une seule fois (migration `badgeV2`)

## Design

Dark-first : fond `#0a0a0c`, cartes `#16161a`, **lime électrique `#ccff00`** réservée aux actions/progression. Mode clair complet en miroir (toute couleur a ses 2 déclinaisons dans les tokens), avec thèmes/duos et couleurs personnalisables. **DA Olympe limitée au Panthéon, aux badges et aux rangs** : or `#f3c969`, marbre, laurier, éclairs, avec déclinaisons dark/light dans les tokens `--ol-*`. Navigation bas de page, cibles ≥ 44 px, gros chiffres, français tutoyé.

## Contraintes (à respecter pour toute modification)

1. Tout dans `index.html` — pas de fichiers CSS/JS séparés, zéro dépendance
2. Zéro backend, données en localStorage (`el-v1:<compte>`), comptes dans `sg-accounts`
3. Toute nouvelle couleur a sa déclinaison light **et** dark dans les blocs de tokens
4. **Incrémenter `CACHE` dans `sw.js` à chaque modification de contenu** (actuellement `elan-v26`) — la page est network-first (avec `cache:"no-store"` pour éviter les 304 qui masqueraient une nouvelle version) mais retombe sur le cache si la réponse n'est pas `ok` (sinon une 502 masque l'offline)
5. Cibles tactiles ≥ 44 px
6. L'onglet Cycle n'apparaît que si `profile.sexe === "femme"` (géré dans `renderAll` + handler `pOk`)

## Test local

```powershell
python -m http.server 8000
# → http://localhost:8000
```

Checklist : compte → onboarding 4 étapes (rythme par sport) → activité (muscu + sport durée, avis ⭐) → défi du jour + humeur → nutrition → exos → cycle femme (masqué pour les autres) → poids + charges dans Progrès → **Panthéon** (50 badges/sport, rangs, dieux) → Profil (rangs, thèmes/duos) → dark/light → reload (persistance) → offline (couper le serveur, recharger).
