import {
  Badge,
  Button,
  Card,
  radii,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { selectImageForSharedMedia } from "../../services/shared-media-management";
import type { PendingSharedImage } from "../departments/department-form-models";
import { InlineNotice } from "./management-form-controls";

export function SharedImagePickerField({
  disabled,
  existingSharedCount,
  onChange,
  value,
}: {
  disabled: boolean;
  existingSharedCount: number;
  onChange(value: PendingSharedImage | undefined): void;
  value?: PendingSharedImage;
}) {
  const { theme } = useCalpulliTheme();
  const [error, setError] = useState<string | null>(null);
  const [selecting, setSelecting] = useState(false);

  const selectImage = async () => {
    setSelecting(true);
    setError(null);
    try {
      const selected = await selectImageForSharedMedia();
      if (selected !== null) onChange(selected);
    } catch (selectionError) {
      setError(
        selectionError instanceof Error
          ? selectionError.message
          : "No se pudo seleccionar la imagen.",
      );
    } finally {
      setSelecting(false);
    }
  };

  return (
    <View style={styles.field}>
      <View style={styles.heading}>
        <View style={styles.headingCopy}>
          <Text style={[styles.label, { color: theme.colors.textPrimary }]}>Imagen real compartida</Text>
          <Text style={[styles.hint, { color: theme.colors.textSecondary }]}>JPEG, PNG o WebP de hasta 8 MB. Se copia a la carpeta media al guardar.</Text>
        </View>
        {existingSharedCount > 0 ? <Badge label={`${existingSharedCount} guardada${existingSharedCount === 1 ? "" : "s"}`} tone="success" /> : null}
      </View>

      {value ? (
        <Card style={styles.previewCard}>
          <Image
            accessibilityLabel="Vista previa de la imagen seleccionada"
            resizeMode="cover"
            source={{ uri: value.uri }}
            style={[styles.preview, { backgroundColor: theme.colors.surfaceElevated }]}
          />
          <View style={styles.previewCopy}>
            <Text numberOfLines={1} style={[styles.fileName, { color: theme.colors.textPrimary }]}>{value.fileName ?? "Imagen seleccionada"}</Text>
            <Text style={[styles.hint, { color: theme.colors.textSecondary }]}>{value.mimeType}</Text>
          </View>
        </Card>
      ) : null}

      {error ? <InlineNotice message={error} /> : null}

      <View style={styles.actions}>
        <Button
          disabled={disabled}
          label={value ? "Cambiar imagen" : "Seleccionar imagen"}
          leading={<Ionicons color={theme.colors.primary} name="image-outline" size={19} />}
          loading={selecting}
          onPress={selectImage}
          variant="secondary"
        />
        {value ? (
          <Button
            disabled={disabled || selecting}
            label="Quitar"
            leading={<Ionicons color={theme.colors.primary} name="close-outline" size={19} />}
            onPress={() => onChange(undefined)}
            variant="ghost"
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: spacing.md },
  heading: { alignItems: "flex-start", flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, justifyContent: "space-between" },
  headingCopy: { flex: 1, gap: spacing.xs, minWidth: 220 },
  label: { ...typography.label },
  hint: { ...typography.caption },
  previewCard: { alignItems: "center", flexDirection: "row", gap: spacing.md },
  preview: { borderRadius: radii.sm, height: 88, width: 112 },
  previewCopy: { flex: 1, gap: spacing.xs },
  fileName: { ...typography.body, fontWeight: "600" },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
});
