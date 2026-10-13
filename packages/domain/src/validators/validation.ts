export const DOMAIN_VALIDATION_CODES = {
  ACTIVE_STAND_REQUEST_ALREADY_EXISTS:
    "standRequest.activeRequestAlreadyExists",
  ENTREPRENEUR_INACTIVE: "entrepreneur.inactive",
  ENTREPRENEUR_NOT_FOUND: "entrepreneur.notFound",
  FAIR_NEXT_DATE_INVALID: "fair.nextDate.invalid",
  FAIR_NEXT_DATE_NOT_FUTURE: "fair.nextDate.notFuture",
  FAIR_RECURRENCE_DAYS_INVALID: "fair.recurrenceHintDays.invalid",
  FAIR_RECURRENCE_WEEKDAY_INVALID: "fair.recurrenceHintWeekday.invalid",
  REFERENCE_DATE_TIME_INVALID: "dateTime.reference.invalid",
  STAND_ALREADY_ASSIGNED: "stand.alreadyAssigned",
  STAND_ASSIGNED_ENTREPRENEUR_REQUIRED:
    "stand.assignedEntrepreneur.required",
  STAND_FAIR_MISMATCH: "stand.fair.mismatch",
  STAND_NOT_AVAILABLE: "stand.notAvailable",
  STAND_REQUEST_ACTIVE_ID_MISMATCH: "standRequest.activeId.mismatch",
  STAND_REQUEST_ENTREPRENEUR_MISMATCH:
    "standRequest.entrepreneur.mismatch",
  STAND_REQUEST_FAIR_MISMATCH: "standRequest.fair.mismatch",
  STAND_REQUEST_NOT_PENDING: "standRequest.notPending",
  STAND_REQUEST_STAND_MISMATCH: "standRequest.stand.mismatch",
  STAND_REQUEST_TRANSITION_INVALID: "standRequest.transition.invalid",
  STORY_EXPIRY_INVALID: "story.expiresAt.invalid",
  STORY_INTERVAL_INVALID: "story.interval.invalid",
  STORY_START_INVALID: "story.startsAt.invalid",
} as const;

export type DomainValidationCode =
  (typeof DOMAIN_VALIDATION_CODES)[keyof typeof DOMAIN_VALIDATION_CODES];

export interface DomainValidationIssue {
  code: DomainValidationCode;
  message: string;
  path?: string;
}

export interface DomainValidationResult {
  valid: boolean;
  issues: readonly DomainValidationIssue[];
}

export function createValidationResult(
  issues: readonly DomainValidationIssue[],
): DomainValidationResult {
  return {
    valid: issues.length === 0,
    issues,
  };
}

