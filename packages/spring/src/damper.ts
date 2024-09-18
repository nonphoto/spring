import { mix } from "@thi.ng/math";
import { fastNegExp } from "./common.js";

export function damper(
  start: number,
  end: number,
  halflife: number,
  t: number
): number {
  return mix(start, end, 1 - fastNegExp((Math.LN2 * t) / halflife));
}
