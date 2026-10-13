import {
  isActiveStandRequest,
  type Entrepreneur,
  type EntrepreneurPost,
  type Fair,
  type Product,
  type StandRequest,
  type StandRequestStatus,
} from "@calpulli/domain";

export interface EntrepreneurMetrics {
  activeProducts: number;
  posts: number;
  products: number;
}

export function selectFairForEntrepreneur(
  fairs: readonly Fair[],
): Fair | undefined {
  const active = fairs.find(({ status }) => status === "active");
  if (active !== undefined) return active;

  return [...fairs]
    .filter(({ status }) => status === "upcoming")
    .sort((left, right) => {
      const difference = Date.parse(left.nextDate) - Date.parse(right.nextDate);
      if (difference !== 0) return difference;
      return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
    })[0];
}

const REQUEST_ORDER: Readonly<Record<StandRequestStatus, number>> = {
  pending: 0,
  approved: 1,
  rejected: 2,
  cancelled: 3,
};

export function sortEntrepreneurRequests(
  requests: readonly StandRequest[],
): StandRequest[] {
  return [...requests].sort((left, right) => {
    const activeDifference = Number(isActiveStandRequest(right)) - Number(isActiveStandRequest(left));
    if (activeDifference !== 0) return activeDifference;
    const dateDifference = Date.parse(right.requestedAt) - Date.parse(left.requestedAt);
    if (dateDifference !== 0) return dateDifference;
    const statusDifference = REQUEST_ORDER[left.status] - REQUEST_ORDER[right.status];
    if (statusDifference !== 0) return statusDifference;
    return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
  });
}

export function getCurrentStandRequest(
  requests: readonly StandRequest[],
): StandRequest | undefined {
  return sortEntrepreneurRequests(requests)[0];
}

export function hasActiveEntrepreneurRequest(
  requests: readonly StandRequest[],
): boolean {
  return requests.some(isActiveStandRequest);
}

export function getEntrepreneurMetrics(
  posts: readonly EntrepreneurPost[],
  products: readonly Product[],
): EntrepreneurMetrics {
  return {
    posts: posts.length,
    products: products.length,
    activeProducts: products.filter(({ isActive }) => isActive).length,
  };
}

export function getEntrepreneurMonogram(
  entrepreneur: Pick<Entrepreneur, "displayName">,
): string {
  return entrepreneur.displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toLocaleUpperCase("es-MX") ?? "")
    .join("");
}

export function formatEntrepreneurDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha no disponible";
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
