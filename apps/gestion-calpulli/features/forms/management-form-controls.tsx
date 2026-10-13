import { radii, spacing, typography, useCalpulliTheme } from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";

export function FormField({
  hint,
  label,
  multiline = false,
  ...inputProps
}: TextInputProps & { hint?: string; label: string }) {
  const { theme } = useCalpulliTheme();

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{label}</Text>
      {hint ? <Text style={[styles.hint, { color: theme.colors.textSecondary }]}>{hint}</Text> : null}
      <TextInput
        accessibilityLabel={label}
        multiline={multiline}
        placeholderTextColor={theme.colors.textSecondary}
        selectionColor={theme.colors.primary}
        style={[
          styles.input,
          multiline && styles.multiline,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.borderSubtle,
            color: theme.colors.textPrimary,
          },
        ]}
        textAlignVertical={multiline ? "top" : "center"}
        {...inputProps}
      />
    </View>
  );
}

export function ChoiceGroup<T extends string | number>({
  label,
  multiple = false,
  onChange,
  options,
  value,
}: {
  label: string;
  multiple?: boolean;
  onChange(value: T): void;
  options: readonly { label: string; value: T }[];
  value: T | readonly T[];
}) {
  const { theme } = useCalpulliTheme();
  const selectedValues = Array.isArray(value) ? value : [value];

  return (
    <View accessibilityRole={multiple ? undefined : "radiogroup"} style={styles.field}>
      <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{label}</Text>
      <View style={styles.chips}>
        {options.map((option) => {
          const selected = selectedValues.includes(option.value);
          return (
            <Pressable
              accessibilityLabel={option.label}
              accessibilityRole={multiple ? "checkbox" : "radio"}
              accessibilityState={{ checked: selected }}
              key={String(option.value)}
              onPress={() => onChange(option.value)}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: selected
                    ? theme.colors.primaryMuted
                    : theme.colors.surfaceElevated,
                  borderColor: selected
                    ? theme.colors.primary
                    : theme.colors.borderSubtle,
                },
                pressed && styles.pressed,
              ]}
            >
              {selected ? <Ionicons color={theme.colors.primary} name="checkmark" size={16} /> : null}
              <Text style={[styles.chipLabel, { color: selected ? theme.colors.primary : theme.colors.textPrimary }]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function ToggleField({
  description,
  label,
  onValueChange,
  value,
}: {
  description?: string;
  label: string;
  onValueChange(value: boolean): void;
  value: boolean;
}) {
  const { theme } = useCalpulliTheme();

  return (
    <View style={[styles.toggle, { borderBottomColor: theme.colors.borderSubtle }]}>
      <View style={styles.toggleCopy}>
        <Text style={[styles.toggleLabel, { color: theme.colors.textPrimary }]}>{label}</Text>
        {description ? <Text style={[styles.hint, { color: theme.colors.textSecondary }]}>{description}</Text> : null}
      </View>
      <Switch
        accessibilityLabel={label}
        onValueChange={onValueChange}
        thumbColor={value ? theme.colors.primary : theme.colors.surfaceElevated}
        trackColor={{ false: theme.colors.borderSubtle, true: theme.colors.primaryMuted }}
        value={value}
      />
    </View>
  );
}

export function FormSection({ children, title }: { children: ReactNode; title: string }) {
  const { theme } = useCalpulliTheme();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>{title}</Text>
      {children}
    </View>
  );
}

export function InlineNotice({
  message,
  tone = "error",
}: {
  message: string;
  tone?: "error" | "info" | "success";
}) {
  const { theme } = useCalpulliTheme();
  const color = tone === "error"
    ? theme.colors.danger
    : tone === "success"
      ? theme.colors.success
      : theme.colors.primary;
  return (
    <View accessibilityRole={tone === "error" ? "alert" : "text"} style={[styles.notice, { borderColor: color }]}>
      <Ionicons color={color} name={tone === "error" ? "alert-circle-outline" : "information-circle-outline"} size={20} />
      <Text style={[styles.noticeText, { color: theme.colors.textPrimary }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
  },
  hint: {
    ...typography.caption,
  },
  input: {
    ...typography.body,
    borderRadius: radii.sm,
    borderWidth: 1,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  multiline: {
    minHeight: 126,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    alignItems: "center",
    borderRadius: radii.pill,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    minHeight: 42,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipLabel: {
    ...typography.label,
  },
  pressed: {
    opacity: 0.65,
  },
  toggle: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    minHeight: 62,
    paddingVertical: spacing.sm,
  },
  toggleCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  toggleLabel: {
    ...typography.body,
    fontWeight: "600",
  },
  section: {
    gap: spacing.lg,
  },
  sectionTitle: {
    ...typography.heading,
  },
  notice: {
    alignItems: "center",
    borderLeftWidth: 3,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md,
  },
  noticeText: {
    ...typography.caption,
    flex: 1,
  },
});
