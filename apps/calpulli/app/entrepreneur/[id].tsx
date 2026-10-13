import {
  Button,
  EmptyState,
  Skeleton,
  spacing,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EntrepreneurProfileView } from "../../features/entrepreneurs/entrepreneur-profile-view";
import { InlineNotice } from "../../features/home/home-states";
import { DetailHeader } from "../../features/shell/detail-header";
import { useEntrepreneurProfileData } from "../../hooks/use-entrepreneur-profile-data";
import { useRefreshOnForeground } from "../../hooks/use-refresh-on-foreground";

export default function EntrepreneurProfileScreen() {
  const { theme } = useCalpulliTheme();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const entrepreneurId = Array.isArray(params.id) ? params.id[0] ?? "" : params.id ?? "";
  const { data, error, isLoading, isRefreshing, refresh } = useEntrepreneurProfileData(entrepreneurId);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );
  const refreshOnForeground = useCallback(() => {
    void refresh();
  }, [refresh]);
  useRefreshOnForeground(refreshOnForeground);

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            colors={[theme.colors.primary]}
            onRefresh={() => void refresh()}
            refreshing={isRefreshing}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <DetailHeader eyebrow="Feria Calpulli" title="Emprendimiento" />
        {isLoading && data === null ? (
          <ProfileSkeleton />
        ) : data === null ? (
          <EmptyState
            action={<Button label="Intentar de nuevo" onPress={() => void refresh()} />}
            description={error ?? "El perfil solicitado no está disponible."}
            illustration={<Ionicons color={theme.colors.danger} name="storefront-outline" size={48} />}
            title="No encontramos este emprendimiento"
          />
        ) : (
          <>
            {error ? <InlineNotice message={error} tone="warning" /> : null}
            <EntrepreneurProfileView {...data} />
          </>
        )}
        <View style={styles.footerSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileSkeleton() {
  return (
    <View style={styles.skeleton}>
      <Skeleton height={190} radius="md" />
      <Skeleton height={28} width="42%" />
      <View style={styles.skeletonRow}>
        <Skeleton height={150} radius="md" width="48%" />
        <Skeleton height={150} radius="md" width="48%" />
      </View>
      <Skeleton height={180} radius="md" />
    </View>
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
    maxWidth: 760,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    width: "100%",
  },
  skeleton: {
    gap: spacing.xxl,
  },
  skeletonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerSpace: {
    height: spacing.xxxl,
  },
});
