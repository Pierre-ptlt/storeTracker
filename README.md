# StoreTracker

Application React Native (Expo) : liste de magasins, fiche détaillée avec carte, favoris.

## Prérequis

- **Node.js 22.13 ou plus** (`node -v` pour vérifier)
- L'app **Expo Go** sur votre téléphone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

## Lancer l'app

```bash
git clone https://github.com/Pierre-ptlt/storeTracker.git
cd storeTracker
npm install
npx expo start
```

Un QR code s'affiche dans le terminal :

- **Sur téléphone** : scannez-le avec l'appareil photo (iPhone) ou depuis Expo Go (Android). Le téléphone doit être sur le même Wi-Fi que l'ordinateur.
- **Dans le navigateur** : appuyez sur `w`.
- **Sur émulateur** : appuyez sur `a` (Android) ou `i` (iOS).

Si le téléphone ne se connecte pas, lancez `npx expo start --tunnel`.

## Lancer les tests

```bash
npm test
```
