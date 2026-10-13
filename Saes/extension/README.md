# SAES UPIICSA — primera integración

Primera integración del preset minimalista para una futura extensión. La carga visual está conectada mediante `manifest.json` y `src/content.js`.

Está pensado como base visual clara y sobria:

- fondo gris muy claro;
- superficies blancas;
- tipografía del sistema;
- bordes finos;
- esquinas ligeramente redondeadas;
- sombras suaves;
- acento azul accesible;
- menú compacto;
- botones con contorno discreto;
- soporte inicial para imagen de fondo mediante `--saes-background-image`.

## Uso

Importa el preset y aplica sus variables en el navegador:

```js
import minimalistPreset from './src/presets/minimalist.js';
import applyTheme from './src/apply-theme.js';

applyTheme(minimalistPreset.tokens);
```

También puedes cargar `src/styles/tokens.css` como hoja de estilos base.

## Carga en el navegador

`manifest.json` activa `src/content.js` en:

```text
https://www.saes.upiicsa.ipn.mx/*
```

El content script aplica el preset automáticamente cuando la página termina de cargar. También adapta el menú lateral en pantallas pequeñas: detecta `#leftColumn`, variantes WebForms como `ctl00_leftColumn` o un enlace cuyo `href` contenga `subMenu_SkipLink`, agrega un botón accesible y un backdrop, y permite cerrar con Escape, al pulsar un enlace del menú o al pulsar el backdrop.

En escritorio el menú permanece visible. En móvil se muestra como panel fijo con desplazamiento interno, ancho máximo de `85vw` y transición mediante `transform`. El contenido conserva desplazamiento horizontal controlado; imágenes, campos y controles se ajustan al ancho disponible. La extensión no cambia `href`, formularios, postbacks ni datos.

La inicialización es idempotente: reejecutar el content script no duplica estilos, botón, backdrop ni listeners.

Para probarla como extensión sin empaquetar, carga esta carpeta como extensión descomprimida en un navegador compatible con Manifest V3. Para Safari, el siguiente paso es empaquetarla como Safari Web Extension mediante Xcode.

## Tokens principales

| Grupo | Tokens |
|---|---|
| Color | `--saes-color-*` |
| Fondo | `--saes-background-*` |
| Botones | `--saes-button-*` |
| Menú | `--saes-menu-*` |
| Tipografía | `--saes-font-*`, `--saes-line-height` |
| Forma | `--saes-radius-*`, `--saes-shadow-*` |

La imagen de fondo debe ser local y validarse antes de convertirse en valor CSS. Este preset todavía no incluye el selector visual ni el guardado de preferencias.

## Validación

Desde la raíz de la extensión:

```sh
node --check src/content.js
node -e "JSON.parse(require('fs').readFileSync('manifest.json', 'utf8')); console.log('manifest.json válido')"
```
