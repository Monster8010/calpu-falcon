import type {
  ExternalContact,
  ID,
  ISODateTime,
  MediaReference,
} from "./common";

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

