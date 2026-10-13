import {
  isValidISODateTime,
  type Fair,
  type Stand,
  type StandRequest,
} from "@calpulli/domain";

export interface FairAdminSummary {
  assigned: number;
  available: number;
  pendingRequests: number;
  requested: number;
  stands: number;
}

export class FairAdminDateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FairAdminDateError";
  }
}

export function selectFairForAdministration(
  fairs: readonly Fair[],
): Fair | undefined {
  const active = fairs.find(({ status }) => status === "active");
  if (active !== undefined) return active;

  return [...fairs]
    .filter(({ status }) => status === "upcoming")
    .sort((left, right) => {
      const difference = Date.parse(left.nextDate) - Date.parse(right.nextDate);
      if (difference !== 0) return difference;
      return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
    })[0];
}

export function getFairAdminSummary(
  stands: readonly Stand[],
  requests: readonly StandRequest[],
): FairAdminSummary {
  return {
    stands: stands.length,
    available: stands.filter(({ status }) => status === "available").length,
    requested: stands.filter(({ status }) => status === "requested").length,
    assigned: stands.filter(({ status }) => status === "assigned").length,
    pendingRequests: requests.filter(({ status }) => status === "pending").length,
  };
}

export function normalizeFutureFairDate(
  value: Date | string,
  referenceTime: string,
): string {
  const date = value instanceof Date ? value : new Date(value);
  const reference = new Date(referenceTime);

  if (
    Number.isNaN(date.getTime()) ||
    Number.isNaN(reference.getTime()) ||
    !isValidISODateTime(date.toISOString())
  ) {
    throw new FairAdminDateError("Selecciona una fecha y hora válidas.");
  }

  if (date.getTime() <= reference.getTime()) {
    throw new FairAdminDateError("La próxima feria debe quedar en el futuro.");
  }

  return date.toISOString();
}

export function suggestNextFairDate(
  fair: Pick<Fair, "nextDate" | "recurrenceHintDays" | "recurrenceHintWeekday">,
  referenceTime: string,
): string {
  const configured = Date.parse(fair.nextDate);
  const reference = Date.parse(referenceTime);

  if (
    !Number.isFinite(configured) ||
    !Number.isFinite(reference) ||
    !Number.isInteger(fair.recurrenceHintDays) ||
    fair.recurrenceHintDays <= 0 ||
    !Number.isInteger(fair.recurrenceHintWeekday) ||
    fair.recurrenceHintWeekday < 0 ||
    fair.recurrenceHintWeekday > 6
  ) {
    throw new FairAdminDateError("No se pudo calcular la siguiente fecha sugerida.");
  }

  const candidate = new Date(Math.max(configured, reference));
  candidate.setUTCDate(candidate.getUTCDate() + fair.recurrenceHintDays);
  const daysUntilTarget =
    (fair.recurrenceHintWeekday - candidate.getUTCDay() + 7) % 7;
  candidate.setUTCDate(candidate.getUTCDate() + daysUntilTarget);

  return normalizeFutureFairDate(candidate, referenceTime);
}

const REQUEST_STATUS_ORDER: Readonly<Record<StandRequest["status"], number>> = {
  pending: 0,
  approved: 1,
  rejected: 2,
  cancelled: 3,
};

export function sortFairRequests(
  requests: readonly StandRequest[],
): StandRequest[] {
  return [...requests].sort((left, right) => {
    const statusDifference =
      REQUEST_STATUS_ORDER[left.status] - REQUEST_STATUS_ORDER[right.status];
    if (statusDifference !== 0) return statusDifference;
    const dateDifference = Date.parse(right.requestedAt) - Date.parse(left.requestedAt);
    if (dateDifference !== 0) return dateDifference;
    return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
  });
}

export function formatFairDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha no disponible";
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
}
