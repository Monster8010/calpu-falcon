import type { ID, ISODateTime, MediaReference } from "./common";

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

