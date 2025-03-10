import * as internal from "./internal";
import { normalizeDamping, normalizeStiffness } from "./util";

export interface Spring {
  position: number;
  velocity: number;
  target: number;
  stiffness: number;
  damping: number;
}

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
