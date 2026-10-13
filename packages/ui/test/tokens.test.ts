import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { culturalColors } from "../src/tokens/colors";
import { radii } from "../src/tokens/radii";
import { spacing } from "../src/tokens/spacing";
import { typography } from "../src/tokens/typography";
import { darkTheme, lightTheme } from "../src/theme/themes";

describe("design tokens", () => {
  it("mantiene la escala de espaciado documentada", () => {
    assert.deepEqual(Object.values(spacing), [4, 8, 12, 16, 20, 24, 32]);
  });

  it("define jerarquía tipográfica y radios centralizados", () => {
    assert.ok(typography.display.fontSize > typography.title.fontSize);
    assert.ok(typography.title.fontSize > typography.body.fontSize);
    assert.ok(radii.sm < radii.md);
    assert.equal(radii.pill, 999);
  });

  it("ofrece temas semánticos distintos sin invertir ciegamente", () => {
    assert.notEqual(lightTheme.colors.background, darkTheme.colors.background);
    assert.notEqual(lightTheme.colors.surface, darkTheme.colors.surface);
    assert.equal(lightTheme.colors.primary, "#126B57");
    assert.equal(darkTheme.colors.primary, "#5DD2B1");
    assert.equal(culturalColors.bone, "#F6F0E4");
    assert.notEqual(lightTheme.colors.success, lightTheme.colors.successMuted);
    assert.notEqual(lightTheme.colors.warning, lightTheme.colors.warningMuted);
    assert.notEqual(lightTheme.colors.danger, lightTheme.colors.dangerMuted);
    assert.notEqual(lightTheme.colors.focusMuted, darkTheme.colors.focusMuted);
  });
});
