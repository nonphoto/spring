export function mix(x: number, y: number, a: number): number {
  return (1 - a) * x + a * y;
}

export function copySign(x: number, y: number): number {
  return Math.sign(x) === Math.sign(y) ? x : -x;
}

export function square(x: number): number {
  return x * x;
}

export function fastNegExp(x: number): number {
  return 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
}

export function fastAtan(x: number): number {
  const z = Math.abs(x);
  const w = z > 1 ? 1 / z : z;
  const y = (Math.PI / 4) * w - w * (w - 1) * (0.2447 + 0.0663 * w);
  return copySign(z > 1 ? Math.PI / 2 - y : y, x);
}

export function halflifeToDamping(halflife: number): number {
  return (4 * Math.LN2) / halflife;
}

export function dampingToHalflife(damping: number): number {
  return (4 * Math.LN2) / damping;
}

export function frequencyToStiffness(frequency: number): number {
  return square(2 * Math.PI * frequency);
}

export function stiffnessToFrequency(stiffness: number): number {
  return Math.sqrt(stiffness) / (2 * Math.PI);
}

export function criticalHalflife(frequency: number): number {
  return dampingToHalflife(Math.sqrt(frequencyToStiffness(frequency) * 4));
}

export function criticalFrequency(halflife: number): number {
  return stiffnessToFrequency(square(halflifeToDamping(halflife)) / 4);
}

export function dampingRatioToStiffness(
  dampingRatio: number,
  damping: number
): number {
  return square(damping / (dampingRatio * 2));
}

export function dampingRatioToDamping(
  dampingRatio: number,
  stiffness: number
): number {
  return dampingRatio * 2 * Math.sqrt(stiffness);
}

export function damper(
  start: number,
  end: number,
  halflife: number,
  t: number
): number {
  return mix(start, end, 1 - fastNegExp((Math.LN2 * t) / halflife));
}
