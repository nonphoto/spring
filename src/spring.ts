import { safeDiv } from "@thi.ng/math";
import {
  amplitudeFromValues,
  defaultCriticality,
  defaultDamping,
  defaultEpsilon,
  defaultPosition,
  defaultTarget,
  defaultVelocity,
  deltaFromPosition,
  phaseFromValues,
} from "./common.js";

export type Spring = [
  position: number,
  velocity: number,
  target: number,
  damping: number,
  criticality: number,
  amplitude: number,
  phase: number
];

export function setValues(
  s: Spring,
  position?: number,
  velocity?: number,
  target?: number,
  damping?: number,
  criticality?: number
): Spring {
  s[0] = position ?? s[0];
  s[1] = velocity ?? s[1];
  s[2] = target ?? s[2];
  s[3] = damping ?? s[3];
  s[4] = criticality ?? s[4];
  s[5] = amplitudeFromValues(s[0], s[1], s[2], s[3], s[4]);
  s[6] = phaseFromValues(s[0], s[1], s[2], s[3], s[4]);
  return s;
}

export function fromValues(
  position?: number,
  velocity?: number,
  target?: number,
  damping?: number,
  criticality?: number
): Spring {
  return setValues(
    [
      defaultPosition,
      defaultVelocity,
      defaultTarget,
      defaultDamping,
      defaultCriticality,
      0,
      0,
    ],
    position,
    velocity,
    target,
    damping,
    criticality
  );
}

export function positionAt(
  position: number,
  velocity: number,
  target: number,
  damping: number,
  criticality: number,
  amplitude: number,
  phase: number,
  t: number
) {
  const delta = deltaFromPosition(position, target);
  const exp = Math.exp(-damping * t);
  return delta === 0
    ? target
    : criticality > 0
    ? amplitude * exp * Math.cos(criticality * t + phase) + target
    : exp * (delta + (velocity + delta * damping) * t) + target;
}

export function velocityAt(
  position: number,
  velocity: number,
  target: number,
  damping: number,
  criticality: number,
  amplitude: number,
  phase: number,
  t: number
) {
  const delta = deltaFromPosition(position, target);
  const exp = Math.exp(-damping * t);
  const theta = criticality * t + phase;
  return criticality > 0
    ? -damping * amplitude * exp * Math.cos(theta) -
        criticality * amplitude * exp * Math.sin(theta)
    : exp * (velocity - (velocity + delta * damping) * damping * t);
}

export function duration(
  _position: number,
  _velocity: number,
  _target: number,
  damping: number,
  _criticality: number,
  amplitude: number,
  _phase: number,
  epsilon: number = defaultEpsilon
) {
  return Math.abs(
    safeDiv(
      -Math.log(safeDiv(epsilon, Math.max(Math.abs(amplitude), epsilon))),
      damping
    )
  );
}
