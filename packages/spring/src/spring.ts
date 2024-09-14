import { copysign } from "@thi.ng/math";
import {
  dampingRatioToStiffness,
  frequencyToStiffness,
  halflifeToDamping,
} from "./math.js";

export const defaultStart = 0;
export const defaultEnd = 1;
export const defaultDelta = -1;
export const defaultVelocity = 0;
export const defaultEpsilon = 0.01;
export const defaultHalflife = 1000;
export const defaultDamping = halflifeToDamping(defaultHalflife);
export const defaultDampingRatio = 1;
export const defaultStiffness = dampingRatioToStiffness(
  defaultDampingRatio,
  defaultDamping
);

function square(x: number): number {
  return x * x;
}

export type Spring = [
  delta: number,
  end: number,
  velocity: number,
  damping: number,
  criticality: number,
  amplitude: number,
  phase: number
];

export interface ScalarSpringOptions {
  damping?: number;
  stiffness?: number;
  halflife?: number;
  frequency?: number;
  dampingRatio?: number;
  criticality?: number;
}

export interface SpringOptions extends ScalarSpringOptions {
  start?: number;
  end?: number;
  delta?: number;
  velocity?: number;
  amplitude?: number;
  phase?: number;
}

export function isSpring(s: any): s is Spring {
  return (
    Array.isArray(s) && s.length === 7 && s.every((n) => typeof n === "number")
  );
}

export function deltaFrom(start?: number, end?: number, delta?: number) {
  return delta ?? (start ?? defaultStart) - (end ?? defaultEnd);
}

export function deltaFromOptions({ start, end, delta }: SpringOptions): number {
  return deltaFrom(start, end, delta);
}

export function endFrom(start?: number, end?: number, delta?: number) {
  return end ?? (start ?? defaultStart) - (delta ?? defaultDelta);
}

export function endFromOptions({ start, end, delta }: SpringOptions): number {
  return endFrom(start, end, delta);
}

export function dampingFrom(damping?: number, halflife?: number) {
  return (
    damping ?? (halflife != null ? halflifeToDamping(halflife) : defaultDamping)
  );
}

export function dampingFromOptions({
  damping,
  halflife,
}: ScalarSpringOptions): number {
  return dampingFrom(damping, halflife);
}

export function criticalityFrom(
  criticality?: number,
  frequency?: number,
  stiffness?: number,
  dampingRatio?: number,
  damping?: number,
  halflife?: number
) {
  damping = dampingFrom(damping, halflife);
  return (
    criticality ??
    Math.sqrt(
      (stiffness ??
        (frequency != null
          ? frequencyToStiffness(frequency)
          : dampingRatioToStiffness(dampingRatio ?? 1, damping))) -
        square(damping)
    )
  );
}

export function criticalityFromOptions({
  criticality,
  frequency,
  stiffness,
  dampingRatio,
  damping,
  halflife,
}: ScalarSpringOptions): number {
  return criticalityFrom(
    criticality,
    frequency,
    stiffness,
    dampingRatio,
    damping,
    halflife
  );
}

export function amplitudeFrom(
  delta: number,
  velocity: number,
  damping: number,
  criticality: number
): number {
  return (
    Math.sign(delta) *
    Math.sqrt(
      square(velocity + delta * damping) / square(criticality) + square(delta)
    )
  );
}

export function phaseFrom(
  delta: number,
  velocity: number,
  damping: number,
  criticality: number
): number {
  return Math.atan((velocity + delta * damping) / (-delta * criticality));
}

export function setOptions(s: Spring, o: SpringOptions): Spring {
  s[0] = deltaFromOptions(o);
  s[1] = endFromOptions(o);
  s[2] = o.velocity ?? 0;
  s[3] = dampingFromOptions(o);
  s[4] = criticalityFromOptions(o);
  s[5] = amplitudeFrom(s[0], s[2], s[3], s[4]);
  s[6] = phaseFrom(s[0], s[2], s[3], s[4]);
  return s;
}

export function fromOptions(o: SpringOptions): Spring {
  return setOptions(new Array(7) as Spring, o);
}

export function positionAt(
  delta: number,
  end: number,
  velocity: number,
  damping: number,
  criticality: number,
  amplitude: number,
  phase: number,
  t: number
) {
  const exp = Math.exp(-damping * t);
  return delta === 0
    ? end
    : criticality > 0
    ? amplitude * exp * Math.cos(criticality * t + phase) + end
    : exp * (delta + (velocity + delta * damping) * t) + end;
}

export function velocityAt(
  delta: number,
  _end: number,
  velocity: number,
  damping: number,
  criticality: number,
  amplitude: number,
  phase: number,
  t: number
) {
  const exp = Math.exp(-damping * t);
  const theta = criticality * t + phase;
  return criticality > 0
    ? -damping * amplitude * exp * Math.cos(theta) -
        criticality * amplitude * exp * Math.sin(theta)
    : exp * (velocity - (velocity + delta * damping) * damping * t);
}

export function duration(
  delta: number,
  _end: number,
  _velocity: number,
  damping: number,
  _criticality: number,
  amplitude: number,
  _phase: number,
  epsilon: number = defaultEpsilon
) {
  return (
    -Math.log(Math.max(1e-4, copysign(epsilon, delta) / amplitude)) / damping
  );
}
