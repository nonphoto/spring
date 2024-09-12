import {
  duration,
  fromOptions,
  positionAt,
  velocityAt,
} from "@nonphoto/spring/src/index";
import { createWindowSize } from "@solid-primitives/resize-observer";
import { createEffect } from "solid-js";

export default function () {
  const size = createWindowSize();
  const canvas = (
    <canvas
      style={{
        width: "100svw",
        height: "100svh",
        display: "block",
      }}
    />
  ) as HTMLCanvasElement;

  const w = () => size.width * 2;
  const h = () => size.height * 2;

  createEffect(() => {
    canvas.width = w();
    canvas.height = h();

    const step = 2;

    const spring = fromOptions({
      start: h(),
      end: h() / 3,
      halflife: w() * 0.1,
      dampingRatio: 0.5,
    });
    console.log(spring);

    const context = canvas.getContext("2d")!;
    context.lineWidth = 4;

    context.beginPath();
    context.moveTo(0, spring[1]);
    context.lineTo(w(), spring[1]);
    context.strokeStyle = "lightgray";
    context.stroke();

    context.beginPath();
    context.moveTo(0, spring[0] + spring[1]);
    for (let x = 0; x < w(); x += step) {
      const y = positionAt(...spring, x);
      context.lineTo(x, y);
    }
    context.strokeStyle = "blue";
    context.stroke();

    context.beginPath();
    context.moveTo(0, spring[1]);
    for (let x = 0; x < w(); x += step) {
      const y = velocityAt(...spring, x);
      context.lineTo(x, spring[1] + y * 100);
    }
    context.strokeStyle = "orange";
    context.stroke();

    context.beginPath();
    const x = duration(...spring, 1);
    context.moveTo(x, 0);
    context.lineTo(x, h());
    context.strokeStyle = "red";
    context.stroke();
  });

  return canvas;
}
