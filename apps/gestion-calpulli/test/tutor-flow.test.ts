import assert from "node:assert/strict";
import test from "node:test";

import type { SharedCalpulliState } from "@calpulli/domain";
import { createDemoSeed } from "@calpulli/mock-data";
import {
  createRepositories,
  type SharedStateStore,
} from "@calpulli/repositories";

import {
  createEmptyTutoringOfferDraft,
  toCreateTutoringOfferInput,
} from "../features/tutors/tutor-form-models";

const NOW = "2026-08-10T18:30:00.000Z";
const TUTOR_ID = "tutor-ana-torres";

function createMemoryStore(initial: SharedCalpulliState): SharedStateStore {
  let state = structuredClone(initial);
  return {
    async readState() {
      return structuredClone(state);
    },
    async mutateSharedState(operation) {
      const draft = structuredClone(state);
      state = operation(draft) ?? draft;
      return structuredClone(state);
    },
  };
}

test("editar materia y contacto queda visible para la consulta pública", async () => {
  const repositories = createRepositories(createMemoryStore(createDemoSeed(NOW)), {
    now: () => NOW,
  });
  const offer = (await repositories.tutors.listOffers(TUTOR_ID))[0];
  const tutor = await repositories.tutors.getById(TUTOR_ID);
  assert.ok(offer);
  assert.ok(tutor);

  await repositories.tutors.update(TUTOR_ID, {
    modes: ["online", "in-person"],
    externalContacts: [{
      id: tutor.externalContacts[0]?.id ?? "contact-stage-14",
      type: "email",
      label: "Correo de tutoría",
      value: "ana.tutora@calpulli.demo",
    }],
  });
  await repositories.tutors.updateOffer(offer.id, {
    subject: "Matemáticas Discretas",
    modes: ["online"],
    availabilityLabel: "Viernes por la tarde",
    isActive: true,
  });

  const publicTutor = (await repositories.tutors.listPublic()).find(({ id }) => id === TUTOR_ID);
  const publicOffer = (await repositories.tutors.listPublicOffers(TUTOR_ID)).find(({ id }) => id === offer.id);
  assert.equal(publicTutor?.externalContacts[0]?.value, "ana.tutora@calpulli.demo");
  assert.deepEqual(publicTutor?.modes, ["online", "in-person"]);
  assert.equal(publicOffer?.subject, "Matemáticas Discretas");
  assert.equal(publicOffer?.availabilityLabel, "Viernes por la tarde");
});

test("crear, desactivar y eliminar materia conserva la visibilidad pública", async () => {
  let nextId = 0;
  const repositories = createRepositories(createMemoryStore(createDemoSeed(NOW)), {
    createId: (prefix) => `${prefix}-stage-14-${++nextId}`,
    now: () => NOW,
  });
  const draft = createEmptyTutoringOfferDraft();
  draft.subject = "Arquitectura de Computadoras";
  draft.description = "Repaso conceptual de demostración.";
  draft.modes = ["hybrid"];
  draft.availabilityLabel = "Horario a acordar";
  const created = await repositories.tutors.createOffer(
    toCreateTutoringOfferInput(draft, TUTOR_ID),
  );
  assert.equal((await repositories.tutors.listPublicOffers(TUTOR_ID)).some(({ id }) => id === created.id), true);

  await repositories.tutors.updateOffer(created.id, { isActive: false });
  assert.equal((await repositories.tutors.listPublicOffers(TUTOR_ID)).some(({ id }) => id === created.id), false);
  await repositories.tutors.deleteOffer(created.id);
  assert.equal(await repositories.tutors.getOfferById(created.id), undefined);
});

test("un tutor inactivo y sus materias desaparecen de Tutorías públicas", async () => {
  const repositories = createRepositories(createMemoryStore(createDemoSeed(NOW)), {
    now: () => NOW,
  });
  await repositories.tutors.update(TUTOR_ID, { isActive: false });
  assert.equal((await repositories.tutors.listPublic()).some(({ id }) => id === TUTOR_ID), false);
  assert.equal((await repositories.tutors.listPublicOffers(TUTOR_ID)).length, 0);
});
