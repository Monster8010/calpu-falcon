import type { Entrepreneur, ID, Stand } from "@calpulli/domain";
import {
  AppHeader,
  Button,
  Card,
  EmptyState,
  Skeleton,
  spacing,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FairActive } from "../../features/fair/fair-active";
import { FairUpcoming } from "../../features/fair/fair-upcoming";
import { StandBottomSheet } from "../../features/fair/stand-bottom-sheet";
import { InlineNotice } from "../../features/home/home-states";
import { useFairData } from "../../hooks/use-fair-data";
import { useRefreshOnForeground } from "../../hooks/use-refresh-on-foreground";

export default function FairTab() {
  const { theme } = useCalpulliTheme();
  const { data, error, isLoading, isRefreshing, refresh } = useFairData();
  const [selectedStandId, setSelectedStandId] = useState<ID | null>(null);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );
  const refreshOnForeground = useCallback(() => {
    void refresh();
  }, [refresh]);
  useRefreshOnForeground(refreshOnForeground);

  const entrepreneursById = useMemo(
    () =>
      new Map<ID, Entrepreneur>(
        data?.entrepreneurs.map((entrepreneur) => [entrepreneur.id, entrepreneur]) ?? [],
      ),
    [data?.entrepreneurs],
  );
  const selectedStand = useMemo(
    () => data?.stands.find(({ id }) => id === selectedStandId) ?? null,
    [data?.stands, selectedStandId],
  );
  const selectedEntrepreneur =
    selectedStand?.status === "assigned" && selectedStand.assignedEntrepreneurId
      ? entrepreneursById.get(selectedStand.assignedEntrepreneurId)
      : undefined;

  useEffect(() => {
    if (selectedStandId !== null && selectedStand === null) {
      setSelectedStandId(null);
    }
  }, [selectedStand, selectedStandId]);

  if (isLoading && data === null) {
    return <FairLoadingState />;
  }

  if (data === null) {
    return <FairErrorState message={error ?? "No encontramos información compartida."} onRetry={() => void refresh()} />;
  }

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
        <AppHeader
          subtitle="Explora la próxima edición o recorre las mesas cuando la feria esté activa."
          title="Feria"
        />
        {error ? <InlineNotice message={error} tone="warning" /> : null}
        {data.fair === undefined ? (
          <EmptyState
            description="Cuando Gestión programe una edición, aquí aparecerán su fecha y su mapa."
            illustration={<Ionicons color={theme.colors.primary} name="calendar-outline" size={48} />}
            title="Todavía no hay una feria programada"
          />
        ) : data.fair.status === "upcoming" ? (
          <FairUpcoming fair={data.fair} />
        ) : (
          <>
            {data.stands.length !== 40 ? (
              <InlineNotice
                message={`El mapa compartido contiene ${data.stands.length} de 40 mesas. Puedes explorarlo mientras Gestión revisa la distribución.`}
                tone="warning"
              />
            ) : null}
            <FairActive
              entrepreneursById={entrepreneursById}
              fairName={data.fair.name}
              onSelectStand={(stand: Stand) => setSelectedStandId(stand.id)}
              stands={data.stands}
            />
          </>
        )}
        <View style={styles.footerSpace} />
      </ScrollView>

      <StandBottomSheet
        entrepreneur={selectedEntrepreneur}
        onClose={() => setSelectedStandId(null)}
        onViewProfile={(entrepreneur) => {
          setSelectedStandId(null);
          router.push({ pathname: "/entrepreneur/[id]", params: { id: entrepreneur.id } });
        }}
        stand={selectedStand}
      />
    </SafeAreaView>
  );
}

function FairLoadingState() {
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <View style={styles.loadingContent}>
        <AppHeader title="Feria" />
        <Card elevated style={styles.skeletonCard}>
          <Skeleton height={28} width={112} />
          <Skeleton height={42} width="70%" />
          <Skeleton height={62} />
        </Card>
        <Skeleton height={24} width="45%" />
        <Skeleton height={540} radius="md" />
      </View>
    </SafeAreaView>
  );
}

function FairErrorState({ message, onRetry }: { message: string; onRetry(): void }) {
  const { theme } = useCalpulliTheme();

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={styles.loadingContent}>
        <AppHeader title="Feria" />
        <EmptyState
          action={<Button label="Intentar de nuevo" onPress={onRetry} />}
          description={message}
          illustration={<Ionicons color={theme.colors.danger} name="cloud-offline-outline" size={48} />}
          title="No pudimos cargar la feria"
        />
      </View>
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
    maxWidth: 760,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    width: "100%",
  },
  footerSpace: {
    height: spacing.xxxl,
  },
  loadingContent: {
    flex: 1,
    gap: spacing.xxl,
    marginHorizontal: "auto",
    maxWidth: 760,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    width: "100%",
  },
  skeletonCard: {
    gap: spacing.lg,
  },
});
