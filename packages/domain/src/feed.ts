import { compareISODateTimesDescending } from "./date-time";
import type { InstitutionalPost, PostPriority } from "./institutional-post";

export const POST_PRIORITY_RANK: Readonly<Record<PostPriority, number>> = {
  normal: 0,
  featured: 1,
  important: 2,
  urgent: 3,
};

export function getPostPriorityRank(priority: PostPriority): number {
  return POST_PRIORITY_RANK[priority];
}

export function compareInstitutionalPosts(
  left: InstitutionalPost,
  right: InstitutionalPost,
): number {
  const priorityDifference =
    getPostPriorityRank(right.priority) - getPostPriorityRank(left.priority);

  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  const dateDifference = compareISODateTimesDescending(
    left.publishedAt,
    right.publishedAt,
  );

  if (dateDifference !== 0 || left.id === right.id) {
    return dateDifference;
  }

  return left.id < right.id ? -1 : 1;
}

export function sortInstitutionalFeed(
  posts: readonly InstitutionalPost[],
): InstitutionalPost[] {
  return [...posts].sort(compareInstitutionalPosts);
}
