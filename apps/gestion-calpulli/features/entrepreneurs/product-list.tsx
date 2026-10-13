import type { Product } from "@calpulli/domain";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

export function ProductList({
  deletingId,
  onCreate,
  onDelete,
  onEdit,
  products,
}: {
  deletingId: string | null;
  onCreate(): void;
  onDelete(product: Product): void;
  onEdit(product: Product): void;
  products: readonly Product[];
}) {
  const { theme } = useCalpulliTheme();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>Mis productos</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Catálogo informativo para descubrimiento local, sin comercio electrónico.</Text>
        </View>
        <Button label="Crear producto" leading={<Ionicons color={theme.colors.textOnAccent} name="add-outline" size={19} />} onPress={onCreate} />
      </View>
      {products.length === 0 ? (
        <EmptyState description="Agrega una pieza, servicio o producto al escaparate." illustration={<Ionicons color={theme.colors.primary} name="cube-outline" size={48} />} title="Aún no hay productos" />
      ) : (
        <View style={styles.list}>
          {products.map((product) => (
            <Card key={product.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardCopy}>
                  <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>{product.name}</Text>
                  <Text style={[styles.category, { color: theme.colors.primary }]}>{product.category}</Text>
                </View>
                <Badge label={product.isActive ? "Activo" : "Inactivo"} tone={product.isActive ? "success" : "neutral"} />
              </View>
              {product.description ? <Text numberOfLines={3} style={[styles.body, { color: theme.colors.textSecondary }]}>{product.description}</Text> : null}
              <View style={styles.metaRow}>
                <Text style={[styles.price, { color: theme.colors.textPrimary }]}>{product.priceLabel ?? "Sin precio publicado"}</Text>
                <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>{product.media.length} medios</Text>
              </View>
              <View style={styles.actions}>
                <Button label="Editar" onPress={() => onEdit(product)} variant="secondary" />
                <Button disabled={deletingId !== null} label="Eliminar" loading={deletingId === product.id} onPress={() => onDelete(product)} variant="ghost" />
              </View>
            </Card>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xxl },
  header: { alignItems: "flex-start", flexDirection: "row", flexWrap: "wrap", gap: spacing.md, justifyContent: "space-between" },
  headerCopy: { flex: 1, gap: spacing.xs, minWidth: 230 },
  title: { ...typography.title },
  subtitle: { ...typography.body },
  list: { gap: spacing.md },
  card: { gap: spacing.lg },
  cardHeader: { alignItems: "flex-start", flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  cardCopy: { flex: 1, gap: spacing.xs, minWidth: 190 },
  cardTitle: { ...typography.heading },
  category: { ...typography.label },
  body: { ...typography.body },
  metaRow: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: spacing.md, justifyContent: "space-between" },
  price: { ...typography.label },
  meta: { ...typography.caption },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, justifyContent: "flex-end" },
});
