import type { ID, ISODateTime, MediaReference } from "./common";

export type PostPriority = "normal" | "featured" | "important" | "urgent";

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

