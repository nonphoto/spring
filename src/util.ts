import { square } from "./internal";

const TWO_LN2 = 2 * Math.LN2;

export const defaultStiffness = 0.1;
export const defaultDamping = 0.1;

export function normalizeHalflife(halflife: number): number {
  return Math.max(0, halflife);
}

export function normalizeDamping(damping: number): number {
  return Math.max(0, damping);
}

export function normalizeStiffness(stiffness: number): number {
  return Math.max(0, stiffness);
}

export function normalizeDampingRatio(dampingRatio: number): number {
  return Math.max(0, Math.min(1, dampingRatio));
}

export function dampingFromHalflife(halflife: number): number {
  return TWO_LN2 / normalizeHalflife(halflife);
}

export function halflifeFromDamping(damping: number): number {
  return TWO_LN2 / normalizeDamping(damping);
}

export function stiffnessFromDamping(
  dampingRatio: number,
  damping: number
): number {
  return square(
    normalizeDamping(damping) / normalizeDampingRatio(dampingRatio)
  );
}

export function dampingFromStiffness(
  dampingRatio: number,
  stiffness: number
): number {
  return (
    normalizeDampingRatio(dampingRatio) *
    Math.sqrt(normalizeStiffness(stiffness))
  );
}
