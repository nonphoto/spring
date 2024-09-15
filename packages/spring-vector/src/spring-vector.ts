import {
  positionAt as _positionAt,
  velocityAt as _velocityAt,
  ScalarSpringOptions,
} from "@nonphoto/spring/src/index.js";
import {
  defHofOp,
  MultiVecOpImpl,
  ReadonlyVec,
  Template,
  Vec,
} from "@thi.ng/vectors";

export type VectorSpring = [
  delta: Vec,
  end: Vec,
  velocity: Vec,
  damping: number,
  criticality: number,
  amplitude: Vec,
  phase: Vec
];

export type ReadonlyVectorSpring = [
  delta: ReadonlyVec,
  end: ReadonlyVec,
  velocity: ReadonlyVec,
  damping: number,
  criticality: number,
  amplitude: ReadonlyVec,
  phase: ReadonlyVec
];

export interface VectorSpringOptions extends ScalarSpringOptions {
  start?: Vec;
  end?: Vec;
  delta?: Vec;
  velocity?: Vec;
  amplitude?: Vec;
  phase?: Vec;
}

type VecOpVVVNNVV = (
  o: Vec | null,
  a: ReadonlyVec,
  b: ReadonlyVec,
  c: ReadonlyVec,
  d: number,
  e: number,
  f: ReadonlyVec,
  g: ReadonlyVec
) => Vec;

const ARGS_VVVNNVV = "o,a,b,c,d,e,f,g";

const FN_VVVNNVV =
  (op = "op"): Template =>
  ([o, a, b, c, , , f, g]) =>
    `${o}=${op}(${a},${b},${c},d,e,${f},${g});`;

export const [positionAt, positionAt2, positionAt3, positionAt4] = defHofOp<
  MultiVecOpImpl<VecOpVVVNNVV>,
  VecOpVVVNNVV
>(_positionAt, FN_VVVNNVV(), ARGS_VVVNNVV);

export const [velocityAt, velocityAt2, velocityAt3, velocityAt4] = defHofOp<
  MultiVecOpImpl<VecOpVVVNNVV>,
  VecOpVVVNNVV
>(_velocityAt, FN_VVVNNVV(), ARGS_VVVNNVV);
