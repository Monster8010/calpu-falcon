import type { AppRole } from "@calpulli/domain";
import { spacing, typography, useCalpulliTheme } from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import type { ReactNode } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getDemoRoleDefinition } from "./role-definitions";
import { RoleSwitcher } from "./role-switcher";

export interface ManagementRoleFrameProps {
  backLabel?: string;
  children: ReactNode;
  onBack?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  role: AppRole;
}

export function ManagementRoleFrame({
  backLabel,
  children,
  onBack,
  onRefresh,
  refreshing = false,
  role,
}: ManagementRoleFrameProps) {
  const { theme } = useCalpulliTheme();
  const definition = getDemoRoleDefinition(role);

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <RoleSwitcher definition={definition} onChangeRole={() => router.replace("/roles")} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={onRefresh ? (
          <RefreshControl colors={[theme.colors.primary]} onRefresh={onRefresh} refreshing={refreshing} tintColor={theme.colors.primary} />
        ) : undefined}
        showsVerticalScrollIndicator={false}
      >
        {onBack ? (
          <Pressable
            accessibilityLabel={backLabel ?? "Volver"}
            accessibilityRole="button"
            hitSlop={8}
            onPress={onBack}
            style={({ pressed }) => [styles.back, pressed && styles.pressed]}
          >
            <Ionicons color={theme.colors.primary} name="arrow-back" size={20} />
            <Text style={[styles.backLabel, { color: theme.colors.primary }]}>{backLabel ?? "Volver"}</Text>
          </Pressable>
        ) : null}
        {children}
        <View style={styles.footerSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: {
    flexGrow: 1,
    gap: spacing.xxl,
    marginHorizontal: "auto",
    maxWidth: 900,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    width: "100%",
  },
  back: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 36,
  },
  backLabel: { ...typography.label },
  pressed: { opacity: 0.62 },
  footerSpace: { height: spacing.xxxl },
});
