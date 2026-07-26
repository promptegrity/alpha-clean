# Alpha Clean

Extension Chrome (Manifest V3) pour nettoyer Google Search et YouTube :

- **Google** : masquer l’aperçu IA, l’onglet Mode IA et « Autres questions »
- **YouTube** : masquer les Shorts (menu, rayons, cartes)

Les toggles s’appliquent immédiatement (sans F5). Sur YouTube, réactiver les Shorts recharge l’onglet (les nœuds ont été retirés du DOM).

## Installation

1. Ouvrir `chrome://extensions`
2. Activer le **Mode développeur**
3. Cliquer **Charger l’extension non empaquetée**
4. Sélectionner le dossier `alpha-clean`

## Utilisation

Cliquez sur l’icône de l’extension pour activer/désactiver chaque filtre.

## Publication

Voir [STORE.md](./STORE.md) (checklist Chrome Web Store) et [privacy.html](./privacy.html) (à héberger pour l’URL de confidentialité).

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

Google et YouTube changent souvent leur DOM. Si un élément réapparaît, mettez à jour les sélecteurs dans `content/`.
