import type { ExternalContact } from "@calpulli/domain";
import { Card, radii, spacing, typography, useCalpulliTheme } from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Linking from "expo-linking";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { getExternalContactUrl } from "./external-contact";

export function ExternalContactList({
  contacts,
}: {
  contacts: readonly ExternalContact[];
}) {
  const { theme } = useCalpulliTheme();

  return (
    <View style={styles.list}>
      {contacts.map((contact) => {
        const url = getExternalContactUrl(contact);

        return (
          <Pressable
            accessibilityHint="Abre otra aplicación para continuar el contacto"
            accessibilityLabel={`${contact.label}: ${contact.value}`}
            accessibilityRole="link"
            disabled={url === null}
            key={contact.id}
            onPress={() => {
              if (url === null) return;
              void Linking.openURL(url).catch(() => {
                Alert.alert(
                  "No pudimos abrir el contacto",
                  "Puedes copiar el dato mostrado e intentarlo desde otra aplicación.",
                );
              });
            }}
            style={({ pressed }) => [pressed && styles.pressed, url === null && styles.disabled]}
          >
            <Card style={styles.contact}>
              <View style={[styles.icon, { backgroundColor: theme.colors.primaryMuted }]}>
                <Ionicons color={theme.colors.primary} name={CONTACT_ICONS[contact.type]} size={21} />
              </View>
              <View style={styles.copy}>
                <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{contact.label}</Text>
                <Text selectable style={[styles.value, { color: theme.colors.textSecondary }]}>{contact.value}</Text>
              </View>
              {url ? (
                <View style={styles.action}>
                  <Text style={[styles.actionLabel, { color: theme.colors.primary }]}>Abrir</Text>
                  <Ionicons color={theme.colors.primary} name="open-outline" size={20} />
                </View>
              ) : null}
            </Card>
          </Pressable>
        );
      })}
    </View>
  );
}

const CONTACT_ICONS: Record<ExternalContact["type"], keyof typeof Ionicons.glyphMap> = {
  whatsapp: "logo-whatsapp",
  telegram: "paper-plane-outline",
  email: "mail-outline",
  instagram: "logo-instagram",
  phone: "call-outline",
  other: "link-outline",
};

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
  contact: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
  },
  icon: {
    alignItems: "center",
    borderRadius: radii.sm,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  copy: {
    flex: 1,
  },
  label: {
    ...typography.label,
  },
  value: {
    ...typography.caption,
  },
  action: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
  },
  actionLabel: {
    ...typography.label,
  },
  pressed: {
    opacity: 0.67,
  },
  disabled: {
    opacity: 0.62,
  },
});
