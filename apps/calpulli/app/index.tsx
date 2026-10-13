import {
  createExpoSafSharedStore,
  isSharedStoreError,
  requestSharedDirectory,
  validateExpoSharedDirectory,
} from "@calpulli/shared-store";
import {
  AppHeader,
  Badge,
  Button,
  Card,
  Screen,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import {
  loadDirectoryUri,
  removeDirectoryUri,
  saveDirectoryUri,
} from "../services/directory-uri-storage";

type ConnectionStatus = "checking" | "connected" | "disconnected";

function errorMessage(error: unknown): string {
  if (isSharedStoreError(error)) {
    return error.message;
  }

  return "No pudimos acceder al almacenamiento compartido.";
}

export default function StorageGatewayScreen() {
  const { theme } = useCalpulliTheme();
  const [status, setStatus] = useState<ConnectionStatus>("checking");
  const [storedDirectoryUri, setStoredDirectoryUri] = useState<string | null>(
    null,
  );
  const [message, setMessage] = useState(
    "Estamos validando la conexión guardada en este dispositivo.",
  );
  const [busy, setBusy] = useState(false);

  const inspectSharedData = async (directoryUri: string): Promise<void> => {
    try {
      const snapshot = await createExpoSafSharedStore(
        directoryUri,
        "calpulli",
      ).readStateSnapshot();
      setMessage(
        snapshot.source === "backup"
          ? "Conexión lista. Los datos se recuperaron desde el respaldo válido."
          : `Conexión lista en la revisión ${snapshot.state.meta.revision}.`,
      );
    } catch (error) {
      if (isSharedStoreError(error) && error.code === "STATE_NOT_FOUND") {
        setMessage(
          "La carpeta está lista; Gestión aún debe inicializar los datos de demostración.",
        );
        return;
      }

      setMessage(errorMessage(error));
    }
  };

  useEffect(() => {
    let cancelled = false;

    const restoreConnection = async () => {
      try {
        const directoryUri = await loadDirectoryUri();

        if (directoryUri === null) {
          if (!cancelled) {
            setStatus("disconnected");
            setMessage(
              "Elige la carpeta compartida que también utiliza Gestión Calpulli.",
            );
          }
          return;
        }

        await validateExpoSharedDirectory(directoryUri);

        if (cancelled) {
          return;
        }

        setStoredDirectoryUri(directoryUri);
        await inspectSharedData(directoryUri);

        if (!cancelled) {
          setStatus("connected");
        }
      } catch (error) {
        await removeDirectoryUri().catch(() => undefined);

        if (!cancelled) {
          setStoredDirectoryUri(null);
          setStatus("disconnected");
          setMessage(
            `La conexión anterior ya no está disponible. ${errorMessage(error)}`,
          );
        }
      }
    };

    void restoreConnection();

    return () => {
      cancelled = true;
    };
  }, []);

  const connectStorage = async () => {
    setBusy(true);

    try {
      const directoryUri = await requestSharedDirectory(
        storedDirectoryUri ?? undefined,
      );
      await validateExpoSharedDirectory(directoryUri);
      await saveDirectoryUri(directoryUri);
      setStoredDirectoryUri(directoryUri);
      await inspectSharedData(directoryUri);
      setStatus("connected");
    } catch (error) {
      setStatus("disconnected");
      setMessage(errorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  if (status === "connected") {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <Screen contentStyle={styles.screenContent} edges={["top", "bottom", "left", "right"]}>
      <AppHeader
        subtitle="Información, feria y comunidad universitaria en una experiencia local y sin depender de internet."
        title="Bienvenido a Calpulli"
      />

      <Card elevated style={styles.connectionCard}>
        <View style={styles.cardHeading}>
          <View
            style={[
              styles.iconWell,
              { backgroundColor: theme.colors.primaryMuted },
            ]}
          >
            <Ionicons
              color={theme.colors.primary}
              name="folder-open-outline"
              size={30}
            />
          </View>
          <Badge
            label={status === "checking" ? "Validando" : "Configuración inicial"}
            tone={status === "checking" ? "neutral" : "accent"}
          />
        </View>

        <View style={styles.cardCopy}>
          <Text style={[styles.cardTitle, { color: theme.colors.textPrimary }]}>
            Un espacio compartido, incluso sin conexión
          </Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary }]}>
            {message}
          </Text>
        </View>

        {status === "checking" ? (
          <ActivityIndicator color={theme.colors.primary} size="large" />
        ) : (
          <Button
            accessibilityHint="Abre el selector de carpetas de Android"
            label="Conectar almacenamiento Calpulli"
            loading={busy}
            onPress={() => void connectStorage()}
          />
        )}
      </Card>

      <View style={styles.steps}>
        <SetupStep
          number="1"
          text="Abre el selector y elige UPIICSA_Calpulli_Shared."
        />
        <SetupStep
          number="2"
          text="Usa exactamente la misma carpeta en la app de Gestión."
        />
        <SetupStep
          number="3"
          text="Calpulli recordará el acceso únicamente en este dispositivo."
        />
      </View>
    </Screen>
  );
}

function SetupStep({ number, text }: { number: string; text: string }) {
  const { theme } = useCalpulliTheme();

  return (
    <View style={styles.step}>
      <View
        style={[
          styles.stepNumber,
          {
            backgroundColor: theme.colors.surfaceMuted,
            borderColor: theme.colors.borderSubtle,
          },
        ]}
      >
        <Text style={[styles.stepNumberText, { color: theme.colors.primary }]}>
          {number}
        </Text>
      </View>
      <Text style={[styles.stepText, { color: theme.colors.textSecondary }]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    gap: spacing.xxl,
    justifyContent: "center",
    marginHorizontal: "auto",
    maxWidth: 680,
    width: "100%",
  },
  connectionCard: {
    gap: spacing.xxl,
  },
  cardHeading: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
  },
  iconWell: {
    alignItems: "center",
    borderRadius: 16,
    height: 56,
    justifyContent: "center",
    width: 56,
  },
  cardCopy: {
    gap: spacing.sm,
  },
  cardTitle: {
    ...typography.heading,
  },
  body: {
    ...typography.body,
  },
  steps: {
    gap: spacing.md,
  },
  step: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  stepNumber: {
    alignItems: "center",
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  stepNumberText: {
    ...typography.label,
  },
  stepText: {
    ...typography.body,
    flex: 1,
  },
});
