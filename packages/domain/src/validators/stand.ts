import type { Stand } from "../stand";
import {
  createValidationResult,
  DOMAIN_VALIDATION_CODES,
  type DomainValidationIssue,
  type DomainValidationResult,
} from "./validation";

export function validateAssignedStand(
  stand: Stand,
): DomainValidationResult {
  const issues: DomainValidationIssue[] = [];

  if (stand.status === "assigned" && !stand.assignedEntrepreneurId) {
    issues.push({
      code: DOMAIN_VALIDATION_CODES.STAND_ASSIGNED_ENTREPRENEUR_REQUIRED,
      message: "Un stand asignado debe tener un emprendimiento asociado.",
      path: "assignedEntrepreneurId",
    });
  }

  return createValidationResult(issues);
}

export function validateStandCanBeAssigned(
  stand: Stand,
): DomainValidationResult {
  const issues: DomainValidationIssue[] = [];

  if (stand.status === "assigned" || stand.assignedEntrepreneurId !== undefined) {
    issues.push({
      code: DOMAIN_VALIDATION_CODES.STAND_ALREADY_ASSIGNED,
      message: "El stand ya está asignado.",
      path: "status",
    });
  }

  return createValidationResult(issues);
}

export function isStandSelectable(stand: Stand): boolean {
  return (
    stand.status === "available" &&
    stand.assignedEntrepreneurId === undefined &&
    stand.activeRequestId === undefined
  );
}
