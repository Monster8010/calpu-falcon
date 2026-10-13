import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DOMAIN_VALIDATION_CODES,
  hasActiveStandRequestForFair,
  isActiveStandRequest,
  isStandRequestTransitionAllowed,
  isStandSelectable,
  validateAssignedStand,
  validateCanCreateStandRequest,
  validateStandCanBeAssigned,
  validateStandRequestApproval,
  validateStandRequestTransition,
  validateUniqueActiveStandRequest,
} from "../src/index";
import {
  createEntrepreneur,
  createStand,
  createStandRequest,
} from "./fixtures";

describe("stands", () => {
  it("exige emprendimiento en un stand asignado", () => {
    const invalid = validateAssignedStand(createStand({ status: "assigned" }));
    const valid = validateAssignedStand(
      createStand({
        status: "assigned",
        assignedEntrepreneurId: "entrepreneur-1",
      }),
    );

    assert.equal(invalid.valid, false);
    assert.equal(
      invalid.issues[0]?.code,
      DOMAIN_VALIDATION_CODES.STAND_ASSIGNED_ENTREPRENEUR_REQUIRED,
    );
    assert.equal(valid.valid, true);
  });

  it("solo permite seleccionar un stand disponible y no reasigna", () => {
    assert.equal(isStandSelectable(createStand()), true);
    assert.equal(isStandSelectable(createStand({ status: "requested" })), false);
    assert.equal(
      isStandSelectable(createStand({ activeRequestId: "request-stale" })),
      false,
    );
    assert.equal(
      validateStandCanBeAssigned(
        createStand({
          status: "assigned",
          assignedEntrepreneurId: "entrepreneur-1",
        }),
      ).valid,
      false,
    );
  });
});

describe("solicitudes de stand", () => {
  it("considera pending y approved como estados activos", () => {
    assert.equal(isActiveStandRequest(createStandRequest()), true);
    assert.equal(
      isActiveStandRequest(createStandRequest({ status: "approved" })),
      true,
    );
    assert.equal(
      isActiveStandRequest(createStandRequest({ status: "rejected" })),
      false,
    );
    assert.equal(
      isActiveStandRequest(createStandRequest({ status: "cancelled" })),
      false,
    );
  });

  it("impide dos solicitudes activas del mismo emprendimiento y feria", () => {
    const existing = [createStandRequest({ id: "request-existing" })];
    const candidate = createStandRequest({ id: "request-candidate" });

    assert.equal(
      hasActiveStandRequestForFair(existing, "entrepreneur-1", "fair-1"),
      true,
    );
    assert.equal(validateUniqueActiveStandRequest(candidate, existing).valid, false);
    assert.equal(
      validateUniqueActiveStandRequest(
        candidate,
        existing.map((request) => ({ ...request, status: "rejected" })),
      ).valid,
      true,
    );
    assert.equal(
      validateUniqueActiveStandRequest(
        { ...candidate, fairId: "fair-2" },
        existing,
      ).valid,
      true,
    );
  });

  it("valida la creación contra disponibilidad, feria y duplicados", () => {
    const valid = validateCanCreateStandRequest({
      stand: createStand(),
      entrepreneurId: "entrepreneur-1",
      fairId: "fair-1",
      existingRequests: [],
    });
    const invalid = validateCanCreateStandRequest({
      stand: createStand({ status: "requested", fairId: "fair-other" }),
      entrepreneurId: "entrepreneur-1",
      fairId: "fair-1",
      existingRequests: [createStandRequest()],
    });

    assert.equal(valid.valid, true);
    assert.deepEqual(
      new Set(invalid.issues.map((issue) => issue.code)),
      new Set([
        DOMAIN_VALIDATION_CODES.STAND_NOT_AVAILABLE,
        DOMAIN_VALIDATION_CODES.STAND_FAIR_MISMATCH,
        DOMAIN_VALIDATION_CODES.ACTIVE_STAND_REQUEST_ALREADY_EXISTS,
      ]),
    );
  });

  it("prohíbe aprobar directamente una solicitud rechazada", () => {
    assert.equal(isStandRequestTransitionAllowed("pending", "approved"), true);
    assert.equal(isStandRequestTransitionAllowed("rejected", "approved"), false);
    assert.equal(isStandRequestTransitionAllowed("rejected", "pending"), true);
    assert.equal(validateStandRequestTransition("rejected", "approved").valid, false);
  });

  it("aprueba solo una solicitud pendiente y consistente", () => {
    const request = createStandRequest();
    const stand = createStand({
      status: "requested",
      activeRequestId: request.id,
    });

    assert.equal(
      validateStandRequestApproval({
        request,
        stand,
        entrepreneur: createEntrepreneur(),
      }).valid,
      true,
    );
  });

  it("detecta estado, asociaciones y emprendimiento inválidos al aprobar", () => {
    const request = createStandRequest({
      status: "rejected",
      standId: "stand-other",
      fairId: "fair-other",
      entrepreneurId: "entrepreneur-other",
    });
    const stand = createStand({
      status: "assigned",
      assignedEntrepreneurId: "entrepreneur-assigned",
      activeRequestId: "request-other",
    });
    const result = validateStandRequestApproval({
      request,
      stand,
      entrepreneur: createEntrepreneur({ isActive: false }),
    });

    assert.equal(result.valid, false);
    assert.deepEqual(
      new Set(result.issues.map((issue) => issue.code)),
      new Set([
        DOMAIN_VALIDATION_CODES.STAND_REQUEST_NOT_PENDING,
        DOMAIN_VALIDATION_CODES.STAND_ALREADY_ASSIGNED,
        DOMAIN_VALIDATION_CODES.STAND_REQUEST_STAND_MISMATCH,
        DOMAIN_VALIDATION_CODES.STAND_REQUEST_FAIR_MISMATCH,
        DOMAIN_VALIDATION_CODES.STAND_REQUEST_ACTIVE_ID_MISMATCH,
        DOMAIN_VALIDATION_CODES.STAND_REQUEST_ENTREPRENEUR_MISMATCH,
        DOMAIN_VALIDATION_CODES.ENTREPRENEUR_INACTIVE,
      ]),
    );
  });
});
