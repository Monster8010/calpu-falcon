import assert from "node:assert/strict";
import test from "node:test";

import type { AppRole } from "@calpulli/domain";

import {
  DEMO_ROLE_DEFINITIONS,
  getDemoRoleDefinition,
  isDemoRole,
} from "../features/roles/role-definitions";

const EXPECTED_ROLES: readonly AppRole[] = [
  "superadmin",
  "fair-admin",
  "department",
  "entrepreneur",
  "tutor",
  "moderator",
];

test("el selector cubre exactamente los seis perfiles de demostración", () => {
  assert.deepEqual(
    DEMO_ROLE_DEFINITIONS.map(({ role }) => role),
    EXPECTED_ROLES,
  );
  assert.equal(new Set(DEMO_ROLE_DEFINITIONS.map(({ role }) => role)).size, 6);
});

test("cada perfil ofrece una identidad y áreas placeholder consistentes", () => {
  for (const role of EXPECTED_ROLES) {
    const definition = getDemoRoleDefinition(role);

    assert.equal(definition.role, role);
    assert.ok(definition.label.length > 0);
    assert.ok(definition.summary.length > 0);
    assert.equal(definition.areas.length, 3);
    assert.equal(new Set(definition.areas.map(({ title }) => title)).size, 3);

    for (const area of definition.areas) {
      assert.ok(area.title.length > 0);
      assert.ok(area.description.length > 0);
    }
  }
});

test("el guard acepta sólo roles del contrato de la demo", () => {
  for (const role of EXPECTED_ROLES) assert.equal(isDemoRole(role), true);

  for (const invalidRole of ["admin", "student", "", null, undefined, 3]) {
    assert.equal(isDemoRole(invalidRole), false);
  }
});
