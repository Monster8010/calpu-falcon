import assert from "node:assert/strict";
import test from "node:test";

import { createDemoSeed } from "@calpulli/mock-data";

import {
  createEmptyTutoringOfferDraft,
  createTutorProfileDraft,
  toCreateTutoringOfferInput,
  toTutorProfilePatch,
  toUpdateTutoringOfferPatch,
} from "../features/tutors/tutor-form-models";
import {
  getTutorMetrics,
  sortTutoringOffers,
} from "../features/tutors/tutor-models";

const NOW = "2026-08-10T18:00:00.000Z";

test("normaliza perfil, modalidades y contacto conservando avatar compartido", () => {
  const tutor = createDemoSeed(NOW).tutors[0];
  assert.ok(tutor);
  tutor.avatar = { type: "shared", uri: "content://calpulli/tutor-avatar" };
  const draft = createTutorProfileDraft(tutor);
  draft.displayName = "  Ana Torres Demo ";
  draft.modes = ["online", "online", "in-person"];
  draft.contacts[0]!.label = " Telegram ";
  draft.contacts[0]!.value = " @ana_nueva ";

  const patch = toTutorProfilePatch(draft);
  assert.equal(patch.displayName, "Ana Torres Demo");
  assert.deepEqual(patch.avatar, { type: "shared", uri: "content://calpulli/tutor-avatar" });
  assert.deepEqual(patch.modes, ["online", "in-person"]);
  assert.equal(patch.externalContacts?.[0]?.value, "@ana_nueva");
});

test("perfil exige modalidad y contactos completos", () => {
  const tutor = createDemoSeed(NOW).tutors[0];
  assert.ok(tutor);
  const withoutMode = createTutorProfileDraft(tutor);
  withoutMode.modes = [];
  assert.throws(() => toTutorProfilePatch(withoutMode), /al menos una modalidad/i);

  const withoutContactValue = createTutorProfileDraft(tutor);
  withoutContactValue.contacts[0]!.value = "";
  assert.throws(() => toTutorProfilePatch(withoutContactValue), /valor del contacto 1/i);
});

test("crea materia con disponibilidad textual y modalidades únicas", () => {
  const draft = createEmptyTutoringOfferDraft();
  draft.subject = "  Matemáticas Discretas ";
  draft.description = "  Práctica guiada ";
  draft.availabilityLabel = "  Viernes por la tarde ";
  draft.modes = ["online", "hybrid", "online"];
  const input = toCreateTutoringOfferInput(draft, "tutor-ana-torres");

  assert.equal(input.subject, "Matemáticas Discretas");
  assert.equal(input.description, "Práctica guiada");
  assert.equal(input.availabilityLabel, "Viernes por la tarde");
  assert.deepEqual(input.modes, ["online", "hybrid"]);
  assert.equal(input.isActive, true);
});

test("materia exige nombre y modalidad", () => {
  const draft = createEmptyTutoringOfferDraft();
  assert.throws(() => toUpdateTutoringOfferPatch(draft), /materia es obligatorio/i);
  draft.subject = "Estadística";
  draft.modes = [];
  assert.throws(() => toUpdateTutoringOfferPatch(draft), /al menos una modalidad/i);
});

test("ordena materias activas primero y resume el perfil", () => {
  const seed = createDemoSeed(NOW);
  const tutor = seed.tutors[0];
  assert.ok(tutor);
  const offers = seed.tutoringOffers
    .filter(({ tutorId }) => tutorId === tutor.id)
    .map((offer, index) => ({ ...offer, isActive: index !== 0 }));
  const sorted = sortTutoringOffers(offers);

  assert.equal(sorted[0]?.isActive, true);
  assert.deepEqual(getTutorMetrics(tutor, offers), {
    offers: offers.length,
    activeOffers: offers.length - 1,
    contacts: tutor.externalContacts.length,
  });
});
