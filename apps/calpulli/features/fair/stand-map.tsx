import type { Entrepreneur, ID, Stand, StandStatus } from "@calpulli/domain";
import {
  Card,
  radii,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { EntrepreneurAvatar } from "../entrepreneurs/entrepreneur-avatar";
import { getFairMapMetrics, getStandMapPosition } from "./fair-selection";

const MAP_GAP = spacing.sm;

const STATUS_LABEL: Record<StandStatus, string> = {
  available: "Disponible",
  requested: "Apartado",
  assigned: "Asignado",
};

export interface StandMapProps {
  entrepreneursById: ReadonlyMap<ID, Entrepreneur>;
  onSelect(stand: Stand): void;
  stands: readonly Stand[];
}

export function StandMap({ entrepreneursById, onSelect, stands }: StandMapProps) {
  const { theme } = useCalpulliTheme();
  const { width: viewportWidth } = useWindowDimensions();
  const cellSize = Math.max(
    44,
    Math.min(56, (viewportWidth - spacing.xl * 2 - MAP_GAP * 6) / 7),
  );
  const metrics = getFairMapMetrics(stands, cellSize, MAP_GAP);
  const branchColumns = useMemo(
    () =>
      [...new Set(
        stands
          .filter(({ coordinate }) => coordinate.branch !== "top")
          .map(({ coordinate }) => coordinate.column),
      )].sort((left, right) => left - right),
    [stands],
  );
  const sortedStands = useMemo(
    () => [...stands].sort((left, right) => left.number - right.number),
    [stands],
  );

  return (
    <View style={styles.section}>
      <View style={styles.headingRow}>
        <View style={styles.headingCopy}>
          <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>Mapa de la feria</Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary }]}>Toca cualquier mesa para ver su estado.</Text>
        </View>
        <View style={[styles.liveDot, { backgroundColor: theme.colors.success }]} />
      </View>

      <Legend />

      <Card style={styles.mapCard}>
        <ScrollView
          contentContainerStyle={styles.horizontalContent}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <View
            accessibilityLabel={`Mapa con ${stands.length} mesas`}
            style={[styles.map, { height: metrics.height, width: metrics.width }]}
          >
            {branchColumns.map((column) => (
              <View
                key={column}
                pointerEvents="none"
                style={[
                  styles.branchLine,
                  {
                    backgroundColor: theme.colors.borderSubtle,
                    height: Math.max(0, metrics.height - cellSize),
                    left: column * (cellSize + MAP_GAP) + cellSize / 2 - 2,
                    top: cellSize,
                  },
                ]}
              />
            ))}
            {sortedStands.map((stand) => {
              const entrepreneur =
                stand.status === "assigned" && stand.assignedEntrepreneurId
                  ? entrepreneursById.get(stand.assignedEntrepreneurId)
                  : undefined;

              return (
                <StandButton
                  cellSize={cellSize}
                  entrepreneur={entrepreneur}
                  key={stand.id}
                  onPress={() => onSelect(stand)}
                  position={getStandMapPosition(stand, cellSize, MAP_GAP)}
                  stand={stand}
                />
              );
            })}
          </View>
        </ScrollView>
      </Card>
    </View>
  );
}

function StandButton({
  cellSize,
  entrepreneur,
  onPress,
  position,
  stand,
}: {
  cellSize: number;
  entrepreneur?: Entrepreneur;
  onPress(): void;
  position: { left: number; top: number };
  stand: Stand;
}) {
  const { theme } = useCalpulliTheme();
  const statusColor =
    stand.status === "available"
      ? theme.colors.textSecondary
      : stand.status === "requested"
        ? theme.colors.warning
        : theme.colors.focus;
  const accessibilityName = entrepreneur
    ? `, ${entrepreneur.displayName}`
    : "";

  return (
    <Pressable
      accessibilityHint="Abre los detalles de la mesa"
      accessibilityLabel={`Mesa ${stand.number}, ${STATUS_LABEL[stand.status]}${accessibilityName}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.stand,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: statusColor,
          height: cellSize,
          left: position.left,
          top: position.top,
          width: cellSize,
        },
        pressed && styles.pressed,
      ]}
    >
      {stand.status === "assigned" && entrepreneur ? (
        <EntrepreneurAvatar entrepreneur={entrepreneur} size={cellSize - 8} />
      ) : stand.status === "requested" ? (
        <Ionicons color={statusColor} name="time-outline" size={20} />
      ) : stand.status === "assigned" ? (
        <Ionicons color={statusColor} name="storefront-outline" size={20} />
      ) : (
        <Ionicons color={statusColor} name="add-outline" size={20} />
      )}
      <View style={[styles.numberBadge, { backgroundColor: statusColor }]}>
        <Text style={[styles.number, { color: theme.colors.textOnAccent }]}>{stand.number}</Text>
      </View>
    </Pressable>
  );
}

function Legend() {
  const { theme } = useCalpulliTheme();

  return (
    <View accessibilityLabel="Simbología del mapa" style={styles.legend}>
      <LegendItem color={theme.colors.textSecondary} label="Disponible" />
      <LegendItem color={theme.colors.warning} label="Apartado" />
      <LegendItem color={theme.colors.focus} label="Asignado" />
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  const { theme } = useCalpulliTheme();

  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendSwatch, { borderColor: color }]} />
      <Text style={[styles.legendLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.lg,
  },
  headingRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  headingCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  heading: {
    ...typography.heading,
  },
  body: {
    ...typography.body,
  },
  liveDot: {
    borderRadius: radii.pill,
    height: 12,
    width: 12,
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.lg,
  },
  legendItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  legendSwatch: {
    borderRadius: 5,
    borderWidth: 2,
    height: 18,
    width: 18,
  },
  legendLabel: {
    ...typography.caption,
  },
  mapCard: {
    padding: spacing.md,
  },
  horizontalContent: {
    minWidth: "100%",
  },
  map: {
    position: "relative",
  },
  branchLine: {
    position: "absolute",
    width: 4,
  },
  stand: {
    alignItems: "center",
    borderRadius: radii.sm,
    borderWidth: 2,
    justifyContent: "center",
    position: "absolute",
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.94 }],
  },
  numberBadge: {
    alignItems: "center",
    borderRadius: radii.pill,
    justifyContent: "center",
    left: -4,
    minHeight: 18,
    minWidth: 18,
    paddingHorizontal: 3,
    position: "absolute",
    top: -5,
  },
  number: {
    fontSize: 9,
    fontWeight: "800",
    lineHeight: 12,
  },
});
