# 📱 Scanner de Prix OCR - Application React Native

Une application mobile moderne pour scanner et gérer les prix des produits avec reconnaissance de texte hors ligne (OCR) et cache persistant.

## ✨ Fonctionnalités

### 🔍 **OCR Hors Ligne**
- Reconnaissance de texte avec **Tesseract** 
- Fonctionne **sans connexion internet**
- Support multilingue (Français, Anglais)
- Qualité de reconnaissance avec indicateur de confiance

### 💾 **Cache Persistant**
- Sauvegarde automatique avec **AsyncStorage**
- Récupération des données au redémarrage
- Historique des scans (limité à 100 éléments)
- Gestion intelligente du stockage

### 🛒 **Gestion Intelligente des Achats**
- **Listes multiples** d'achats
- **Calcul automatique** des totaux
- **Contrôles +/-** pour les quantités
- **Édition en temps réel** des prix et noms
- **Statistiques détaillées** par liste

### 🎨 **Interface Moderne**
- Design inspiré de **Tailwind CSS**
- Icônes **FontAwesome** intégrées
- Animations fluides et transitions
- Interface intuitive et responsive

## 🚀 Installation

### Prérequis
- Node.js (v16+)
- React Native CLI
- Android Studio / Xcode
- JDK 11+

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd PriceScannerOCR
```

2. **Installer les dépendances**
```bash
npm install
# ou
yarn install
```

3. **Installation des dépendances natives**

**Android :**
```bash
cd android
./gradlew clean
cd ..
```

**iOS :**
```bash
cd ios
pod install
cd ..
```

4. **Lancer l'application**

**Android :**
```bash
npm run android
# ou
npx react-native run-android
```

**iOS :**
```bash
npm run ios
# ou
npx react-native run-ios
```

## 📱 Utilisation

### 1. **Scanner un Prix**
- Appuyez sur "Scanner un prix" depuis l'écran principal
- Pointez la caméra vers l'étiquette de prix
- L'application reconnaît automatiquement le texte
- Modifiez le titre, prix et quantité si nécessaire
- Ajoutez à une liste d'achats

### 2. **Gérer les Listes**
- Créez plusieurs listes d'achats
- Ajoutez des articles scannés
- Modifiez les quantités avec les boutons +/-
- Éditez les détails des articles
- Suivez les totaux en temps réel

### 3. **Fonctionnalités Avancées**
- **Duplication** de listes existantes
- **Recherche** dans les articles
- **Export CSV** des listes
- **Statistiques** détaillées
- **Historique** des scans

## 🏗️ Architecture

### Structure des Dossiers
```
src/
├── components/          # Composants réutilisables
│   ├── CameraScanner.tsx      # Scanner de caméra
│   └── OCRResultDisplay.tsx   # Affichage des résultats
├── screens/            # Écrans de l'application
│   ├── HomeScreen.tsx         # Écran principal
│   ├── ScannerScreen.tsx      # Écran du scanner
│   └── ShoppingListScreen.tsx # Écran de liste
├── services/           # Services métier
│   ├── OCRService.ts          # Service OCR Tesseract
│   ├── StorageService.ts      # Gestion du stockage
│   └── ShoppingListService.ts # Gestion des listes
├── types/              # Types TypeScript
│   └── index.ts               # Interfaces et types
├── utils/              # Utilitaires
│   └── styles.ts              # Styles inspirés de Tailwind
└── App.tsx             # Composant principal
```

### Technologies Utilisées

- **React Native 0.72.6** - Framework mobile
- **TypeScript** - Typage statique
- **Tesseract OCR** - Reconnaissance de texte
- **AsyncStorage** - Stockage persistant
- **React Navigation** - Navigation entre écrans
- **FontAwesome** - Icônes vectorielles
- **Vision Camera** - Accès à la caméra

## 🔧 Configuration

### Permissions Requises

**Android (`android/app/src/main/AndroidManifest.xml`) :**
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

**iOS (`ios/Info.plist`) :**
```xml
<key>NSCameraUsageDescription</key>
<string>Cette application a besoin d'accéder à la caméra pour scanner les prix</string>
```

### Configuration Tesseract

L'application utilise Tesseract OCR avec :
- Langues : Français, Anglais
- Configuration optimisée pour la reconnaissance de prix
- Extraction automatique des prix et noms de produits

## 📊 Fonctionnalités OCR

### Reconnaissance Intelligente
- **Détection automatique** des prix
- **Extraction des noms** de produits
- **Indicateur de confiance** pour chaque scan
- **Correction manuelle** si nécessaire

### Optimisations
- Prétraitement des images
- Filtrage des caractères pertinents
- Validation des prix détectés
- Gestion des erreurs de reconnaissance

## 💾 Gestion des Données

### Stockage Local
- **AsyncStorage** pour la persistance
- **Chiffrement** des données sensibles
- **Sauvegarde automatique** après chaque modification
- **Récupération** en cas de crash

### Structure des Données
```typescript
interface PriceItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  timestamp: number;
  imageUri?: string;
  ocrText?: string;
}

