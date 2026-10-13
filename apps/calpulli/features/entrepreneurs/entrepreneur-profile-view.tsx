import type {
  Entrepreneur,
  EntrepreneurPost,
  ExternalContact,
  MediaReference,
  Product,
  Stand,
} from "@calpulli/domain";
import {
  Badge,
  Card,
  culturalColors,
  radii,
  spacing,
  typography,
  useCalpulliTheme,
} from "@calpulli/ui";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import { EntrepreneurAvatar, getEntrepreneurAccent } from "./entrepreneur-avatar";

export function EntrepreneurProfileView({
  entrepreneur,
  posts,
  products,
  stand,
}: {
  entrepreneur: Entrepreneur;
  posts: readonly EntrepreneurPost[];
  products: readonly Product[];
  stand?: Stand;
}) {
  const { theme } = useCalpulliTheme();
  const accent = getEntrepreneurAccent(entrepreneur);

  return (
    <View style={styles.container}>
      <Card elevated style={[styles.hero, { borderTopColor: accent }]}>
        <View style={styles.identity}>
          <EntrepreneurAvatar entrepreneur={entrepreneur} size={92} />
          <View style={styles.identityCopy}>
            <Badge label={entrepreneur.category} tone="accent" />
            <Text accessibilityRole="header" style={[styles.title, { color: theme.colors.textPrimary }]}>{entrepreneur.displayName}</Text>
          </View>
        </View>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{entrepreneur.description}</Text>
        {stand ? (
          <View style={[styles.stand, { backgroundColor: theme.colors.primaryMuted }]}>
            <Ionicons color={theme.colors.primary} name="location-outline" size={22} />
            <View style={styles.standCopy}>
              <Text style={[styles.label, { color: theme.colors.textPrimary }]}>Encuéntralo en la feria activa</Text>
              <Text style={[styles.caption, { color: theme.colors.textSecondary }]}>Mesa {stand.number}</Text>
            </View>
          </View>
        ) : null}
      </Card>

      {entrepreneur.gallery.length > 0 ? (
        <ProfileSection title="Galería">
          <View style={styles.gallery}>
            {entrepreneur.gallery.map((media, index) => (
              <GalleryTile
                accent={index % 2 === 0 ? accent : culturalColors.cempasuchil}
                entrepreneurName={entrepreneur.displayName}
                index={index}
                key={mediaKey(media, index)}
              />
            ))}
          </View>
        </ProfileSection>
      ) : null}

      {entrepreneur.externalContacts.length > 0 ? (
        <ProfileSection title="Contacto">
          <Card style={styles.contactCard}>
            {entrepreneur.externalContacts.map((contact, index) => (
              <ContactRow
                contact={contact}
                divider={index < entrepreneur.externalContacts.length - 1}
                key={contact.id}
              />
            ))}
          </Card>
        </ProfileSection>
      ) : null}

      <ProfileSection title="Productos">
        {products.length > 0 ? (
          <View style={styles.cardList}>
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </View>
        ) : (
          <SectionEmpty copy="Este emprendimiento aún no tiene productos públicos." icon="bag-outline" />
        )}
      </ProfileSection>

      <ProfileSection title="Publicaciones">
        {posts.length > 0 ? (
          <View style={styles.cardList}>
            {posts.map((post) => <EntrepreneurPostCard key={post.id} post={post} />)}
          </View>
        ) : (
          <SectionEmpty copy="Todavía no hay publicaciones visibles." icon="newspaper-outline" />
        )}
      </ProfileSection>
    </View>
  );
}

function ProfileSection({ children, title }: { children: React.ReactNode; title: string }) {
  const { theme } = useCalpulliTheme();

  return (
    <View style={styles.section}>
      <Text accessibilityRole="header" style={[styles.heading, { color: theme.colors.textPrimary }]}>{title}</Text>
      {children}
    </View>
  );
}

function GalleryTile({ accent, entrepreneurName, index }: { accent: string; entrepreneurName: string; index: number }) {
  return (
    <View accessibilityLabel={`Imagen ${index + 1} de ${entrepreneurName}`} style={[styles.galleryTile, { backgroundColor: accent }]}>
      <Ionicons color={culturalColors.white} name="sparkles-outline" size={28} />
      <View style={styles.galleryPattern}>
        <View style={styles.galleryStepLong} />
        <View style={styles.galleryStepShort} />
      </View>
    </View>
  );
}

