import type { Entrepreneur, Stand } from "@calpulli/domain";
import {
  Badge,
  Button,
  culturalColors,
  radii,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EntrepreneurAvatar, getEntrepreneurAccent } from "../entrepreneurs/entrepreneur-avatar";

export interface StandBottomSheetProps {
  entrepreneur?: Entrepreneur;
  onClose(): void;
  onViewProfile(entrepreneur: Entrepreneur): void;
  stand: Stand | null;
}

export function StandBottomSheet({
  entrepreneur,
  onClose,
  onViewProfile,
  stand,
}: StandBottomSheetProps) {
  const { theme } = useCalpulliTheme();

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent
      visible={stand !== null}
    >
      <View style={[styles.modal, { backgroundColor: theme.colors.overlay }]}>
        <Pressable
          accessibilityLabel="Cerrar detalles de la mesa"
          accessibilityRole="button"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView
          accessibilityViewIsModal
          edges={["bottom"]}
          style={[styles.sheet, { backgroundColor: theme.colors.surfaceElevated }]}
        >
          {stand ? (
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
              <View style={[styles.handle, { backgroundColor: theme.colors.borderSubtle }]} />
              <View style={styles.header}>
                <View style={styles.headerCopy}>
                  <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>Mesa {stand.number}</Text>
                  <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>
                    {stand.status === "available"
                      ? "Disponible"
                      : stand.status === "requested"
                        ? "Apartada"
                        : entrepreneur?.displayName ?? "Emprendimiento asignado"}
                  </Text>
                </View>
                <Pressable
                  accessibilityLabel="Cerrar"
                  accessibilityRole="button"
                  hitSlop={12}
                  onPress={onClose}
                  style={({ pressed }) => [
                    styles.closeButton,
                    { backgroundColor: theme.colors.surfaceMuted },
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons color={theme.colors.textPrimary} name="close" size={24} />
                </Pressable>
              </View>

              <StandSheetContent entrepreneur={entrepreneur} stand={stand} />

              <View style={styles.actions}>
                {stand.status === "assigned" && entrepreneur ? (
                  <Button
                    label="Ver perfil del emprendimiento"
                    leading={<Ionicons color={theme.colors.textOnAccent} name="arrow-forward" size={19} />}
                    onPress={() => onViewProfile(entrepreneur)}
                  />
                ) : null}
                <Button label="Cerrar" onPress={onClose} variant="ghost" />
              </View>
            </ScrollView>
          ) : null}
        </SafeAreaView>
      </View>
    </Modal>
  );
}

function StandSheetContent({ entrepreneur, stand }: { entrepreneur?: Entrepreneur; stand: Stand }) {
  const { theme } = useCalpulliTheme();

  if (stand.status === "available") {
    return (
      <View style={styles.message}>
        <View style={[styles.stateIcon, { backgroundColor: theme.colors.primaryMuted }]}>
          <Ionicons color={theme.colors.success} name="checkmark-circle-outline" size={36} />
        </View>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>Esta mesa todavía no tiene un emprendimiento asignado. Su estado se actualizará cuando Gestión confirme un cambio.</Text>
      </View>
    );
  }

  if (stand.status === "requested") {
    return (
      <View style={styles.message}>
        <View style={[styles.stateIcon, { backgroundColor: theme.colors.surfaceMuted }]}>
          <Ionicons color={theme.colors.warning} name="time-outline" size={36} />
        </View>
        <View style={styles.messageCopy}>
          <Badge label="En revisión" tone="warning" />
          <Text style={[styles.body, { color: theme.colors.textSecondary }]}>Esta mesa está apartada mientras se revisa una solicitud. La identidad de quien solicitó permanece privada hasta que exista una asignación.</Text>
        </View>
      </View>
    );
  }

  if (!entrepreneur) {
    return (
      <View style={styles.message}>
        <View style={[styles.stateIcon, { backgroundColor: theme.colors.surfaceMuted }]}>
          <Ionicons color={theme.colors.primary} name="storefront-outline" size={36} />
        </View>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>La mesa tiene una asignación, pero su perfil público no está disponible.</Text>
      </View>
    );
  }

  const accent = getEntrepreneurAccent(entrepreneur);

  return (
    <View style={styles.profile}>
      <View style={styles.identity}>
        <EntrepreneurAvatar entrepreneur={entrepreneur} size={76} />
        <View style={styles.identityCopy}>
          <Badge label={entrepreneur.category} tone="accent" />
          <Text numberOfLines={3} style={[styles.body, { color: theme.colors.textSecondary }]}>{entrepreneur.description}</Text>
        </View>
      </View>
      {entrepreneur.gallery.length > 0 ? (
        <View style={styles.previewRail}>
          {entrepreneur.gallery.slice(0, 3).map((media, index) => (
            <View
              accessibilityLabel={`Vista previa ${index + 1} de ${entrepreneur.displayName}`}
              key={media.type === "bundled" ? media.key : media.uri}
              style={[styles.preview, { backgroundColor: index % 2 === 0 ? accent : culturalColors.cempasuchil }]}
            >
              <Ionicons color={culturalColors.white} name="sparkles-outline" size={22} />
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    maxHeight: "78%",
    overflow: "hidden",
  },
  content: {
    gap: spacing.xl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  handle: {
    alignSelf: "center",
    borderRadius: radii.pill,
    height: 4,
    width: 44,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.lg,
  },
  headerCopy: {
    flex: 1,
  },
  eyebrow: {
    ...typography.caption,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  title: {
    ...typography.title,
  },
  closeButton: {
    alignItems: "center",
    borderRadius: radii.pill,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  pressed: {
    opacity: 0.65,
  },
  message: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.lg,
  },
  stateIcon: {
    alignItems: "center",
    borderRadius: radii.md,
    height: 72,
    justifyContent: "center",
    width: 72,
  },
  messageCopy: {
    flex: 1,
    gap: spacing.sm,
  },
  body: {
    ...typography.body,
    flex: 1,
  },
  profile: {
    gap: spacing.lg,
  },
  identity: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.lg,
  },
  identityCopy: {
    flex: 1,
    gap: spacing.sm,
  },
  previewRail: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  preview: {
    alignItems: "center",
    aspectRatio: 1.35,
    borderRadius: radii.sm,
    flex: 1,
    justifyContent: "center",
  },
  actions: {
    gap: spacing.sm,
  },
});
