import {
  dampingRatioToStiffness,
  frequencyToStiffness,
  halflifeToDamping,
  square,
} from "./math";

export const defaultDamping = halflifeToDamping(1000);
export const defaultStiffness = dampingRatioToStiffness(1, defaultDamping);

export interface Spring {
  halfDamping: number;
  start: number;
  end: number;
  delta: number;
  startVelocity: number;
  dampedFrequency: number;
  amplitude: number;
  phase: number;
}

export interface SpringOptions {
  start?: number;
  end?: number;
  startVelocity?: number;
  damping?: number;
  stiffness?: number;
  halflife?: number;
  frequency?: number;
  dampingRatio?: number;
}

export function springSet(s: Partial<Spring>, o: SpringOptions): Spring {
  const damping = o.damping
    ? o.damping
    : o.halflife
    ? halflifeToDamping(o.halflife)
    : defaultDamping;
  const stiffness = o.stiffness
    ? o.stiffness
    : o.frequency
    ? frequencyToStiffness(o.frequency)
    : dampingRatioToStiffness(o.dampingRatio ?? 1, damping);
  s.start = o.start ?? 0;
  s.end = o.end ?? 1;
  s.startVelocity = o.startVelocity ?? 0;
  s.delta = s.start - s.end;
  s.dampedFrequency = Math.sqrt(stiffness - square(damping) / 4);
  const velocityDelta = s.startVelocity + s.delta * damping * 0.5;
  s.amplitude =
    Math.sign(s.delta) *
    Math.sqrt(
      square(velocityDelta) / square(s.dampedFrequency) + square(s.delta)
    );
  s.phase = Math.atan(velocityDelta / (-s.delta * s.dampedFrequency));
  s.phase = isNaN(s.phase) ? 0 : s.phase;
  s.halfDamping = damping / 2;
  return s as Spring;
}

export function springCreate(options: SpringOptions): Spring {
  return springSet({}, options);
}

export function springPosition(s: Spring, t: number) {
  const exp = Math.exp(-s.halfDamping * t);
  return s.delta === 0
    ? s.end
    : s.dampedFrequency > 0
    ? s.amplitude * exp * Math.cos(s.dampedFrequency * t + s.phase) + s.end
    : exp * (s.delta + (s.startVelocity + s.delta * s.halfDamping) * t) + s.end;
}

export function springVelocity(s: Spring, t: number) {
  const exp = Math.exp(-s.halfDamping * t);
  const theta = s.dampedFrequency * t + s.phase;
  return s.dampedFrequency > 0
    ? -s.halfDamping * s.amplitude * exp * Math.cos(theta) -
        s.dampedFrequency * s.amplitude * exp * Math.sin(theta)
    : exp *
        (s.startVelocity -
          (s.startVelocity + s.delta * s.halfDamping) * s.halfDamping * t);
}

export function springDuration(s: Spring, epsilon: number = 0.1) {
  const duration =
    -Math.log((Math.sign(s.delta) * epsilon) / s.amplitude) / s.halfDamping;
  return isNaN(duration) ? 0 : duration;
}
