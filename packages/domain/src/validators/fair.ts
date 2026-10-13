import type { ISODateTime } from "../common";
import { toEpochMilliseconds } from "../date-time";
import type { Fair } from "../fair";
import {
  createValidationResult,
  DOMAIN_VALIDATION_CODES,
  type DomainValidationIssue,
  type DomainValidationResult,
} from "./validation";

export function validateFairNextDate(
  fair: Fair,
  referenceTime: ISODateTime,
): DomainValidationResult {
  const issues: DomainValidationIssue[] = [];
  const nextDate = toEpochMilliseconds(fair.nextDate);
  const referenceTimestamp = toEpochMilliseconds(referenceTime);

  if (nextDate === null) {
    issues.push({
      code: DOMAIN_VALIDATION_CODES.FAIR_NEXT_DATE_INVALID,
      message: "La próxima fecha de feria no es ISO 8601 válida.",
      path: "nextDate",
    });
  }

  if (referenceTimestamp === null) {
    issues.push({
      code: DOMAIN_VALIDATION_CODES.REFERENCE_DATE_TIME_INVALID,
      message: "La fecha de referencia no es ISO 8601 válida.",
    });
  }

  if (
    fair.status === "upcoming" &&
    nextDate !== null &&
    referenceTimestamp !== null &&
    nextDate <= referenceTimestamp
  ) {
    issues.push({
      code: DOMAIN_VALIDATION_CODES.FAIR_NEXT_DATE_NOT_FUTURE,
      message: "Una feria próxima debe tener una fecha futura.",
      path: "nextDate",
    });
  }

  if (
    !Number.isInteger(fair.recurrenceHintDays) ||
    fair.recurrenceHintDays <= 0
  ) {
    issues.push({
      code: DOMAIN_VALIDATION_CODES.FAIR_RECURRENCE_DAYS_INVALID,
      message: "La sugerencia de recurrencia debe ser un entero positivo.",
      path: "recurrenceHintDays",
    });
  }

  if (
    !Number.isInteger(fair.recurrenceHintWeekday) ||
    fair.recurrenceHintWeekday < 0 ||
    fair.recurrenceHintWeekday > 6
  ) {
    issues.push({
      code: DOMAIN_VALIDATION_CODES.FAIR_RECURRENCE_WEEKDAY_INVALID,
      message: "El día sugerido debe estar entre 0 y 6.",
      path: "recurrenceHintWeekday",
    });
  }

  return createValidationResult(issues);
}

