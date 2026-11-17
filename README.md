# Élan ⚡ — carnet sportif multi-sport

Version 3, reconstruite de zéro. Remplace « Suivi salle » (v1 dans `ilane`, v2 écrasée ici).

**Un seul principe : tout ce que tu bouges, quel que soit le sport, se suit dans une seule app.**

## Écrans

- ⚡ **Aujourd'hui** : streak 🔥 + 7 derniers jours, objectif principal, 3 anneaux (séances · minutes · eau), barres hebdo par sport **+ barre des minutes du jour et résumé « Aujourd'hui »**, 🎯 **défi du jour** (rotation quotidienne, bouton « Fait ✓ » ou auto-détection), **humeur du jour** (5 émojis), raccourcis de tes sports favoris **avec ton niveau affiché**, gros bouton « ＋ Nouvelle activité », dernières activités
- 🏋️ **Muscu & Street workout** : exercices **pré-enregistrés** (machines/exos courants + tes historiques), séries kg/rép, détection auto des records
- 🏃 **Tous les sports** (course, vélo, natation, padel, 🏐 **volley**, escalade, rando, foot, HIIT, maison, + sports custom) : séance avec **durée, distance, exercices minutés (total auto)** et note
- ⭐ **Avis sur la séance** : à chaque enregistrement, note de 1 à 5 étoiles
- 🎯 **Défis** : défi du jour (10 défis généraux auto ou manuels + défis quotidiens spécifiques à tes sports favoris) + **défi par sport** (2 séances du même sport dans la semaine) → badges 💎
- 📶 **Niveau par sport** : Débutant → Intermédiaire → Confirmé → Expert, **auto selon tes séances, réglable à la main** (Profil)
- 📒 **Journal** : historique groupé par jour, résumé enrichi (exercices, ⭐, kcal)
- 📈 **Progrès** : heatmap 16 semaines, minutes/semaine, répartition par sport, **⚖️ Mon poids** (pesée + courbe), **💪 Charges à la salle** (courbe d'évolution par exercice), badges généraux + **badges par sport** (jalons, séries, streaks) + 💎 défis gagnés
- 🍽️ **Nutrition** : **calculateur de besoins** (Mifflin-St Jeor BMR/TDEE selon objectif & activité) + 3 modes de saisie — **🥘 Assiettes-types** (8 pré-faites + créables), **🍽️ Mes plats** (kcal/prot pour 100 g + poids d'assiette, ajout **en grammes ou en assiettes**), **⌨️ Direct** (kcal/prot/gluc/lip à la main) + suivi eau 💧
- 🏋️ **Exos** : échauffement, exercices guidés et étirements par sport favori (cochables par jour)
- 🌙 **Cycle** (réservé aux profils femme) : phase du jour + conseil sportif, **calendrier prévisionnel mensuel** (phases colorées par jour, ‹ › pour changer de mois), **humeur par jour** (touche un jour pour noter), réglages + historique
- 👤 **Profil** : identité + IMC (la pesée alimente aussi ta courbe de poids), objectifs globaux et par sport, **niveaux par sport (‹ ›)**, sports favoris + création, **thème & couleurs** (accents, 6 duos prédéfinis, fond primaire & accent libres), badges généraux + performance, **🏛️ Panthéon** (13 divinités débloquées en finalisant les badges d'un sport, thème Or débloqué au complet), export/import JSON, multi-comptes

## Design

Dark-first : fond `#0a0a0c`, cartes `#16161a`, **lime électrique `#ccff00`** réservée aux actions/progression. Mode clair complet en miroir (toute couleur a ses 2 déclinaisons dans les tokens), avec thèmes/duos et couleurs personnalisables. Navigation bas de page, cibles ≥ 44 px, gros chiffres, langage français (tutoiement).

## Contraintes (à respecter pour toute modification)

1. Tout dans `index.html` — pas de fichiers CSS/JS séparés, zéro dépendance
2. Zéro backend, données en localStorage (`el-v1:<compte>`), comptes dans `sg-accounts`
3. Toute nouvelle couleur a sa déclinaison light **et** dark dans les blocs de tokens
4. **Incrémenter `CACHE` dans `sw.js` à chaque modification de contenu** (actuellement `elan-v16`) — la page est network-first (avec `cache:"no-store"` pour éviter les 304 qui masqueraient une nouvelle version) mais retombe sur le cache si la réponse n'est pas `ok` (sinon une 502 masque l'offline)
5. Cibles tactiles ≥ 44 px
6. L'onglet Cycle n'apparaît que si `profile.sexe === "femme"` (géré dans `renderAll` + handler `pOk`)

## Test local

```powershell
python -m http.server 8000
# → http://localhost:8000
```

Checklist : compte → onboarding 4 étapes → activité (muscu + sport durée, avis ⭐ à la fin) → défi du jour + humeur → nutrition (calculateur / assiettes / plats pesés / direct) → exos → anneaux + barre du jour → cycle femme (calendrier prévisionnel + humeur/jour, masqué pour les autres) → poids + charges + badges par sport dans Progrès → niveaux ‹ › + thèmes/duos + Panthéon → dark/light → reload (persistance) → offline (couper le serveur, recharger).
