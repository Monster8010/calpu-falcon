import type { Product } from "@calpulli/domain";
import {
  Badge,
  Button,
  Card,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  ChoiceGroup,
  FormField,
  FormSection,
  InlineNotice,
  ToggleField,
} from "../forms/management-form-controls";
import {
  DEMO_PRODUCT_MEDIA,
  createEmptyProductDraft,
  createProductDraft,
  type ProductDraft,
} from "./entrepreneur-form-models";

export function ProductEditor({
  error,
  onSave,
  product,
  saving,
}: {
  error: string | null;
  onSave(draft: ProductDraft): void;
  product?: Product;
  saving: boolean;
}) {
  const { theme } = useCalpulliTheme();
  const [draft, setDraft] = useState(() => product ? createProductDraft(product) : createEmptyProductDraft());
  const mediaOptions = [
    ...DEMO_PRODUCT_MEDIA,
    ...draft.mediaKeys
      .filter((key) => !DEMO_PRODUCT_MEDIA.some((option) => option.key === key))
      .map((key, index) => ({ key, label: `Media actual ${index + 1}` })),
  ].map(({ key, label }) => ({ value: key, label }));

  const toggleMedia = (key: string) => setDraft((current) => ({
    ...current,
    mediaKeys: current.mediaKeys.includes(key)
      ? current.mediaKeys.filter((item) => item !== key)
      : [...current.mediaKeys, key],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>{product ? "Editar producto" : "Crear producto"}</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>El precio es una etiqueta informativa; no habilita pagos, carrito ni pedidos.</Text>
        </View>
        {product ? <Badge label={product.isActive ? "Activo" : "Inactivo"} tone={product.isActive ? "success" : "neutral"} /> : null}
      </View>
      {error ? <InlineNotice message={error} /> : null}

      <Card elevated style={styles.form}>
        <FormSection title="Ficha del producto">
          <FormField label="Nombre" maxLength={120} onChangeText={(name) => setDraft((current) => ({ ...current, name }))} value={draft.name} />
          <FormField label="Descripción" maxLength={600} multiline onChangeText={(description) => setDraft((current) => ({ ...current, description }))} value={draft.description} />
          <FormField label="Precio o referencia" maxLength={60} onChangeText={(priceLabel) => setDraft((current) => ({ ...current, priceLabel }))} placeholder="$120 MXN · Desde $80 · Pregunta por precio" value={draft.priceLabel} />
          <FormField label="Categoría" maxLength={60} onChangeText={(category) => setDraft((current) => ({ ...current, category }))} value={draft.category} />
          <ChoiceGroup label="Media demo" multiple onChange={toggleMedia} options={mediaOptions} value={draft.mediaKeys} />
          <ToggleField description="Un producto inactivo deja de aparecer en Marketplace después de refrescar." label="Producto activo" onValueChange={(isActive) => setDraft((current) => ({ ...current, isActive }))} value={draft.isActive} />
        </FormSection>
      </Card>
      <View style={styles.actions}>
        <Button label="Guardar producto" leading={<Ionicons color={theme.colors.textOnAccent} name="save-outline" size={20} />} loading={saving} onPress={() => onSave(draft)} />
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
  form: { gap: spacing.xxxl },
  actions: { alignItems: "flex-end" },
});
