import type { ISODateTime, SharedWriter } from "./common";
import type { AppConfiguration } from "./configuration";
import type { Department } from "./department";
import type { Entrepreneur } from "./entrepreneur";
import type { Fair } from "./fair";
import type { InstitutionalPost } from "./institutional-post";
import type { EntrepreneurPost, Product } from "./marketplace";
import type { Stand, StandRequest } from "./stand";
import type { Story } from "./story";
import type { Tutor, TutoringOffer } from "./tutor";

export interface SharedMeta {
  schemaVersion: number;
  revision: number;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  lastWriter: SharedWriter;
}

export interface SharedCalpulliState {
  meta: SharedMeta;
  departments: Department[];
  institutionalPosts: InstitutionalPost[];
  stories: Story[];
  fairs: Fair[];
  stands: Stand[];
  standRequests: StandRequest[];
  entrepreneurs: Entrepreneur[];
  entrepreneurPosts: EntrepreneurPost[];
  products: Product[];
  tutors: Tutor[];
  tutoringOffers: TutoringOffer[];
  configuration: AppConfiguration;
}

