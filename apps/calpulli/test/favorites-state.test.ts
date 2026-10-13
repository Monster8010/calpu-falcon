import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  EMPTY_FAVORITES_STATE,
  normalizeFavoritesState,
  reconcileFavoriteIds,
  removeFavoriteId,
  toggleFavoriteId,
} from "../features/favorites/favorites-state";

describe("favoritos locales", () => {
  it("recupera un estado vacío ante datos privados inválidos", () => {
    assert.deepEqual(normalizeFavoritesState(null), EMPTY_FAVORITES_STATE);
    assert.deepEqual(
      normalizeFavoritesState({ institutionalPostIds: "post-1" }),
      EMPTY_FAVORITES_STATE,
    );
  });

  it("descarta IDs inválidos y duplicados", () => {
    assert.deepEqual(
      normalizeFavoritesState({
        institutionalPostIds: ["post-1", "", 42, "post-1", "post-2"],
      }),
      { institutionalPostIds: ["post-1", "post-2"] },
    );
  });

  it("agrega y elimina una publicación sin mutar el estado anterior", () => {
    const initial = { institutionalPostIds: ["post-1"] };
    const added = toggleFavoriteId(initial, "post-2");
    const removed = toggleFavoriteId(added, "post-1");

    assert.deepEqual(initial, { institutionalPostIds: ["post-1"] });
    assert.deepEqual(added, { institutionalPostIds: ["post-1", "post-2"] });
    assert.deepEqual(removed, { institutionalPostIds: ["post-2"] });
  });

  it("quita explícitamente un favorito sin agregarlo por accidente", () => {
    const initial = { institutionalPostIds: ["post-1", "post-2"] };

    assert.deepEqual(removeFavoriteId(initial, "post-1"), {
      institutionalPostIds: ["post-2"],
    });
    assert.deepEqual(removeFavoriteId(initial, "missing"), initial);
  });

  it("limpia referencias que ya no existen en el contenido público", () => {
    const initial = { institutionalPostIds: ["post-1", "orphan", "post-2"] };

    assert.deepEqual(
      reconcileFavoriteIds(initial, new Set(["post-2", "post-1"])),
      { institutionalPostIds: ["post-1", "post-2"] },
    );
    assert.deepEqual(initial, {
      institutionalPostIds: ["post-1", "orphan", "post-2"],
    });
  });
});
