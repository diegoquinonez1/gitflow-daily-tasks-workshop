# GitFlow Cheat Sheet — Daily Tasks App

Guía rápida de GitFlow para trabajo diario con **features**, **releases** y **hotfixes**, usando `main` (producción) y `develop` (integración).

---

## Tabla de contenido
- [0. Ramas base](#0-ramas-base)
- [1. Features (`feature/*`)](#1-features-feature)
- [2. Releases (`release/*`)](#2-releases-release)
- [3. Hotfixes (`hotfix/*`)](#3-hotfixes-hotfix)
- [4. CI (GitHub Actions)](#4-ci-github-actions)
- [5. Deploy (Render) — opcional](#5-deploy-render--opcional)

---

## 0. Ramas base

- `main` → **producción** (deploy a Render PROD)
- `develop` → **integración de desarrollo** (opcional deploy a Render STAGING)

### Crear `develop` desde `main` (solo una vez)
```bash
git checkout main
git pull origin main
git checkout -b develop
git push origin develop
```

---

## 1. Features (`feature/*`)

**Objetivo:** desarrollar una nueva funcionalidad sobre `develop` y devolverla a `develop` vía PR.

### 1.1 Actualizar `develop`
```bash
git checkout develop
git pull origin develop
```

### 1.2 Crear rama feature
```bash
git checkout -b feature/<nombre-feature>
```

**Ejemplo**
```bash
git checkout -b feature/delete-tasks
```

### 1.3 Subir rama feature
```bash
git push -u origin feature/<nombre-feature>
```

### 1.4 Trabajar en la feature
- Editar código (C#, Java, Python, Node, etc.)
- Ejecutar tests localmente:
```bash
npm test
```

### 1.5 Commit & push
```bash
git add .
git commit -m "feat: <descripción corta de la feature>"
git push
```

### 1.6 Pull Request (GitHub)
- **Base:** `develop`
- **Compare:** `feature/<nombre-feature>`
- Esperar CI en verde (GitHub Actions)
- Hacer merge a `develop`

### 1.7 Borrar rama feature
```bash
# Local
git branch -d feature/<nombre-feature>

# Remoto (si no se borró desde GitHub)
git push origin --delete feature/<nombre-feature>
```

---

## 2. Releases (`release/*`)

**Objetivo:** congelar el estado de `develop`, estabilizarlo y promoverlo a producción (`main`).

### 2.1 Crear rama release
```bash
git checkout develop
git pull origin develop
git checkout -b release/x.y.z
git push -u origin release/x.y.z
```

**Ejemplo**
```bash
git checkout -b release/1.0.0
git push -u origin release/1.0.0
```

### 2.2 Estabilizar la release
- Solo fixes pequeños: textos, estilos, bugs.
- Evitar nuevas features grandes.

### 2.3 Ajustes + tests + push
```bash
npm test
git add .
git commit -m "chore: ajustes menores para release x.y.z"
git push
```

### 2.4 PR de release a producción
**PR:** `release/x.y.z` → `main`

En GitHub:
- **Base:** `main`
- **Compare:** `release/x.y.z`
- Verificar CI verde
- Revisar cambios
- Merge a `main`

### 2.5 Crear tag de versión (en `main`)
```bash
git checkout main
git pull origin main
git tag vX.Y.Z
git push origin vX.Y.Z
```

**Ejemplo**
```bash
git tag v1.0.0
git push origin v1.0.0
```

### 2.6 Merge back a `develop`
**PR:** `release/x.y.z` → `develop`

En GitHub:
- **Base:** `develop`
- **Compare:** `release/x.y.z`
- Verificar CI verde
- Merge

### 2.7 Borrar rama release
```bash
git branch -d release/x.y.z
git push origin --delete release/x.y.z
```

---

## 3. Hotfixes (`hotfix/*`)

**Objetivo:** arreglar un bug crítico en producción (`main`) y propagar el fix a `develop`.

### 3.1 Crear rama hotfix desde `main`
```bash
git checkout main
git pull origin main
git checkout -b hotfix/<nombre-hotfix>
git push -u origin hotfix/<nombre-hotfix>
```

**Ejemplo**
```bash
git checkout -b hotfix/fix-task-creation
git push -u origin hotfix/fix-task-creation
```

### 3.2 Aplicar el fix
```bash
npm test
git add .
git commit -m "fix: <descripción breve del bug corregido>"
git push
```

### 3.3 PR a producción
**PR:** `hotfix/<nombre-hotfix>` → `main`

En GitHub:
- **Base:** `main`
- **Compare:** `hotfix/<nombre-hotfix>`
- CI verde → merge  
(Producción en Render se redeploya con el fix)

### 3.4 Propagar el fix a `develop`
**PR:** `hotfix/<nombre-hotfix>` → `develop`

En GitHub:
- **Base:** `develop`
- **Compare:** `hotfix/<nombre-hotfix>`
- CI verde → merge

### 3.5 Borrar rama hotfix
```bash
git branch -d hotfix/<nombre-hotfix>
git push origin --delete hotfix/<nombre-hotfix>
```

---

## 4. CI (GitHub Actions)

CI se lanza automáticamente en:
- `push` a: `main`, `develop`, `feature/*`, `release/*`, `hotfix/*`
- `pull_request` hacia: `main` y `develop`

No necesitas comandos especiales:
```bash
git push origin <rama>
```

El pipeline típicamente ejecuta:
```bash
npm install
npm test
```

---

## 5. Deploy (Render) — opcional

### Staging — desde `develop`
Static Site en Render:
- **Branch:** `develop`
- **Auto-Deploy:** ON  
→ Cada merge a `develop` despliega nueva versión de **staging**.

### Producción — desde `main`
Static Site en Render:
- **Branch:** `main`
- **Auto-Deploy:** ON  
→ Cada merge a `main` (normalmente desde `release/*` o `hotfix/*`) despliega nueva versión de **producción**.