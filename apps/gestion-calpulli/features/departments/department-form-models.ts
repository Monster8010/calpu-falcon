import type {
  Department,
  InstitutionalPost,
  InstitutionalPostVisibility,
  MediaReference,
  PostPriority,
  Story,
} from "@calpulli/domain";
import type {
  CreateInstitutionalPostInput,
  CreateStoryInput,
  UpdateDepartmentInput,
  UpdateInstitutionalPostInput,
  UpdateStoryInput,
} from "@calpulli/repositories";

export const POST_PRIORITY_OPTIONS: readonly {
  label: string;
  value: PostPriority;
}[] = [
  { label: "Normal", value: "normal" },
  { label: "Destacada", value: "featured" },
  { label: "Importante", value: "important" },
  { label: "Urgente", value: "urgent" },
];

export const DEMO_POST_MEDIA: readonly { key: string; label: string }[] = [
  { key: "posts/demo-comunidad", label: "Comunidad" },
  { key: "posts/demo-servicios", label: "Servicios" },
  { key: "posts/demo-convocatoria", label: "Convocatoria" },
];

export const DEMO_STORY_MEDIA: readonly { key: string; label: string }[] = [
  { key: "stories/demo-recordatorio", label: "Recordatorio" },
  { key: "stories/demo-campus", label: "Campus" },
  { key: "stories/demo-comunidad", label: "Comunidad" },
];

export const STORY_DURATION_OPTIONS = [6, 12, 24, 48] as const;
export type StoryDurationHours = (typeof STORY_DURATION_OPTIONS)[number];

const DEFAULT_VISIBILITY: InstitutionalPostVisibility = {
  showDepartment: true,
  showLocation: true,
  showMedia: true,
  showDate: true,
  showViews: true,
};

export interface DepartmentProfileDraft {
  description: string;
  name: string;
  shortName: string;
}

export interface PendingSharedImage {
  fileName?: string;
  mimeType: string;
  uri: string;
}

export interface InstitutionalPostDraft {
  body: string;
  existingDocument?: MediaReference;
  hasDocument: boolean;
  linkUrl: string;
  location: string;
  mediaKeys: string[];
  pendingSharedImage?: PendingSharedImage;
  preservedMedia: MediaReference[];
  priority: PostPriority;
  title: string;
  visibility: InstitutionalPostVisibility;
}

export interface StoryDraft {
  body: string;
  durationHours: StoryDurationHours;
  isActive: boolean;
  mediaKey: string;
  title: string;
}

export class DepartmentFormError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DepartmentFormError";
  }
}

function required(value: string, fieldLabel: string): string {
  const result = value.trim();
  if (result.length === 0) {
    throw new DepartmentFormError(`${fieldLabel} es obligatorio.`);
  }
  return result;
}

function optional(value: string): string | undefined {
  const result = value.trim();
  return result.length === 0 ? undefined : result;
}

function bundledMedia(key: string): MediaReference {
  return { type: "bundled", key };
}

function validateOptionalWebUrl(value: string): string | undefined {
  const normalized = optional(value);
  if (normalized === undefined) return undefined;

  try {
    const url = new URL(normalized);
    if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error();
  } catch {
    throw new DepartmentFormError("El enlace debe comenzar con http:// o https://.");
  }

  return normalized;
}

export function createDepartmentProfileDraft(
  department: Department,
): DepartmentProfileDraft {
  return {
    name: department.name,
    shortName: department.shortName ?? "",
    description: department.description ?? "",
  };
}

export function toDepartmentProfilePatch(
  draft: DepartmentProfileDraft,
): UpdateDepartmentInput {
  return {
    name: required(draft.name, "El nombre"),
    shortName: optional(draft.shortName),
    description: optional(draft.description),
  };
}

export function createEmptyPostDraft(): InstitutionalPostDraft {
  return {
    title: "",
    body: "",
    priority: "normal",
    location: "",
    linkUrl: "",
    mediaKeys: [],
    pendingSharedImage: undefined,
    preservedMedia: [],
    existingDocument: undefined,
    hasDocument: false,
    visibility: { ...DEFAULT_VISIBILITY },
  };
}

