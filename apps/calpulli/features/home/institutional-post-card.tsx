import type {
  Department,
  InstitutionalPost,
  MediaReference,
} from "@calpulli/domain";
import {
  Badge,
  CalpulliMark,
  Card,
  culturalColors,
  radii,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { selectFirstSharedImage } from "../media/shared-media-presentation";
import {
  formatPublishedAt,
  getDepartmentAccent,
  getDepartmentMonogram,
  getPriorityPresentation,
} from "./presentation";

export interface InstitutionalPostCardProps {
  department?: Department;
  favorite: boolean;
  favoriteActionLabel?: string;
  favoriteReady: boolean;
  favoriteSaving: boolean;
  onToggleFavorite(): void;
  post: InstitutionalPost;
}

export function InstitutionalPostCard({
  department,
  favorite,
  favoriteActionLabel,
  favoriteReady,
  favoriteSaving,
  onToggleFavorite,
  post,
}: InstitutionalPostCardProps) {
  const { theme } = useCalpulliTheme();
  const departmentAccent = getDepartmentAccent(department);
  const priority = getPriorityPresentation(post.priority);
  const authorName = department?.name ?? "UPIICSA Calpulli";

  return (
    <Card
      elevated={post.priority !== "normal"}
      style={[styles.card, { borderLeftColor: priority.accent }]}
    >
      <View style={styles.header}>
        {post.visibility.showDepartment ? (
          <>
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: theme.colors.surfaceElevated,
                  borderColor: departmentAccent,
                },
              ]}
            >
              <Text
                style={[styles.monogram, { color: theme.colors.textPrimary }]}
              >
                {getDepartmentMonogram(department)}
              </Text>
            </View>
            <View style={styles.authorCopy}>
              <Text
                numberOfLines={1}
                style={[styles.author, { color: theme.colors.textPrimary }]}
              >
                {authorName}
              </Text>
              {post.visibility.showDate ? (
                <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
                  {formatPublishedAt(post.publishedAt)}
                </Text>
              ) : null}
            </View>
          </>
        ) : (
          <>
            <CalpulliMark size={42} />
            <View style={styles.authorCopy}>
              <Text style={[styles.author, { color: theme.colors.textPrimary }]}>
                Aviso institucional
              </Text>
              {post.visibility.showDate ? (
                <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
                  {formatPublishedAt(post.publishedAt)}
                </Text>
              ) : null}
            </View>
          </>
        )}
        {priority.label ? (
          <Badge label={priority.label} tone={priority.badgeTone} />
        ) : null}
      </View>

      <View style={styles.copy}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
          {post.title}
        </Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>
          {post.body}
        </Text>
      </View>

      {post.visibility.showMedia && post.media.length > 0 ? (
        <PostMediaPreview
          accent={departmentAccent}
          media={post.media}
          title={post.title}
        />
      ) : null}

      <View style={styles.metadata}>
        {post.visibility.showLocation && post.location ? (
          <MetadataItem icon="location-outline" label={post.location} />
        ) : null}
        {post.linkUrl ? (
          <MetadataItem icon="link-outline" label="Enlace disponible" />
        ) : null}
        {post.document ? (
          <MetadataItem icon="document-text-outline" label="Documento adjunto" />
        ) : null}
      </View>

      <View
        style={[styles.footer, { borderTopColor: theme.colors.borderSubtle }]}
      >
        {post.visibility.showViews ? (
          <View accessibilityLabel={`${post.views} visualizaciones`} style={styles.views}>
            <Ionicons
              color={theme.colors.textSecondary}
              name="eye-outline"
              size={19}
            />
            <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
              {post.views.toLocaleString("es-MX")}
            </Text>
          </View>
        ) : (
          <View />
        )}

        <Pressable
          accessibilityLabel={favorite ? "Quitar de favoritos" : "Guardar en favoritos"}
          accessibilityRole="button"
          accessibilityState={{
            busy: favoriteSaving,
            disabled: !favoriteReady || favoriteSaving,
            selected: favorite,
          }}
          disabled={!favoriteReady || favoriteSaving}
          hitSlop={spacing.sm}
          onPress={onToggleFavorite}
          style={({ pressed }) => [
            styles.favorite,
            pressed && styles.pressed,
            (!favoriteReady || favoriteSaving) && styles.disabled,
          ]}
        >
          <Ionicons
            color={favorite ? theme.colors.primary : theme.colors.textSecondary}
            name={favorite ? "bookmark" : "bookmark-outline"}
            size={21}
          />
          <Text
            style={[
              styles.footerText,
              {
                color: favorite
                  ? theme.colors.primary
                  : theme.colors.textSecondary,
              },
            ]}
          >
            {favoriteActionLabel ?? (favorite ? "Guardado" : "Guardar")}
          </Text>
        </Pressable>
      </View>
    </Card>
  );
}

