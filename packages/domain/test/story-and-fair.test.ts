import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DOMAIN_VALIDATION_CODES,
  filterVisibleStories,
  getCountdown,
  isStoryVisibleAt,
  validateFairNextDate,
  validateStorySchedule,
} from "../src/index";
import {
  createFair,
  createStory,
  REFERENCE_TIME,
} from "./fixtures";

describe("historias", () => {
  it("usa inicio inclusivo y expiración exclusiva", () => {
    const story = createStory();

    assert.equal(isStoryVisibleAt(story, story.startsAt), true);
    assert.equal(isStoryVisibleAt(story, story.expiresAt), false);
    assert.equal(
      isStoryVisibleAt(story, "2026-08-10T10:59:59.999Z"),
      false,
    );
  });

  it("excluye historias inactivas, futuras y expiradas", () => {
    const stories = [
      createStory({ id: "visible" }),
      createStory({ id: "inactive", isActive: false }),
      createStory({
        id: "future",
        startsAt: "2026-08-10T13:00:00.000Z",
        expiresAt: "2026-08-10T14:00:00.000Z",
      }),
      createStory({
        id: "expired",
        startsAt: "2026-08-10T09:00:00.000Z",
        expiresAt: "2026-08-10T10:00:00.000Z",
      }),
    ];

    assert.deepEqual(
      filterVisibleStories(stories, REFERENCE_TIME).map((story) => story.id),
      ["visible"],
    );
  });

  it("rechaza intervalos inválidos", () => {
    const result = validateStorySchedule(
      createStory({
        startsAt: "2026-08-10T13:00:00.000Z",
        expiresAt: "2026-08-10T12:00:00.000Z",
      }),
    );

    assert.equal(result.valid, false);
    assert.ok(
      result.issues.some(
        (issue) => issue.code === DOMAIN_VALIDATION_CODES.STORY_INTERVAL_INVALID,
      ),
    );
  });
});

describe("próxima fecha de feria", () => {
  it("calcula countdown sin valores negativos", () => {
    assert.deepEqual(
      getCountdown(
        "2026-08-11T14:03:04.000Z",
        "2026-08-10T12:00:00.000Z",
      ),
      {
        days: 1,
        hours: 2,
        minutes: 3,
        seconds: 4,
        totalMilliseconds: 93_784_000,
        isElapsed: false,
      },
    );
    assert.deepEqual(
      getCountdown(
        "2026-08-10T11:00:00.000Z",
        "2026-08-10T12:00:00.000Z",
      ),
      {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalMilliseconds: 0,
        isElapsed: true,
      },
    );
  });

  it("rechaza fechas inválidas al calcular countdown", () => {
    assert.equal(getCountdown("fecha", REFERENCE_TIME), null);
  });

  it("acepta una próxima fecha futura y sugerencias coherentes", () => {
    assert.equal(validateFairNextDate(createFair(), REFERENCE_TIME).valid, true);
  });

  it("rechaza una feria upcoming con fecha alcanzada o pasada", () => {
    const result = validateFairNextDate(
      createFair({ nextDate: REFERENCE_TIME }),
      REFERENCE_TIME,
    );

    assert.equal(result.valid, false);
    assert.ok(
      result.issues.some(
        (issue) =>
          issue.code === DOMAIN_VALIDATION_CODES.FAIR_NEXT_DATE_NOT_FUTURE,
      ),
    );
  });

  it("permite que una feria active conserve una fecha ya alcanzada", () => {
    const result = validateFairNextDate(
      createFair({ status: "active", nextDate: "2026-08-10T10:00:00.000Z" }),
      REFERENCE_TIME,
    );

    assert.equal(result.valid, true);
  });

  it("valida ISO, días positivos y weekday 0–6", () => {
    const result = validateFairNextDate(
      createFair({
        nextDate: "fecha-inválida",
        recurrenceHintDays: 0,
        recurrenceHintWeekday: 7,
      }),
      REFERENCE_TIME,
    );

    assert.deepEqual(
      new Set(result.issues.map((issue) => issue.code)),
      new Set([
        DOMAIN_VALIDATION_CODES.FAIR_NEXT_DATE_INVALID,
        DOMAIN_VALIDATION_CODES.FAIR_RECURRENCE_DAYS_INVALID,
        DOMAIN_VALIDATION_CODES.FAIR_RECURRENCE_WEEKDAY_INVALID,
      ]),
    );
  });
});
