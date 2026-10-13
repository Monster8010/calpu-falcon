import type { Department, ID } from "@calpulli/domain";
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
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { InlineNotice } from "../../features/home/home-states";
import { InstitutionalPostCard } from "../../features/home/institutional-post-card";
import { useFavorites } from "../../hooks/use-favorites";
import { useFavoritesData } from "../../hooks/use-favorites-data";
import { useRefreshOnForeground } from "../../hooks/use-refresh-on-foreground";

export default function FavoritesTab() {
  const { theme } = useCalpulliTheme();
  const resource = useFavoritesData();
  const favorites = useFavorites();
  const refreshResource = resource.refresh;
  const refreshFavorites = favorites.refresh;

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshResource(), refreshFavorites()]);
  }, [refreshFavorites, refreshResource]);

  useFocusEffect(useCallback(() => { void refreshAll(); }, [refreshAll]));
  const refreshOnForeground = useCallback(() => { void refreshAll(); }, [refreshAll]);
  useRefreshOnForeground(refreshOnForeground);

  useEffect(() => {
    if (resource.data === null || favorites.isLoading) return;

    const publicPostIds = new Set(resource.data.posts.map(({ id }) => id));
    void favorites.reconcile(publicPostIds);
  }, [favorites.favoriteIds, favorites.isLoading, favorites.reconcile, resource.data]);

  const favoriteIdSet = useMemo(
    () => new Set(favorites.favoriteIds),
    [favorites.favoriteIds],
  );
  const favoritePosts = useMemo(
    () => resource.data?.posts.filter(({ id }) => favoriteIdSet.has(id)) ?? [],
    [favoriteIdSet, resource.data?.posts],
  );
  const departmentsById = useMemo(
    () => new Map<ID, Department>(resource.data?.departments.map((department) => [department.id, department]) ?? []),
    [resource.data?.departments],
  );

  if ((resource.isLoading && resource.data === null) || favorites.isLoading) {
    return <FavoritesLoadingState />;
  }

  if (resource.data === null) {
    return (
      <Screen contentStyle={styles.stateContent}>
        <AppHeader title="Favoritos" />
        <EmptyState
          action={<Button label="Intentar de nuevo" onPress={() => void refreshAll()} />}
          description={resource.error ?? "No pudimos consultar los avisos compartidos."}
          illustration={<Ionicons color={theme.colors.danger} name="cloud-offline-outline" size={48} />}
          title="No pudimos cargar tus favoritos"
        />
      </Screen>
    );
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <FlatList
        contentContainerStyle={styles.content}
        data={favoritePosts}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={({ id }) => id}
        ListEmptyComponent={
          <EmptyState
            description="Guarda avisos importantes para consultarlos rápidamente."
            illustration={<Ionicons color={theme.colors.primary} name="bookmark-outline" size={52} />}
            title="Aún no tienes favoritos"
          />
        }
        ListFooterComponent={<View style={styles.footerSpace} />}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <AppHeader subtitle="Tus avisos guardados viven solamente en este dispositivo." title="Favoritos" />
            {resource.error ? <InlineNotice message={resource.error} tone="warning" /> : null}
            {favorites.error ? <InlineNotice message={favorites.error} /> : null}
          </View>
        }
        refreshControl={<RefreshControl colors={[theme.colors.primary]} onRefresh={() => void refreshAll()} refreshing={resource.isRefreshing || favorites.isLoading} tintColor={theme.colors.primary} />}
        renderItem={({ item }) => (
          <InstitutionalPostCard
            department={departmentsById.get(item.departmentId)}
            favorite
            favoriteActionLabel="Quitar"
            favoriteReady={!favorites.isLoading}
            favoriteSaving={favorites.isSaving}
            onToggleFavorite={() => void favorites.remove(item.id)}
            post={item}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function FavoritesLoadingState() {
  return (
    <Screen contentStyle={styles.stateContent} scroll={false}>
      <AppHeader title="Favoritos" />
      {[0, 1].map((item) => (
        <Card key={item} style={styles.skeletonCard}>
          <Skeleton height={44} width="55%" />
          <Skeleton height={28} width="74%" />
          <Skeleton height={120} radius="md" />
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: {
    flexGrow: 1,
    marginHorizontal: "auto",
    maxWidth: 760,
    paddingHorizontal: spacing.xl,
    width: "100%",
  },
  headerContent: { gap: spacing.xxl, paddingBottom: spacing.xl, paddingTop: spacing.lg },
  separator: { height: spacing.lg },
  footerSpace: { height: spacing.xxxl },
  stateContent: {
    gap: spacing.xxl,
    marginHorizontal: "auto",
    maxWidth: 760,
    width: "100%",
  },
  skeletonCard: { gap: spacing.lg },
});
