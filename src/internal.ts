/**
 * All arguments are assumed to be pre-normalized
 */

function safeDiv(a: number, b: number): number {
  const c = a / b;
  return isNaN(c) ? 0 : c;
}

export function square(x: number): number {
  return x * x;
}

export function positionAt(
  position: number,
  positionTarget: number,
  velocity: number,
  velocityTarget: number,
  stiffness: number,
  damping: number,
  t: number
) {
  const c = positionTarget + safeDiv(damping * velocityTarget, stiffness);
  const d = position - c;
  const y = damping / 2;
  const u = stiffness - square(damping) / 4;
  if (u > 0) {
    const w = Math.sqrt(u);
    const j =
      Math.sign(d) *
      Math.sqrt(safeDiv(square(velocity + y * d), u) + square(d));
    const p = Math.atan(safeDiv(velocity + d * y, -d * w));
    const r = Math.exp(-y * t);
    return j * r * Math.cos(w * t + p) + c;
  } else if (u < 0) {
    const z = Math.sqrt(square(damping) - 4 * stiffness);
    const y0 = (damping + z) / 2;
    const y1 = (damping - z) / 2;
    const j1 = (c * y0 - position * y0 - velocity) / (y1 - y0);
    const j0 = position - j1 - c;
    const r0 = Math.exp(-y0 * t);
    const r1 = Math.exp(-y1 * t);
    return j0 * r0 + j1 * r1 + c;
  } else {
    const j = velocity + d * y;
    const r = Math.exp(-y * t);
    return d * r + t * j * r + c;
  }
}

export function velocityAt(
  position: number,
  positionTarget: number,
  velocity: number,
  velocityTarget: number,
  stiffness: number,
  damping: number,
  t: number
) {
  const c = positionTarget + safeDiv(damping * velocityTarget, stiffness);
  const d = position - c;
  const y = damping / 2;
  const u = stiffness - square(damping) / 4;
  if (u > 0) {
    const w = Math.sqrt(u);
    const j =
      Math.sign(d) *
      Math.sqrt(safeDiv(square(velocity + y * d), u) + square(d));
    const p = Math.atan(safeDiv(velocity + d * y, -d * w));
    const r = Math.exp(-y * t);
    return -y * j * r * Math.cos(w * t + p) - w * j * r * Math.sin(w * t + p);
  } else if (u < 0) {
    const z = Math.sqrt(square(damping) - 4 * stiffness);
    const y0 = (damping + z) / 2;
    const y1 = (damping - z) / 2;
    const j1 = (c * y0 - position * y0 - velocity) / (y1 - y0);
    const j0 = position - j1 - c;
    const r0 = Math.exp(-y0 * t);
    const r1 = Math.exp(-y1 * t);
    return -y0 * j0 * r0 - y1 * j1 * r1;
  } else {
    const j = velocity + d * y;
    const r = Math.exp(-y * t);
    return -y * d * r - y * t * j * r + j * r;
  }
}

export function duration(
  position: number,
  positionTarget: number,
  velocity: number,
  velocityTarget: number,
  stiffness: number,
  damping: number,
  epsilon: number = 1
) {
  return 0;
}
