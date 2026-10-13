import type { Tutor } from "@calpulli/domain";
import { culturalColors, radii, useCalpulliTheme } from "@calpulli/ui";
import { StyleSheet, Text, View } from "react-native";

const TUTOR_ACCENTS = [
  culturalColors.mayaBlue,
  culturalColors.turquoise,
  culturalColors.mexicanPink,
  culturalColors.cempasuchil,
] as const;

export function getTutorAccent(tutor: Tutor): string {
  const hash = [...tutor.displayName].reduce(
    (total, character) => total + (character.codePointAt(0) ?? 0),
    0,
  );
  return TUTOR_ACCENTS[hash % TUTOR_ACCENTS.length] ?? culturalColors.mayaBlue;
}

export function TutorAvatar({ tutor, size = 60 }: { tutor: Tutor; size?: number }) {
  const { theme } = useCalpulliTheme();
  const accent = getTutorAccent(tutor);
  const initials = tutor.displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toLocaleUpperCase("es-MX") ?? "")
    .join("");

  return (
    <View
      accessibilityLabel={`Avatar de ${tutor.displayName}`}
      style={[
        styles.avatar,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: accent,
          borderRadius: Math.min(radii.pill, size / 2),
          height: size,
          width: size,
        },
      ]}
    >
      <Text adjustsFontSizeToFit numberOfLines={1} style={[styles.initials, { color: theme.colors.textPrimary, fontSize: Math.max(12, size * 0.25) }]}>{initials}</Text>
      <View style={[styles.accent, { backgroundColor: accent }]} />
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
  initials: {
    fontWeight: "800",
  },
  accent: {
    bottom: 0,
    height: 5,
    left: 0,
    position: "absolute",
    right: 0,
  },
});
