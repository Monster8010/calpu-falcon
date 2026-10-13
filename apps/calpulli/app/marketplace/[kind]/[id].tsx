import { Button, EmptyState, Skeleton, spacing, useCalpulliTheme } from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { InlineNotice } from "../../../features/home/home-states";
import { MarketplaceDetailView } from "../../../features/marketplace/marketplace-detail-view";
import { DetailHeader } from "../../../features/shell/detail-header";
import { useMarketplaceEntry } from "../../../hooks/use-marketplace-data";
import { useRefreshOnForeground } from "../../../hooks/use-refresh-on-foreground";

export default function MarketplaceDetailScreen() {
  const { theme } = useCalpulliTheme();
  const params = useLocalSearchParams<{ id?: string | string[]; kind?: string | string[] }>();
  const id = firstParam(params.id);
  const kindValue = firstParam(params.kind);
  const routeIsValid = kindValue === "post" || kindValue === "product";
  const kind = kindValue === "post" ? "post" : "product";
  const { data, error, isLoading, isRefreshing, refresh } = useMarketplaceEntry(kind, id);

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
        <DetailHeader eyebrow="Marketplace" title="Detalle" />
        {isLoading && data === null ? (
          <View style={styles.skeleton}>
            <Skeleton height={250} radius="md" />
            <Skeleton height={42} width="72%" />
            <Skeleton height={110} />
          </View>
        ) : data === null || !routeIsValid ? (
          <EmptyState
            action={<Button label="Intentar de nuevo" onPress={() => void refresh()} />}
            description={routeIsValid ? error ?? "El contenido ya no está disponible." : "La ruta de Marketplace no es válida."}
            illustration={<Ionicons color={theme.colors.danger} name="bag-handle-outline" size={48} />}
            title="No encontramos este contenido"
          />
        ) : (
          <>
            {error ? <InlineNotice message={error} tone="warning" /> : null}
            <MarketplaceDetailView
              entry={data}
              onViewEntrepreneur={() => router.push({ pathname: "/entrepreneur/[id]", params: { id: data.entrepreneur.id } })}
            />
          </>
        )}
        <View style={styles.footerSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
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
