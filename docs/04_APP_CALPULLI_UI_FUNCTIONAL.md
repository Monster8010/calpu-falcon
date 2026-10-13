# 04 — APP PÚBLICA: UPIICSA CALPULLI

## Propósito

Ser el punto único de consulta para el alumnado.

No pedir login.

No pedir crear cuenta.

Debe abrir y permitir navegar inmediatamente una vez conectado el almacenamiento compartido.

---

# NAVEGACIÓN GLOBAL

Bottom tabs:

1. Inicio.
2. Feria.
3. Marketplace.
4. Tutorías.
5. Favoritos.

Requisitos:

- ícono + label;
- área táctil cómoda;
- respetar safe areas;
- estado activo claro;
- modo claro/oscuro;
- no usar guinda institucional como único recurso visual.

Header global:

- marca/nombre Calpulli;
- control de tema o respeto al sistema;
- búsqueda solo donde tenga utilidad;
- no saturar.

---

# 1. INICIO

## Objetivo

Mostrar información institucional reciente, fácil de filtrar y escanear.

## Orden vertical

1. App header.
2. Directorio/filtros de departamentos.
3. Historias.
4. Feed.
5. Bottom navigation.

## Directorio/filtros

Debe resolver muchos departamentos sin romper composición.

### Componente

`DepartmentFilterRail`

Elementos:

- opción `Todos`;
- logo de ~1 carácter de altura visual;
- nombre a continuación;
- scroll horizontal;
- pill/chip compacto;
- estado seleccionado;
- padding consistente.

Ejemplo conceptual:

```text
Todos | ● Dirección | ● Gestión Escolar | ● Biblioteca | ● Médico | ...
```

No usar una cuadrícula gigante.

Al seleccionar un departamento:

- filtrar feed;
- opcionalmente priorizar sus historias;
- conservar posición coherente.

## Historias

`DepartmentStoriesRail`

Composición:

- avatar/logo circular o contenedor propio Calpulli;
- nombre corto;
- indicador visual de historia no vista;
- scroll horizontal.

Al abrir:

`StoryViewer`

Debe mostrar:

- departamento;
- progreso;
- contenido visual;
- texto si existe;
- contador de visualizaciones si está habilitado;
- cerrar/deslizar siguiente.

No:

- respuestas;
- likes;
- comentarios.

Para MVP una transición discreta basta.

## Feed

`InstitutionalFeed`

Orden base:

- nuevo a viejo.

Tratamiento de prioridades:

### normal
Card estándar.

### featured
Acento visual, borde o etiqueta.

### important
Etiqueta claramente visible y jerarquía superior.

### urgent
Tratamiento fuerte pero elegante.
Puede elevarse al inicio de la lista mientras siga vigente/visible.

Evitar llenar toda la pantalla de rojo.

## InstitutionalPostCard

Header:

- logo;
- nombre del departamento;
- fecha relativa o absoluta;
- badge de prioridad cuando aplique;
- menú no necesario para alumno.

Cuerpo:

- título;
- texto;
- imagen/carrusel si `showMedia`;
- ubicación si existe y `showLocation`;
- link/documento cuando aplique.

Footer:

- icono ojo + número de visualizaciones si `showViews`;
- botón Guardar/Favorito.

No incluir:

- corazón;
- like;
- comentarios.

### Estados visuales

- skeleton de carga;
- sin publicaciones;
- filtro sin resultados;
- error de almacenamiento;
- refresh.

### Refresh

Pull-to-refresh debe releer archivo compartido.

También refrescar al volver foreground.

---

# 2. FERIA

## Estado `upcoming`

Objetivo: crear expectativa.

Elementos:

- título Feria de Emprendimiento;
- fecha próxima;
- texto contextual corto;
- cuenta regresiva;
- referencia visual a Calpulli;
- indicación de que el mapa se habilitará durante la feria.

Cuenta regresiva:

- días;
- horas;
- minutos;
- segundos si no genera problemas de render.

No escribir la fecha dentro del código de UI.
Leer de `Fair.nextDate`.

