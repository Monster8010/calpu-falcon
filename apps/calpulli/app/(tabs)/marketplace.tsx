import { AppHeader, EmptyState, spacing, typography, useCalpulliTheme } from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MarketplaceCard } from "../../features/marketplace/marketplace-card";
import {
  createMarketplaceEntries,
  filterMarketplaceEntries,
  getMarketplaceCategories,
  type MarketplaceCategory,
} from "../../features/marketplace/marketplace-selection";
import { DiscoveryErrorState, DiscoveryLoadingState } from "../../features/shell/discovery-states";
import { FilterRail, LocalSearchField } from "../../features/shell/discovery-controls";
import { InlineNotice } from "../../features/home/home-states";
import { useMarketplaceData } from "../../hooks/use-marketplace-data";
import { useRefreshOnForeground } from "../../hooks/use-refresh-on-foreground";

const SUBTITLE = "Descubre productos, novedades y proyectos creados por la comunidad universitaria.";

export default function MarketplaceTab() {
  const { theme } = useCalpulliTheme();
  const { data, error, isLoading, isRefreshing, refresh } = useMarketplaceData();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<MarketplaceCategory>("all");

  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));
  const refreshOnForeground = useCallback(() => { void refresh(); }, [refresh]);
  useRefreshOnForeground(refreshOnForeground);

  const entries = useMemo(
    () => data ? createMarketplaceEntries(data.entrepreneurs, data.products, data.posts) : [],
    [data],
  );
  const categories = useMemo(() => getMarketplaceCategories(entries), [entries]);
  const filteredEntries = useMemo(
    () => filterMarketplaceEntries(entries, query, category),
    [category, entries, query],
  );
  const filterOptions = useMemo(
    () => [
      { label: "Todas", value: "all" },
      ...categories.map((value) => ({ label: value, value })),
    ],
    [categories],
  );

  useEffect(() => {
    if (category !== "all" && !categories.includes(category)) {
      setCategory("all");
    }
  }, [categories, category]);

  if (isLoading && data === null) {
    return <DiscoveryLoadingState subtitle={SUBTITLE} title="Marketplace" />;
  }

  if (data === null) {
    return <DiscoveryErrorState message={error ?? "No encontramos contenido compartido."} onRetry={() => void refresh()} title="Marketplace" />;
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <FlatList
        contentContainerStyle={styles.content}
        data={filteredEntries}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        keyExtractor={(entry) => `${entry.kind}:${entry.id}`}
        ListEmptyComponent={
          <EmptyState
            description={entries.length === 0 ? "Cuando haya productos o publicaciones públicas, aparecerán aquí." : "Prueba otra búsqueda o categoría."}
            illustration={<Ionicons color={theme.colors.primary} name="storefront-outline" size={48} />}
            title={entries.length === 0 ? "Marketplace sin contenido" : "Sin coincidencias"}
          />
        }
        ListFooterComponent={<View style={styles.footerSpace} />}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <AppHeader subtitle={SUBTITLE} title="Marketplace" />
            {error ? <InlineNotice message={error} tone="warning" /> : null}
            <LocalSearchField onChangeText={setQuery} placeholder="Buscar producto o emprendimiento" value={query} />
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: theme.colors.textPrimary }]}>Categorías</Text>
              <FilterRail accessibilityLabel="Filtros de categoría" onSelect={setCategory} options={filterOptions} selected={category} />
            </View>
            <View style={styles.resultsHeading}>
              <Text style={[styles.resultsTitle, { color: theme.colors.textPrimary }]}>Explora la comunidad</Text>
              <Text style={[styles.resultsCount, { color: theme.colors.textSecondary }]}>{filteredEntries.length} {filteredEntries.length === 1 ? "resultado" : "resultados"}</Text>
            </View>
          </View>
        }
        refreshControl={<RefreshControl colors={[theme.colors.primary]} onRefresh={() => void refresh()} refreshing={isRefreshing} tintColor={theme.colors.primary} />}
        renderItem={({ item }) => (
          <MarketplaceCard
            entry={item}
            onPress={() => router.push({ pathname: "/marketplace/[kind]/[id]", params: { id: item.id, kind: item.kind } })}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
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
  headerContent: {
    gap: spacing.xxl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.lg,
  },
  filterSection: { gap: spacing.md },
  filterTitle: { ...typography.heading },
  resultsHeading: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
  },
  resultsTitle: { ...typography.heading, flex: 1 },
  resultsCount: { ...typography.caption },
  separator: { height: spacing.lg },
  footerSpace: { height: spacing.xxxl },
});
