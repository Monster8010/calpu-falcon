import { ThemeProvider, useCalpulliTheme } from "@calpulli/ui";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

function RootNavigator() {
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
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="entrepreneur/[id]" />
        <Stack.Screen name="marketplace/[kind]/[id]" />
        <Stack.Screen name="tutor/[id]" />
      </Stack>
      <StatusBar animated style={theme.isDark ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
