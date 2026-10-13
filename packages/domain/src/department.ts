import type { ExternalContact, ID, ISODateTime } from "./common";

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

