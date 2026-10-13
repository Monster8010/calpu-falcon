import { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { motion, radii } from "../tokens";
import { useCalpulliTheme } from "../theme";

export interface SkeletonProps {
  height: number;
  radius?: keyof typeof radii;
  style?: StyleProp<ViewStyle>;
  width?: number | `${number}%`;
}

export function Skeleton({
  height,
  radius = "sm",
  style,
  width = "100%",
}: SkeletonProps) {
  const { theme } = useCalpulliTheme();
  const reduceMotion = useReduceMotion();
  const opacity = useRef(new Animated.Value(0.52)).current;

  useEffect(() => {
    if (reduceMotion) {
      opacity.setValue(1);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          duration: motion.deliberate * 3,
          easing: Easing.inOut(Easing.ease),
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          duration: motion.deliberate * 3,
          easing: Easing.inOut(Easing.ease),
          toValue: 0.52,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity, reduceMotion]);

  return (
    <Animated.View
      accessibilityLabel="Cargando contenido"
      accessibilityRole="progressbar"
      style={[
        styles.base,
        {
          backgroundColor: theme.colors.surfaceMuted,
          borderRadius: radii[radius],
          height,
          opacity,
          width,
        },
        style,
      ]}
    />
  );
}

function useReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (active) setReduceMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion,
    );

    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  return reduceMotion;
}

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
  },
});
