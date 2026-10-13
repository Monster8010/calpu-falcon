import { spacing, typography, useCalpulliTheme } from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ManagementDashboardPlaceholder } from "../../features/dashboard/management-dashboard-placeholder";
import { useDemoRole } from "../../features/roles/demo-role-context";
import {
  getDemoRoleDefinition,
  isDemoRole,
} from "../../features/roles/role-definitions";
import { RoleSwitcher } from "../../features/roles/role-switcher";

export default function DemoRoleDashboardScreen() {
  const { theme } = useCalpulliTheme();
  const params = useLocalSearchParams<{ role?: string | string[] }>();
  const rawRole = Array.isArray(params.role) ? params.role[0] : params.role;
  const { isHydrated, role: storedRole, selectRole } = useDemoRole();
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    if (!isHydrated || !isDemoRole(rawRole) || storedRole === rawRole) return;

    void selectRole(rawRole).catch(() => setStorageError(true));
  }, [isHydrated, rawRole, selectRole, storedRole]);

  if (!isDemoRole(rawRole)) {
    return <Redirect href="/roles" />;
  }

  const definition = getDemoRoleDefinition(rawRole);

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <RoleSwitcher definition={definition} onChangeRole={() => router.replace("/roles")} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {storageError ? (
          <View accessibilityRole="alert" style={[styles.notice, { borderColor: theme.colors.warning }]}>
            <Ionicons color={theme.colors.warning} name="information-circle-outline" size={20} />
            <Text style={[styles.noticeText, { color: theme.colors.textPrimary }]}>El perfil funciona en esta sesión, pero no pudo guardarse como último perfil.</Text>
          </View>
        ) : null}
        <ManagementDashboardPlaceholder definition={definition} key={definition.role} />
        <View style={styles.footerSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: spacing.xxl,
    marginHorizontal: "auto",
    maxWidth: 860,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    width: "100%",
  },
  notice: {
    alignItems: "center",
    borderLeftWidth: 3,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md,
  },
  noticeText: {
    ...typography.caption,
    flex: 1,
  },
  footerSpace: {
    height: spacing.xxxl,
  },
});
