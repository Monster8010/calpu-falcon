import { radii, spacing, useCalpulliTheme } from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

function TabIcon({
  color,
  focused,
  name,
  selectedName,
  size,
}: {
  color: string;
  focused: boolean;
  name: IoniconName;
  selectedName: IoniconName;
  size: number;
}) {
  return (
    <Ionicons
      color={color}
      name={focused ? selectedName : name}
      size={size}
    />
  );
}

export default function PublicTabsLayout() {
  const { theme } = useCalpulliTheme();

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        animation: "fade",
        headerShown: false,
        sceneStyle: { backgroundColor: theme.colors.background },
        tabBarActiveBackgroundColor: theme.colors.primaryMuted,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: theme.colors.navigationInactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
        tabBarItemStyle: {
          borderRadius: radii.sm,
          marginHorizontal: spacing.xs,
          marginVertical: spacing.xs,
          paddingVertical: spacing.xs,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surfaceElevated,
          borderTopColor: theme.colors.borderSubtle,
          borderTopWidth: 1,
          minHeight: spacing.xxxl * 2,
          paddingHorizontal: spacing.xs,
          paddingTop: spacing.xs,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarAccessibilityLabel: "Inicio",
          tabBarIcon: ({ color, focused, size }) => (
            <TabIcon
              color={color}
              focused={focused}
              name="home-outline"
              selectedName="home"
              size={size}
            />
          ),
          title: "Inicio",
        }}
      />
      <Tabs.Screen
        name="fair"
        options={{
          tabBarAccessibilityLabel: "Feria",
          tabBarIcon: ({ color, focused, size }) => (
            <TabIcon
              color={color}
              focused={focused}
              name="map-outline"
              selectedName="map"
              size={size}
            />
          ),
          title: "Feria",
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          tabBarAccessibilityLabel: "Marketplace",
          tabBarIcon: ({ color, focused, size }) => (
            <TabIcon
              color={color}
              focused={focused}
              name="storefront-outline"
              selectedName="storefront"
              size={size}
            />
          ),
          title: "Marketplace",
        }}
      />
      <Tabs.Screen
        name="tutoring"
        options={{
          tabBarAccessibilityLabel: "Tutorías",
          tabBarIcon: ({ color, focused, size }) => (
            <TabIcon
              color={color}
              focused={focused}
              name="school-outline"
              selectedName="school"
              size={size}
            />
          ),
          title: "Tutorías",
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarAccessibilityLabel: "Favoritos",
          tabBarIcon: ({ color, focused, size }) => (
            <TabIcon
              color={color}
              focused={focused}
              name="bookmark-outline"
              selectedName="bookmark"
              size={size}
            />
          ),
          title: "Favoritos",
        }}
      />
    </Tabs>
  );
}