function ContactRow({ contact, divider }: { contact: ExternalContact; divider: boolean }) {
  const { theme } = useCalpulliTheme();
  const icon = CONTACT_ICONS[contact.type];

  return (
    <View style={[styles.contactRow, divider && { borderBottomColor: theme.colors.borderSubtle, borderBottomWidth: 1 }]}>
      <View style={[styles.contactIcon, { backgroundColor: theme.colors.primaryMuted }]}>
        <Ionicons color={theme.colors.primary} name={icon} size={20} />
      </View>
      <View style={styles.contactCopy}>
        <Text style={[styles.label, { color: theme.colors.textPrimary }]}>{contact.label}</Text>
        <Text selectable style={[styles.caption, { color: theme.colors.textSecondary }]}>{contact.value}</Text>
      </View>
    </View>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { theme } = useCalpulliTheme();

  return (
    <Card style={styles.itemCard}>
      <View style={[styles.itemIcon, { backgroundColor: theme.colors.primaryMuted }]}>
        <Ionicons color={theme.colors.primary} name="bag-handle-outline" size={24} />
      </View>
      <View style={styles.itemCopy}>
        <View style={styles.itemHeading}>
          <Text style={[styles.itemTitle, { color: theme.colors.textPrimary }]}>{product.name}</Text>
          {product.priceLabel ? <Badge label={product.priceLabel} tone="success" /> : null}
        </View>
        <Text style={[styles.caption, { color: theme.colors.primary }]}>{product.category}</Text>
        {product.description ? <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{product.description}</Text> : null}
      </View>
    </Card>
  );
}

function EntrepreneurPostCard({ post }: { post: EntrepreneurPost }) {
  const { theme } = useCalpulliTheme();
  const date = new Date(post.publishedAt);
  const dateLabel = Number.isNaN(date.getTime())
    ? "Fecha no disponible"
    : new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(date);

  return (
    <Card style={styles.postCard}>
      <Text style={[styles.caption, { color: theme.colors.primary }]}>{dateLabel}</Text>
      <Text style={[styles.itemTitle, { color: theme.colors.textPrimary }]}>{post.title}</Text>
      <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{post.body}</Text>
      {post.media.length > 0 ? (
        <View style={[styles.mediaCount, { backgroundColor: theme.colors.surfaceMuted }]}>
          <Ionicons color={theme.colors.primary} name="images-outline" size={18} />
          <Text style={[styles.caption, { color: theme.colors.textSecondary }]}>{post.media.length === 1 ? "1 medio" : `${post.media.length} medios`}</Text>
        </View>
      ) : null}
    </Card>
  );
}

function SectionEmpty({ copy, icon }: { copy: string; icon: keyof typeof Ionicons.glyphMap }) {
  const { theme } = useCalpulliTheme();

  return (
    <View style={[styles.sectionEmpty, { borderColor: theme.colors.borderSubtle }]}>
      <Ionicons color={theme.colors.primary} name={icon} size={28} />
      <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{copy}</Text>
    </View>
  );
}

function mediaKey(media: MediaReference, index: number): string {
  return `${index}:${media.type === "bundled" ? media.key : media.uri}`;
}

const CONTACT_ICONS: Record<ExternalContact["type"], keyof typeof Ionicons.glyphMap> = {
  whatsapp: "logo-whatsapp",
  telegram: "paper-plane-outline",
  email: "mail-outline",
  instagram: "logo-instagram",
  phone: "call-outline",
  other: "link-outline",
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.xxl,
  },
  hero: {
    borderTopWidth: 5,
    gap: spacing.xl,
  },
  identity: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.lg,
  },
  identityCopy: {
    flex: 1,
    gap: spacing.sm,
  },
  title: {
    ...typography.title,
  },
  heading: {
    ...typography.heading,
  },
  body: {
    ...typography.body,
  },
  label: {
    ...typography.label,
  },
  caption: {
    ...typography.caption,
  },
  stand: {
    alignItems: "center",
    borderRadius: radii.sm,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
  },
  standCopy: {
    flex: 1,
  },
  section: {
    gap: spacing.md,
  },
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  galleryTile: {
    alignItems: "center",
    aspectRatio: 1.25,
    borderRadius: radii.md,
    flexBasis: "46%",
    flexGrow: 1,
    justifyContent: "center",
    minWidth: 132,
    overflow: "hidden",
  },
  galleryPattern: {
    bottom: spacing.md,
    gap: spacing.xs,
    position: "absolute",
    right: spacing.md,
  },
  galleryStepLong: {
    backgroundColor: "rgba(255,255,255,0.75)",
    height: 6,
    width: 54,
  },
  galleryStepShort: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(255,255,255,0.75)",
    height: 6,
    width: 32,
  },
  contactCard: {
    paddingVertical: 0,
  },
  contactRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  contactIcon: {
    alignItems: "center",
    borderRadius: radii.sm,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  contactCopy: {
    flex: 1,
  },
  cardList: {
    gap: spacing.md,
  },
  itemCard: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
  },
  itemIcon: {
    alignItems: "center",
    borderRadius: radii.sm,
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  itemCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  itemHeading: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between",
  },
  itemTitle: {
    ...typography.label,
    flex: 1,
  },
  postCard: {
    gap: spacing.sm,
  },
  mediaCount: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: radii.pill,
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  sectionEmpty: {
    alignItems: "center",
    borderRadius: radii.md,
    borderStyle: "dashed",
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.lg,
  },
});
