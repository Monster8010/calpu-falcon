import type { Fair, Stand } from "@calpulli/domain";

export function selectPublicFair(fairs: readonly Fair[]): Fair | undefined {
  const active = fairs.find(({ status }) => status === "active");

  if (active !== undefined) {
    return active;
  }

  return [...fairs]
    .filter(({ status }) => status === "upcoming")
    .sort((left, right) => {
      const dateDifference =
        new Date(left.nextDate).getTime() - new Date(right.nextDate).getTime();
      if (dateDifference !== 0) return dateDifference;
      return left.id < right.id ? -1 : left.id > right.id ? 1 : 0;
    })[0];
}

export interface FairMapMetrics {
  columns: number;
  height: number;
  rows: number;
  width: number;
}

export function getFairMapMetrics(
  stands: readonly Stand[],
  cellSize: number,
  gap: number,
): FairMapMetrics {
  const columns = Math.max(1, ...stands.map(({ coordinate }) => coordinate.column + 1));
  const rows = Math.max(1, ...stands.map(({ coordinate }) => coordinate.row + 1));

  return {
    columns,
    rows,
    width: columns * cellSize + Math.max(0, columns - 1) * gap,
    height: rows * cellSize + Math.max(0, rows - 1) * gap,
  };
}

export function getStandMapPosition(
  stand: Stand,
  cellSize: number,
  gap: number,
) {
  return {
    left: stand.coordinate.column * (cellSize + gap),
    top: stand.coordinate.row * (cellSize + gap),
  };
}
