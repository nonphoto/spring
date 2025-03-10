import { LRUCache } from "@thi.ng/cache";
import { memoize } from "@thi.ng/memoize";
import {
  amplitude,
  criticality,
  duration,
  phase,
  positionAt,
  velocityAt,
} from "./common";

interface SpringLike {
  position: number;
  velocity: number;
  target: number;
  damping: number;
  stiffness: number;
}

export class Spring implements SpringLike {
  position: number;
  velocity: number;
  target: number;
  damping: number;
  stiffness: number;

  constructor(options?: Partial<SpringLike>) {
    this.position = options?.position ?? 0;
    this.velocity = options?.velocity ?? 0;
    this.target = options?.target ?? 0;
    this.damping = options?.damping ?? 0;
    this.stiffness = options?.stiffness ?? 0;
    console.log(criticality(this.stiffness, this.damping));
  }

  #criticality = memoize(criticality, new LRUCache(null, { maxlen: 1 }));
  #amplitude = memoize(amplitude, new LRUCache(null, { maxlen: 1 }));
  #phase = memoize(
    phase,
    new LRUCache(null, {
      maxlen: 1,
    })
  );

  criticality() {
    return this.#criticality(this.stiffness, this.damping);
  }

  amplitude() {
    return this.#amplitude(
      this.position,
      this.target,
      this.velocity,
      this.damping,
      this.criticality()
    );
  }

  phase() {
    return this.#phase(
      this.position,
      this.target,
      this.velocity,
      this.damping,
      this.criticality()
    );
  }

  positionAt(t: number) {
    return positionAt(
      this.position,
      this.target,
      this.velocity,
      this.damping,
      this.criticality(),
      this.amplitude(),
      this.phase(),
      t
    );
  }

  velocityAt(t: number) {
    return velocityAt(
      this.position,
      this.target,
      this.velocity,
      this.damping,
      this.criticality(),
      this.amplitude(),
      this.phase(),
      t
    );
  }

  duration(epsilon?: number) {
    return duration(this.damping, this.amplitude(), epsilon);
  }
}
