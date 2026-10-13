import {
  AppHeader,
  Badge,
  Card,
  Screen,
  culturalColors,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";

type IoniconName = ComponentProps<typeof Ionicons>["name"];
type AccentName =
  | "jade"
  | "turquoise"
  | "mayaBlue"
  | "mexicanPink"
  | "cempasuchil";

export interface PlaceholderTabProps {
  accent: AccentName;
  description: string;
  icon: IoniconName;
  title: string;
}

export function PlaceholderTab({
  accent,
  description,
  icon,
  title,
}: PlaceholderTabProps) {
  const { theme } = useCalpulliTheme();
  const accentColor = culturalColors[accent];

  return (
    <Screen contentStyle={styles.content}>
      <AppHeader
        subtitle="El shell público ya está listo para recibir información compartida."
        title={title}
      />

      <Card elevated style={styles.card}>
        <View style={styles.visual}>
          <View
            style={[
              styles.iconWell,
              { backgroundColor: theme.colors.primaryMuted },
            ]}
          >
            <Ionicons color={theme.colors.primary} name={icon} size={42} />
          </View>
          <View style={styles.steps}>
            <View style={[styles.stepLong, { backgroundColor: accentColor }]} />
            <View style={[styles.stepMedium, { backgroundColor: accentColor }]} />
            <View style={[styles.stepShort, { backgroundColor: accentColor }]} />
          </View>
        </View>

        <View style={styles.copy}>
          <Badge label="Vista preparada" tone="accent" />
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            {description}
          </Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary }]}>
            La navegación y el tema están activos. El contenido funcional se
            incorporará en su etapa correspondiente.
          </Text>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xxl,
    marginHorizontal: "auto",
    maxWidth: 760,
    width: "100%",
  },
  card: {
    gap: spacing.xxl,
    minHeight: 330,
  },
  visual: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconWell: {
    alignItems: "center",
    borderRadius: 24,
    height: 84,
    justifyContent: "center",
    width: 84,
  },
  steps: {
    alignItems: "flex-end",
    gap: spacing.xs,
    opacity: 0.82,
  },
  stepLong: {
    height: 8,
    width: 88,
  },
  stepMedium: {
    height: 8,
    width: 64,
  },
  stepShort: {
    height: 8,
    width: 40,
  },
  copy: {
    gap: spacing.md,
  },
  title: {
    ...typography.heading,
  },
  body: {
    ...typography.body,
  },
});
