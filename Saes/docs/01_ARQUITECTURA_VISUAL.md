# Arquitectura visual actual

## 1. Shell general

La aplicación usa un contenedor centrado de aproximadamente 954 px de ancho en escritorio. El fondo exterior es gris. Dentro existe una estructura institucional con encabezado, navegación superior, breadcrumb, menú lateral, contenido principal, accesos rápidos y pie.

```text
Página completa
└── Fondo gris
    └── Contenedor institucional centrado
        ├── Encabezado
        │   ├── Escudo IPN
        │   ├── Nombre de UPIICSA
        │   └── Logos / accesos institucionales
        ├── Menú horizontal superior
        ├── Breadcrumb
        ├── Área de trabajo
        │   ├── Menú lateral de alumnos
        │   ├── Contenido de la pantalla
        │   └── Accesos rápidos
        └── Pie institucional
```

## 2. Encabezado

### Elementos observados

- Escudo del IPN a la izquierda.
- Texto centrado: `UNIDAD PROFESIONAL INTERDISCIPLINARIA DE INGENIERÍA Y CIENCIAS SOCIALES Y ADMINISTRATIVAS`.
- Logo institucional verde y amarillo a la derecha.
- Icono de correo.
- Icono de mapa o estructura institucional.
- Línea horizontal vino debajo del encabezado.

### Características

- Altura visual aproximada: 70–75 px.
- Texto en mayúsculas, centrado y de peso fuerte.
- Identidad visual basada en vino, verde, amarillo, blanco y gris.
- La cabecera se repite en casi todas las páginas.

### Mejora propuesta

- Mantener la identidad institucional.
- Convertir el encabezado en una barra adaptable.
- En móvil, conservar logo y nombre corto; mover enlaces secundarios a un menú.
- Usar `alt` descriptivo para escudos y logotipos.

## 3. Navegación superior

La navegación principal se muestra como pestañas horizontales:

1. Inicio
2. Alumnos
3. Académica
4. Reglamento
5. Ayuda
6. Recuperar Contraseña

La pestaña activa se pinta de naranja. Las demás tienen fondo gris claro y bordes finos.

### Problemas

- El estado activo depende mucho del color.
- Los textos son pequeños.
- No se observa una versión móvil clara.
- La navegación no resume el contexto del módulo.

### Mejora propuesta

- Añadir indicador visual y textual de sección activa.
- Convertirla en navegación con `aria-current="page"`.
- En pantallas pequeñas, usar botón `Menú`.
- Mantener los enlaces originales para no romper navegación.

## 4. Breadcrumb

Cada pantalla usa una ruta de contexto similar a:

```text
Inicio » Alumnos » Datos académicos » Kárdex
```

Los segmentos anteriores suelen ser enlaces subrayados en vino. El último segmento identifica la pantalla actual.

### Mejora propuesta

- Aumentar contraste y tamaño.
- Separar visualmente enlaces y página actual.
- Mantener estructura semántica `<nav aria-label="Migas de pan">`.
- En móvil, permitir truncado con tooltip o mostrar solo el módulo y página actual.

## 5. Distribución del área de trabajo

En la mayoría de pantallas existe una distribución de tres zonas:

```text
┌──────────────────────────────────────────────────────────────┐
│ Breadcrumb                                                    │
├──────────────┬─────────────────────────────────┬─────────────┤
│ Menú lateral │ Contenido principal              │ Accesos     │
│              │                                 │ rápidos     │
└──────────────┴─────────────────────────────────┴─────────────┘
```

### Menú lateral

- Ancho aproximado: 150 px.
- Fondo gris claro.
- Enlaces apilados verticalmente.
- Líneas separadoras horizontales.
- Subopciones con indentación mínima.
- Elemento activo con fondo naranja.
- Contiene todos los módulos de alumnos y permanece visible en muchas pantallas.

### Contenido principal

- Ancho aproximado: 640–790 px, según la pantalla.
- Fondo blanco o gris muy claro.
- Algunas páginas usan panel con borde gris.
- Otras usan borde grueso vino.
- Las páginas de tablas agregan scroll interno.

### Accesos rápidos

Caja lateral titulada `Accesos rápidos` con enlaces a:

- Agenda escolar.
- Horarios de clase.
- Horarios de ETS.

## 6. Pie

El pie es pequeño y contiene:

- `© 2024 SAES`.
- Enlace IPN.
- Enlace IPN-DAE.

Debe conservarse como información institucional, pero puede ganar separación, contraste y mejor ubicación en responsive.

## 7. Paleta visual aproximada

Los valores siguientes son estimaciones visuales. Antes de codificar una sustitución exacta se debe leer el CSS real del sitio.

| Uso | Color aproximado |
|---|---|
| Vino institucional | `#72002f` / `#800020` |
| Rojo oscuro de encabezados de tabla | `#8a0000` |
| Naranja de elemento activo | `#ff9800` |
| Fondo exterior | `#888888` |
| Fondo de menú | `#e5e5e5` |
| Fondo de contenido | `#ffffff` |
| Líneas grises | `#c8c8c8` |
| Verde de logotipo | `#0d6b45` |
| Amarillo de logotipo | `#d9df28` |

## 8. Tipografía y densidad

- El texto general parece usar una fuente sans serif del sistema.
- Encabezados y títulos aparecen en mayúsculas y peso fuerte.
- Tablas usan texto pequeño.
- Existen títulos centrados con exceso de espacio vertical.
- Algunos botones mezclan estilos oscuros, naranjas y vino.

### Mejora propuesta

- Sistema de tipografía único.
- Texto base mínimo de 15–16 px.
- Encabezados con jerarquía real, no solo mayúsculas.
- Altura de línea entre 1.4 y 1.6.
- Botones con estados hover, focus, disabled y loading.

## 9. Variaciones encontradas

No todas las pantallas usan exactamente el mismo shell:

- La pantalla de horario muestra un panel amplio con tabla semanal y botón de regreso.
- Pase Digital usa un contenedor casi independiente con borde negro y pie propio.
- Algunas páginas no muestran el menú lateral completo.
- Las tablas académicas pueden tener scroll interno separado del scroll de página.
- El estado de error de ETS reemplaza por completo el shell institucional.

La extensión debe aplicar mejoras de forma tolerante, verificando qué elementos existen antes de moverlos.
