import { toEpochMilliseconds } from "../date-time";
import type { ISODateTime } from "../common";
import type { Story } from "../story";
import {
  createValidationResult,
  DOMAIN_VALIDATION_CODES,
  type DomainValidationIssue,
  type DomainValidationResult,
} from "./validation";

export function validateStorySchedule(story: Story): DomainValidationResult {
  const issues: DomainValidationIssue[] = [];
  const startsAt = toEpochMilliseconds(story.startsAt);
  const expiresAt = toEpochMilliseconds(story.expiresAt);

  if (startsAt === null) {
    issues.push({
      code: DOMAIN_VALIDATION_CODES.STORY_START_INVALID,
      message: "La fecha de inicio de la historia no es ISO 8601 válida.",
      path: "startsAt",
    });
  }

  if (expiresAt === null) {
    issues.push({
      code: DOMAIN_VALIDATION_CODES.STORY_EXPIRY_INVALID,
      message: "La fecha de expiración de la historia no es ISO 8601 válida.",
      path: "expiresAt",
    });
  }

  if (startsAt !== null && expiresAt !== null && expiresAt <= startsAt) {
    issues.push({
      code: DOMAIN_VALIDATION_CODES.STORY_INTERVAL_INVALID,
      message: "La historia debe expirar después de iniciar.",
      path: "expiresAt",
    });
  }

  return createValidationResult(issues);
}

export function isStoryVisibleAt(
  story: Story,
  referenceTime: ISODateTime,
): boolean {
  if (!story.isActive || !validateStorySchedule(story).valid) {
    return false;
  }

  const referenceTimestamp = toEpochMilliseconds(referenceTime);
  const startsAt = toEpochMilliseconds(story.startsAt);
  const expiresAt = toEpochMilliseconds(story.expiresAt);

  return (
    referenceTimestamp !== null &&
    startsAt !== null &&
    expiresAt !== null &&
    startsAt <= referenceTimestamp &&
    referenceTimestamp < expiresAt
  );
}

export function filterVisibleStories(
  stories: readonly Story[],
  referenceTime: ISODateTime,
): Story[] {
  return stories.filter((story) => isStoryVisibleAt(story, referenceTime));
}

