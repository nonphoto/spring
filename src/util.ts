import { square } from "./internal";

export const defaultDamping = dampingFromHalflife(200);
export const defaultStiffness = stiffnessFromDamping(1, defaultDamping);

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

export function dampingFromHalflife(halflife: number) {
  return (4 * Math.LN2) / normalizeHalflife(halflife);
}

export function halflifeFromDamping(damping: number) {
  return (4 * Math.LN2) / normalizeDamping(damping);
}

export function stiffnessFromFrequency(frequency: number) {
  return square(2 * Math.PI * frequency);
}

export function frequencyFromStiffness(stiffness: number) {
  return Math.sqrt(stiffness) / (2 * Math.PI);
}

export function criticalHalflife(frequency: number) {
  return halflifeFromDamping(Math.sqrt(stiffnessFromFrequency(frequency) * 4));
}

export function criticalFrequency(halflife: number) {
  return frequencyFromStiffness(square(dampingFromHalflife(halflife)) / 4);
}

export function dampingRatio(stiffness: number, damping: number) {
  return damping / (2 * Math.sqrt(stiffness));
}

export function stiffnessFromDamping(dampingRatio: number, damping: number) {
  return square(damping / (dampingRatio * 2));
}

export function dampingFromStiffness(dampingRatio: number, stiffness: number) {
  return dampingRatio * 2 * Math.sqrt(stiffness);
}