## Estado `active`

Mostrar mapa cenital.

### Geometría

Top row:

```text
[01] [02] [03] [04] [05] [06] [07]
           |         |         |
```

Desde 03:

- 11 stands hacia abajo.

Desde 05:

- 11 stands hacia abajo.

Desde 07:

- 11 stands hacia abajo.

Total: 40.

Usar `Stand.coordinate`.

### Visual de stand

Disponible:

- mesa limpia;
- número;
- color neutro.

Solicitada:

- para la app pública puede mantenerse neutral o mostrar estado reservado sin datos sensibles.

Asignada:

- avatar/logo/sticker del emprendimiento;
- número;
- acento por categoría si es conveniente.

### Interacción

Tap en mesa disponible:

- mostrar ficha simple: `Stand disponible` / número.

Tap en asignada:

Abrir `StandBottomSheet`:

- avatar;
- emprendimiento;
- categoría;
- descripción corta;
- número de mesa;
- 1–3 medios;
- CTA `Ver perfil`.

### Perfil de emprendimiento desde Feria

`EntrepreneurProfileScreen`

Header:

- avatar/sticker;
- nombre;
- categoría;
- descripción;
- contactos públicos si aplica.

Contenido:

- galería;
- publicaciones;
- productos;
- mesa actual si feria activa.

---

# 3. MARKETPLACE

## Objetivo

Descubrir emprendimientos y productos.

No es tienda transaccional.

## Pantalla

1. Header.
2. Search opcional simple.
3. Filtros de categoría horizontales.
4. Grid/lista de productos/publicaciones.
5. acceso a perfil.

### MarketplaceCard

- imagen;
- nombre de producto/publicación;
- `priceLabel` opcional;
- nombre del emprendimiento;
- categoría;
- tap abre detalle.

No:

- carrito;
- comprar;
- pagar;
- entrega.

### Detalle

Puede contener:

- imagen/carrusel;
- título;
- descripción;
- precio de muestra;
- emprendimiento;
- botón `Ver emprendimiento`;
- contacto externo solo si está configurado.

---

# 4. TUTORÍAS

## Objetivo

Facilitar encontrar alumnos tutores.

## Layout

1. Header.
2. Search por materia/nombre.
3. Filtros de modalidad.
4. Cards de tutor.

### TutorCard

- avatar;
- nombre;
- materias principales;
- modalidad;
- descripción corta;
- CTA `Ver perfil`.

### Perfil Tutor

- foto/avatar;
- nombre;
- descripción;
- lista de materias;
- modalidad;
- disponibilidad textual;
- contactos externos.

El contacto sale de Calpulli.

Mostrar aviso ligero:

`El contacto y acuerdo de tutoría se realiza fuera de UPIICSA Calpulli.`

No crear chat.

---

# 5. FAVORITOS

## Fuente

Local de App pública.

No shared store.

## Contenido

Por ahora guardar publicaciones institucionales.

Pantalla:

- título Favoritos;
- lista de posts guardados;
- opción quitar;
- estado vacío.

Estado vacío:

- iconografía elegante;
- mensaje:
  `Guarda avisos importantes para consultarlos rápidamente.`

Si una publicación ya no existe en el shared store:

- limpiar referencia huérfana o mostrarla como no disponible y permitir eliminarla;
- preferir limpieza segura al refrescar.

---

# BUSCADOR

Para la primera versión:

- búsqueda local;
- sin indexación compleja;
- sin backend.

Puede implementarse en Marketplace/Tutorías.
En Inicio solo si el tiempo lo permite después de funciones esenciales.

---

# ACCESIBILIDAD

- texto nunca crítico por color solamente;
- contraste suficiente;
- touch targets;
- Dynamic Type razonable;
- etiquetas accesibles en iconos;
- no usar textos diminutos para meter más departamentos.

---

# ANIMACIÓN

Discreta:

- press states;
- fade/slide de bottom sheets;
- transición de historia;
- feedback al guardar;
- cambio suave de tema.

No construir animaciones pesadas antes de terminar funcionalidad.
