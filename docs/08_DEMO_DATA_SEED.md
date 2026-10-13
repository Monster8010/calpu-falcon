# 08 — DATOS FICTICIOS PARA LA DEMOSTRACIÓN

## Objetivo

La app debe sentirse habitada desde el primer arranque.

No usar lorem ipsum.

Usar contenido ficticio pero plausible para contexto universitario.

## Departamentos

1. Dirección.
2. Gestión Escolar.
3. Biblioteca.
4. Servicio Médico.
5. Cultura.
6. Deportes.
7. Becas.
8. Emprendimiento.
9. Posgrado.
10. Tutorías.

Cada uno:

- logo placeholder propio;
- descripción breve;
- color token;
- 1–3 publicaciones.

## Ejemplos de publicaciones

### Gestión Escolar
`Registro de optativas del periodo`
Texto ficticio sobre fechas.

### Biblioteca
`Extensión de horario por semana de evaluaciones`

### Servicio Médico
`Jornada preventiva de salud`

### Cultura
`Convocatoria para muestra de fotografía universitaria`

### Deportes
`Entrenamiento abierto de voleibol`

### Becas
`Recordatorio de entrega documental`

### Emprendimiento
`Próxima Feria de Emprendimiento`

### Posgrado
`Sesión informativa de programas de especialidad`

### Tutorías
`Registro de alumnos tutores`

Incluir mezcla:

- normal;
- featured;
- important;
- urgent.

## Historias

8–12.

Ejemplos:

- Cultura: taller.
- Becas: fecha límite.
- Biblioteca: nuevo horario.
- Deportes: partido.
- Emprendimiento: feria.
- Tutorías: convocatoria.

## Feria

Nombre:

`Feria de Emprendimiento Calpulli`

Fecha inicial:

Elegir un miércoles futuro coherente con la fecha de demo.

No hardcodear UI.

Status inicial sugerido:

`upcoming`

## Stands

40.

Seed debe generar:

Top:

1–7.

Columna de 3:

8–18.

Columna de 5:

19–29.

Columna de 7:

30–40.

La numeración es sugerida y debe ser consistente.

Asignar algunos stands en un seed alternativo o permitir que el presentador lo haga durante la demo.

## Emprendimientos ficticios

Ejemplos:

1. Quetzal Café — alimentos.
2. Nopal Studio — diseño.
3. Tenochtli Tech — tecnología.
4. Xolo Print — impresión/arte.
5. Cacao Lab — alimentos.
6. Axólotl Accesorios — accesorios.
7. Maíz Circular — sustentabilidad.
8. Tlalli Cerámica — artesanía.
9. Pixel Calpulli — servicios digitales.
10. Mecatl — textiles.

No implicar que sean negocios reales.

Cada uno:

- avatar;
- categoría;
- descripción;
- galería bundled;
- contactos ficticios.

## Marketplace

15–25 items.

Mezclar:

- producto;
- publicación;
- servicio.

Precios pueden usar `priceLabel` ficticio.

Ejemplo:

`$85 MXN`
`Desde $120`
`Cotización`

No implementar aritmética.

## Tutores

8 perfiles ficticios.

Materias ejemplo:

- Cálculo Diferencial.
- Cálculo Integral.
- Álgebra.
- Probabilidad.
- Estadística.
- Programación.
- Estructuras de Datos.
- Bases de Datos.
- Redes.
- Contabilidad.
- Investigación de Operaciones.

Cada tutor:

- 2–4 materias;
- modalidad;
- contacto ficticio.

## Visualizaciones

Generar números plausibles.

No incrementar automáticamente con cada render.

Si se implementa incremento por apertura, hacerlo una sola vez por evento de apertura y aceptar que es demo local.

## Fechas

Distribuir publicaciones en últimas 72 horas para que el feed muestre temporalidad realista.

Algunas publicaciones pueden ser de semanas anteriores para comprobar scroll/orden.
