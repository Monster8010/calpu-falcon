import type { Fair } from "@calpulli/domain";
import {
  Badge,
  CalpulliMark,
  Card,
  culturalColors,
  radii,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import { useCountdown } from "../../hooks/use-countdown";

export function FairUpcoming({ fair }: { fair: Fair }) {
  const { theme } = useCalpulliTheme();
  const countdown = useCountdown(fair.nextDate);
  const date = new Date(fair.nextDate);
  const formattedDate = Number.isNaN(date.getTime())
    ? "Fecha por confirmar"
    : new Intl.DateTimeFormat("es-MX", {
        dateStyle: "full",
        timeStyle: "short",
      }).format(date);

  return (
    <View style={styles.container}>
      <Card elevated style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.heroIdentity}>
            <CalpulliMark size={52} />
            <Badge label="Próxima feria" tone="accent" />
          </View>
          <View style={styles.pattern}>
            <View
              style={[styles.patternLong, { backgroundColor: culturalColors.cempasuchil }]}
            />
            <View
              style={[styles.patternMedium, { backgroundColor: culturalColors.mexicanPink }]}
            />
            <View
              style={[styles.patternShort, { backgroundColor: culturalColors.mayaBlue }]}
            />
          </View>
        </View>
        <View style={styles.copy}>
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            {fair.name}
          </Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary }]}>
            La comunidad emprendedora volverá a encontrarse en la plaza Calpulli.
          </Text>
        </View>
        <View
          style={[
            styles.dateRow,
            { backgroundColor: theme.colors.primaryMuted },
          ]}
        >
          <Ionicons color={theme.colors.primary} name="calendar-outline" size={22} />
          <Text style={[styles.date, { color: theme.colors.textPrimary }]}>
            {formattedDate}
          </Text>
        </View>
      </Card>

      <View style={styles.countdownSection}>
        <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>
          Cuenta regresiva
        </Text>
        {countdown ? (
          <View accessibilityLabel="Cuenta regresiva para la próxima feria" style={styles.countdown}>
            <CountdownUnit label="Días" value={countdown.days} />
            <CountdownUnit label="Horas" value={countdown.hours} />
            <CountdownUnit label="Min" value={countdown.minutes} />
            <CountdownUnit label="Seg" value={countdown.seconds} />
          </View>
        ) : (
          <Text style={[styles.body, { color: theme.colors.danger }]}>
            No pudimos interpretar la próxima fecha.
          </Text>
        )}
        {countdown?.isElapsed ? (
          <Text style={[styles.body, { color: theme.colors.warning }]}>
            La fecha llegó. Desliza hacia abajo para actualizar el estado de la feria.
          </Text>
        ) : null}
      </View>

      <Card style={styles.mapNotice}>
        <View
          style={[styles.noticeIcon, { backgroundColor: theme.colors.surfaceMuted }]}
        >
          <Ionicons color={theme.colors.primary} name="map-outline" size={28} />
        </View>
        <View style={styles.noticeCopy}>
          <Text style={[styles.noticeTitle, { color: theme.colors.textPrimary }]}>
            El mapa se abrirá durante la feria
          </Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary }]}>
            Cuando la edición esté activa podrás explorar las 40 mesas y conocer los emprendimientos asignados.
          </Text>
        </View>
      </Card>
    </View>
  );
}

function CountdownUnit({ label, value }: { label: string; value: number }) {
  const { theme } = useCalpulliTheme();

  return (
    <View
      style={[
        styles.countdownUnit,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
        },
      ]}
    >
      <Text style={[styles.countdownValue, { color: theme.colors.textPrimary }]}>
        {String(value).padStart(2, "0")}
      </Text>
      <Text style={[styles.countdownLabel, { color: theme.colors.textSecondary }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xxl,
  },
  hero: {
    gap: spacing.xxl,
    overflow: "hidden",
  },
  heroTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heroIdentity: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  pattern: {
    alignItems: "flex-end",
    gap: spacing.xs,
  },
  patternLong: {
    height: 7,
    width: 68,
  },
  patternMedium: {
    height: 7,
    width: 48,
  },
  patternShort: {
    height: 7,
    width: 28,
  },
  copy: {
    gap: spacing.sm,
  },
  title: {
    ...typography.display,
  },
  heading: {
    ...typography.heading,
  },
  body: {
    ...typography.body,
  },
  dateRow: {
    alignItems: "center",
    borderRadius: radii.sm,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg,
  },
  date: {
    ...typography.label,
    flex: 1,
    textTransform: "capitalize",
  },
  countdownSection: {
    gap: spacing.md,
  },
  countdown: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  countdownUnit: {
    alignItems: "center",
    borderRadius: radii.sm,
    borderWidth: 1,
    flex: 1,
    minWidth: 64,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.md,
  },
  countdownValue: {
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  countdownLabel: {
    ...typography.caption,
  },
  mapNotice: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.lg,
  },
  noticeIcon: {
    alignItems: "center",
    borderRadius: radii.md,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
  noticeCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  noticeTitle: {
    ...typography.label,
  },
});
