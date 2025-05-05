import { Vec } from "@thi.ng/vectors";

export interface Spring {
  position: number;
  positionTarget: number;
  velocity: number;
  velocityTarget: number;
  stiffness: number;
  damping: number;
}

export interface VecSpring {
  position: Vec;
  positionTarget: Vec;
  velocity: Vec;
  velocityTarget: Vec;
  stiffness: number;
  damping: number;
}
