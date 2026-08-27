# Runbook para Claude Code — Vorlagen-Zentrale privada con Cloudflare

> **Cómo usar este archivo:** en cualquier sesión de Claude Code (local o web),
> di: *«Lee docs/claude-cloudflare-runbook.md y continúa desde el primer paso
> incompleto».* El runbook es idempotente: cada paso dice cómo comprobar si ya
> está hecho.

## Contexto del proyecto

- **Qué es:** N's Hotel · Vorlagen-Zentrale — sitio 100 % estático (HTML, CSS,
  módulos ES nativos), **sin build y sin backend**. La raíz del repo ES el
  sitio (`index.html`, `js/`, `assets/`, `sw.js`, `manifest.webmanifest`).
- **Repo:** `elpollo619/N-s-Hotel-template-system` (público). Hoy publicado en
  GitHub Pages: <https://elpollo619.github.io/N-s-Hotel-template-system/>.
- **Objetivo:** servir el sitio en **Cloudflare Pages** y protegerlo con
  **Cloudflare Access** (login por correo con código de un solo uso, plan
  Zero Trust **Free**, hasta 50 usuarios). Guía manual equivalente para
  humanos: `docs/privat-zugang.md`.
- **El usuario (Cris) ya tiene cuenta de Cloudflare.** Habla español; responde
  en español.

## Autenticación (comprobar antes de nada)

Por orden de preferencia:

1. **MCP `cloudflare-api` autorizado** (plugin oficial). Si el plugin no está:
   `claude plugin marketplace add cloudflare/skills` y
   `claude plugin install cloudflare@cloudflare`, luego `/reload-plugins`.
   En sesión interactiva, `/mcp` → `cloudflare-api` → OAuth en el navegador.
2. **Variable de entorno `CLOUDFLARE_API_TOKEN`** (y opcionalmente
   `CLOUDFLARE_ACCOUNT_ID`): wrangler la usa directamente. Permisos mínimos
   del token: *Account → Cloudflare Pages → Edit* y *Account → Access: Apps
   and Policies → Edit*.

Comprobación: `npx -y wrangler whoami` debe mostrar la cuenta.

**Reglas duras:**

- **Nunca** escribir el token en archivos del repo, commits, PRs ni logs — el
  repo es público. Nunca pedir al usuario que pegue el token en el chat: debe
  ir en variables de entorno o en GitHub Secrets.
- No comprometer fuentes `.otf/.ttf` (licencia Gotham/Caflisch); el bundler
  `tools/build-standalone.mjs` ya se niega a incrustarlas.
- Cambios de código: rama `claude/worker-tool-*`, `npm test` antes de push,
  PR contra `main` (convención del repo; ver README).

## Pasos (en orden; salta los que ya estén hechos)

### 1. Skills

Carga las skills del plugin `cloudflare:cloudflare` y `cloudflare:cloudflare-one`
antes de usar wrangler o la API de Access — priorizan docs actuales sobre
conocimiento entrenado.

### 2. Proyecto de Pages

- **¿Hecho?** `npx wrangler pages project list` contiene `ns-hotel`.
- Si no: `npx wrangler pages project create ns-hotel --production-branch=main`

### 3. Carpeta de despliegue y primer deploy

El repo lleva tests y herramientas que no deben subirse. Construir un `dist/`
limpio y desplegarlo:

```bash
node tools/build-standalone.mjs   # refresca standalone.html
rm -rf dist && mkdir dist
rsync -a ./ dist/ \
  --exclude .git --exclude node_modules --exclude tests --exclude tools \
  --exclude docs --exclude dist --exclude .github --exclude .claude \
  --exclude 'package*.json'
npx wrangler pages deploy dist --project-name=ns-hotel --branch=main
```

> El sitio necesita solo archivos estáticos; `standalone.html` sí se incluye
> (es la copia offline). Verifica que `dist/index.html`, `dist/js/` y
> `dist/assets/` existen antes de desplegar.

- **¿Hecho?** `curl -s -o /dev/null -w "%{http_code}" https://ns-hotel.pages.dev/index.html`
  devuelve 200 (antes de activar Access) y el hash-router carga plantillas.

### 4. Despliegue automático en cada push

- **¿Hecho?** existe `.github/workflows/cloudflare-pages.yml`.
- Si no, crearlo: en cada push a `main`, checkout → los mismos comandos del
  paso 3 → `wrangler pages deploy`, usando los **GitHub Secrets**
  `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID`
  (`cloudflare/wrangler-action` o `npx wrangler` directo).
- Los secrets los crea el usuario en GitHub → *Settings → Secrets and
  variables → Actions*; guíale con los nombres exactos. No puede hacerlo
  Claude.

### 5. Cloudflare Access delante del dominio

- **¿Hecho?** `GET /accounts/{account_id}/access/apps` contiene una app con
  dominio `ns-hotel.pages.dev`.
- La organización Zero Trust debe existir (nombre de equipo). Si la API
  responde que no hay organización: pedir al usuario ese único paso de
  dashboard (<https://one.dash.cloudflare.com>, elegir nombre de equipo,
  plan **Free**) y continuar.
- Crear la aplicación (API o MCP): tipo `self_hosted`,
  dominio `ns-hotel.pages.dev`, y en `self_hosted_domains` añadir también
  `*.ns-hotel.pages.dev` para cubrir las previews; `session_duration: "730h"`.
- Política **Allow** con `include` = lista de correos del equipo (preguntar a
  Cris la lista o el dominio común) — `email` / `email_domain`.
- Login: One-time PIN. Si no existe el identity provider `onetimepin`,
  crearlo (`POST /accounts/{account_id}/access/identity_providers`).

### 6. Verificación

```bash
curl -s -o /dev/null -w "%{http_code} %{redirect_url}" https://ns-hotel.pages.dev/
```

Debe responder 302 hacia `…cloudflareaccess.com…`. Después, pedir a Cris que
entre con su correo y confirme que recibe el código y ve la Zentrale.

### 7. Remate (decide el usuario — preguntar, no hacer por defecto)

- ¿Despublicar GitHub Pages? (GitHub → Settings → Pages → *Unpublish site*).
  Ojo: los enlaces «Link teilen» antiguos apuntan a github.io.
- Actualizar README y `docs/privat-zugang.md` con la URL definitiva.
- Si se despublica GitHub Pages, revisar que nada del repo dependa de esa URL
  (buscar `github.io` en el código).

## Estado conocido al escribir esto (2026-08-27)

- Plugin de Cloudflare instalado en el entorno remoto de Claude (efímero: en
  local hay que instalarlo una vez con los dos comandos de arriba).
- Cuenta de Cloudflare: creada. Token/OAuth: **pendiente**.
- Pasos 2–7: **pendientes**. Empezar por «Autenticación».
