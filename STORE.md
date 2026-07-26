# Publication Chrome Web Store — Alpha Clean

Checklist avant soumission (version actuelle du `manifest.json`).

## 1. Préparer le package

1. Tester en local : `chrome://extensions` → Mode développeur → Charger non empaqueté.
2. Vérifier Google (aperçu IA, Mode IA, Autres questions) et YouTube (rayon Shorts + entrée menu).
3. Tester les toggles du popup **sans F5** (Google immédiat ; Shorts : masquage immédiat, réaffichage = reload auto de l’onglet).
4. Zipper le dossier **sans** fichiers inutiles (pas de `.git` si possible) :

```bash
cd /path/to/alpha-clean
zip -r alpha-clean.zip manifest.json content popup icons privacy.html README.md -x "*.DS_Store"
```

## 2. Fiche store (à remplir sur le dashboard)

| Champ | Suggestion |
|--------|------------|
| Nom | Alpha Clean |
| Description courte (132 car. max) | Masque l’aperçu IA et le Mode IA sur Google, les « Autres questions », et les Shorts sur YouTube. |
| Description détaillée | Voir section ci-dessous |
| Catégorie | Productivité / Fonctionnalité |
| Langue | Français (+ Anglais si tu traduis) |
| URL politique de confidentialité | URL publique de `privacy.html` (GitHub Pages, etc.) |

### Description détaillée (brouillon)

```
Alpha Clean nettoie discrètement Google Search et YouTube.

Google
• Masque l’aperçu IA (AI Overview)
• Masque l’onglet Mode IA
• Masque le bloc « Autres questions » / People Also Ask

YouTube
• Masque les rayons Shorts sur l’accueil et le feed
• Masque l’entrée Shorts du menu latéral

Les options se règlent depuis le popup. Aucune donnée n’est envoyée à un serveur :
seules vos préférences sont stockées localement (chrome.storage.sync).

Note : Google et YouTube changent parfois leur interface. Si un élément
réapparaît, mettez à jour l’extension.
```

## 3. Visuels obligatoires

| Asset | Taille | Notes |
|--------|--------|--------|
| Icône store | 128×128 | Déjà dans `icons/icon128.png` |
| Capture 1 | **1280×800** ou 640×400 | Google Search avec aperçu IA masqué |
| Capture 2 | idem | Popup de l’extension |
| Capture 3 (reco.) | idem | YouTube sans rayon Shorts |

Optionnel : petite promo 440×280, grande promo 920×680, marquee 1400×560.

## 4. Déclaration de confidentialité (questionnaire store)

Réponses typiques pour Alpha Clean :

- **Collecte des données utilisateur ?** Non (ou : uniquement préférences stockées localement / sync Chrome, pas transmises à l’éditeur).
- **Transmission à des serveurs ?** Non.
- **Utilisation hors finalité unique ?** Non.
- **Politique de confidentialité** : URL de `privacy.html` hébergée.

Finalité unique : « Améliorer l’expérience de navigation en masquant des éléments d’UI sur Google et YouTube. »

## 5. Après publication

- Surveiller les avis si Google/YouTube casse les sélecteurs → bump de version + hotfix.
- Incrémenter `version` dans `manifest.json` à chaque upload.
