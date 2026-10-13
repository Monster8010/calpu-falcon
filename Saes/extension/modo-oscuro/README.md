# Modo oscuro de SAES

Módulo visual independiente para aplicar un tema oscuro al SAES sin alterar su navegación ni su lógica ASP.NET Web Forms.

## Activación

El módulo se carga desde `manifest.json` en las mismas rutas del SAES y activa el modo oscuro por defecto. Guarda la preferencia `dark` o `light` en `localStorage` con la clave `saes-theme`.

## API temporal

```js
SaesDarkMode.get();
SaesDarkMode.set('light');
SaesDarkMode.set('dark');
SaesDarkMode.toggle();
```

La API permitirá conectar después un selector visual de preferencias. Todavía no se añade un panel de configuración para mantener este primer módulo pequeño.

## Compatibilidad

- No cambia `href`, `form.action`, `form.method` ni `target`.
- No modifica `__VIEWSTATE`, `__EVENTVALIDATION`, `__EVENTTARGET` ni `__EVENTARGUMENT`.
- No intercepta `submit`, `__doPostBack` ni los listeners del menú.
- Mantiene las clases del menú responsive existente.
- Excluye los campos `input[type="hidden"]` de los estilos de controles visibles.

## Archivos

- `modo-oscuro.css`: variables y overrides visuales.
- `modo-oscuro.js`: activación, persistencia y API mínima.
- `ANALISIS.md`: decisiones de diseño basadas en la extracción del SAES.
