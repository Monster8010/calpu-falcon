import type { ID, ISODateTime } from "./common";

export type FairStatus = "upcoming" | "active";

export interface Fair {
  id: ID;
  name: string;
  status: FairStatus;
  nextDate: ISODateTime;
  activatedAt?: ISODateTime;
  endedAt?: ISODateTime;
  recurrenceHintDays: number;
  /** JavaScript weekday convention: Sunday = 0, Wednesday = 3, Saturday = 6. */
  recurrenceHintWeekday: number;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

