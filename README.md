# GitFlow Workshop Template — Daily Tasks App

Guía completa para un taller práctico de desarrolladores sobre **GitFlow** usando:

- Git y GitHub
- Flujo de ramas GitFlow: `main`, `develop`, `feature/*`, `release/*`, `hotfix/*`
- HTML, CSS y JavaScript (sin frameworks)
- Jest + JSDOM para pruebas
- GitHub Actions para CI
- Render (u otra PaaS similar) para despliegue estático gratuito (opcional)

El objetivo es practicar **GitFlow end‑to‑end** con una mini aplicación de **tareas del día**: desde un commit en una rama `feature/*` hasta el despliegue de una `release/*` en producción, pasando por CI y revisiones en GitHub.

---

## Tabla de contenido
- [1. Objetivo del taller](#1-objetivo-del-taller)
- [2. Descripción de la mini app: Daily Tasks](#2-descripción-de-la-mini-app-daily-tasks)
- [3. Estrategia GitFlow (cómo usamos las ramas)](#3-estrategia-gitflow-cómo-usamos-las-ramas)
- [4. Arquitectura y diseño de la app](#4-arquitectura-y-diseño-de-la-app)
- [5. Flujo de ramas GitFlow (diagramas)](#5-flujo-de-ramas-gitflow-diagramas)
- [6. Tests (Jest + JSDOM)](#6-tests-jest--jsdom)
- [7. CI con GitHub Actions](#7-ci-con-github-actions)
- [8. Despliegue (Render) — opcional](#8-despliegue-render--opcional)
- [9. Cómo trabajar con este repo (paso a paso) usando GitFlow](#9-cómo-trabajar-con-este-repo-paso-a-paso-usando-gitflow)
- [10. Checklist GitFlow + DevOps](#10-checklist-gitflow--devops)

---

## 1. Objetivo del taller

Al finalizar el taller, deberías ser capaz de:

- Entender y aplicar el flujo de ramas **GitFlow**:
  - `main`, `develop`, `feature/*`, `release/*`, `hotfix/*`
- Trabajar con:
  - Integración en `develop` como rama de desarrollo
  - Releases estabilizadas antes de ir a producción (`release/*`)
  - Hotfixes rápidos desde `main` hacia producción (`hotfix/*`)
- Usar GitHub:
  - Pull requests, branch protection, tags/releases
  - GitHub Actions para CI
- Conectar GitFlow con el ciclo DevOps:
  - **CODE → CI → RELEASE → DEPLOY**

---

## 2. Descripción de la mini app: Daily Tasks

Este repo contiene una mini aplicación web de **tareas del día**.

### 2.1 Lista básica de tareas (MVP)
- Ver una lista de tareas.
- Agregar una nueva tarea escribiendo texto y haciendo click en un botón.
- Marcar una tarea como completada.
- (Inicialmente) las tareas viven en memoria (se pierden al recargar).

### 2.2 Ideas de mejoras (para practicar GitFlow)
Estas se pueden implementar en ramas `feature/*`:
- Validación de tareas vacías (mensaje de error en la UI).
- Eliminar tareas.
- Mostrar contador de tareas pendientes.
- Persistir tareas en `localStorage`.
- Filtros: todas / pendientes / completadas.

### 2.3 Estructura de archivos (simplificada)
```text
index.html                # UI (HTML) - lista de tareas
styles.css                # Estilos (CSS)
app.js                    # Lógica de la app (JS)
tests/app.test.js         # Tests unitarios + DOM con Jest + JSDOM
jest.config.cjs           # Configuración de Jest
package.json              # Dependencias (Jest, jest-environment-jsdom, etc.)
.github/workflows/ci.yml  # Pipeline CI (GitHub Actions)
```

---

## 3. Estrategia GitFlow (cómo usamos las ramas)

### 3.1 Ramas principales

#### `main` (producción)
- Representa el estado en producción.
- Contiene versiones etiquetadas (tags) como `v1.0.0`, `v1.1.0`, etc.
- Solo recibe cambios desde:
  - `release/*` (nuevas versiones)
  - `hotfix/*` (correcciones urgentes)

#### `develop` (integración)
- Rama de integración de desarrollo.
- Contiene el código preparado para la próxima release.
- Recibe cambios desde:
  - `feature/*`
  - `release/*` (merge de vuelta a `develop`)
  - `hotfix/*` (merge de vuelta a `develop`)

### 3.2 Ramas de soporte

#### `feature/*` (nuevas funcionalidades)
- Se crean desde `develop`.
- Representan nuevas funcionalidades o mejoras.
- Ejemplos:
  - `feature/validate-empty-task`
  - `feature/delete-tasks`
  - `feature/pending-tasks-counter`
  - `feature/localstorage-persistence`
- Al finalizar:
  - PR → `develop` (CI + review)
  - Se borran

#### `release/*` (estabilización de versión)
- Se crean desde `develop` cuando se decide preparar una versión estable.
- Ejemplo: `release/1.0.0`
- En esta rama:
  - Ajustes finales, documentación, pequeños bugs
  - Se congela la incorporación de nuevas features grandes
- Al finalizar:
  - PR → `main` (producción + tag)
  - PR → `develop` (merge back para no perder ajustes)
  - Se borra la rama

#### `hotfix/*` (incidentes en producción)
- Se crean desde `main` para corregir problemas críticos.
- Ejemplo: `hotfix/fix-task-creation-bug`
- Al finalizar:
  - PR → `main` (deploy rápido)
  - PR → `develop` (merge back)
  - Se borra la rama

---

## 4. Arquitectura y diseño de la app

La aplicación es 100% estática (no hay backend).

### 4.1 Vista lógica de la app
![Vista lógica](assets/Vista%20lógica%20de%20la%20app.png)

### 4.2 Diagrama de componentes
![Diagrama de componentes](assets/Diagrama%20de%20componentes.png)

---

## 5. Flujo de ramas GitFlow (diagramas)

### 5.1 Diagrama de ramas principales y de soporte
![Diagrama de ramas principales y de soporte](assets/Diagrama%20de%20ramas%20principales%20y%20de%20soporte.png)

### 5.2 Flujo típico de una nueva funcionalidad (`feature/*`)
![Flujo típico feature](assets/Flujo%20típico%20de%20una%20nueva%20funcionalidad.png)

### 5.3 Flujo de una release (`release/*`)
![Flujo release](assets/Flujo%20de%20una%20release.png)

### 5.4 Flujo de un hotfix (`hotfix/*`)
![Flujo hotfix](assets/Flujo%20de%20un%20hotfix.png)

---

## 6. Tests (Jest + JSDOM)

El proyecto incluye pruebas:

### 6.1 Unitarias de lógica (sin DOM)
- `addTask(text)`: agrega una nueva tarea válida.
- `toggleTask(id)`: alterna el estado `completed` de la tarea con el `id` dado.

### 6.2 Pruebas con DOM usando JSDOM
- `setupTaskApp()`: agrega una tarea cuando se hace click en **"Agregar"**.
- Se valida que:
  - se marca una tarea como completada al hacer click en el checkbox

### 6.3 Arquitectura de tests
```text
tests/
  app.test.js          # Tests de lógica + DOM
jest.config.cjs        # Usa testEnvironment = 'jsdom'
```

### 6.4 Ejecutar los tests en local
```bash
npm install
npm test
```

---

## 7. CI con GitHub Actions

El workflow `.github/workflows/ci.yml` ejecuta:
- `npm install`
- `npm test`

### Recomendación: protección de ramas (GitHub → Settings → Branches)

**Para `main`:**
- Requerir PR
- Requerir que el workflow de CI pase

**Para `develop`:**
- Requerir PR
- Requerir que el workflow de CI pase

---

## 8. Despliegue (Render) — opcional

Esta mini app es puramente estática (HTML, CSS, JS), así que se puede desplegar como **Static Site**.

Demo (si aplica):
- https://gitflow-daily-tasks-workshop.onrender.com/

### 8.1 Diagrama de despliegue
![Diagrama de despliegue](assets/Diagrama%20de%20despliegue.png)

### 8.2 Crear Static Site en Render (producción desde `main`)
1. Crear cuenta en Render (plan gratuito).
2. Conectar cuenta de GitHub.
3. En el panel de Render: **New + → Static Site**.
4. Seleccionar este repositorio.
5. Configurar:
   - **Name:** `gitflow-daily-tasks-prod` (por ejemplo)
   - **Branch:** `main`
   - **Build Command:**
     - `npm test` (para bloquear deploy si las pruebas fallan), o
     - vacío si solo quieres servir los archivos
   - **Publish Directory:** `.`
6. Crear el Static Site.
7. Render generará una URL pública tipo:
   - `https://gitflow-daily-tasks-prod.onrender.com`

### 8.3 (Opcional) Deploy a Staging desde `develop`
Repetir el proceso creando otro Static Site:
- **Name:** `gitflow-daily-tasks-staging`
- **Branch:** `develop`

Así cada merge a `develop` se refleja en staging.

---

## 9. Cómo trabajar con este repo (paso a paso) usando GitFlow

### 9.1 Setup inicial de ramas (solo una vez)
```bash
git checkout main
git pull origin main

git checkout -b develop
git push -u origin develop
```

Luego, configurar protección de ramas `main` y `develop` en GitHub.

---

### 9.2 Nueva funcionalidad (`feature/*`) — ejemplo `feature/delete-tasks`
```bash
git checkout develop
git pull origin develop
git checkout -b feature/delete-tasks

# implementar cambios...
npm test

git add .
git commit -m "feat: delete tasks"
git push -u origin feature/delete-tasks
```

En GitHub:
- Crear PR: `feature/delete-tasks` → `develop`
- CI en verde → merge
- Borrar rama feature

---

### 9.3 Preparar una release (`release/*`) — ejemplo `release/1.0.0`
```bash
git checkout develop
git pull origin develop
git checkout -b release/1.0.0
git push -u origin release/1.0.0

# ajustes menores...
npm test

git add .
git commit -m "chore: prepare release 1.0.0"
git push
```

En GitHub:
1) PR: `release/1.0.0` → `main` (release a producción)  
2) CI en verde → merge

Crear tag en `main`:
```bash
git checkout main
git pull origin main
git tag v1.0.0
git push origin v1.0.0
```

Merge back:
- PR: `release/1.0.0` → `develop`
- CI en verde → merge
- Borrar rama release

---

### 9.4 Hotfix en producción (`hotfix/*`) — ejemplo `hotfix/fix-task-creation-bug`
```bash
git checkout main
git pull origin main
git checkout -b hotfix/fix-task-creation-bug
git push -u origin hotfix/fix-task-creation-bug

# fix...
npm test

git add .
git commit -m "fix: task creation bug"
git push
```

En GitHub:
1) PR: `hotfix/fix-task-creation-bug` → `main`  
   - CI en verde → merge (producción se redeploya)
2) PR: `hotfix/fix-task-creation-bug` → `develop`  
   - CI en verde → merge
3) Borrar rama hotfix

---

## 10. Checklist GitFlow + DevOps

- [ ] ¿`main` refleja siempre el estado en producción de la app?
- [ ] ¿`develop` contiene el trabajo integrado para la próxima release?
- [ ] ¿Creo ramas `feature/*` desde `develop` y las borro tras el merge?
- [ ] ¿Uso `release/*` para estabilizar antes de ir a `main`?
- [ ] ¿Uso `hotfix/*` solo para incidentes reales en producción?
- [ ] ¿Ningún merge a `develop` o `main` se hace sin pasar por CI?
- [ ] ¿Staging (opcional) se despliega desde `develop` y producción desde `main`?

Si la mayoría de respuestas son “sí”, estás usando GitFlow de forma coherente con un flujo DevOps moderno para la app de tareas diarias.