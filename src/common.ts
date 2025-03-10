const TWO_LN2 = 2 * Math.LN2;

function safeDiv(a: number, b: number): number {
  const c = a / b;
  return isNaN(c) ? 0 : c;
}

export function square(x: number): number {
  return x * x;
}

export function dampingFromHalflife(halflife: number): number {
  return TWO_LN2 / halflife;
}

export function halflifeFromDamping(damping: number): number {
  return TWO_LN2 / damping;
}

export function stiffnessFromDamping(
  dampingRatio: number,
  damping: number
): number {
  return square(damping / dampingRatio);
}

export function dampingFromStiffness(
  dampingRatio: number,
  stiffness: number
): number {
  return dampingRatio * Math.sqrt(stiffness);
}

export function delta(position: number, target: number) {
  return position - target;
}

export function criticality(stiffness: number, damping: number) {
  return Math.sqrt(stiffness - square(damping));
}

export function criticalityFromDamping(dampingRatio: number, damping: number) {
  return criticality(stiffnessFromDamping(dampingRatio, damping), damping);
}

export function amplitude(
  position: number,
  target: number,
  velocity: number,
  damping: number,
  criticality: number
): number {
  const d = delta(position, target);
  return (
    Math.sign(d) *
    Math.sqrt(
      safeDiv(square(velocity + d * damping), square(criticality)) + square(d)
    )
  );
}

export function phase(
  position: number,
  target: number,
  velocity: number,
  damping: number,
  criticality: number
): number {
  const d = delta(position, target);
  return Math.atan(safeDiv(velocity + d * damping, -d * criticality));
}

export function positionAt(
  position: number,
  target: number,
  velocity: number,
  damping: number,
  criticality: number,
  amplitude: number,
  phase: number,
  t: number
) {
  const d = delta(position, target);
  const exp = Math.exp(-damping * t);
  return d === 0
    ? target
    : criticality > 0
    ? amplitude * exp * Math.cos(criticality * t + phase) + target
    : exp * (d + (velocity + d * damping) * t) + target;
}

export function velocityAt(
  position: number,
  target: number,
  velocity: number,
  damping: number,
  criticality: number,
  amplitude: number,
  phase: number,
  t: number
) {
  const d = delta(position, target);
  const exp = Math.exp(-damping * t);
  const theta = criticality * t + phase;
  return criticality > 0
    ? -damping * amplitude * exp * Math.cos(theta) -
        criticality * amplitude * exp * Math.sin(theta)
    : exp * (velocity - (velocity + d * damping) * damping * t);
}

export function duration(
  damping: number,
  amplitude: number,
  epsilon: number = 1
) {
  return Math.abs(
    safeDiv(
      -Math.log(safeDiv(epsilon, Math.max(Math.abs(amplitude), epsilon))),
      damping
    )
  );
}
