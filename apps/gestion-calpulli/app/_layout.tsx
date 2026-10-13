import { ThemeProvider, useCalpulliTheme } from "@calpulli/ui";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { DemoRoleProvider } from "../features/roles/demo-role-context";

function ManagementNavigator() {
  const { theme } = useCalpulliTheme();

  return (
    <>
      <Stack
        screenOptions={{
          animation: "fade",
          contentStyle: { backgroundColor: theme.colors.background },
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="roles/index" />
        <Stack.Screen name="roles/[role]" />
        <Stack.Screen name="roles/superadmin/index" />
        <Stack.Screen name="roles/department/index" />
        <Stack.Screen name="roles/department/[departmentId]/index" />
        <Stack.Screen name="roles/fair-admin/index" />
        <Stack.Screen name="roles/entrepreneur/index" />
        <Stack.Screen name="roles/entrepreneur/[entrepreneurId]/index" />
        <Stack.Screen name="roles/tutor/index" />
        <Stack.Screen name="roles/tutor/[tutorId]/index" />
        <Stack.Screen name="roles/moderator/index" />
      </Stack>
      <StatusBar animated style={theme.isDark ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <DemoRoleProvider>
          <ManagementNavigator />
        </DemoRoleProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
