import { copysign } from "@thi.ng/math";
import {
  dampingRatioToStiffness,
  frequencyToStiffness,
  halflifeToDamping,
} from "./math.js";

export const defaultEpsilon = 0.01;
export const defaultDamping = halflifeToDamping(1000);
export const defaultStiffness = dampingRatioToStiffness(1, defaultDamping);

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

export interface SpringOptions {
  start?: number;
  end?: number;
  delta?: number;
  velocity?: number;
  damping?: number;
  stiffness?: number;
  halflife?: number;
  frequency?: number;
  dampingRatio?: number;
}

export function isSpring(s: any): s is Spring {
  return (
    Array.isArray(s) && s.length === 7 && s.every((n) => typeof n === "number")
  );
}

export function setOptions(
  s: Spring,
  {
    start,
    end = 1,
    delta = (start ?? 0) - end,
    velocity = 0,
    halflife,
    frequency,
    dampingRatio,
    damping = halflife != null ? halflifeToDamping(halflife) : defaultDamping,
    stiffness = frequency != null
      ? frequencyToStiffness(frequency)
      : dampingRatioToStiffness(dampingRatio ?? 1, damping),
  }: SpringOptions
): Spring {
  const v = velocity + delta * damping;
  const criticality = Math.sqrt(stiffness - square(damping));
  const amplitude =
    Math.sign(delta) *
    Math.sqrt(square(v) / square(criticality) + square(delta));
  const phase = Math.atan(v / (-delta * criticality));
  s[0] = delta;
  s[1] = end;
  s[2] = velocity;
  s[3] = damping;
  s[4] = criticality;
  s[5] = amplitude;
  s[6] = phase;
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

// const [a] = defHofOp<MultiVecOpVVVVV, VecOpVVVVV>(positionF, FN5, ARGS_VV);
