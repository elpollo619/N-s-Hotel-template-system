# Runbook para Claude Code — desplegar N's Hotel Vorlagen-Zentrale en Cloudflare (privado)

> **Para el agente:** este archivo es el punto de arranque para poner la
> Vorlagen-Zentrale detrás de un login de equipo (Cloudflare Pages + Access).
> Sigue los pasos en orden. Todo se hace con la API de Cloudflare vía el token
> `CLOUDFLARE_API_TOKEN`; no hace falta navegador salvo el paso 0 (que hace el
> humano) y el paso 6 (elegir el nombre de equipo Zero Trust, una sola vez).

## Contexto

- **Repo:** `elpollo619/N-s-Hotel-template-system` (público). Sitio 100 % estático
  (HTML/CSS/ES-modules, sin build). Raíz del repo = raíz web (`index.html` arriba).
- **Meta:** servir el sitio desde Cloudflare Pages y protegerlo con Cloudflare
  Access (login por correo, One-time PIN, gratis hasta 50 personas), sin tocar el
  código de la app. Los despliegues siguen siendo automáticos en cada push a `main`.
- **Cuenta Cloudflare:** una cuenta NUEVA y vacía, dedicada solo a esto
  (separada de la cuenta de Workpulse del usuario). No hay dominio propio: se usa
  el subdominio gratis `*.pages.dev`.

## Requisitos previos

- [ ] **(Paso 0 — lo hace el humano)** Token creado en la cuenta nueva con permisos
  *Account · Cloudflare Pages · Edit* y *Account · Access: Apps and Policies · Edit*,
  guardado como variable de entorno `CLOUDFLARE_API_TOKEN`. Comprobar:
  ```bash
  echo "${CLOUDFLARE_API_TOKEN:+token presente}"
  npx -y wrangler whoami        # debe listar la cuenta y el Account ID
  ```
  Si `whoami` dice «not authenticated», parar: el token no está en el entorno.
- [ ] Guardar el **Account ID** que muestra `whoami` (se usa en las llamadas API).

## Datos que pedir al usuario antes de empezar

1. **Correos del equipo** que podrán entrar (o el dominio común, p. ej. `@amonn.ch`).
2. Confirmar el **nombre del proyecto** de Pages. Propuesta: `ns-hotel`
   → URL final `https://ns-hotel.pages.dev`.

---

## Paso 1 — Crear el proyecto de Pages y el primer despliegue

Cargar la skill `cloudflare:wrangler` antes de usar wrangler. Desde la raíz del repo:

```bash
# Crear el proyecto de Pages (producción = rama main)
npx -y wrangler pages project create ns-hotel --production-branch main

# Primer despliegue del sitio estático (la raíz del repo es la raíz web)
npx -y wrangler pages deploy . --project-name ns-hotel --branch main --commit-dirty=true
```

Verificar que la URL responde (200) y sirve la app:
```bash
curl -s -o /dev/null -w "%{http_code}\n" https://ns-hotel.pages.dev/index.html
```

> Nota: `wrangler pages deploy .` sube TODO el repo. Está bien — no hay secretos
> en el repo (ver .gitignore: nada de fuentes .otf/.ttf ni contraseñas). Si se
> quiere excluir `tests/`, `tools/`, `node_modules/`, añadir un `.assetsignore`
> en la raíz (una ruta por línea) antes de desplegar.

## Paso 2 — Despliegue automático en cada push (GitHub Action)

Crear `.github/workflows/cloudflare-pages.yml` en una rama de trabajo
(`claude/worker-tool-09upbx`), abrir PR draft, y NO fusionar hasta que el usuario
haya añadido los secretos del repo (ver abajo):

```yaml
name: Deploy to Cloudflare Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions: { contents: read, deployments: write }
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy . --project-name ns-hotel --branch main
```

**Secretos del repo que el usuario debe añadir** (GitHub → Settings → Secrets and
variables → Actions): `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID`.
Decírselo en el PR y en el chat; no fusionar el workflow hasta que estén.

## Paso 3 — Cloudflare Access (el login por correo)

Cargar la skill `cloudflare:cloudflare-one`. Todo por API con el mismo token.
Base: `https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/access`.

1. **Comprobar/crear identidad One-time PIN** — normalmente ya existe al abrir
   Zero Trust; si no, el paso 6 (humano) la habilita.
2. **Crear la aplicación Access** (self-hosted) sobre el dominio de Pages:
   ```bash
   curl -s -X POST \
     "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/access/apps" \
     -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "N'\''s Hotel Vorlagen-Zentrale",
       "domain": "ns-hotel.pages.dev",
       "type": "self_hosted",
       "session_duration": "720h"
     }'
   ```
   Guardar el `id` (App UID) de la respuesta.
3. **Crear la política Allow** con los correos del equipo:
   ```bash
   curl -s -X POST \
     "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/access/apps/$APP_UID/policies" \
     -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Team N'\''s Hotel",
       "decision": "allow",
       "include": [ { "email": { "email": "persona1@ejemplo.ch" } },
                    { "email": { "email": "persona2@ejemplo.ch" } } ]
     }'
   ```
   Para un dominio entero, usar `{ "email_domain": { "domain": "amonn.ch" } }`
   en lugar de las entradas `email`.

> Si la API de Access devuelve un error de que Zero Trust no está inicializado,
> es que falta el paso 6 (elegir nombre de equipo). Pedírselo al usuario y reintentar.

## Paso 4 — Verificar

- Abrir `https://ns-hotel.pages.dev` en incógnito → debe aparecer la pantalla de
  Cloudflare Access pidiendo el correo (no la app directamente).
- Con un correo de la lista: llega el código, se entra, se ve la Zentrale.
- Con un correo fuera de la lista: acceso denegado.

## Paso 5 — Apagar (opcional) la página pública de GitHub Pages

Una vez la de Cloudflare funcione, decidir con el usuario si se apaga
`elpollo619.github.io/N-s-Hotel-template-system/`:
- GitHub → Settings → Pages → **Unpublish site** (lo hace el usuario), o
- dejarla como copia pública de respaldo.
Actualizar README si se apaga.

## Paso 6 — Único clic obligatorio del humano (una vez)

La primera vez que se toca Zero Trust, Cloudflare obliga a **elegir un nombre de
equipo** en el panel (Zero Trust → al entrar pide `<algo>.cloudflareaccess.com`)
y a elegir el plan **Free**. No se puede hacer por API. Si el paso 3 falla por
esto, pedir al usuario que entre a **dash.cloudflare.com → Zero Trust**, elija el
nombre de equipo y el plan Free, y avise para reintentar el paso 3.

---

## Estado / checklist para ir marcando

- [ ] Paso 0: token en el entorno + `wrangler whoami` OK
- [ ] Paso 1: proyecto Pages creado + primer deploy responde 200
- [ ] Paso 2: workflow en PR (esperando secretos del repo del usuario)
- [ ] Paso 6: nombre de equipo Zero Trust elegido (humano)
- [ ] Paso 3: app Access + política con correos del equipo
- [ ] Paso 4: verificado en incógnito (dentro/fuera de la lista)
- [ ] Paso 5: decidido qué pasa con GitHub Pages

## Notas de seguridad (mantener)

- El repo es público: nunca commitear el token ni el Account ID en el código
  (van en variables de entorno / secretos del repo). Nunca pegarlos en el chat.
- Las fuentes compradas (Gotham/Caflisch) siguen sin subirse; el build de
  standalone se niega a incrustarlas. Nada de esto cambia con Cloudflare.
