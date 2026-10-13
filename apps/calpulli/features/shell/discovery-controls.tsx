import { radii, spacing, typography, useCalpulliTheme } from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export function LocalSearchField({
  onChangeText,
  placeholder,
  value,
}: {
  onChangeText(value: string): void;
  placeholder: string;
  value: string;
}) {
  const { theme } = useCalpulliTheme();

  return (
    <View
      style={[
        styles.search,
        {
          backgroundColor: theme.colors.surfaceElevated,
          borderColor: theme.colors.borderSubtle,
        },
      ]}
    >
      <Ionicons color={theme.colors.textSecondary} name="search-outline" size={21} />
      <TextInput
        accessibilityLabel={placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        returnKeyType="search"
        style={[styles.searchInput, { color: theme.colors.textPrimary }]}
        value={value}
      />
      {value.length > 0 ? (
        <Pressable
          accessibilityLabel="Limpiar búsqueda"
          accessibilityRole="button"
          hitSlop={8}
          onPress={() => onChangeText("")}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <Ionicons color={theme.colors.textSecondary} name="close-circle" size={21} />
        </Pressable>
      ) : null}
    </View>
  );
}

export interface FilterOption<T extends string> {
  label: string;
  value: T;
}

export function FilterRail<T extends string>({
  accessibilityLabel,
  onSelect,
  options,
  selected,
}: {
  accessibilityLabel: string;
  onSelect(value: T): void;
  options: readonly FilterOption<T>[];
  selected: T;
}) {
  const { theme } = useCalpulliTheme();

  return (
    <ScrollView
      accessibilityLabel={accessibilityLabel}
      contentContainerStyle={styles.rail}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {options.map((option) => {
        const active = option.value === selected;

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            key={option.value}
            onPress={() => onSelect(option.value)}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: active
                  ? theme.colors.primaryMuted
                  : theme.colors.surfaceElevated,
                borderColor: active
                  ? theme.colors.primary
                  : theme.colors.borderSubtle,
              },
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.chipLabel,
                {
                  color: active
                    ? theme.colors.primary
                    : theme.colors.textSecondary,
                },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  search: {
    alignItems: "center",
    borderRadius: radii.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 52,
    paddingHorizontal: spacing.lg,
  },
  searchInput: {
    ...typography.body,
    flex: 1,
    paddingVertical: spacing.sm,
  },
  rail: {
    gap: spacing.sm,
    paddingRight: spacing.xl,
  },
  chip: {
    borderRadius: radii.pill,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: spacing.lg,
  },
  chipLabel: {
    ...typography.label,
  },
  pressed: {
    opacity: 0.66,
  },
});