function PostMediaPreview({
  accent,
  media,
  title,
}: {
  accent: string;
  media: MediaReference[];
  title: string;
}) {
  const { theme } = useCalpulliTheme();
  const countLabel = media.length === 1 ? "1 medio" : `${media.length} medios`;
  const sharedImage = selectFirstSharedImage(media);
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const showSharedImage = sharedImage !== undefined && failedUri !== sharedImage.uri;

  return (
    <View
      accessibilityLabel={`Contenido visual de ${title}, ${countLabel}`}
      style={[styles.media, { backgroundColor: theme.colors.primaryMuted }]}
    >
      {showSharedImage ? (
        <>
          <Image
            accessibilityLabel={`Imagen de ${title}`}
            onError={() => setFailedUri(sharedImage.uri)}
            resizeMode="cover"
            source={{ uri: sharedImage.uri }}
            style={styles.sharedImage}
          />
          {media.length > 1 ? (
            <View style={[styles.mediaCount, { backgroundColor: theme.colors.overlay }]}>
              <Ionicons color={culturalColors.white} name="images-outline" size={15} />
              <Text style={[styles.mediaCountLabel, { color: culturalColors.white }]}>{media.length}</Text>
            </View>
          ) : null}
        </>
      ) : (
        <>
          <View style={styles.mediaIcon}>
            <Ionicons
              color={theme.colors.primary}
              name="images-outline"
              size={38}
            />
            <Text style={[styles.mediaLabel, { color: theme.colors.textSecondary }]}>
              {countLabel}
            </Text>
          </View>
          <View style={styles.pattern}>
            <View style={[styles.patternLong, { backgroundColor: accent }]} />
            <View style={[styles.patternMedium, { backgroundColor: accent }]} />
            <View style={[styles.patternShort, { backgroundColor: accent }]} />
          </View>
        </>
      )}
    </View>
  );
}

function MetadataItem({
  icon,
  label,
}: {
  icon: "document-text-outline" | "link-outline" | "location-outline";
  label: string;
}) {
  const { theme } = useCalpulliTheme();

  return (
    <View style={styles.metadataItem}>
      <Ionicons color={theme.colors.primary} name={icon} size={18} />
      <Text
        numberOfLines={2}
        style={[styles.metadataText, { color: theme.colors.textSecondary }]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 4,
    gap: spacing.xl,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
  },
  avatar: {
    alignItems: "center",
    borderRadius: radii.sm,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  monogram: {
    fontSize: 13,
    fontWeight: "800",
  },
  authorCopy: {
    flex: 1,
  },
  author: {
    ...typography.label,
  },
  date: {
    ...typography.caption,
  },
  copy: {
    gap: spacing.sm,
  },
  title: {
    ...typography.heading,
  },
  body: {
    ...typography.body,
  },
  media: {
    aspectRatio: 1.75,
    borderRadius: radii.md,
    justifyContent: "center",
    overflow: "hidden",
    padding: spacing.xl,
  },
  mediaIcon: {
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  sharedImage: {
    ...StyleSheet.absoluteFillObject,
  },
  mediaCount: {
    alignItems: "center",
    borderRadius: radii.pill,
    bottom: spacing.md,
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    position: "absolute",
    right: spacing.md,
  },
  mediaCountLabel: {
    ...typography.caption,
    fontWeight: "800",
  },
  mediaLabel: {
    ...typography.caption,
  },
  pattern: {
    alignItems: "flex-end",
    bottom: spacing.xl,
    gap: spacing.xs,
    position: "absolute",
    right: spacing.xl,
  },
  patternLong: {
    height: 8,
    width: 84,
  },
  patternMedium: {
    height: 8,
    width: 60,
  },
  patternShort: {
    height: 8,
    width: 36,
  },
  metadata: {
    gap: spacing.sm,
  },
  metadataItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  metadataText: {
    ...typography.caption,
    flex: 1,
  },
  footer: {
    alignItems: "center",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: spacing.lg,
  },
  views: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 44,
  },
  favorite: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 44,
    paddingHorizontal: spacing.sm,
  },
  footerText: {
    ...typography.label,
  },
  pressed: {
    opacity: 0.65,
  },
  disabled: {
    opacity: 0.5,
  },
});
