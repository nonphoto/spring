import {
  add,
  addN,
  atan,
  cos,
  divN,
  log,
  maddN,
  msubN,
  mul,
  mulN,
  neg,
  ones,
  powN,
  safeDiv,
  sign,
  sin,
  sqrt,
  sub,
  Vec,
  zeroes,
} from "@thi.ng/vectors";
import {
  dampingRatioToStiffness,
  frequencyToStiffness,
  halflifeToDamping,
  square,
} from "./math.js";

export const defaultEpsilon = 0.1;
export const defaultDamping = halflifeToDamping(1000);
export const defaultStiffness = dampingRatioToStiffness(1, defaultDamping);

const scratchVec: [number] = [0];

export interface Spring {
  halfDamping: number;
  start: Vec;
  end: Vec;
  delta: Vec;
  startVelocity: Vec;
  dampedFrequency: number;
  amplitude: Vec;
  phase: Vec;
  theta: Vec;
  cosTheta: Vec;
  sinTheta: Vec;
}

export interface SpringOptions {
  start?: Vec;
  end?: Vec;
  startVelocity?: Vec;
  damping?: number;
  stiffness?: number;
  halflife?: number;
  frequency?: number;
  dampingRatio?: number;
}

export function isSpring(s: any): s is Spring {
  return (
    typeof s === "object" &&
    s !== null &&
    "halfDamping" in s &&
    typeof s.halfDamping === "number" &&
    "start" in s &&
    Array.isArray(s.start) &&
    "end" in s &&
    Array.isArray(s.end) &&
    "startVelocity" in s &&
    Array.isArray(s.startVelocity) &&
    "dampedFrequency" in s &&
    typeof s.halfDamping === "number" &&
    "amplitude" in s &&
    Array.isArray(s.amplitude) &&
    "phase" in s &&
    Array.isArray(s.phase) &&
    "theta" in s &&
    Array.isArray(s.theta) &&
    "cosTheta" in s &&
    Array.isArray(s.cosTheta) &&
    "sinTheta" in s &&
    Array.isArray(s.sinTheta)
  );
}

export function setOptions(s: Partial<Spring>, o: SpringOptions): Spring {
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
  s.halfDamping = damping / 2;
  const length =
    o.start?.length ?? o.end?.length ?? o.startVelocity?.length ?? 1;
  s.start = o.start ?? zeroes(length);
  s.end = o.end ?? ones(length);
  s.startVelocity = o.startVelocity ?? zeroes(length);
  s.delta = sub([], s.start, s.end);
  const squareDampedFrequency = Math.max(0, stiffness - square(damping) / 4);
  s.dampedFrequency = Math.sqrt(squareDampedFrequency);
  const velocityDelta = maddN([], s.delta, s.halfDamping, s.startVelocity);
  s.amplitude = mul(
    null,
    sign([], s.delta),
    sqrt(
      null,
      add(
        null,
        safeDiv(
          null,
          powN([], velocityDelta, 2),
          mulN([], ones(length), squareDampedFrequency)
        ),
        powN([], s.delta, 2)
      )
    )
  );
  s.phase = atan(
    null,
    safeDiv([], velocityDelta, mulN(null, neg([], s.delta), s.dampedFrequency))
  );
  s.theta = [];
  s.cosTheta = [];
  s.sinTheta = [];
  return s as Spring;
}

export function fromOptions(o: SpringOptions): Spring {
  return setOptions({}, o);
}

export function position(a: Vec | null, s: Spring, t: number): Vec {
  const exp = Math.exp(-s.halfDamping * t);
  return s.dampedFrequency > 0
    ? maddN(
        null,
        mul(
          null,
          cos(null, addN(a, s.phase, s.dampedFrequency * t)),
          s.amplitude
        ),
        exp,
        s.end
      )
    : maddN(
        null,
        maddN(
          null,
          maddN(a, s.delta, s.halfDamping, s.startVelocity),
          t,
          s.delta
        ),
        exp,
        s.end
      );
}

export function positionN(s: Spring, t: number): number {
  return position(scratchVec, s, t)[0];
}

export function velocity(a: Vec | null, s: Spring, t: number) {
  const exp = Math.exp(-s.halfDamping * t);
  addN(s.theta, s.phase, s.dampedFrequency * t);
  return s.dampedFrequency > 0
    ? mul(
        a,
        add(
          null,
          mulN(null, cos(s.cosTheta, s.theta), -s.halfDamping * exp),
          mulN(null, sin(s.sinTheta, s.theta), -s.dampedFrequency * exp)
        ),
        s.amplitude
      )
    : mulN(
        null,
        msubN(
          null,
          maddN(a, s.delta, s.halfDamping, s.startVelocity),
          s.halfDamping * t,
          s.startVelocity
        ),
        -exp
      );
}

export function velocityN(s: Spring, t: number): number {
  return velocity(scratchVec, s, t)[0];
}

export function duration(
  a: Vec | null,
  s: Spring,
  epsilon: number = defaultEpsilon
) {
  return divN(
    null,
    neg(
      null,
      log(
        null,
        safeDiv(null, mulN(null, sign(a, s.delta), epsilon), s.amplitude)
      )
    ),
    s.halfDamping
  );
}

export function durationN(s: Spring, epsilon: number = defaultEpsilon) {
  return duration(scratchVec, s, epsilon)[0];
}
