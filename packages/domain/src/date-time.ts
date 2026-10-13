import type { ISODateTime } from "./common";

const ISO_DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,9}))?(Z|[+-](\d{2}):(\d{2}))$/;

function compareStringsAscending(left: string, right: string): number {
  if (left === right) {
    return 0;
  }

  return left < right ? -1 : 1;
}

function hasValidCalendarParts(match: RegExpExecArray): boolean {
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  const offsetHour = match[9] === undefined ? 0 : Number(match[9]);
  const offsetMinute = match[10] === undefined ? 0 : Number(match[10]);

  if (month < 1 || month > 12) {
    return false;
  }

  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  return (
    day >= 1 &&
    day <= daysInMonth &&
    hour >= 0 &&
    hour <= 23 &&
    minute >= 0 &&
    minute <= 59 &&
    second >= 0 &&
    second <= 59 &&
    offsetHour >= 0 &&
    offsetHour <= 23 &&
    offsetMinute >= 0 &&
    offsetMinute <= 59
  );
}

export function toEpochMilliseconds(value: unknown): number | null {
  if (typeof value !== "string") {
    return null;
  }

  const match = ISO_DATE_TIME_PATTERN.exec(value);

  if (match === null || !hasValidCalendarParts(match)) {
    return null;
  }

  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function isValidISODateTime(value: unknown): value is ISODateTime {
  return toEpochMilliseconds(value) !== null;
}

/** Comparator that places valid, newest timestamps first and invalid values last. */
export function compareISODateTimesDescending(
  left: ISODateTime,
  right: ISODateTime,
): number {
  const leftTimestamp = toEpochMilliseconds(left);
  const rightTimestamp = toEpochMilliseconds(right);

  if (leftTimestamp === null && rightTimestamp === null) {
    return compareStringsAscending(left, right);
  }

  if (leftTimestamp === null) {
    return 1;
  }

  if (rightTimestamp === null) {
    return -1;
  }

  return rightTimestamp - leftTimestamp;
}
