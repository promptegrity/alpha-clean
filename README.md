# Alpha Clean

Extension Chrome (Manifest V3) pour nettoyer Google Search et YouTube :

- **Google** : masquer l’aperçu IA, l’onglet Mode IA et « Autres questions »
- **YouTube** : masquer les Shorts et les jeux intégrés (menu, rayons, cartes)

Les options s’appliquent immédiatement depuis le popup.

## Installation

1. Ouvrir `chrome://extensions`
2. Activer le **Mode développeur**
3. Cliquer **Charger l’extension non empaquetée**
4. Sélectionner le dossier `alpha-clean`

## Utilisation

Cliquez sur l’icône de l’extension pour activer/désactiver chaque filtre.

## Confidentialité

Voir [privacy.html](./privacy.html).  
Textes Chrome Web Store : [STORE.md](./STORE.md).

## Structure

```
manifest.json
content/google.css|js
content/youtube.css|js
popup/
icons/
privacy.html
STORE.md
```

## Notes

Google et YouTube changent souvent leur DOM. Si un élément réapparaît, les sélecteurs dans `content/` peuvent nécessiter une mise à jour.
