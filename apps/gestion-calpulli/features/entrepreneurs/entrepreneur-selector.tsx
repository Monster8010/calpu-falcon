import type { Entrepreneur } from "@calpulli/domain";
import {
  AppHeader,
  Badge,
  Button,
  Card,
  Skeleton,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { InlineNotice } from "../forms/management-form-controls";
import { EntrepreneurAvatar } from "./entrepreneur-avatar";
import { getEntrepreneurAccent } from "./entrepreneur-presentation";

export function EntrepreneurSelector({
  entrepreneurs,
  error,
  isLoading,
  onRetry,
  onSelect,
}: {
  entrepreneurs: Entrepreneur[] | null;
  error: string | null;
  isLoading: boolean;
  onRetry(): void;
  onSelect(entrepreneur: Entrepreneur): void;
}) {
  const { theme } = useCalpulliTheme();

  return (
    <View style={styles.container}>
      <AppHeader
        eyebrow="Perfil Emprendedor · Modo demo"
        subtitle="Elige un emprendimiento ficticio. No representa una cuenta, identidad ni sesión real."
        title="Elegir emprendimiento demo"
      />
      <View style={styles.contextRow}>
        <Badge label={`${entrepreneurs?.length ?? "—"} perfiles ficticios`} tone="accent" />
        <Text style={[styles.contextCopy, { color: theme.colors.textSecondary }]}>Podrás editar su escaparate y solicitar una mesa.</Text>
      </View>

      {error ? (
        <View style={styles.errorBlock}>
          <InlineNotice message={error} />
          <Button label="Reintentar" onPress={onRetry} variant="secondary" />
        </View>
      ) : null}

      {isLoading && entrepreneurs === null ? (
        <View style={styles.list}>
          {[0, 1, 2, 3].map((item) => <Skeleton height={138} key={item} radius="md" />)}
        </View>
      ) : (
        <View accessibilityLabel="Emprendimientos de demostración" style={styles.list}>
          {entrepreneurs?.map((entrepreneur) => (
            <Pressable
              accessibilityHint="Abre las herramientas de este emprendimiento"
              accessibilityLabel={entrepreneur.displayName}
              accessibilityRole="button"
              key={entrepreneur.id}
              onPress={() => onSelect(entrepreneur)}
              style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
            >
              <Card style={[styles.card, { borderLeftColor: getEntrepreneurAccent(entrepreneur) }]}>
                <EntrepreneurAvatar entrepreneur={entrepreneur} size={62} />
                <View style={styles.copy}>
                  <Text style={[styles.name, { color: theme.colors.textPrimary }]}>{entrepreneur.displayName}</Text>
                  <Text style={[styles.category, { color: theme.colors.primary }]}>{entrepreneur.category}</Text>
                  <Text numberOfLines={2} style={[styles.description, { color: theme.colors.textSecondary }]}>{entrepreneur.description}</Text>
                </View>
                <Ionicons color={theme.colors.primary} name="chevron-forward" size={22} />
              </Card>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xxl },
  contextRow: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  contextCopy: { ...typography.body, flex: 1, minWidth: 220 },
  errorBlock: { gap: spacing.md },
  list: { gap: spacing.md },
  pressable: { width: "100%" },
  card: { alignItems: "center", borderLeftWidth: 4, flexDirection: "row", gap: spacing.md, minHeight: 138 },
  copy: { flex: 1, gap: spacing.xs },
  name: { ...typography.heading },
  category: { ...typography.label },
  description: { ...typography.body },
  pressed: { opacity: 0.68, transform: [{ scale: 0.995 }] },
});
