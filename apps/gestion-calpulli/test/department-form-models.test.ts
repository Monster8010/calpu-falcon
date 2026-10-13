import assert from "node:assert/strict";
import test from "node:test";

import type { InstitutionalPost } from "@calpulli/domain";

import {
  DepartmentFormError,
  attachSharedImageToPostDraft,
  createEmptyPostDraft,
  createEmptyStoryDraft,
  toCreatePostInput,
  toCreateStoryInput,
  toDepartmentProfilePatch,
  toUpdatePostPatch,
} from "../features/departments/department-form-models";

const NOW = "2026-08-10T18:30:00.000Z";

function publishedPost(): InstitutionalPost {
  return {
    id: "post-1",
    departmentId: "department-1",
    title: "Aviso anterior",
    body: "Contenido anterior",
    priority: "normal",
    publishedAt: "2026-08-01T12:00:00.000Z",
    media: [],
    views: 12,
    visibility: {
      showDepartment: true,
      showLocation: true,
      showMedia: true,
      showDate: true,
      showViews: true,
    },
    isPublished: true,
    isHiddenByModerator: false,
    createdAt: "2026-08-01T11:00:00.000Z",
    updatedAt: "2026-08-01T12:00:00.000Z",
  };
}

test("construye un aviso urgente publicable con flags y media demo", () => {
  const draft = createEmptyPostDraft();
  draft.title = "  Cambio urgente de aula  ";
  draft.body = "  Consulta el nuevo espacio antes de tu clase.  ";
  draft.priority = "urgent";
  draft.location = " Edificio B ";
  draft.linkUrl = "https://calpulli.demo/aviso";
  draft.mediaKeys = ["posts/demo-comunidad", "posts/demo-servicios"];
  draft.hasDocument = true;
  draft.visibility.showLocation = false;

  const input = toCreatePostInput(draft, "department-gestion-escolar", true, NOW);

  assert.equal(input.title, "Cambio urgente de aula");
  assert.equal(input.body, "Consulta el nuevo espacio antes de tu clase.");
  assert.equal(input.priority, "urgent");
  assert.equal(input.departmentId, "department-gestion-escolar");
  assert.equal(input.publishedAt, NOW);
  assert.equal(input.isPublished, true);
  assert.equal(input.isHiddenByModerator, false);
  assert.equal(input.visibility.showLocation, false);
  assert.deepEqual(input.media, [
    { type: "bundled", key: "posts/demo-comunidad" },
    { type: "bundled", key: "posts/demo-servicios" },
  ]);
  assert.deepEqual(input.document, {
    type: "bundled",
    key: "documents/demo-aviso",
  });
});

test("editar un post publicado conserva su fecha y su moderación", () => {
  const current = { ...publishedPost(), isHiddenByModerator: true };
  const draft = createEmptyPostDraft();
  draft.title = "Título editado";
  draft.body = "Contenido editado";

  const patch = toUpdatePostPatch(draft, current, true, NOW);

  assert.equal(patch.publishedAt, current.publishedAt);
  assert.equal(patch.isPublished, true);
  assert.equal("isHiddenByModerator" in patch, false);
});

test("preserva medios shared que el editor demo no reemplaza", () => {
  const draft = createEmptyPostDraft();
  draft.title = "Aviso con archivo previo";
  draft.body = "Conserva una referencia que ya existe.";
  draft.preservedMedia = [{ type: "shared", uri: "content://calpulli/media/1" }];
  draft.mediaKeys = ["posts/demo-comunidad"];

  const input = toCreatePostInput(draft, "department-1", false, NOW);

  assert.deepEqual(input.media, [
    { type: "shared", uri: "content://calpulli/media/1" },
    { type: "bundled", key: "posts/demo-comunidad" },
  ]);
  assert.equal(input.isPublished, false);
});

test("sólo persiste la imagen seleccionada después de copiarla al directorio compartido", () => {
  const draft = createEmptyPostDraft();
  draft.title = "Aviso con imagen real";
  draft.body = "La selección local todavía no debe entrar al JSON.";
  draft.pendingSharedImage = {
    uri: "file:///picker/temporary.jpg",
    fileName: "temporary.jpg",
    mimeType: "image/jpeg",
  };

  assert.deepEqual(
    toCreatePostInput(draft, "department-1", true, NOW).media,
    [],
  );

  const attached = attachSharedImageToPostDraft(draft, {
    type: "shared",
    uri: "content://calpulli/media/persisted.jpg",
    fileName: "persisted.jpg",
    mimeType: "image/jpeg",
  });
  const input = toCreatePostInput(attached, "department-1", true, NOW);

  assert.equal(attached.pendingSharedImage, undefined);
  assert.deepEqual(input.media, [
    {
      type: "shared",
      uri: "content://calpulli/media/persisted.jpg",
      fileName: "persisted.jpg",
      mimeType: "image/jpeg",
    },
  ]);
});

test("crea una historia con vigencia exacta y exige texto", () => {
  const draft = createEmptyStoryDraft();
  draft.body = "Recordatorio para la comunidad";
  draft.durationHours = 12;

  const input = toCreateStoryInput(draft, "department-1", NOW);

  assert.equal(input.startsAt, NOW);
  assert.equal(input.expiresAt, "2026-08-11T06:30:00.000Z");
  assert.equal(input.isActive, true);
  assert.equal(input.views, 0);

  const empty = createEmptyStoryDraft();
  assert.throws(
    () => toCreateStoryInput(empty, "department-1", NOW),
    DepartmentFormError,
  );
});

test("normaliza el perfil y rechaza enlaces no web", () => {
  assert.deepEqual(
    toDepartmentProfilePatch({
      name: "  Biblioteca  ",
      shortName: "  Biblio  ",
      description: "  Recursos universitarios  ",
    }),
    {
      name: "Biblioteca",
      shortName: "Biblio",
      description: "Recursos universitarios",
    },
  );

  const draft = createEmptyPostDraft();
  draft.title = "Enlace inválido";
  draft.body = "No debe aceptar un esquema inseguro.";
  draft.linkUrl = "javascript:alert(1)";
  assert.throws(
    () => toCreatePostInput(draft, "department-1", true, NOW),
    DepartmentFormError,
  );
});
