# 05 — APP DE GESTIÓN: GESTIÓN UPIICSA CALPULLI

## Propósito

Modificar los datos que consulta UPIICSA Calpulli y demostrar capacidades por rol.

## MVP

No login.

Pantalla inicial:

`Selecciona un perfil de demostración`

Roles:

- Superadministrador.
- Administrador de Feria.
- Departamento.
- Emprendedor.
- Tutor.
- Moderador.

La selección de rol puede guardarse localmente solo para navegación de demo.

Siempre incluir:

`Cambiar perfil demo`

No confundir rol demo con autenticación.

---

# HOME / ROLE SELECTOR

Diseño en cards.

Cada card:

- icono;
- nombre;
- una frase de función;
- tap.

Ejemplo:

```text
Administrador de Feria
Fechas, mapa, solicitudes y asignación de stands.
```

Añadir indicador visible de que es:

`Modo demostración`

---

# 1. SUPERADMINISTRADOR

## Dashboard

Resumen:

- departamentos;
- posts publicados;
- próxima feria;
- stands asignados;
- solicitudes pendientes;
- emprendedores;
- tutores.

Cards/acciones:

1. Departamentos.
2. Configuración.
3. Feria.
4. Contenido.
5. Datos de demostración.

### Datos de demostración

Acciones:

- `Restaurar datos demo`.
- `Ver revisión del shared store`.
- `Ver estado de conexión`.
- `Revalidar almacenamiento`.

No exponer detalles técnicos de forma prominente frente a directivos, pero sí en una sección de herramientas.

---

# 2. ADMINISTRADOR DE FERIA

## Dashboard Feria

Bloque de estado:

- próxima fecha;
- estado;
- cuenta de stands;
- solicitudes pendientes;
- asignados;
- disponibles.

Acciones:

- cambiar fecha;
- activar feria;
- finalizar feria;
- ver mapa;
- ver solicitudes.

## Cambiar fecha

Date picker.

Debe sobrescribir `Fair.nextDate`.

La regla "cada 15 días en miércoles" sirve como sugerencia, no como bloqueo.

Puede existir:

`Sugerir siguiente miércoles +15 días`

pero el administrador conserva control.

## Activar Feria

Confirmación simple.

Cambio:

`upcoming → active`

## Finalizar Feria

Confirmación.

Cambio:

`active → upcoming`

Debe:

- registrar `endedAt`;
- limpiar/archivar asociaciones de feria según implementación del seed;
- conservar trazabilidad mínima;
- usar/configurar siguiente fecha.

Para MVP no construir histórico completo si complica.

## Mapa administrativo

Misma geometría pública, con más información.

Estados:

- disponible;
- solicitud pendiente;
- asignado.

Tap:

- número;
- emprendimiento;
- solicitud;
- acciones disponibles.

## Solicitudes

Lista:

- avatar;
- emprendimiento;
- categoría;
- stand solicitado;
- fecha;
- estado.

Acciones:

`Aprobar`
`Rechazar`

### Aprobar

Validaciones:

- stand sigue disponible/solicitable;
- solicitud pendiente;
- emprendedor válido.

Efectos:

- request `approved`;
- stand `assigned`;
- `assignedEntrepreneurId`;
- rechazar/cancelar solicitudes incompatibles si las hubiera.

### Rechazar

- request `rejected`;
- stand vuelve a estado coherente si no hay otras solicitudes.

## Liberar stand

Administrador puede liberar.

Debe actualizar asociación de forma consistente.

---

# 3. DEPARTAMENTO

Para demo debe poder seleccionarse un departamento ficticio.

Primera pantalla:

`Elegir departamento demo`

Ejemplos: Dirección, Gestión Escolar, Biblioteca, etc.

## Dashboard

Header:

- logo;
- nombre;
- editar perfil.

Métricas:

- publicaciones;
- visualizaciones acumuladas ficticias/reales del estado local;
- historias activas.

Acciones:

- `Crear publicación`;
- `Mis publicaciones`;
- `Crear historia`;
- `Editar perfil`.

## Editor de publicación

Campos:

