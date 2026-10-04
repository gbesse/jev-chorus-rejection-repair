# Importer des données

`importChorusExport` accepte un export local : `numeroFacture`, `montantTtcCentimes`, `statut`, `codeMotif`, `motif`. Il différencie Recyclée, Suspendue et Rejetée. Les codes sont une taxonomie de travail normalisée par votre importeur ; ce dépôt ne constitue pas un client authentifié Chorus ni une nomenclature officielle exhaustive. La checklist est une proposition, aucune facture n’est envoyée.

```sh
npm run demo:import
```

[Code complet de l’import](../examples/import.mjs). Ce parcours passe réellement du format source au rapport JSON/HTML. Les fichiers générés ne contiennent que des données synthétiques. Pour des documents réels confidentiels, écrire les rapports dans `reports/private/` (ignoré par Git), contrôler les droits de fichier et informer les personnes concernées avant un envoi externe.
