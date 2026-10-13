import { isValidISODateTime, type ISODateTime } from "@calpulli/domain";

const HOUR_IN_MILLISECONDS = 60 * 60 * 1_000;
const DAY_IN_MILLISECONDS = 24 * HOUR_IN_MILLISECONDS;
const WEDNESDAY = 3;
const FAIR_HOUR_UTC = 18;

export interface DemoSeedContext {
  referenceTime: ISODateTime;
  atHours(offset: number): ISODateTime;
  atDays(offset: number): ISODateTime;
  nextFairDate: ISODateTime;
}

function nextWednesdayAtDemoHour(referenceEpoch: number): ISODateTime {
  const reference = new Date(referenceEpoch);
  const candidate = new Date(
    Date.UTC(
      reference.getUTCFullYear(),
      reference.getUTCMonth(),
      reference.getUTCDate(),
      FAIR_HOUR_UTC,
    ),
  );
  const daysUntilWednesday =
    (WEDNESDAY - candidate.getUTCDay() + 7) % 7;

  candidate.setUTCDate(candidate.getUTCDate() + daysUntilWednesday);

  if (candidate.getTime() <= referenceEpoch) {
    candidate.setUTCDate(candidate.getUTCDate() + 7);
  }

  return candidate.toISOString();
}

export function createDemoSeedContext(
  referenceTime: ISODateTime = new Date().toISOString(),
): DemoSeedContext {
  if (!isValidISODateTime(referenceTime)) {
    throw new RangeError(
      "La fecha de referencia del seed debe ser ISO 8601 con zona explícita.",
    );
  }

  const referenceEpoch = new Date(referenceTime).getTime();

  return {
    referenceTime: new Date(referenceEpoch).toISOString(),
    atHours(offset) {
      return new Date(referenceEpoch + offset * HOUR_IN_MILLISECONDS).toISOString();
    },
    atDays(offset) {
      return new Date(referenceEpoch + offset * DAY_IN_MILLISECONDS).toISOString();
    },
    nextFairDate: nextWednesdayAtDemoHour(referenceEpoch),
  };
}
