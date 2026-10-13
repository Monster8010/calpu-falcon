import type { ID, ISODateTime, MediaReference } from "./common";

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

