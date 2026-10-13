import { AppHeader, EmptyState, spacing, typography, useCalpulliTheme } from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { InlineNotice } from "../../features/home/home-states";
import { FilterRail, LocalSearchField } from "../../features/shell/discovery-controls";
import { DiscoveryErrorState, DiscoveryLoadingState } from "../../features/shell/discovery-states";
import { TutorCard } from "../../features/tutoring/tutor-card";
import {
  createPublicTutorProfiles,
  filterPublicTutorProfiles,
  type TutoringModeFilter,
} from "../../features/tutoring/tutoring-selection";
import { useRefreshOnForeground } from "../../hooks/use-refresh-on-foreground";
import { useTutoringData } from "../../hooks/use-tutoring-data";

const SUBTITLE = "Encuentra acompañamiento por materia, persona o modalidad.";

const MODE_OPTIONS: ReadonlyArray<{ label: string; value: TutoringModeFilter }> = [
  { label: "Todas", value: "all" },
  { label: "Presencial", value: "in-person" },
  { label: "En línea", value: "online" },
  { label: "Híbrida", value: "hybrid" },
];

export default function TutoringTab() {
  const { theme } = useCalpulliTheme();
  const { data, error, isLoading, isRefreshing, refresh } = useTutoringData();
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<TutoringModeFilter>("all");

  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));
  const refreshOnForeground = useCallback(() => { void refresh(); }, [refresh]);
  useRefreshOnForeground(refreshOnForeground);

  const profiles = useMemo(
    () => data ? createPublicTutorProfiles(data.tutors, data.offers) : [],
    [data],
  );
  const filteredProfiles = useMemo(
    () => filterPublicTutorProfiles(profiles, query, mode),
    [mode, profiles, query],
  );

  if (isLoading && data === null) {
    return <DiscoveryLoadingState subtitle={SUBTITLE} title="Tutorías" />;
  }
  if (data === null) {
    return <DiscoveryErrorState message={error ?? "No encontramos perfiles compartidos."} onRetry={() => void refresh()} title="Tutorías" />;
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <FlatList
        contentContainerStyle={styles.content}
        data={filteredProfiles}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        keyExtractor={({ tutor }) => tutor.id}
        ListEmptyComponent={
          <EmptyState
            description={profiles.length === 0 ? "Cuando haya tutores activos, sus perfiles aparecerán aquí." : "Prueba otra materia, nombre o modalidad."}
            illustration={<Ionicons color={theme.colors.primary} name="school-outline" size={48} />}
            title={profiles.length === 0 ? "No hay tutorías públicas" : "Sin coincidencias"}
          />
        }
        ListFooterComponent={<View style={styles.footerSpace} />}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <AppHeader subtitle={SUBTITLE} title="Tutorías" />
            {error ? <InlineNotice message={error} tone="warning" /> : null}
            <LocalSearchField onChangeText={setQuery} placeholder="Buscar materia o tutor" value={query} />
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: theme.colors.textPrimary }]}>Modalidad</Text>
              <FilterRail<TutoringModeFilter> accessibilityLabel="Filtros de modalidad" onSelect={setMode} options={MODE_OPTIONS} selected={mode} />
            </View>
            <View style={styles.resultsHeading}>
              <Text style={[styles.resultsTitle, { color: theme.colors.textPrimary }]}>Tutoría entre comunidad</Text>
              <Text style={[styles.resultsCount, { color: theme.colors.textSecondary }]}>{filteredProfiles.length} {filteredProfiles.length === 1 ? "perfil" : "perfiles"}</Text>
            </View>
          </View>
        }
        refreshControl={<RefreshControl colors={[theme.colors.primary]} onRefresh={() => void refresh()} refreshing={isRefreshing} tintColor={theme.colors.primary} />}
        renderItem={({ item }) => <TutorCard onPress={() => router.push({ pathname: "/tutor/[id]", params: { id: item.tutor.id } })} profile={item} />}
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
  headerContent: { gap: spacing.xxl, paddingBottom: spacing.xl, paddingTop: spacing.lg },
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
