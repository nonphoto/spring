import {
  amplitudeFromValues,
  defaultCriticality,
  defaultDamping,
  defaultPosition,
  defaultTarget,
  defaultVelocity,
  phaseFromValues,
  positionAt,
  velocityAt,
} from "@nonphoto/spring/src/index.js";
import {
  defHofOp,
  MultiVecOpImpl,
  MultiVecOpN,
  ReadonlyVec,
  setN,
  setN2,
  setN3,
  setN4,
  Template,
  Vec,
  VecOpN,
} from "@thi.ng/vectors";

function create(set: VecOpN | MultiVecOpN): VectorSpring {
  return [
    set([], defaultPosition),
    set([], defaultVelocity),
    set([], defaultTarget),
    defaultDamping,
    defaultCriticality,
    [],
    [],
  ];
}

export type VectorSpring = [
  position: Vec,
  velocity: Vec,
  target: Vec,
  damping: number,
  criticality: number,
  amplitude: Vec,
  phase: Vec
];

export type ReadonlyVectorSpring = [
  position: ReadonlyVec,
  velocity: ReadonlyVec,
  target: ReadonlyVec,
  damping: number,
  criticality: number,
  amplitude: ReadonlyVec,
  phase: ReadonlyVec
];

type VecOpVVVNN = (
  o: Vec | null,
  a: ReadonlyVec,
  b: ReadonlyVec,
  c: ReadonlyVec,
  d: number,
  e: number
) => Vec;

type VecOpVVVNNVVN = (
  o: Vec | null,
  a: ReadonlyVec,
  b: ReadonlyVec,
  c: ReadonlyVec,
  d: number,
  e: number,
  f: ReadonlyVec,
  g: ReadonlyVec,
  h: number
) => Vec;

const ARGS_VVVNN = "o,a,b,c,d,e";

const ARGS_VVVNNVVN = "o,a,b,c,d,e,f,g,h";

const FN_VVVNN: Template = ([o, a, b, c]) => `${o}=op(${a},${b},${c},d,e);`;

const FN_VVVNNVVN: Template = ([o, a, b, c, , , f, g]) =>
  `${o}=op(${a},${b},${c},d,e,${f},${g},h);`;

export const [
  amplitudeFromValuesV,
  amplitudeFromValues2,
  amplitudeFromValues3,
  amplitudeFromValues4,
] = defHofOp<MultiVecOpImpl<VecOpVVVNN>, VecOpVVVNN>(
  amplitudeFromValues,
  FN_VVVNN,
  ARGS_VVVNN
);

export const [
  phaseFromValuesV,
  phaseFromValues2,
  phaseFromValues3,
  phaseFromValues4,
] = defHofOp<MultiVecOpImpl<VecOpVVVNN>, VecOpVVVNN>(
  phaseFromValues,
  FN_VVVNN,
  ARGS_VVVNN
);

export function setValuesV(
  s: VectorSpring,
  position?: Vec,
  velocity?: Vec,
  target?: Vec,
  damping?: number,
  criticality?: number
): VectorSpring {
  s[0] = position ?? s[0];
  s[1] = velocity ?? s[1];
  s[2] = target ?? s[2];
  s[3] = damping ?? s[3];
  s[4] = criticality ?? s[4];
  amplitudeFromValuesV(s[5], s[0], s[1], s[2], s[3], s[4]);
  phaseFromValuesV(s[6], s[0], s[1], s[2], s[3], s[4]);
  return s;
}

export function setValues2(
  s: VectorSpring,
  position?: Vec,
  velocity?: Vec,
  target?: Vec,
  damping?: number,
  criticality?: number
): VectorSpring {
  s[0] = position ?? s[0];
  s[1] = velocity ?? s[1];
  s[2] = target ?? s[2];
  s[3] = damping ?? s[3];
  s[4] = criticality ?? s[4];
  amplitudeFromValues2(s[5], s[0], s[1], s[2], s[3], s[4]);
  phaseFromValues2(s[6], s[0], s[1], s[2], s[3], s[4]);
  return s;
}

export function setValues3(
  s: VectorSpring,
  position?: Vec,
  target?: Vec,
  velocity?: Vec,
  damping?: number,
  criticality?: number
): VectorSpring {
  s[0] = position ?? s[0];
  s[1] = velocity ?? s[1];
  s[2] = target ?? s[2];
  s[3] = damping ?? s[3];
  s[4] = criticality ?? s[4];
  amplitudeFromValues3(s[5], s[0], s[1], s[2], s[3], s[4]);
  phaseFromValues3(s[6], s[0], s[1], s[2], s[3], s[4]);
  return s;
}

export function setValues4(
  s: VectorSpring,
  position?: Vec,
  target?: Vec,
  velocity?: Vec,
  damping?: number,
  criticality?: number
): VectorSpring {
  s[0] = position ?? s[0];
  s[1] = velocity ?? s[1];
  s[2] = target ?? s[2];
  s[3] = damping ?? s[3];
  s[4] = criticality ?? s[4];
  amplitudeFromValues4(s[5], s[0], s[1], s[2], s[3], s[4]);
  phaseFromValues4(s[6], s[0], s[1], s[2], s[3], s[4]);
  return s;
}

export function fromValuesV(
  position?: Vec,
  velocity?: Vec,
  target?: Vec,
  damping?: number,
  criticality?: number
): VectorSpring {
  return setValuesV(
    create(setN),
    position,
    velocity,
    target,
    damping,
    criticality
  );
}

export function fromValues2(
  position?: Vec,
  velocity?: Vec,
  target?: Vec,
  damping?: number,
  criticality?: number
): VectorSpring {
  return setValues2(
    create(setN2),
    position,
    velocity,
    target,
    damping,
    criticality
  );
}

export function fromValues3(
  position?: Vec,
  velocity?: Vec,
  target?: Vec,
  damping?: number,
  criticality?: number
): VectorSpring {
  return setValues3(
    create(setN3),
    position,
    velocity,
    target,
    damping,
    criticality
  );
}

export function fromValues4(
  position?: Vec,
  velocity?: Vec,
  target?: Vec,
  damping?: number,
  criticality?: number
): VectorSpring {
  return setValues4(
    create(setN4),
    position,
    velocity,
    target,
    damping,
    criticality
  );
}

export const [positionAtV, positionAt2, positionAt3, positionAt4] = defHofOp<
  MultiVecOpImpl<VecOpVVVNNVVN>,
  VecOpVVVNNVVN
>(positionAt, FN_VVVNNVVN, ARGS_VVVNNVVN);

export const [velocityAtV, velocityAt2, velocityAt3, velocityAt4] = defHofOp<
  MultiVecOpImpl<VecOpVVVNNVVN>,
  VecOpVVVNNVVN
>(velocityAt, FN_VVVNNVVN, ARGS_VVVNNVVN);
