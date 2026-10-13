import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  compareISODateTimesDescending,
  isValidISODateTime,
  toEpochMilliseconds,
  type SharedCalpulliState,
} from "../src/index";

describe("contratos compartidos", () => {
  it("modela el estado interoperable completo sin favoritos locales", () => {
    const state: SharedCalpulliState = {
      meta: {
        schemaVersion: 1,
        revision: 0,
        createdAt: "2026-08-10T12:00:00.000Z",
        updatedAt: "2026-08-10T12:00:00.000Z",
        lastWriter: "gestion-calpulli",
      },
      departments: [],
      institutionalPosts: [],
      stories: [],
      fairs: [],
      stands: [],
      standRequests: [],
      entrepreneurs: [],
      entrepreneurPosts: [],
      products: [],
      tutors: [],
      tutoringOffers: [],
      configuration: {
        schemaVersion: 1,
        demoMode: true,
        institutionName: "UPIICSA",
        publicAppName: "UPIICSA Calpulli",
        managementAppName: "Gestión UPIICSA Calpulli",
        defaultTheme: "system",
      },
    };

    assert.equal(state.meta.lastWriter, "gestion-calpulli");
    assert.equal("favorites" in state, false);
  });
});

describe("fechas ISO 8601", () => {
  it("acepta Z y offsets explícitos", () => {
    assert.equal(isValidISODateTime("2026-08-10T12:00:00.000Z"), true);
    assert.equal(isValidISODateTime("2026-08-10T06:00:00-06:00"), true);
  });

  it("rechaza hora local ambigua y fechas imposibles", () => {
    assert.equal(isValidISODateTime("2026-08-10T12:00:00"), false);
    assert.equal(isValidISODateTime("2026-02-30T12:00:00.000Z"), false);
    assert.equal(toEpochMilliseconds("no-es-fecha"), null);
  });

  it("compara instantes por epoch y ordena los más nuevos primero", () => {
    assert.equal(
      compareISODateTimesDescending(
        "2026-08-10T12:00:00.000Z",
        "2026-08-10T06:00:00-06:00",
      ),
      0,
    );
    assert.ok(
      compareISODateTimesDescending(
        "2026-08-10T13:00:00.000Z",
        "2026-08-10T12:00:00.000Z",
      ) < 0,
    );
  });
});

