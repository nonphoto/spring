import { Vec } from "@thi.ng/vectors";

export interface Body {
  position: number;
  velocity: number;
}

export interface Spring extends Body {
  positionTarget: number;
  velocityTarget: number;
  stiffness: number;
  damping: number;
}

export interface VecBody {
  position: Vec;
  velocity: Vec;
}

export interface VecSpring extends VecBody {
  positionTarget: Vec;
  velocityTarget: Vec;
  stiffness: number;
  damping: number;
}
