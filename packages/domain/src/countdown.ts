import type { ISODateTime } from "./common";
import { toEpochMilliseconds } from "./date-time";

const SECOND_MS = 1_000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMilliseconds: number;
  isElapsed: boolean;
}

export function getCountdown(
  target: ISODateTime,
  referenceTime: ISODateTime,
): CountdownParts | null {
  const targetTimestamp = toEpochMilliseconds(target);
  const referenceTimestamp = toEpochMilliseconds(referenceTime);

  if (targetTimestamp === null || referenceTimestamp === null) {
    return null;
  }

  const rawDifference = targetTimestamp - referenceTimestamp;
  const totalMilliseconds = Math.max(0, rawDifference);
  let remaining = totalMilliseconds;
  const days = Math.floor(remaining / DAY_MS);
  remaining -= days * DAY_MS;
  const hours = Math.floor(remaining / HOUR_MS);
  remaining -= hours * HOUR_MS;
  const minutes = Math.floor(remaining / MINUTE_MS);
  remaining -= minutes * MINUTE_MS;
  const seconds = Math.floor(remaining / SECOND_MS);

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMilliseconds,
    isElapsed: rawDifference <= 0,
  };
}
