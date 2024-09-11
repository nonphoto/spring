import { copysign, HALF_PI, QUARTER_PI, TAU } from "@thi.ng/math";

const QUAD_LN2 = 4 * Math.LN2;

function square(x: number): number {
  return x * x;
}

export function fastNegExp(x: number): number {
  return 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
}

export function fastAtan(x: number): number {
  const z = Math.abs(x);
  const w = z > 1 ? 1 / z : z;
  const y = QUARTER_PI * w - w * (w - 1) * (0.2447 + 0.0663 * w);
  return copysign(z > 1 ? HALF_PI - y : y, x);
}

export function halflifeToDamping(halflife: number): number {
  return QUAD_LN2 / halflife;
}

export function dampingToHalflife(damping: number): number {
  return QUAD_LN2 / damping;
}

export function frequencyToStiffness(frequency: number): number {
  return square(TAU * frequency);
}

export function stiffnessToFrequency(stiffness: number): number {
  return Math.sqrt(stiffness) / TAU;
}

export function criticalHalflife(frequency: number): number {
  return dampingToHalflife(Math.sqrt(frequencyToStiffness(frequency) * 4));
}

export function criticalFrequency(halflife: number): number {
  return stiffnessToFrequency(square(halflifeToDamping(halflife)) / 4);
}

export function dampingRatioToStiffness(
  dampingRatio: number,
  damping: number
): number {
  return square(damping / (dampingRatio * 2));
}

export function dampingRatioToDamping(
  dampingRatio: number,
  stiffness: number
): number {
  return dampingRatio * 2 * Math.sqrt(stiffness);
}
