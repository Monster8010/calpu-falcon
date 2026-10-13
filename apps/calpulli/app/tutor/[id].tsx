import { Button, EmptyState, Skeleton, spacing, useCalpulliTheme } from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { InlineNotice } from "../../features/home/home-states";
import { DetailHeader } from "../../features/shell/detail-header";
import { TutorProfileView } from "../../features/tutoring/tutor-profile-view";
import { useRefreshOnForeground } from "../../hooks/use-refresh-on-foreground";
import { useTutorProfile } from "../../hooks/use-tutoring-data";

export default function TutorProfileScreen() {
  const { theme } = useCalpulliTheme();
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const tutorId = Array.isArray(params.id) ? params.id[0] ?? "" : params.id ?? "";
  const { data, error, isLoading, isRefreshing, refresh } = useTutorProfile(tutorId);

  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));
  const refreshOnForeground = useCallback(() => { void refresh(); }, [refresh]);
  useRefreshOnForeground(refreshOnForeground);

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl colors={[theme.colors.primary]} onRefresh={() => void refresh()} refreshing={isRefreshing} tintColor={theme.colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <DetailHeader eyebrow="Tutorías Calpulli" title="Perfil de tutor" />
        {isLoading && data === null ? (
          <View style={styles.skeleton}>
            <Skeleton height={210} radius="md" />
            <Skeleton height={72} radius="sm" />
            <Skeleton height={180} radius="md" />
          </View>
        ) : data === null ? (
          <EmptyState
            action={<Button label="Intentar de nuevo" onPress={() => void refresh()} />}
            description={error ?? "El tutor solicitado ya no está disponible."}
            illustration={<Ionicons color={theme.colors.danger} name="school-outline" size={48} />}
            title="No encontramos este perfil"
          />
        ) : (
          <>
            {error ? <InlineNotice message={error} tone="warning" /> : null}
            <TutorProfileView profile={data} />
          </>
        )}
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
    maxWidth: 760,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    width: "100%",
  },
  skeleton: { gap: spacing.xxl },
  footerSpace: { height: spacing.xxxl },
});
