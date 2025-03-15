import * as internal from "./internal";
import { Spring } from "./types";
import { normalizeDamping, normalizeStiffness } from "./util";

export function positionAt(s: Spring, t: number): number {
  return internal.positionAt(
    s.position,
    s.target,
    s.velocity,
    normalizeStiffness(s.stiffness),
    normalizeDamping(s.damping),
    t
  );
}

export function velocityAt(s: Spring, t: number): number {
  return internal.velocityAt(
    s.position,
    s.target,
    s.velocity,
    normalizeStiffness(s.stiffness),
    normalizeDamping(s.damping),
    t
  );
}

export function duration(s: Spring, epsilon?: number): number {
  return internal.duration(
    s.position,
    s.target,
    s.velocity,
    normalizeStiffness(s.stiffness),
    normalizeDamping(s.damping),
    epsilon
  );
}