- título;
- contenido;
- prioridad;
- imagen/galería demo;
- enlace;
- documento opcional;
- ubicación;
- fecha/publicación;
- switches de visibilidad.

Switches:

- mostrar departamento;
- mostrar ubicación;
- mostrar media;
- mostrar fecha;
- mostrar visualizaciones.

Prioridad:

- normal;
- destacada;
- importante;
- urgente.

Botones:

- Guardar borrador visual si se implementa;
- Publicar.

Para MVP puede omitirse flujo complejo de borradores siempre que `isPublished` esté modelado.

## Lista publicaciones

Card:

- título;
- prioridad;
- estado;
- fecha;
- visualizaciones;
- editar;
- eliminar.

Eliminar requiere confirmación.

Los departamentos publican libremente.
No pasan por moderador para aprobación.

## Historias

Crear:

- media;
- texto;
- duración/expiración sencilla.

No construir editor multimedia complejo.

---

# 4. EMPRENDEDOR

Para demo debe poder seleccionar uno de varios perfiles ficticios.

## Dashboard

Header:

- avatar/sticker;
- nombre;
- categoría;
- editar.

Secciones:

1. Mi perfil.
2. Mis publicaciones.
3. Mis productos.
4. Feria.
5. Estado de solicitud.

## Editar perfil

- nombre;
- categoría;
- descripción;
- avatar/foto/sticker;
- galería;
- contactos externos.

## Publicaciones

CRUD de `EntrepreneurPost`.

No aparecen en Inicio institucional.

Sí aparecen:

- perfil de emprendimiento;
- Marketplace cuando corresponda.

## Productos

CRUD demo:

- nombre;
- descripción;
- `priceLabel`;
- categoría;
- media;
- activo.

## Feria

Si próxima:

- fecha;
- botón `Seleccionar stand`.

Si activa y el proceso permite selección según reglas de demo:

- mostrar mapa de stands.

### Seleccionar stand

Solo permitir stands disponibles.

Tap → detalle → `Solicitar esta mesa`.

Al solicitar:

- crear `StandRequest`;
- cambiar estado de visualización apropiadamente;
- mostrar `Pendiente de aprobación`.

El emprendedor NO puede aprobar su solicitud.

## Estado

- pendiente;
- aprobada;
- rechazada;
- cancelada.

Si aprobada:

- mostrar número de stand;
- mostrar mapa/ubicación.

---

# 5. TUTOR

Para demo seleccionar tutor ficticio.

## Dashboard

- avatar;
- nombre;
- editar perfil;
- materias;
- modalidad;
- contacto.

## Editar

Campos:

- nombre;
- descripción;
- avatar;
- modalidad;
- contactos.

## Materias

CRUD simple de `TutoringOffer`.

Cada oferta:

- materia;
- descripción opcional;
- modalidad;
- disponibilidad textual;
- activa/inactiva.

Al guardar, la app pública debe reflejarlo tras refresh.

---

# 6. MODERADOR

## Propósito

Moderación posterior, no aprobación previa de departamentos.

## Dashboard

Listas:

- publicaciones institucionales;
- publicaciones de emprendedores;
- productos/perfiles si aplica.

Acciones MVP:

- ocultar;
- restaurar;
- ver detalle.

No eliminar permanentemente como primera opción.

### Publicación oculta

`isHiddenByModerator = true`

La app pública no la muestra.

Gestión debe indicar claramente:

`Oculta por moderación`

No construir sistema de denuncias complejo para esta demo.

---

# COMPONENTES COMPARTIDOS DE GESTIÓN

- `RoleSwitcher`
- `ManagementHeader`
- `MetricCard`
- `EntityListItem`
- `StatusBadge`
- `FormField`
- `VisibilityToggle`
- `PriorityPicker`
- `ConfirmationSheet`
- `StorageStatusIndicator`
- `EmptyState`
- `ErrorState`

---

# FEEDBACK DE GUARDADO

Toda escritura:

1. mostrar estado `Guardando...`;
2. ejecutar Repository;
3. verificar persistencia;
4. mostrar `Guardado`;
5. si falla, mostrar error;
6. no cerrar formulario como si hubiera funcionado.

Para la presentación, la confiabilidad visual del guardado es esencial.
