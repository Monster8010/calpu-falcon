import type { AppRole, ID, ISODateTime } from "./common";

export type StandStatus = "available" | "requested" | "assigned";

export type StandRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";

export type StandBranch = "top" | "from-3" | "from-5" | "from-7";

export interface StandCoordinate {
  row: number;
  column: number;
  branch?: StandBranch;
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

