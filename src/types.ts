import { Vec } from "@thi.ng/vectors";

export interface Spring {
  position: number;
  velocity: number;
  target: number;
  stiffness: number;
  damping: number;
}

export interface VecSpring {
  position: Vec;
  velocity: Vec;
  target: Vec;
  stiffness: number;
  damping: number;
}
