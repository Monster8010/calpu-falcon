import type { Department } from "@calpulli/domain";
import {
  AppHeader,
  Badge,
  Button,
  Card,
  Skeleton,
  radii,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { InlineNotice } from "../forms/management-form-controls";
import {
  getDepartmentAccent,
  getDepartmentMonogram,
} from "./department-presentation";

export function DepartmentSelector({
  departments,
  error,
  isLoading,
  onRetry,
  onSelect,
}: {
  departments: Department[] | null;
  error: string | null;
  isLoading: boolean;
  onRetry(): void;
  onSelect(department: Department): void;
}) {
  const { theme } = useCalpulliTheme();

  return (
    <View style={styles.container}>
      <AppHeader
        eyebrow="Perfil Departamento · Modo demo"
        subtitle="Cada opción utiliza datos ficticios del almacenamiento compartido. No representa una cuenta ni una sesión real."
        title="Elegir departamento demo"
      />
      <View style={styles.contextRow}>
        <Badge label={`${departments?.length ?? "—"} perfiles ficticios`} tone="accent" />
        <Text style={[styles.contextCopy, { color: theme.colors.textSecondary }]}>Podrás editar su perfil, publicaciones e historias.</Text>
      </View>

      {error ? (
        <View style={styles.errorBlock}>
          <InlineNotice message={error} />
          <Button label="Reintentar" onPress={onRetry} variant="secondary" />
        </View>
      ) : null}

      {isLoading && departments === null ? (
        <View style={styles.grid}>
          {[0, 1, 2, 3].map((item) => <Skeleton height={132} key={item} radius="md" />)}
        </View>
      ) : (
        <View accessibilityLabel="Departamentos de demostración" style={styles.grid}>
          {departments?.map((department) => {
            const accent = getDepartmentAccent(department);
            return (
              <Pressable
                accessibilityHint="Abre las herramientas de este departamento"
                accessibilityLabel={department.name}
                accessibilityRole="button"
                key={department.id}
                onPress={() => onSelect(department)}
                style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
              >
                <Card style={[styles.card, { borderLeftColor: accent }]}>
                  <View style={[styles.logo, { backgroundColor: theme.colors.surfaceMuted, borderColor: accent }]}>
                    <Text style={[styles.monogram, { color: accent }]}>{getDepartmentMonogram(department)}</Text>
                  </View>
                  <View style={styles.copy}>
                    <Text style={[styles.name, { color: theme.colors.textPrimary }]}>{department.name}</Text>
                    <Text numberOfLines={2} style={[styles.description, { color: theme.colors.textSecondary }]}>{department.description ?? "Perfil institucional de demostración."}</Text>
                  </View>
                  <Ionicons color={theme.colors.primary} name="chevron-forward" size={22} />
                </Card>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xxl,
  },
  contextRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  contextCopy: {
    ...typography.body,
    flex: 1,
    minWidth: 220,
  },
  errorBlock: {
    gap: spacing.md,
  },
  grid: {
    gap: spacing.md,
  },
  pressable: {
    width: "100%",
  },
  card: {
    alignItems: "center",
    borderLeftWidth: 4,
    flexDirection: "row",
    gap: spacing.md,
    minHeight: 132,
  },
  logo: {
    alignItems: "center",
    borderRadius: radii.sm,
    borderWidth: 1,
    height: 58,
    justifyContent: "center",
    width: 58,
  },
  monogram: {
    ...typography.heading,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    ...typography.heading,
  },
  description: {
    ...typography.body,
  },
  pressed: {
    opacity: 0.68,
    transform: [{ scale: 0.995 }],
  },
});
