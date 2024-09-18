import {
  fromValues2,
  positionAt2,
  setValues2,
  velocityAt2,
} from "@nonphoto/spring-vector/src/spring-vector.js";
import {
  dampingRatioToCriticality,
  halflifeToDamping,
} from "@nonphoto/spring/src/common.js";
import { useMousePosition } from "@solid-primitives/mouse";
import createRAF from "@solid-primitives/raf";
import { createEffect, createSignal } from "solid-js";

export default function ExamplesMouseRoute() {
  const mouse = useMousePosition();
  const [x, setX] = createSignal(0);
  const [y, setY] = createSignal(0);

  const damping = halflifeToDamping(200);
  const criticality = dampingRatioToCriticality(0.5, damping);
  const s = fromValues2(undefined, undefined, undefined, damping, criticality);

  createEffect(() => {
    setValues2(s, undefined, undefined, [mouse.x, mouse.y]);
  });

  let prevTime = 0;
  const [, start] = createRAF((time) => {
    let dt = time - prevTime;
    prevTime = time;
    setValues2(s, positionAt2(s[0], ...s, dt), velocityAt2(s[1], ...s, dt));
    setX(s[0][0]);
    setY(s[0][1]);
  });

  start();

  const element = (
    <div
      style={{
        position: "fixed",
        inset: "0 auto auto 0",
        background: "skyblue",
        width: "4rem",
        height: "4rem",
        transform: `translate(${x()}px, ${y()}px`,
      }}
    />
  ) as HTMLElement;

  return element;
}
