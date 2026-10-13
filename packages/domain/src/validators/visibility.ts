import type { Department } from "../department";
import type { Entrepreneur } from "../entrepreneur";
import { sortInstitutionalFeed } from "../feed";
import type { ID } from "../common";
import type { InstitutionalPost } from "../institutional-post";
import type { EntrepreneurPost, Product } from "../marketplace";
import type { Tutor, TutoringOffer } from "../tutor";

export function isDepartmentPublic(department: Department): boolean {
  return department.isActive;
}

export function isInstitutionalPostPublic(post: InstitutionalPost): boolean {
  return post.isPublished && !post.isHiddenByModerator;
}

export function isEntrepreneurPostPublic(
  post: EntrepreneurPost,
  entrepreneur: Entrepreneur | undefined,
): boolean {
  return (
    post.isPublished &&
    !post.isHiddenByModerator &&
    entrepreneur?.id === post.entrepreneurId &&
    entrepreneur.isActive
  );
}

export function isEntrepreneurPublic(entrepreneur: Entrepreneur): boolean {
  return entrepreneur.isActive;
}

export function isProductPublic(
  product: Product,
  entrepreneur: Entrepreneur | undefined,
): boolean {
  return (
    product.isActive &&
    entrepreneur?.id === product.entrepreneurId &&
    entrepreneur.isActive
  );
}

export function isTutorPublic(tutor: Tutor): boolean {
  return tutor.isActive;
}

export function isTutoringOfferPublic(
  offer: TutoringOffer,
  tutor: Tutor | undefined,
): boolean {
  return offer.isActive && tutor?.id === offer.tutorId && tutor.isActive;
}

export function filterPublicInstitutionalPosts(
  posts: readonly InstitutionalPost[],
): InstitutionalPost[] {
  return posts.filter(isInstitutionalPostPublic);
}

export function filterPublicEntrepreneurPosts(
  posts: readonly EntrepreneurPost[],
  entrepreneurs: readonly Entrepreneur[],
): EntrepreneurPost[] {
  const entrepreneursById = new Map(
    entrepreneurs.map((entrepreneur) => [entrepreneur.id, entrepreneur]),
  );

  return posts.filter((post) =>
    isEntrepreneurPostPublic(post, entrepreneursById.get(post.entrepreneurId)),
  );
}

export function filterActiveEntrepreneurs(
  entrepreneurs: readonly Entrepreneur[],
): Entrepreneur[] {
  return entrepreneurs.filter(isEntrepreneurPublic);
}

export function filterActiveTutors(tutors: readonly Tutor[]): Tutor[] {
  return tutors.filter(isTutorPublic);
}

export function filterPublicProducts(
  products: readonly Product[],
  entrepreneurs: readonly Entrepreneur[],
): Product[] {
  const entrepreneursById = new Map(
    entrepreneurs.map((entrepreneur) => [entrepreneur.id, entrepreneur]),
  );

  return products.filter((product) =>
    isProductPublic(product, entrepreneursById.get(product.entrepreneurId)),
  );
}

export function filterPublicTutoringOffers(
  offers: readonly TutoringOffer[],
  tutors: readonly Tutor[],
): TutoringOffer[] {
  const tutorsById = new Map(tutors.map((tutor) => [tutor.id, tutor]));

  return offers.filter((offer) =>
    isTutoringOfferPublic(offer, tutorsById.get(offer.tutorId)),
  );
}

export function selectPublicInstitutionalFeed(
  posts: readonly InstitutionalPost[],
  departmentId?: ID,
): InstitutionalPost[] {
  const visiblePosts = filterPublicInstitutionalPosts(posts).filter(
    (post) => departmentId === undefined || post.departmentId === departmentId,
  );

  return sortInstitutionalFeed(visiblePosts);
}
