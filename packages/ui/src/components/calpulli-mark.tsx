import { StyleSheet, View } from "react-native";

import { radii } from "../tokens";
import { useCalpulliTheme } from "../theme";

export interface CalpulliMarkProps {
  size?: number;
}

export function CalpulliMark({ size = 44 }: CalpulliMarkProps) {
  const { theme } = useCalpulliTheme();
  const unit = size / 5;

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.primary,
          borderRadius: radii.sm,
          height: size,
          width: size,
        },
      ]}
    >
      <View
        style={[
          styles.block,
          {
            backgroundColor: theme.colors.textOnAccent,
            height: unit,
            left: unit,
            top: unit,
            width: unit * 3,
          },
        ]}
      />
      <View
        style={[
          styles.block,
          {
            backgroundColor: theme.colors.textOnAccent,
            height: unit * 2,
            left: unit * 2,
            top: unit * 2,
            width: unit,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  block: {
    position: "absolute",
  },
});
