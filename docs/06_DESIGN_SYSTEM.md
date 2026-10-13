# 06 — SISTEMA DE DISEÑO

## Dirección creativa

UPIICSA Calpulli debe sentirse:

1. tecnológica;
2. contemporánea;
3. mexicana;
4. universitaria;
5. viva;
6. limpia;
7. accesible.

No debe sentirse:

- gubernamental anticuada;
- turística;
- arqueológica;
- infantil;
- saturada;
- copia de Instagram;
- plantilla genérica.

## Referencias culturales

Usar de manera abstracta/discreta:

- geometría escalonada;
- grecas;
- ritmo modular;
- patrones inspirados en códices;
- composición de bloques;
- formas relacionadas con plaza/comunidad/calpulli.

No abusar de:

- pirámides;
- penachos;
- águilas;
- símbolos sagrados como decoración sin contexto.

## Paleta conceptual

Nombres de tokens, no valores definitivos obligatorios:

- `obsidian`
- `bone`
- `jade`
- `turquoise`
- `mayaBlue`
- `mexicanPink`
- `cempasuchil`
- `cochineal`
- `charcoal`
- `surface`
- `surfaceElevated`
- `textPrimary`
- `textSecondary`
- `borderSubtle`

Codex puede proponer valores hex coherentes, pero debe centralizarlos en tokens.

No hardcodear colores por pantalla.

## Tema claro

- fondo base hueso/blanco cálido;
- cards claras;
- texto oscuro;
- acentos vivos controlados.

## Tema oscuro

- fondo obsidiana;
- cards carbón;
- texto claro;
- acentos jade/turquesa/cempasúchil/rosa.

No invertir ciegamente colores.

## Tipografía

Priorizar fuentes compatibles con Expo Go y sistema.

Jerarquía:

- display;
- title;
- heading;
- body;
- label;
- caption.

No usar más de 2 familias.

Si una fuente externa complica la demo, usar system font y dejar tipografía custom para etapa posterior.

## Espaciado

Crear escala:

- 4
- 8
- 12
- 16
- 20
- 24
- 32

No usar números arbitrarios repetidos.

## Radios

- pequeños para chips;
- medianos para cards;
- altos para sheets;
- evitar que todo parezca una burbuja.

## Iconografía

Usar una sola familia disponible y coherente.

No mezclar 3 estilos.

## Cards

Cards de contenido deben:

- respirar;
- tener jerarquía;
- no encerrar cada elemento innecesariamente;
- no depender solo de sombra.

## Feed

Inspirarse en patrones entendibles de apps sociales:

- avatar;
- autor/departamento;
- contenido;
- media;
- acciones secundarias.

Pero:

- no copiar iconografía exacta;
- no copiar spacing exacto;
- no copiar nombres o distribución de una marca específica.

## DepartmentFilterRail

Debe ser visualmente sofisticado a pesar de muchos departamentos.

Recomendación:

- chip pequeño;
- logo 16–20 px;
- nombre;
- selected state por fondo/borde;
- scroll horizontal.

## Feria

Puede ser el elemento visual más distintivo.

El mapa debe parecer:

- ordenado;
- táctil;
- legible;
- abstracto;
- no un plano arquitectónico complejo.

Los stands asignados deben generar una sensación de feria viva usando avatares/stickers.

## Movimiento

Duraciones cortas.

Usar haptics solo si ya está disponible y no rompe Expo Go.

No añadir librerías de animación únicamente por decoración si compromete estabilidad.

## Accesibilidad

- contraste WCAG razonable;
- no usar color como único indicador;
- badges con texto;
- targets mínimos cómodos;
- soporte de modo claro/oscuro;
- respetar Reduce Motion cuando sea viable.

## Lenguaje

Español claro.

Evitar tono excesivamente administrativo.

Ejemplos:

`Próxima Feria`
`Seleccionar mesa`
`Solicitud pendiente`
`Guardar aviso`
`Ver emprendimiento`
`Contactar externamente`

No:

`Ejecución de proceso de asignación de entidad mercantil`.
