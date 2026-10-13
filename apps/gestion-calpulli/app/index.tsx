import { createDemoSeed } from "@calpulli/mock-data";
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
  radii,
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

type GatewayStatus =
  | "checking"
  | "disconnected"
  | "empty"
  | "error"
  | "ready";

interface DirectoryInspection {
  message: string;
  revision: number | null;
  status: Extract<GatewayStatus, "empty" | "error" | "ready">;
}

function readableStorageError(error: unknown): string {
  if (isSharedStoreError(error)) return error.message;
  return "Ocurrió un error inesperado al acceder al almacenamiento.";
}

async function inspectDirectory(directoryUri: string): Promise<DirectoryInspection> {
  try {
    const snapshot = await createExpoSafSharedStore(
      directoryUri,
      "gestion-calpulli",
    ).readStateSnapshot();

    return {
      message: snapshot.source === "backup"
        ? "Conexión lista; el estado válido se recuperó desde el respaldo."
        : "Conexión y estado compartido validados.",
      revision: snapshot.state.meta.revision,
      status: "ready",
    };
  } catch (error) {
    if (isSharedStoreError(error) && error.code === "STATE_NOT_FOUND") {
      return {
        message: "La carpeta está conectada y todavía no contiene datos compartidos.",
        revision: null,
        status: "empty",
      };
    }

    return {
      message: readableStorageError(error),
      revision: null,
      status: "error",
    };
  }
}

export default function ManagementStorageGateway() {
  const { theme } = useCalpulliTheme();
  const [status, setStatus] = useState<GatewayStatus>("checking");
  const [directoryUri, setDirectoryUri] = useState<string | null>(null);
  const [revision, setRevision] = useState<number | null>(null);
  const [message, setMessage] = useState("Validando la configuración guardada en este dispositivo.");
  const [busy, setBusy] = useState(false);

  const applyInspection = (inspection: DirectoryInspection) => {
    setStatus(inspection.status);
    setRevision(inspection.revision);
    setMessage(inspection.message);
  };

  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      try {
        const storedUri = await loadDirectoryUri();

        if (storedUri === null) {
          if (!cancelled) {
            setStatus("disconnected");
            setMessage("Conecta la misma carpeta que utiliza UPIICSA Calpulli.");
          }
          return;
        }

        await validateExpoSharedDirectory(storedUri);
        const inspection = await inspectDirectory(storedUri);

        if (!cancelled) {
          setDirectoryUri(storedUri);
          applyInspection(inspection);
        }
      } catch (error) {
        await removeDirectoryUri().catch(() => undefined);

        if (!cancelled) {
          setDirectoryUri(null);
          setRevision(null);
          setStatus("disconnected");
          setMessage(`La conexión anterior dejó de ser válida. ${readableStorageError(error)}`);
        }
      }
    };

    void restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const connectDirectory = async () => {
    setBusy(true);

    try {
      const selectedUri = await requestSharedDirectory(directoryUri ?? undefined);
      await validateExpoSharedDirectory(selectedUri);
      await saveDirectoryUri(selectedUri);
      setDirectoryUri(selectedUri);
      applyInspection(await inspectDirectory(selectedUri));
    } catch (error) {
      setMessage(readableStorageError(error));
    } finally {
      setBusy(false);
    }
  };

  const retryInspection = async () => {
    if (directoryUri === null) return;
    setBusy(true);
    applyInspection(await inspectDirectory(directoryUri));
    setBusy(false);
  };

  const initializeDemoData = async () => {
    if (directoryUri === null || status !== "empty") return;
    setBusy(true);

    try {
      const persisted = await createExpoSafSharedStore(
        directoryUri,
        "gestion-calpulli",
      ).initializeState(createDemoSeed());
      setRevision(persisted.meta.revision);
      setMessage("Datos de demostración inicializados y verificados.");
      setStatus("ready");
    } catch (error) {
      setStatus("error");
      setMessage(readableStorageError(error));
    } finally {
      setBusy(false);
    }
  };

  if (status === "ready") {
    return <Redirect href="/roles" />;
  }

  const statusTone = status === "empty" ? "warning" : status === "error" ? "danger" : "neutral";
  const statusLabel = status === "checking"
    ? "Validando"
    : status === "disconnected"
      ? "Sin conexión"
      : status === "empty"
        ? "Lista para inicializar"
        : "Revisión necesaria";

  return (
    <Screen contentStyle={styles.content} edges={["top", "bottom", "left", "right"]}>
      <AppHeader
        eyebrow="Gestión UPIICSA Calpulli"
        subtitle="Conecta el almacenamiento compartido antes de elegir un perfil de demostración."
        title="Preparar Gestión"
      />

      <Card elevated style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconWell, { backgroundColor: theme.colors.primaryMuted }]}>
            <Ionicons color={theme.colors.primary} name="folder-open-outline" size={30} />
          </View>
          <Badge label={statusLabel} tone={statusTone} />
        </View>
        <View style={styles.cardCopy}>
          <Text style={[styles.heading, { color: theme.colors.textPrimary }]}>Almacenamiento Calpulli</Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{message}</Text>
          {revision !== null ? <Text style={[styles.revision, { color: theme.colors.primary }]}>Revisión compartida {revision}</Text> : null}
        </View>
        {status === "checking" ? <ActivityIndicator color={theme.colors.primary} size="large" /> : null}
      </Card>

      {status === "disconnected" ? (
        <Button
          label="Conectar almacenamiento Calpulli"
          leading={<Ionicons color={theme.colors.textOnAccent} name="folder-outline" size={20} />}
          loading={busy}
          onPress={() => void connectDirectory()}
        />
      ) : null}

      {status === "empty" ? (
        <View style={styles.actions}>
          <Button
            label="Inicializar datos de demostración"
            leading={<Ionicons color={theme.colors.textOnAccent} name="sparkles-outline" size={20} />}
            loading={busy}
            onPress={() => void initializeDemoData()}
          />
          <Button disabled={busy} label="Elegir otra carpeta" onPress={() => void connectDirectory()} variant="secondary" />
        </View>
      ) : null}

      {status === "error" ? (
        <View style={styles.actions}>
          <Button label="Reintentar lectura" loading={busy} onPress={() => void retryInspection()} />
          <Button disabled={busy} label="Elegir otra carpeta" onPress={() => void connectDirectory()} variant="secondary" />
        </View>
      ) : null}

      <View style={[styles.demoNote, { borderColor: theme.colors.borderSubtle }]}>
        <Ionicons color={theme.colors.primary} name="information-circle-outline" size={22} />
        <Text style={[styles.noteText, { color: theme.colors.textSecondary }]}>Los perfiles siguientes son controles de navegación para la demo, no cuentas ni autenticación.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xxl,
    justifyContent: "center",
    marginHorizontal: "auto",
    maxWidth: 680,
    width: "100%",
  },
  card: {
    gap: spacing.xl,
  },
  cardHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconWell: {
    alignItems: "center",
    borderRadius: radii.md,
    height: 58,
    justifyContent: "center",
    width: 58,
  },
  cardCopy: {
    gap: spacing.sm,
  },
  heading: {
    ...typography.heading,
  },
  body: {
    ...typography.body,
  },
  revision: {
    ...typography.label,
  },
  actions: {
    gap: spacing.md,
  },
  demoNote: {
    alignItems: "center",
    borderRadius: radii.sm,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg,
  },
  noteText: {
    ...typography.caption,
    flex: 1,
  },
});
