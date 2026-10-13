# 03 — CONTRATOS DE DATOS

Todos los contratos viven en `packages/domain`.

No duplicarlos dentro de cada app.

Todos los IDs son `string`.

Todas las fechas persistidas se guardan en ISO 8601.

## Tipos base

```ts
export type ID = string;
export type ISODateTime = string;

export type AppRole =
  | "superadmin"
  | "fair-admin"
  | "department"
  | "entrepreneur"
  | "tutor"
  | "moderator";

export type PostPriority =
  | "normal"
  | "featured"
  | "important"
  | "urgent";

export type FairStatus =
  | "upcoming"
  | "active";

export type StandStatus =
  | "available"
  | "requested"
  | "assigned";

export type StandRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";

export type TutoringMode =
  | "in-person"
  | "online"
  | "hybrid";
```

## Department

```ts
export interface Department {
  id: ID;
  name: string;
  shortName?: string;
  description?: string;
  logoKey: string;
  accentToken?: string;
  contact?: ExternalContact[];
  isActive: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
```

## InstitutionalPost

```ts
export interface InstitutionalPostVisibility {
  showDepartment: boolean;
  showLocation: boolean;
  showMedia: boolean;
  showDate: boolean;
  showViews: boolean;
}

export interface InstitutionalPost {
  id: ID;
  departmentId: ID;
  title: string;
  body: string;
  priority: PostPriority;
  publishedAt: ISODateTime;
  scheduledAt?: ISODateTime;
  location?: string;
  media: MediaReference[];
  linkUrl?: string;
  document?: MediaReference;
  views: number;
  visibility: InstitutionalPostVisibility;
  isPublished: boolean;
  isHiddenByModerator: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
```

## Story

```ts
export interface Story {
  id: ID;
  departmentId: ID;
  title?: string;
  body?: string;
  media: MediaReference[];
  views: number;
  startsAt: ISODateTime;
  expiresAt: ISODateTime;
  isActive: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
```

## Fair

```ts
export interface Fair {
  id: ID;
  name: string;
  status: FairStatus;
  nextDate: ISODateTime;
  activatedAt?: ISODateTime;
  endedAt?: ISODateTime;
  recurrenceHintDays: number; // seed: 15
  recurrenceHintWeekday: number; // miércoles, documentar convención
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
```

## Stand

No guardar posición de forma implícita.

```ts
export interface StandCoordinate {
  row: number;
  column: number;
  branch?: "top" | "from-3" | "from-5" | "from-7";
  order: number;
}

export interface Stand {
  id: ID;
  fairId: ID;
  number: number;
  coordinate: StandCoordinate;
  status: StandStatus;
  assignedEntrepreneurId?: ID;
  activeRequestId?: ID;
  updatedAt: ISODateTime;
}
```

## StandRequest

```ts
export interface StandRequest {
  id: ID;
  fairId: ID;
  standId: ID;
  entrepreneurId: ID;
  status: StandRequestStatus;
  requestedAt: ISODateTime;
  reviewedAt?: ISODateTime;
  reviewedByDemoRole?: AppRole;
  note?: string;
}
```

## Entrepreneur

```ts
export interface Entrepreneur {
  id: ID;
  displayName: string;
  category: string;
  description: string;
  avatar: MediaReference;
  gallery: MediaReference[];
  externalContacts: ExternalContact[];
  isActive: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
```

## EntrepreneurPost

```ts
export interface EntrepreneurPost {
  id: ID;
  entrepreneurId: ID;
  title: string;
  body: string;
  media: MediaReference[];
  publishedAt: ISODateTime;
  isPublished: boolean;
  isHiddenByModerator: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
```

## Product

```ts
export interface Product {
  id: ID;
  entrepreneurId: ID;
  name: string;
  description?: string;
  priceLabel?: string;
  category: string;
  media: MediaReference[];
  isActive: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
```

`priceLabel` es texto para demo. No construir lógica financiera.

## Tutor

```ts
export interface Tutor {
  id: ID;
  displayName: string;
  description: string;
  avatar: MediaReference;
  modes: TutoringMode[];
  externalContacts: ExternalContact[];
  isActive: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
```

## TutoringOffer

```ts
export interface TutoringOffer {
  id: ID;
  tutorId: ID;
  subject: string;
  description?: string;
  modes: TutoringMode[];
  availabilityLabel?: string;
  isActive: boolean;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
```

## ExternalContact

```ts
export type ExternalContactType =
  | "whatsapp"
  | "telegram"
  | "email"
  | "instagram"
  | "phone"
  | "other";

export interface ExternalContact {
  id: ID;
  type: ExternalContactType;
  label: string;
  value: string;
}
```

## MediaReference

```ts
export type MediaReference =
  | {
      type: "bundled";
      key: string;
    }
  | {
      type: "shared";
      uri: string;
      mimeType?: string;
      fileName?: string;
    };
```

## AppConfiguration

```ts
export interface AppConfiguration {
  schemaVersion: number;
  demoMode: boolean;
  institutionName: string;
  publicAppName: string;
  managementAppName: string;
  defaultTheme: "system" | "light" | "dark";
}
```

## Validaciones

Crear funciones de dominio para:

- verificar que un stand asignado tenga `assignedEntrepreneurId`;
- impedir asignar un stand ya asignado;
- impedir dos solicitudes activas del mismo emprendedor para la misma feria;
- impedir aprobar una solicitud rechazada sin una nueva transición explícita;
- ocultar publicaciones moderadas de la app pública;
- ocultar publicaciones no publicadas;
- ocultar tutores/emprendedores inactivos;
- ordenar feed por prioridad definida + temporalidad;
- filtrar historias expiradas;
- garantizar que una feria solo tenga una fecha próxima coherente.

Las pantallas no implementan estas reglas directamente.
