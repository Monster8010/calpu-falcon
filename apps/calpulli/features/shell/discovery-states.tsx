import {
  AppHeader,
  Button,
  Card,
  EmptyState,
  Screen,
  Skeleton,
  spacing,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View } from "react-native";

export function DiscoveryLoadingState({
  subtitle,
  title,
}: {
  subtitle: string;
  title: string;
}) {
  return (
    <Screen contentStyle={styles.content} scroll={false}>
      <AppHeader subtitle={subtitle} title={title} />
      <Skeleton height={52} radius="sm" />
      <View style={styles.rail}>
        <Skeleton height={44} radius="pill" width={100} />
        <Skeleton height={44} radius="pill" width={140} />
      </View>
      {[0, 1].map((item) => (
        <Card key={item} style={styles.card}>
          <Skeleton height={140} radius="sm" />
          <Skeleton height={28} width="68%" />
          <Skeleton height={52} />
        </Card>
      ))}
    </Screen>
  );
}

export function DiscoveryErrorState({
  message,
  onRetry,
  title,
}: {
  message: string;
  onRetry(): void;
  title: string;
}) {
  const { theme } = useCalpulliTheme();

  return (
    <Screen contentStyle={styles.content}>
      <AppHeader title={title} />
      <EmptyState
        action={<Button label="Intentar de nuevo" onPress={onRetry} />}
        description={message}
        illustration={<Ionicons color={theme.colors.danger} name="cloud-offline-outline" size={48} />}
        title={`No pudimos cargar ${title.toLocaleLowerCase("es-MX")}`}
      />
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
  rail: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  card: {
    gap: spacing.lg,
  },
});
