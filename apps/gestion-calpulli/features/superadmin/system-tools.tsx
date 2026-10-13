import type { SharedMeta } from "@calpulli/domain";
import type { SharedStateSource } from "@calpulli/shared-store";
import {
  Badge,
  Button,
  Card,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import { InlineNotice } from "../forms/management-form-controls";

function formatDateTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Fecha no disponible"
    : date.toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });
}

export function SystemTools({
  busyAction,
  meta,
  onRestore,
  onValidate,
  source,
}: {
  busyAction: "restore" | "validate" | null;
  meta: SharedMeta;
  onRestore(): void;
  onValidate(): void;
  source: SharedStateSource;
}) {
  const { theme } = useCalpulliTheme();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>Datos de demostración</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Herramientas técnicas del almacenamiento compartido.</Text>
        </View>
        <Badge label={source === "primary" ? "Store conectado" : "Recuperado del backup"} tone={source === "primary" ? "success" : "warning"} />
      </View>

      {source === "backup" ? <InlineNotice message="La lectura actual proviene del respaldo. Revalida antes de continuar la demostración." tone="info" /> : null}

      <Card elevated style={styles.statusCard}>
        <View style={[styles.statusIcon, { backgroundColor: theme.colors.primaryMuted }]}>
          <Ionicons color={theme.colors.primary} name="server-outline" size={28} />
        </View>
        <View style={styles.statusCopy}>
          <Text style={[styles.statusTitle, { color: theme.colors.textPrimary }]}>Shared store</Text>
          <Detail label="Estado de conexión" value="Carpeta SAF conectada y legible" />
          <Detail label="Revisión" value={String(meta.revision)} />
          <Detail label="Schema" value={String(meta.schemaVersion)} />
          <Detail label="Última escritura" value={formatDateTime(meta.updatedAt)} />
          <Detail label="Último escritor" value={meta.lastWriter === "gestion-calpulli" ? "Gestión UPIICSA Calpulli" : "UPIICSA Calpulli"} />
        </View>
      </Card>

      <View style={styles.actions}>
        <Button disabled={busyAction !== null} label="Revalidar almacenamiento" leading={<Ionicons color={theme.colors.textOnAccent} name="refresh-outline" size={20} />} loading={busyAction === "validate"} onPress={onValidate} />
      </View>

      <Card style={[styles.dangerCard, { borderColor: theme.colors.danger }]}>
        <Ionicons color={theme.colors.danger} name="warning-outline" size={25} />
        <View style={styles.dangerCopy}>
          <Text style={[styles.dangerTitle, { color: theme.colors.textPrimary }]}>Restaurar datos demo</Text>
          <Text style={[styles.dangerText, { color: theme.colors.textSecondary }]}>Reemplaza publicaciones, feria, solicitudes, perfiles, configuración y departamentos actuales con un seed nuevo. Requiere confirmación.</Text>
          <Button disabled={busyAction !== null} label="Restaurar datos de demostración" loading={busyAction === "restore"} onPress={onRestore} variant="secondary" />
        </View>
      </Card>
    </View>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  const { theme } = useCalpulliTheme();
  return (
    <View style={styles.detail}>
      <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: theme.colors.textPrimary }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xxl },
  header: { alignItems: "flex-start", flexDirection: "row", flexWrap: "wrap", gap: spacing.md, justifyContent: "space-between" },
  headerCopy: { flex: 1, gap: spacing.xs, minWidth: 230 },
  title: { ...typography.title },
  subtitle: { ...typography.body },
  statusCard: { alignItems: "flex-start", flexDirection: "row", gap: spacing.lg },
  statusIcon: { alignItems: "center", height: 54, justifyContent: "center", width: 54 },
  statusCopy: { flex: 1, gap: spacing.md },
  statusTitle: { ...typography.heading },
  detail: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, justifyContent: "space-between" },
  detailLabel: { ...typography.caption },
  detailValue: { ...typography.label },
  actions: { alignItems: "flex-start" },
  dangerCard: { alignItems: "flex-start", flexDirection: "row", gap: spacing.md },
  dangerCopy: { flex: 1, gap: spacing.md },
  dangerTitle: { ...typography.heading },
  dangerText: { ...typography.body },
});
