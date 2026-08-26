# Acceso privado con Cloudflare Access (gratis hasta 50 personas)

La Vorlagen-Zentrale es 100 % estática, así que se puede servir desde
Cloudflare Pages y proteger con **Cloudflare Access**: cada persona del
equipo entra con su **correo** (recibe un código de un solo uso) y nadie
más puede abrir la página. Sin servidor propio, sin cambiar el código,
y los despliegues siguen siendo automáticos con cada push a `main`.

> Nota honesta: GitHub Pages solo, no puede tener login de verdad — es
> hosting público. Por eso el login se hace delante, con Cloudflare.

## Paso 1 — Cuenta y despliegue (una vez, ~10 minutos)

1. Crear cuenta gratis en <https://dash.cloudflare.com/sign-up>.
2. En el panel: **Workers & Pages → Create → Pages → Connect to Git**.
3. Autorizar GitHub y elegir el repo `elpollo619/N-s-Hotel-template-system`.
4. Ajustes del proyecto:
   * **Production branch:** `main`
   * **Build command:** *(vacío — no hay build)*
   * **Build output directory:** `/`
5. **Save and Deploy**. Cloudflare da una dirección tipo
   `https://ns-hotel.pages.dev` — la nueva casa privada de la Zentrale.

Desde ahora, cada push a `main` se publica solo también ahí.

## Paso 2 — Poner el login delante

1. En el panel: **Zero Trust** (la primera vez pide elegir un nombre de
   equipo y el plan **Free**).
2. **Access → Applications → Add an application → Self-hosted**.
3. **Application domain:** el dominio del paso 1 (`ns-hotel.pages.dev`),
   sin ruta, para cubrirlo todo.
4. **Session duration:** 1 mes (para no pedir el código cada día).
5. Política de acceso (**Add a policy**):
   * Action **Allow**
   * Include → **Emails** → la lista de correos del equipo
     (o **Emails ending in** `@…` si todo el equipo comparte dominio).
6. Login method: dejar **One-time PIN** (correo con código; no hace falta
   que nadie cree cuentas).
7. Guardar. Al abrir la página aparece la pantalla de Cloudflare: correo →
   código → dentro. En el móvil, la PWA instalada sigue funcionando; tras
   el login la sesión dura lo elegido en el punto 4.

## Paso 3 — Decidir qué pasa con la página pública

* La dirección de GitHub Pages (`elpollo619.github.io/...`) seguiría
  abierta. Para apagarla: en GitHub, **Settings → Pages → Unpublish site**.
* El repo puede seguir siendo público (el código no contiene secretos:
  ni claves WLAN ni las fuentes compradas) o hacerse privado en
  **Settings → General → Danger Zone → Change visibility**. Cloudflare
  Pages sigue funcionando con el repo privado.

## Qué NO cambia

* `standalone.html` sigue siendo la copia offline (Drive, USB, correo).
* Los borradores viven en el navegador de cada persona, como siempre.
* Nada de esto toca el código de la app.
