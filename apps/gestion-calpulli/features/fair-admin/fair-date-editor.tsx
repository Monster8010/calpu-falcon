import type { Fair } from "@calpulli/domain";
import {
  Badge,
  Button,
  Card,
  radii,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { InlineNotice } from "../forms/management-form-controls";
import {
  formatFairDate,
  suggestNextFairDate,
} from "./fair-admin-models";

export function FairDateEditor({
  error,
  fair,
  now,
  onSave,
  saving,
}: {
  error: string | null;
  fair: Fair;
  now: string;
  onSave(date: Date): void;
  saving: boolean;
}) {
  const { theme } = useCalpulliTheme();
  const initial = new Date(fair.nextDate);
  const [selected, setSelected] = useState(
    Number.isNaN(initial.getTime()) ? new Date(Date.parse(now) + 86_400_000) : initial,
  );
  const [pickerMode, setPickerMode] = useState<"date" | "time" | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const onPickerChange = (event: DateTimePickerEvent, date?: Date) => {
    setPickerMode(null);
    if (event.type === "set" && date !== undefined) {
      setSelected(date);
      setLocalError(null);
    }
  };

  const applySuggestion = () => {
    try {
      setSelected(new Date(suggestNextFairDate(fair, now)));
      setLocalError(null);
    } catch (suggestionError) {
      setLocalError(suggestionError instanceof Error ? suggestionError.message : "No se pudo sugerir una fecha.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>Cambiar próxima fecha</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>La regla de miércoles y 15 días sólo sirve como sugerencia.</Text>
        </View>
        <Badge label="Fecha editable" tone="accent" />
      </View>
      {error ? <InlineNotice message={error} /> : null}
      {localError ? <InlineNotice message={localError} /> : null}

      <Card elevated style={styles.card}>
        <View style={[styles.dateIcon, { backgroundColor: theme.colors.primaryMuted }]}>
          <Ionicons color={theme.colors.primary} name="calendar-outline" size={30} />
        </View>
        <View style={styles.dateCopy}>
          <Text style={[styles.dateLabel, { color: theme.colors.textSecondary }]}>Fecha seleccionada</Text>
          <Text style={[styles.dateValue, { color: theme.colors.textPrimary }]}>{formatFairDate(selected.toISOString())}</Text>
        </View>
        <View style={styles.pickerActions}>
          <Button label="Elegir fecha" onPress={() => setPickerMode("date")} variant="secondary" />
          <Button label="Elegir hora" onPress={() => setPickerMode("time")} variant="secondary" />
        </View>
        {pickerMode ? (
          <DateTimePicker
            minimumDate={new Date(now)}
            mode={pickerMode}
            onChange={onPickerChange}
            value={selected}
          />
        ) : null}
      </Card>

      <Button label="Sugerir siguiente miércoles +15 días" onPress={applySuggestion} variant="ghost" />
      <InlineNotice message="El selector muestra la hora local del dispositivo y guarda un instante ISO 8601 con zona explícita." tone="info" />
      <View style={styles.saveRow}>
        <Button label="Guardar próxima fecha" leading={<Ionicons color={theme.colors.textOnAccent} name="save-outline" size={20} />} loading={saving} onPress={() => onSave(selected)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xxl },
  header: { alignItems: "flex-start", flexDirection: "row", flexWrap: "wrap", gap: spacing.md, justifyContent: "space-between" },
  headerCopy: { flex: 1, gap: spacing.xs, minWidth: 230 },
  title: { ...typography.title },
  subtitle: { ...typography.body },
  card: { gap: spacing.xl },
  dateIcon: { alignItems: "center", alignSelf: "flex-start", borderRadius: radii.md, height: 58, justifyContent: "center", width: 58 },
  dateCopy: { gap: spacing.xs },
  dateLabel: { ...typography.caption },
  dateValue: { ...typography.heading, textTransform: "capitalize" },
  pickerActions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  saveRow: { alignItems: "flex-end" },
});
