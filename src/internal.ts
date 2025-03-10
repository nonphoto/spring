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
