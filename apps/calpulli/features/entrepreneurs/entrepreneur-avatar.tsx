import type { Entrepreneur } from "@calpulli/domain";
import {
  culturalColors,
  radii,
  useCalpulliTheme,
} from "@calpulli/ui";
import { StyleSheet, Text, View } from "react-native";

const ENTREPRENEUR_ACCENTS = [
  culturalColors.jade,
  culturalColors.turquoise,
  culturalColors.mayaBlue,
  culturalColors.mexicanPink,
  culturalColors.cempasuchil,
] as const;

export function getEntrepreneurAccent(entrepreneur?: Entrepreneur): string {
  const source = entrepreneur?.category ?? entrepreneur?.displayName ?? "Calpulli";
  const hash = [...source].reduce(
    (total, character) => total + (character.codePointAt(0) ?? 0),
    0,
  );
  return ENTREPRENEUR_ACCENTS[hash % ENTREPRENEUR_ACCENTS.length] ?? culturalColors.jade;
}

function monogram(entrepreneur?: Entrepreneur): string {
  const source = entrepreneur?.displayName ?? "Calpulli";
  return source
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toLocaleUpperCase("es-MX") ?? "")
    .join("");
}

export interface EntrepreneurAvatarProps {
  entrepreneur?: Entrepreneur;
  size?: number;
}

export function EntrepreneurAvatar({
  entrepreneur,
  size = 56,
}: EntrepreneurAvatarProps) {
  const { theme } = useCalpulliTheme();
  const accent = getEntrepreneurAccent(entrepreneur);

  return (
    <View
      accessibilityLabel={
        entrepreneur ? `Avatar de ${entrepreneur.displayName}` : "Avatar Calpulli"
      }
      style={[
        styles.avatar,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: accent,
          borderRadius: Math.min(radii.md, size / 3),
          height: size,
          width: size,
        },
      ]}
    >
      <Text
        adjustsFontSizeToFit
        numberOfLines={1}
        style={[
          styles.monogram,
          { color: theme.colors.textPrimary, fontSize: Math.max(11, size * 0.28) },
        ]}
      >
        {monogram(entrepreneur)}
      </Text>
      <View style={[styles.step, { backgroundColor: accent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    borderWidth: 2,
    justifyContent: "center",
    overflow: "hidden",
  },
  monogram: {
    fontWeight: "800",
  },
  step: {
    bottom: 0,
    height: 4,
    left: "32%",
    position: "absolute",
    width: "68%",
  },
});
