/**
 * All arguments are assumed to be pre-normalized
 */

function safeDiv(a: number, b: number): number {
  const c = a / b;
  return isNaN(c) ? 0 : c;
}

function safeSqrt(a: number): number {
  return Math.sqrt(Math.max(0, a));
}

export function square(x: number): number {
  return x * x;
}

export function delta(position: number, target: number) {
  return position - target;
}

export function criticality(stiffness: number, damping: number) {
  return safeSqrt(stiffness - square(damping));
}

export function amplitude(
  delta: number,
  velocity: number,
  damping: number,
  criticality: number
): number {
  return (
    Math.sign(delta) *
    Math.sqrt(
      safeDiv(square(velocity + delta * damping), square(criticality)) +
        square(delta)
    )
  );
}

export function phase(
  delta: number,
  velocity: number,
  damping: number,
  criticality: number
): number {
  return Math.atan(safeDiv(velocity + delta * damping, -delta * criticality));
}

export function positionAt(
  position: number,
  target: number,
  velocity: number,
  stiffness: number,
  damping: number,
  t: number
) {
  const delta_ = delta(position, target);
  const criticality_ = criticality(stiffness, damping);
  const amplitude_ = amplitude(delta_, velocity, damping, criticality_);
  const phase_ = phase(delta_, velocity, damping, criticality_);
  const exp = Math.exp(-damping * t);
  return delta_ === 0
    ? target
    : criticality_ > 0
    ? amplitude_ * exp * Math.cos(criticality_ * t + phase_) + target
    : exp * (delta_ + (velocity + delta_ * damping) * t) + target;
}

export function velocityAt(
  position: number,
  target: number,
  velocity: number,
  stiffness: number,
  damping: number,
  t: number
) {
  const delta_ = delta(position, target);
  const criticality_ = criticality(stiffness, damping);
  const amplitude_ = amplitude(delta_, velocity, damping, criticality_);
  const phase_ = phase(delta_, velocity, damping, criticality_);
  const exp = Math.exp(-damping * t);
  const theta = criticality_ * t + phase_;
  return criticality_ > 0
    ? -damping * amplitude_ * exp * Math.cos(theta) -
        criticality_ * amplitude_ * exp * Math.sin(theta)
    : exp * (velocity - (velocity + delta_ * damping) * damping * t);
}

export function duration(
  position: number,
  target: number,
  velocity: number,
  stiffness: number,
  damping: number,
  epsilon: number = 1
) {
  const delta_ = delta(position, target);
  const criticality_ = criticality(stiffness, damping);
  const amplitude_ = amplitude(delta_, velocity, damping, criticality_);
  return Math.abs(
    safeDiv(
      -Math.log(safeDiv(epsilon, Math.max(Math.abs(amplitude_), epsilon))),
      damping
    )
  );
}

export function spring_damper_exact_stiffness_damping(
  position: number,
  positionTarget: number,
  velocity: number,
  velocityTarget: number,
  stiffness: number,
  damping: number,
  t: number
) {
  const c = positionTarget + (damping * velocityTarget) / stiffness;
  const halfDamping = damping / 2;
  const criticality = stiffness - square(damping) / 4;
  if (criticality > 0) {
    const w = Math.sqrt(criticality);
    const j = Math.sqrt(
      square(velocity + halfDamping * (position - c)) / (w * w) +
        square(position - c)
    );
    const p = Math.atan(
      (velocity + (position - c) * halfDamping) / (-(position - c) * w)
    );
    const j1 = position - c > 0 ? j : -j;
    const eydt = Math.exp(-halfDamping * t);
    return j1 * eydt * Math.cos(w * t + p) + c;
    // v = -halfDamping * j * eydt * Math.cos(w * t + p) - w * j * eydt * Math.sin(w * t + p);
  } else if (criticality < 0) {
    const y0 = (damping + Math.sqrt(square(damping) - 4 * stiffness)) / 2;
    const y1 = (damping - Math.sqrt(square(damping) - 4 * stiffness)) / 2;
    const j1 = (c * y0 - position * y0 - velocity) / (y1 - y0);
    const j0 = position - j1 - c;
    const ey0dt = Math.exp(-y0 * t);
    const ey1dt = Math.exp(-y1 * t);
    return j0 * ey0dt + j1 * ey1dt + c;
    // v = -y0 * j0 * ey0dt - y1 * j1 * ey1dt;
  } else {
    const j0 = position - c;
    const j1 = velocity + j0 * halfDamping;
    const eydt = Math.exp(-halfDamping * t);
    return j0 * eydt + t * j1 * eydt + c;
    // v = -halfDamping * j0 * eydt - halfDamping * t * j1 * eydt + j1 * eydt;
  }
}
