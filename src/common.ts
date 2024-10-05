import { copysign, HALF_PI, QUARTER_PI, safeDiv, TAU } from "@thi.ng/math";

const TWO_LN2 = 2 * Math.LN2;

export const defaultPosition = 0;
export const defaultVelocity = 0;
export const defaultTarget = 1;
export const defaultDamping = halflifeToDamping(200);
export const defaultCriticality = 0;
export const defaultEpsilon = 0.01;

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
  return TWO_LN2 / halflife;
}

export function dampingToHalflife(damping: number): number {
  return TWO_LN2 / damping;
}

export function frequencyToStiffness(frequency: number): number {
  return square(TAU * frequency);
}

export function stiffnessToFrequency(stiffness: number): number {
  return Math.sqrt(stiffness) / TAU;
}

export function criticalHalflife(frequency: number): number {
  return dampingToHalflife(Math.sqrt(frequencyToStiffness(frequency)));
}

export function criticalFrequency(halflife: number): number {
  return stiffnessToFrequency(square(halflifeToDamping(halflife)));
}

export function dampingRatioToStiffness(
  dampingRatio: number,
  damping: number
): number {
  return square(damping / dampingRatio);
}

export function dampingRatioToDamping(
  dampingRatio: number,
  stiffness: number
): number {
  return dampingRatio * Math.sqrt(stiffness);
}

export function dampingRatioToCriticality(
  dampingRatio: number,
  damping: number
) {
  return stiffnessToCriticality(
    dampingRatioToStiffness(dampingRatio, damping),
    damping
  );
}

export function stiffnessToCriticality(stiffness: number, damping: number) {
  return Math.sqrt(stiffness - square(damping));
}

export function deltaFromPosition(position: number, target: number) {
  return position - target;
}

export function amplitudeFromValues(
  position: number,
  velocity: number,
  target: number,
  damping: number,
  criticality: number
): number {
  const delta = deltaFromPosition(position, target);
  return (
    Math.sign(delta) *
    Math.sqrt(
      square(velocity + delta * damping) / square(criticality) + square(delta)
    )
  );
}

export function phaseFromValues(
  position: number,
  velocity: number,
  target: number,
  damping: number,
  criticality: number
): number {
  const delta = deltaFromPosition(position, target);
  return Math.atan(safeDiv(velocity + delta * damping, -delta * criticality));
}
