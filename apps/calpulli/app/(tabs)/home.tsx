import type { Department, ID, InstitutionalPost } from "@calpulli/domain";
import {
  AppHeader,
  EmptyState,
  spacing,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DepartmentFilterRail, SectionHeading } from "../../features/home/department-filter-rail";
import { HomeErrorState, HomeLoadingState, InlineNotice } from "../../features/home/home-states";
import { InstitutionalPostCard } from "../../features/home/institutional-post-card";
import { DepartmentStoriesRail } from "../../features/stories/department-stories-rail";
import { StoryViewer } from "../../features/stories/story-viewer";
import { useFavorites } from "../../hooks/use-favorites";
import { useHomeData } from "../../hooks/use-home-data";
import { useRefreshOnForeground } from "../../hooks/use-refresh-on-foreground";

export default function HomeTab() {
  const { theme } = useCalpulliTheme();
  const { data, error, isLoading, isRefreshing, refresh } = useHomeData();
  const favorites = useFavorites();
  const refreshFavorites = favorites.refresh;
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    ID | undefined
  >();
  const [storyIndex, setStoryIndex] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      void refresh();
      void refreshFavorites();
    }, [refresh, refreshFavorites]),
  );
  const refreshOnForeground = useCallback(() => {
    void refresh();
    void refreshFavorites();
  }, [refresh, refreshFavorites]);
  useRefreshOnForeground(refreshOnForeground);

  const departmentsById = useMemo(
    () =>
      new Map<ID, Department>(
        data?.departments.map((department) => [department.id, department]) ?? [],
      ),
    [data?.departments],
  );
  const filteredPosts = useMemo(
    () =>
      data?.posts.filter(
        ({ departmentId }) =>
          selectedDepartmentId === undefined ||
          departmentId === selectedDepartmentId,
      ) ?? [],
    [data?.posts, selectedDepartmentId],
  );
  const orderedStories = useMemo(() => {
    const stories = data?.stories ?? [];

    if (selectedDepartmentId === undefined) {
      return stories;
    }

    return [
      ...stories.filter(({ departmentId }) => departmentId === selectedDepartmentId),
      ...stories.filter(({ departmentId }) => departmentId !== selectedDepartmentId),
    ];
  }, [data?.stories, selectedDepartmentId]);

  useEffect(() => {
    if (
      selectedDepartmentId !== undefined &&
      !departmentsById.has(selectedDepartmentId)
    ) {
      setSelectedDepartmentId(undefined);
    }
  }, [departmentsById, selectedDepartmentId]);

  useEffect(() => {
    if (storyIndex !== null && storyIndex >= orderedStories.length) {
      setStoryIndex(null);
    }
  }, [orderedStories.length, storyIndex]);

  if (isLoading && data === null) {
    return <HomeLoadingState />;
  }

  if (data === null) {
    return (
      <HomeErrorState
        message={error ?? "No encontramos información compartida."}
        onRetry={() => void refresh()}
      />
    );
  }

  const selectedDepartment =
    selectedDepartmentId === undefined
      ? undefined
      : departmentsById.get(selectedDepartmentId);

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <FlatList
        contentContainerStyle={styles.content}
        data={filteredPosts}
        ItemSeparatorComponent={FeedSeparator}
        keyExtractor={({ id }) => id}
        ListEmptyComponent={
          <EmptyState
            description={
              selectedDepartment
                ? `Todavía no hay avisos visibles de ${selectedDepartment.name}.`
                : "Cuando los departamentos publiquen avisos, aparecerán aquí."
            }
            illustration={
              <Ionicons
                color={theme.colors.primary}
                name="newspaper-outline"
                size={48}
              />
            }
            title={selectedDepartment ? "Sin resultados en este filtro" : "Sin publicaciones"}
          />
        }
        ListFooterComponent={<View style={styles.footerSpace} />}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <AppHeader
              subtitle="Avisos, historias y novedades de la comunidad universitaria."
              title="Inicio"
            />
            {error ? <InlineNotice message={error} tone="warning" /> : null}
            {favorites.error ? <InlineNotice message={favorites.error} /> : null}
            <DepartmentFilterRail
              departments={data.departments}
              onSelect={(departmentId) => {
                setSelectedDepartmentId(departmentId);
                setStoryIndex(null);
              }}
              selectedDepartmentId={selectedDepartmentId}
            />
            <DepartmentStoriesRail
              departmentsById={departmentsById}
              onOpen={setStoryIndex}
              stories={orderedStories}
            />
            <SectionHeading
              subtitle={
                selectedDepartment
                  ? `Mostrando publicaciones de ${selectedDepartment.name}.`
                  : "Ordenados por prioridad y fecha de publicación."
              }
              title="Avisos para ti"
            />
          </View>
        }
        refreshControl={
          <RefreshControl
            colors={[theme.colors.primary]}
            onRefresh={() => void refresh()}
            refreshing={isRefreshing}
            tintColor={theme.colors.primary}
          />
        }
        renderItem={({ item }) => (
          <FeedPost
            department={departmentsById.get(item.departmentId)}
            favorite={favorites.isFavorite(item.id)}
            favoriteReady={!favorites.isLoading}
            favoriteSaving={favorites.isSaving}
            onToggleFavorite={() => void favorites.toggle(item.id)}
            post={item}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
      <StoryViewer
        departmentsById={departmentsById}
        index={storyIndex}
        onChangeIndex={setStoryIndex}
        onClose={() => setStoryIndex(null)}
        stories={orderedStories}
      />
    </SafeAreaView>
  );
}

function FeedPost({
  department,
  favorite,
  favoriteReady,
  favoriteSaving,
  onToggleFavorite,
  post,
}: {
  department?: Department;
  favorite: boolean;
  favoriteReady: boolean;
  favoriteSaving: boolean;
  onToggleFavorite(): void;
  post: InstitutionalPost;
}) {
  return (
    <InstitutionalPostCard
      department={department}
      favorite={favorite}
      favoriteReady={favoriteReady}
      favoriteSaving={favoriteSaving}
      onToggleFavorite={onToggleFavorite}
      post={post}
    />
  );
}

function FeedSeparator() {
  return <View style={styles.feedSeparator} />;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    marginHorizontal: "auto",
    maxWidth: 760,
    paddingHorizontal: spacing.xl,
    width: "100%",
  },
  headerContent: {
    gap: spacing.xxl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.lg,
  },
  feedSeparator: {
    height: spacing.lg,
  },
  footerSpace: {
    height: spacing.xxxl,
  },
});
