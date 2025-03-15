import { Vec } from "@thi.ng/vectors";
import * as internal from "./internal";
import { VecSpring } from "./types";
import { normalizeDamping, normalizeStiffness } from "./util";

export function positionAt4(out: Vec, s: VecSpring, t: number): Vec {
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
  out[2] = internal.positionAt(
    s.position[2],
    s.target[2],
    s.velocity[2],
    stiffness,
    damping,
    t
  );
  out[3] = internal.positionAt(
    s.position[3],
    s.target[3],
    s.velocity[3],
    stiffness,
    damping,
    t
  );
  return out;
}

export function velocityAt4(out: Vec, s: VecSpring, t: number): Vec {
  const stiffness = normalizeStiffness(s.stiffness);
  const damping = normalizeDamping(s.damping);
  out[0] = internal.velocityAt(
    s.position[0],
    s.target[0],
    s.velocity[0],
    stiffness,
    damping,
    t
  );
  out[1] = internal.velocityAt(
    s.position[1],
    s.target[1],
    s.velocity[1],
    stiffness,
    damping,
    t
  );
  out[2] = internal.velocityAt(
    s.position[2],
    s.target[2],
    s.velocity[2],
    stiffness,
    damping,
    t
  );
  out[3] = internal.velocityAt(
    s.position[3],
    s.target[3],
    s.velocity[3],
    stiffness,
    damping,
    t
  );
  return out;
}

export function duration4(s: VecSpring, epsilon?: number): number {
  const stiffness = normalizeStiffness(s.stiffness);
  const damping = normalizeDamping(s.damping);
  return Math.max(
    internal.duration(
      s.position[0],
      s.target[0],
      s.velocity[0],
      stiffness,
      damping,
      epsilon
    ),
    internal.duration(
      s.position[1],
      s.target[1],
      s.velocity[1],
      stiffness,
      damping,
      epsilon
    ),
    internal.duration(
      s.position[2],
      s.target[2],
      s.velocity[2],
      stiffness,
      damping,
      epsilon
    ),
    internal.duration(
      s.position[3],
      s.target[3],
      s.velocity[3],
      stiffness,
      damping,
      epsilon
    )
  );
}
