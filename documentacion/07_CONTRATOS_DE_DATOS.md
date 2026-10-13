# Contratos de datos

## Ubicación

Los contratos viven en `packages/domain/src`. No duplicarlos dentro de las apps.

## Reglas base

- Todos los IDs son `string`.
- Todas las fechas persistidas usan ISO 8601.
- Los contratos compartidos son la fuente semántica para ambas apps.

## Entidades

| Entidad | Uso |
|---|---|
| `Department` | Área institucional, logo, contacto y estado activo. |
| `InstitutionalPost` | Aviso institucional con prioridad, visibilidad y moderación. |
| `Story` | Aviso temporal de un departamento. |
| `Fair` | Edición de feria, fecha y estado. |
| `Stand` | Mesa con número, coordenada y asignación. |
| `StandRequest` | Solicitud de mesa y su transición de estado. |
| `Entrepreneur` | Perfil, galería y contactos externos. |
| `EntrepreneurPost` | Publicación de Marketplace/perfil. |
| `Product` | Producto de descubrimiento; `priceLabel` es texto. |
| `Tutor` | Perfil de tutor y modalidades. |
| `TutoringOffer` | Materia, modalidad y disponibilidad textual. |
| `ExternalContact` | WhatsApp, Telegram, email, Instagram, teléfono u otro. |
| `MediaReference` | Recurso empaquetado (`bundled`) o compartido (`shared`). |
| `AppConfiguration` | Configuración compartida y versión de esquema. |

## Estados importantes

```text
Fair: upcoming | active
Stand: available | requested | assigned
StandRequest: pending | approved | rejected | cancelled
PostPriority: normal | featured | important | urgent
TutoringMode: in-person | online | hybrid
```

## Reglas de validación

- Un stand asignado debe tener `assignedEntrepreneurId`.
- No se puede asignar un stand ya asignado.
- Un emprendedor no puede tener dos solicitudes activas para la misma feria.
- Aprobar una solicitud rechazada requiere una nueva transición explícita.
- Publicaciones no publicadas o moderadas no aparecen en la consulta pública.
- Emprendedores y tutores inactivos no aparecen en selectores públicos.
- El feed ordena `urgent > important > featured > normal`; dentro de cada prioridad, más reciente primero y `id` como desempate estable.

## Favoritos

Favoritos no forman parte de `SharedCalpulliState`. Se guardan de forma local en la app pública y no se sincronizan con Gestión.

## Fuera del contrato

No convertir `priceLabel` en lógica financiera, `availabilityLabel` en agenda, ni contactos externos en chat interno.