interface ShoppingList {
  id: string;
  name: string;
  items: PriceItem[];
  total: number;
  createdAt: number;
  updatedAt: number;
}
```

## 🎨 Design System

### Couleurs
- **Primary** : Bleu (#3B82F6)
- **Success** : Vert (#22C55E)
- **Warning** : Orange (#F59E0B)
- **Danger** : Rouge (#EF4444)
- **Gray** : Échelle de gris (#F9FAFB à #111827)

### Typographie
- **Font Sizes** : xs (12px) à 5xl (48px)
- **Font Weights** : normal (400) à extrabold (800)
- **Line Heights** : Optimisées pour la lisibilité

### Composants
- **Cards** avec ombres et bordures arrondies
- **Buttons** avec états hover et disabled
- **Inputs** avec validation et feedback
- **Modals** avec animations fluides

## 🚀 Déploiement

### Build de Production

**Android :**
```bash
cd android
./gradlew assembleRelease
```

**iOS :**
```bash
cd ios
xcodebuild -workspace PriceScannerOCR.xcworkspace -scheme PriceScannerOCR -configuration Release
```

### Configuration de Production
- Désactivation des logs de debug
- Optimisation des performances
- Gestion des erreurs en production
- Monitoring des crashs

## 🔒 Sécurité

### Bonnes Pratiques
- **Validation** des entrées utilisateur
- **Sanitisation** des données OCR
- **Gestion sécurisée** des permissions
- **Chiffrement** des données sensibles

### Permissions
- Demande explicite des permissions caméra
- Gestion gracieuse des refus
- Explication claire de l'usage

## 📈 Performance

### Optimisations
- **Lazy loading** des composants
- **Memoization** des calculs coûteux
- **Debouncing** des actions utilisateur
- **Gestion efficace** de la mémoire

### Monitoring
- Métriques de performance
- Temps de réponse OCR
- Utilisation mémoire
- Temps de chargement

## 🧪 Tests

### Tests Unitaires
```bash
npm test
```

### Tests d'Intégration
- Tests des services OCR
- Tests de persistance des données
- Tests de navigation

### Tests E2E
- Workflows complets de scan
- Gestion des listes d'achats
- Validation des calculs

## 🤝 Contribution

### Guidelines
1. Fork le projet
2. Créez une branche feature
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

### Standards de Code
- **TypeScript** strict
- **ESLint** pour la qualité
- **Prettier** pour le formatage
- **Tests** pour les nouvelles fonctionnalités

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

### Documentation
- [Documentation React Native](https://reactnative.dev/)
- [Documentation Tesseract](https://tesseract.projectnaptha.com/)
- [Documentation AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

### Issues
- Utilisez les Issues GitHub pour signaler des bugs
- Fournissez des informations détaillées
- Incluez des captures d'écran si possible

### Contact
- **Email** : support@example.com
- **Discord** : [Serveur communautaire]
- **GitHub** : [Issues et Discussions]

---

**Développé avec ❤️ pour simplifier vos courses quotidiennes !**