import type { AppRole } from "@calpulli/domain";
import {
  AppHeader,
  Badge,
  Screen,
  Skeleton,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useDemoRole } from "../../features/roles/demo-role-context";
import { RoleSelector } from "../../features/roles/role-selector";

export default function DemoRoleSelectorScreen() {
  const { theme } = useCalpulliTheme();
  const { isHydrated, role, selectRole } = useDemoRole();
  const [busyRole, setBusyRole] = useState<AppRole | null>(null);

  const chooseRole = async (nextRole: AppRole) => {
    setBusyRole(nextRole);
    await selectRole(nextRole).catch(() => undefined);
    setBusyRole(null);
    if (nextRole === "superadmin") {
      router.replace("/roles/superadmin");
    } else if (nextRole === "department") {
      router.replace("/roles/department");
    } else if (nextRole === "fair-admin") {
      router.replace("/roles/fair-admin");
    } else if (nextRole === "entrepreneur") {
      router.replace("/roles/entrepreneur");
    } else if (nextRole === "tutor") {
      router.replace("/roles/tutor");
    } else if (nextRole === "moderator") {
      router.replace("/roles/moderator");
    } else {
      router.replace({ pathname: "/roles/[role]", params: { role: nextRole } });
    }
  };

  return (
    <Screen contentStyle={styles.content} edges={["top", "bottom", "left", "right"]}>
      <AppHeader
        eyebrow="Gestión UPIICSA Calpulli"
        subtitle="Elige una vista para continuar. Puedes cambiarla en cualquier momento sin reiniciar la app."
        title="Selecciona un perfil de demostración"
      />
      <View style={styles.modeRow}>
        <Badge label="Modo demostración" tone="accent" />
        <Text style={[styles.modeCopy, { color: theme.colors.textSecondary }]}>No solicita usuario, contraseña ni datos personales.</Text>
      </View>
      {isHydrated ? (
        <RoleSelector busyRole={busyRole} currentRole={role} onSelect={(nextRole) => void chooseRole(nextRole)} />
      ) : (
        <View style={styles.skeletons}>
          {[0, 1, 2].map((item) => <Skeleton height={132} key={item} radius="md" />)}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xxl,
    marginHorizontal: "auto",
    maxWidth: 860,
    width: "100%",
  },
  modeRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  modeCopy: {
    ...typography.body,
    flex: 1,
    minWidth: 220,
  },
  skeletons: {
    gap: spacing.md,
  },
});
