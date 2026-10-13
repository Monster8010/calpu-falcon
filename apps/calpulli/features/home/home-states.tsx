import {
  AppHeader,
  Button,
  Card,
  EmptyState,
  Screen,
  Skeleton,
  radii,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

export function HomeLoadingState() {
  return (
    <Screen contentStyle={styles.loadingContent}>
      <AppHeader
        subtitle="Avisos, historias y novedades de la comunidad universitaria."
        title="Inicio"
      />
      <View style={styles.loadingSection}>
        <Skeleton height={24} width="35%" />
        <View style={styles.loadingRail}>
          <Skeleton height={46} radius="pill" width={112} />
          <Skeleton height={46} radius="pill" width={148} />
        </View>
      </View>
      <View style={styles.loadingRail}>
        <Skeleton height={78} radius="pill" width={78} />
        <Skeleton height={78} radius="pill" width={78} />
        <Skeleton height={78} radius="pill" width={78} />
      </View>
      {[0, 1].map((item) => (
        <Card key={item} style={styles.skeletonCard}>
          <View style={styles.loadingRail}>
            <Skeleton height={42} width={42} />
            <Skeleton height={38} width="55%" />
          </View>
          <Skeleton height={26} width="78%" />
          <Skeleton height={72} />
          <Skeleton height={160} radius="md" />
        </Card>
      ))}
    </Screen>
  );
}

export function HomeErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry(): void;
}) {
  const { theme } = useCalpulliTheme();

  return (
    <Screen contentStyle={styles.errorContent}>
      <AppHeader title="Inicio" />
      <EmptyState
        action={<Button label="Intentar de nuevo" onPress={onRetry} />}
        description={message}
        illustration={<Ionicons color={theme.colors.danger} name="cloud-offline-outline" size={42} />}
        title="No pudimos cargar los avisos"
      />
    </Screen>
  );
}

export function InlineNotice({
  message,
  tone = "danger",
}: {
  message: string;
  tone?: "danger" | "warning";
}) {
  const { theme } = useCalpulliTheme();
  const color = tone === "danger" ? theme.colors.danger : theme.colors.warning;

  return (
    <View
      accessibilityRole="alert"
      style={[
        styles.notice,
        {
          backgroundColor: theme.colors.surfaceMuted,
          borderColor: color,
        },
      ]}
    >
      <Ionicons
        color={color}
        name={tone === "danger" ? "alert-circle-outline" : "information-circle-outline"}
        size={20}
      />
      <Text style={[styles.noticeText, { color: theme.colors.textPrimary }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContent: {
    gap: spacing.xxl,
    marginHorizontal: "auto",
    maxWidth: 760,
    width: "100%",
  },
  loadingSection: {
    gap: spacing.md,
  },
  loadingRail: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  skeletonCard: {
    gap: spacing.lg,
  },
  errorContent: {
    gap: spacing.xxl,
    marginHorizontal: "auto",
    maxWidth: 680,
    width: "100%",
  },
  notice: {
    alignItems: "center",
    borderLeftWidth: 3,
    borderRadius: radii.sm,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md,
  },
  noticeText: {
    ...typography.caption,
    flex: 1,
  },
});
