import type {
  ExternalContact,
  ID,
  ISODateTime,
  MediaReference,
} from "./common";

export type TutoringMode = "in-person" | "online" | "hybrid";

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

