export type ID = string;
export type ISODateTime = string;

export type AppRole =
  | "superadmin"
  | "fair-admin"
  | "department"
  | "entrepreneur"
  | "tutor"
  | "moderator";

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

export type SharedWriter = "calpulli" | "gestion-calpulli";