export function createPostDraft(post: InstitutionalPost): InstitutionalPostDraft {
  return {
    title: post.title,
    body: post.body,
    priority: post.priority,
    location: post.location ?? "",
    linkUrl: post.linkUrl ?? "",
    mediaKeys: post.media
      .filter((media): media is Extract<MediaReference, { type: "bundled" }> => media.type === "bundled")
      .map(({ key }) => key),
    pendingSharedImage: undefined,
    preservedMedia: post.media.filter(({ type }) => type === "shared"),
    existingDocument: post.document,
    hasDocument: post.document !== undefined,
    visibility: { ...post.visibility },
  };
}

export function attachSharedImageToPostDraft(
  draft: InstitutionalPostDraft,
  media: Extract<MediaReference, { type: "shared" }>,
): InstitutionalPostDraft {
  return {
    ...draft,
    pendingSharedImage: undefined,
    preservedMedia: [...draft.preservedMedia, media],
  };
}

function postEditableFields(
  draft: InstitutionalPostDraft,
): Pick<
  InstitutionalPost,
  "body" | "document" | "linkUrl" | "location" | "media" | "priority" | "title" | "visibility"
> {
  return {
    title: required(draft.title, "El título"),
    body: required(draft.body, "El contenido"),
    priority: draft.priority,
    location: optional(draft.location),
    linkUrl: validateOptionalWebUrl(draft.linkUrl),
    media: [...draft.preservedMedia, ...draft.mediaKeys.map(bundledMedia)],
    document: draft.hasDocument
      ? draft.existingDocument ?? bundledMedia("documents/demo-aviso")
      : undefined,
    visibility: { ...draft.visibility },
  };
}

export function toCreatePostInput(
  draft: InstitutionalPostDraft,
  departmentId: string,
  isPublished: boolean,
  now: string,
): CreateInstitutionalPostInput {
  return {
    ...postEditableFields(draft),
    departmentId,
    publishedAt: now,
    views: 0,
    isPublished,
    isHiddenByModerator: false,
  };
}

export function toUpdatePostPatch(
  draft: InstitutionalPostDraft,
  current: InstitutionalPost,
  isPublished: boolean,
  now: string,
): UpdateInstitutionalPostInput {
  return {
    ...postEditableFields(draft),
    isPublished,
    publishedAt: isPublished && !current.isPublished
      ? now
      : current.publishedAt,
  };
}

export function createEmptyStoryDraft(): StoryDraft {
  return {
    title: "",
    body: "",
    durationHours: 24,
    isActive: true,
    mediaKey: DEMO_STORY_MEDIA[0].key,
  };
}

export function createStoryDraft(story: Story, now: string): StoryDraft {
  const remainingHours = Math.max(
    1,
    Math.round((Date.parse(story.expiresAt) - Date.parse(now)) / 3_600_000),
  );
  const durationHours = STORY_DURATION_OPTIONS.reduce((closest, option) =>
    Math.abs(option - remainingHours) < Math.abs(closest - remainingHours)
      ? option
      : closest,
  );
  const bundled = story.media.find(
    (media): media is Extract<MediaReference, { type: "bundled" }> => media.type === "bundled",
  );

  return {
    title: story.title ?? "",
    body: story.body ?? "",
    durationHours,
    isActive: story.isActive,
    mediaKey: bundled?.key ?? DEMO_STORY_MEDIA[0].key,
  };
}

function storyEditableFields(
  draft: StoryDraft,
  now: string,
): Pick<Story, "body" | "expiresAt" | "isActive" | "media" | "startsAt" | "title"> {
  const startsAt = new Date(now);

  if (Number.isNaN(startsAt.getTime())) {
    throw new DepartmentFormError("No se pudo determinar la vigencia de la historia.");
  }

  const expiresAt = new Date(
    startsAt.getTime() + draft.durationHours * 3_600_000,
  ).toISOString();
  const title = optional(draft.title);
  const body = optional(draft.body);

  if (title === undefined && body === undefined) {
    throw new DepartmentFormError("Agrega un título o texto a la historia.");
  }

  return {
    title,
    body,
    media: [bundledMedia(required(draft.mediaKey, "El medio demo"))],
    startsAt: startsAt.toISOString(),
    expiresAt,
    isActive: draft.isActive,
  };
}

export function toCreateStoryInput(
  draft: StoryDraft,
  departmentId: string,
  now: string,
): CreateStoryInput {
  return {
    ...storyEditableFields(draft, now),
    departmentId,
    views: 0,
  };
}

export function toUpdateStoryPatch(
  draft: StoryDraft,
  now: string,
): UpdateStoryInput {
  return storyEditableFields(draft, now);
}
