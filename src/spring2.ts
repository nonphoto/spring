import * as internal from "./internal";
import { normalizeDamping, normalizeStiffness } from "./util";

type Vec2 = [number, number];

export interface Spring2 {
  position: Vec2;
  velocity: Vec2;
  target: Vec2;
  stiffness: number;
  damping: number;
}

export function positionAt2(out: Vec2, s: Spring2, t: number): Vec2 {
  const stiffness = normalizeStiffness(s.stiffness);
  const damping = normalizeDamping(s.damping);
  out[0] = internal.positionAt(
    s.position[0],
    s.target[0],
    s.velocity[0],
    stiffness,
    damping,
    t
  );
  out[1] = internal.positionAt(
    s.position[1],
    s.target[1],
    s.velocity[1],
    stiffness,
    damping,
    t
  );
  return out;
}

export function velocityAt2(out: Vec2, s: Spring2, t: number): Vec2 {
  const stiffness = normalizeStiffness(s.stiffness);
  const damping = normalizeDamping(s.damping);
  out[0] = internal.positionAt(
    s.position[0],
    s.target[0],
    s.velocity[0],
    stiffness,
    damping,
    t
  );
  out[1] = internal.positionAt(
    s.position[1],
    s.target[1],
    s.velocity[1],
    stiffness,
    damping,
    t
  );
  return out;
}

export function duration2(s: Spring2, t: number): number {
  const stiffness = normalizeStiffness(s.stiffness);
  const damping = normalizeDamping(s.damping);
  return Math.max(
    internal.duration(
      s.position[0],
      s.target[0],
      s.velocity[0],
      stiffness,
      damping,
      t
    ),
    internal.duration(
      s.position[1],
      s.target[1],
      s.velocity[1],
      stiffness,
      damping,
      t
    )
  );
}
