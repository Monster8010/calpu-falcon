export type AppThemePreference = "system" | "light" | "dark";

export interface AppConfiguration {
  schemaVersion: number;
  demoMode: boolean;
  institutionName: string;
  publicAppName: string;
  managementAppName: string;
  defaultTheme: AppThemePreference;
}

