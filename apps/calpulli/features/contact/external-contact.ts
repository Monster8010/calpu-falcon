import type { ExternalContact } from "@calpulli/domain";

export function getExternalContactUrl(
  contact: ExternalContact,
): string | null {
  const value = contact.value.trim();

  if (value.length === 0) return null;

  switch (contact.type) {
    case "email":
      return `mailto:${value}`;
    case "phone": {
      const phone = value.replace(/[^+\d]/g, "");
      return phone.length > 0 ? `tel:${phone}` : null;
    }
    case "whatsapp": {
      const phone = value.replace(/\D/g, "");
      return phone.length > 0 ? `https://wa.me/${phone}` : null;
    }
    case "telegram": {
      const handle = stripHandle(value);
      return handle.length > 0 ? `https://t.me/${handle}` : null;
    }
    case "instagram": {
      const handle = stripHandle(value);
      return handle.length > 0
        ? `https://www.instagram.com/${handle}`
        : null;
    }
    case "other":
      return /^https?:\/\//i.test(value) ? value : null;
  }
}

function stripHandle(value: string): string {
  return value.replace(/^@+/, "");
}
