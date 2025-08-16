# hidoc

Monorepo PNPM pour application mobile, backend API et portail web.

Super 🚀 ! On va mettre en place un **setup complet** pour les autres packages (`web`, `mobile`, `shared`) afin que tu puisses les lancer avec PNPM aussi facilement que ton `api`.

---

# 🌐 `packages/web` → Next.js (Portail Web)

---

## 1. Générer le projet

```bash
cd packages
pnpm dlx create-next-app@latest web --typescript --eslint --app --src-dir --import-alias "@/*"
```

⚠️ Installe-le dans `packages/web`.

---

## 2. Scripts `package.json`

Dans `packages/web/package.json` :

```json
{
  "name": "web",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "typescript": "^5.4.5",
    "eslint": "^9.7.0"
  }
}
```

---

## 3. Lancer en dev

```bash
cd packages/web
pnpm install
pnpm dev
```

👉 L’appli Next.js sera dispo sur **[http://localhost:3000](http://localhost:3000)**

---

# 📱 `packages/mobile` → React Native / Expo

---

## 1. Générer le projet Expo

```bash
cd packages
pnpm dlx create-expo-app mobile
```

---

## 2. Scripts `package.json`

Dans `packages/mobile/package.json` :

```json
{
  "name": "mobile",
  "private": true,
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "^51.0.0",
    "react": "18.3.1",
    "react-native": "0.73.6"
  },
  "devDependencies": {
    "typescript": "^5.4.5"
  }
}
```

---

## 3. Lancer en dev

```bash
cd packages/mobile
pnpm install
pnpm start
```

👉 Expo te donnera un QR code pour lancer l’app sur ton téléphone ou un émulateur.

---

# 📦 `packages/shared` → Code TypeScript partagé

---

## 1. Créer un package TS

```bash
cd packages/shared
pnpm init -y
```

---

## 2. `package.json`

Dans `packages/shared/package.json` :

```json
{
  "name": "shared",
  "version": "0.1.0",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "lint": "eslint . --ext .ts",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.4.5",
    "eslint": "^9.7.0",
    "prettier": "^3.3.3"
  }
}
```

---

## 3. Ajouter un `tsconfig.json`

`packages/shared/tsconfig.json` :

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "declaration": true
  },
  "include": ["src"]
}
```

---

## 4. Exemple de code partagé

`packages/shared/src/index.ts` :

```ts
export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};
```

---

# 🔗 Intégration dans le monorepo

Grâce au `pnpm-workspace.yaml` :

```yaml
packages:
  - "packages/*"
```

Chaque package est reconnu par PNPM. Tu peux exécuter :

* **API** :

  ```bash
  pnpm --filter api start:dev
  ```

* **Web** :

  ```bash
  pnpm --filter web dev
  ```

* **Mobile** :

  ```bash
  pnpm --filter mobile start
  ```

* **Shared** (build du code partagé) :

  ```bash
  pnpm --filter shared build
  ```

---

# 🚀 Commandes globales depuis la racine

* Lancer **uniquement l’API** :

  ```bash
  pnpm dev
  ```

* Lancer **le portail web** :

  ```bash
  pnpm --filter web dev
  ```

* Lancer **le mobile (Expo)** :

  ```bash
  pnpm --filter mobile start
  ```

* Builder **tous les packages** :

  ```bash
  pnpm build
  ```

---

✅ Résultat : tu as maintenant **API (NestJS) + Web (Next.js) + Mobile (Expo) + Shared (lib TS)** dans un monorepo PNPM fonctionnel.

---

Veux-tu que je prépare aussi un **script Turbo (turbo.json)** corrigé pour pouvoir lancer **tous tes dev servers (`api`, `web`, `mobile`) en parallèle** avec une seule commande (`pnpm dev:all`) ?

