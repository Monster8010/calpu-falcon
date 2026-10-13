import type { ID } from "../common";
import type { Entrepreneur } from "../entrepreneur";
import type {
  Stand,
  StandRequest,
  StandRequestStatus,
} from "../stand";
import { isStandSelectable, validateStandCanBeAssigned } from "./stand";
import {
  createValidationResult,
  DOMAIN_VALIDATION_CODES,
  type DomainValidationIssue,
  type DomainValidationResult,
} from "./validation";

export const ACTIVE_STAND_REQUEST_STATUSES: readonly StandRequestStatus[] = [
  "pending",
  "approved",
];

const ALLOWED_STAND_REQUEST_TRANSITIONS: Readonly<
  Record<StandRequestStatus, readonly StandRequestStatus[]>
> = {
  pending: ["approved", "rejected", "cancelled"],
  approved: ["cancelled"],
  rejected: ["pending"],
  cancelled: ["pending"],
};

export function isActiveStandRequest(request: StandRequest): boolean {
  return ACTIVE_STAND_REQUEST_STATUSES.includes(request.status);
}

export function hasActiveStandRequestForFair(
  requests: readonly StandRequest[],
  entrepreneurId: ID,
  fairId: ID,
  excludingRequestId?: ID,
): boolean {
  return requests.some(
    (request) =>
      request.id !== excludingRequestId &&
      request.entrepreneurId === entrepreneurId &&
      request.fairId === fairId &&
      isActiveStandRequest(request),
  );
}

export function validateUniqueActiveStandRequest(
  candidate: StandRequest,
  existingRequests: readonly StandRequest[],
): DomainValidationResult {
  if (
    !isActiveStandRequest(candidate) ||
    !hasActiveStandRequestForFair(
      existingRequests,
      candidate.entrepreneurId,
      candidate.fairId,
      candidate.id,
    )
  ) {
    return createValidationResult([]);
  }

  return createValidationResult([
    {
      code: DOMAIN_VALIDATION_CODES.ACTIVE_STAND_REQUEST_ALREADY_EXISTS,
      message:
        "El emprendimiento ya tiene una solicitud activa para esta feria.",
    },
  ]);
}

export interface CreateStandRequestValidationInput {
  stand: Stand;
  entrepreneurId: ID;
  fairId: ID;
  existingRequests: readonly StandRequest[];
}

export function validateCanCreateStandRequest({
  stand,
  entrepreneurId,
  fairId,
  existingRequests,
}: CreateStandRequestValidationInput): DomainValidationResult {
  const issues: DomainValidationIssue[] = [];

  if (!isStandSelectable(stand)) {
    issues.push({
      code: DOMAIN_VALIDATION_CODES.STAND_NOT_AVAILABLE,
      message: "Solo se puede solicitar un stand disponible.",
      path: "stand.status",
    });
  }

  if (stand.fairId !== fairId) {
    issues.push({
      code: DOMAIN_VALIDATION_CODES.STAND_FAIR_MISMATCH,
      message: "El stand no pertenece a la feria indicada.",
      path: "stand.fairId",
    });
  }

  if (hasActiveStandRequestForFair(existingRequests, entrepreneurId, fairId)) {
    issues.push({
      code: DOMAIN_VALIDATION_CODES.ACTIVE_STAND_REQUEST_ALREADY_EXISTS,
      message:
        "El emprendimiento ya tiene una solicitud activa para esta feria.",
    });
  }

  return createValidationResult(issues);
}

export function isStandRequestTransitionAllowed(
  currentStatus: StandRequestStatus,
  nextStatus: StandRequestStatus,
): boolean {
  return (
    currentStatus === nextStatus ||
    ALLOWED_STAND_REQUEST_TRANSITIONS[currentStatus].includes(nextStatus)
  );
}

export function validateStandRequestTransition(
  currentStatus: StandRequestStatus,
  nextStatus: StandRequestStatus,
): DomainValidationResult {
  if (isStandRequestTransitionAllowed(currentStatus, nextStatus)) {
    return createValidationResult([]);
  }

  return createValidationResult([
    {
      code: DOMAIN_VALIDATION_CODES.STAND_REQUEST_TRANSITION_INVALID,
      message: `La transición ${currentStatus} → ${nextStatus} no está permitida.`,
      path: "status",
    },
  ]);
}

export interface StandRequestApprovalValidationInput {
  request: StandRequest;
  stand: Stand;
  entrepreneur: Entrepreneur | undefined;
}

export function validateStandRequestApproval({
  request,
  stand,
  entrepreneur,
}: StandRequestApprovalValidationInput): DomainValidationResult {
  const issues: DomainValidationIssue[] = [];

  if (request.status !== "pending") {
    issues.push({
      code: DOMAIN_VALIDATION_CODES.STAND_REQUEST_NOT_PENDING,
      message: "Solo se puede aprobar una solicitud pendiente.",
      path: "request.status",
    });
  }

  issues.push(...validateStandCanBeAssigned(stand).issues);

  if (request.standId !== stand.id) {
    issues.push({
      code: DOMAIN_VALIDATION_CODES.STAND_REQUEST_STAND_MISMATCH,
      message: "La solicitud no corresponde al stand indicado.",
      path: "request.standId",
    });
  }

  if (request.fairId !== stand.fairId) {
    issues.push({
      code: DOMAIN_VALIDATION_CODES.STAND_REQUEST_FAIR_MISMATCH,
      message: "La solicitud y el stand pertenecen a ferias distintas.",
      path: "request.fairId",
    });
  }

  if (
    stand.activeRequestId !== undefined &&
    stand.activeRequestId !== request.id
  ) {
    issues.push({
      code: DOMAIN_VALIDATION_CODES.STAND_REQUEST_ACTIVE_ID_MISMATCH,
      message: "El stand está vinculado a otra solicitud activa.",
      path: "stand.activeRequestId",
    });
  }

  if (entrepreneur === undefined) {
    issues.push({
      code: DOMAIN_VALIDATION_CODES.ENTREPRENEUR_NOT_FOUND,
      message: "No existe el emprendimiento de la solicitud.",
      path: "request.entrepreneurId",
    });
  } else {
    if (request.entrepreneurId !== entrepreneur.id) {
      issues.push({
        code: DOMAIN_VALIDATION_CODES.STAND_REQUEST_ENTREPRENEUR_MISMATCH,
        message: "La solicitud no corresponde al emprendimiento indicado.",
        path: "request.entrepreneurId",
      });
    }

    if (!entrepreneur.isActive) {
      issues.push({
        code: DOMAIN_VALIDATION_CODES.ENTREPRENEUR_INACTIVE,
        message: "El emprendimiento de la solicitud está inactivo.",
        path: "entrepreneur.isActive",
      });
    }
  }

  return createValidationResult(issues);
}

