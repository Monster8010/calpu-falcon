import type { Tutor } from "@calpulli/domain";
import { radii, typography, useCalpulliTheme } from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import { getTutorMonogram } from "./tutor-models";
import { getManagementTutorAccent } from "./tutor-presentation";

export function ManagementTutorAvatar({ tutor, size = 64 }: { tutor: Tutor; size?: number }) {
  const { theme } = useCalpulliTheme();
  const accent = getManagementTutorAccent(tutor);
  return (
    <View
      accessibilityLabel={`Avatar de ${tutor.displayName}`}
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
      <Ionicons color={accent} name="school-outline" size={Math.round(size * 0.34)} />
      <Text style={[styles.initials, { color: accent, fontSize: Math.max(12, size * 0.19) }]}>{getTutorMonogram(tutor)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: "center", borderWidth: 2, justifyContent: "center" },
  initials: { ...typography.label, fontWeight: "900" },
});
