import type { Entrepreneur } from "@calpulli/domain";
import { radii, typography, useCalpulliTheme } from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import {
  getEntrepreneurMonogram,
} from "./entrepreneur-models";
import { getEntrepreneurAccent } from "./entrepreneur-presentation";

export function EntrepreneurAvatar({
  entrepreneur,
  size = 64,
}: {
  entrepreneur: Entrepreneur;
  size?: number;
}) {
  const { theme } = useCalpulliTheme();
  const accent = getEntrepreneurAccent(entrepreneur);
  const sticker = entrepreneur.avatar.type === "bundled";

  return (
    <View
      accessibilityLabel={`Avatar de ${entrepreneur.displayName}`}
      style={[
        styles.avatar,
        {
          backgroundColor: theme.colors.surfaceMuted,
          borderColor: accent,
          borderRadius: size >= 64 ? radii.lg : radii.md,
          height: size,
          width: size,
        },
      ]}
    >
      {sticker ? <Ionicons color={accent} name="sparkles" size={Math.round(size * 0.34)} /> : null}
      <Text style={[styles.monogram, { color: accent, fontSize: Math.max(12, size * 0.2) }]}>
        {getEntrepreneurMonogram(entrepreneur)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    borderWidth: 2,
    justifyContent: "center",
  },
  monogram: {
    ...typography.label,
    fontWeight: "900",
  },
});
