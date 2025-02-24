import { createWindowSize } from "@solid-primitives/resize-observer";
import { createEffect, createSignal } from "solid-js";
import {
  dampingRatioToCriticality,
  duration,
  fromValues,
  halflifeToDamping,
  positionAt,
  velocityAt,
} from "~/../../src";
import { Controls, ControlsSlider } from "~/components/Controls";

export default function GraphRoute() {
  const size = createWindowSize();
  const w = () => size.width * 2;
  const h = () => size.height * 2;

  const [dampingRatio, setDampingRatio] = createSignal([0.5]);
  const [halflife, setHalflife] = createSignal([0.25]);

  const canvas = (
    <canvas
      style={{
        width: "100svw",
        height: "100svh",
        display: "block",
      }}
    />
  ) as HTMLCanvasElement;

  createEffect(() => {
    canvas.width = w();
    canvas.height = h();

    const step = 2;

    const damping = halflifeToDamping((w() / 2) * halflife()[0]);
    const criticality = dampingRatioToCriticality(dampingRatio()[0], damping);
    const spring = fromValues(h(), 0, h() / 3, damping, criticality);

    const context = canvas.getContext("2d")!;
    context.lineWidth = 4;

    context.beginPath();
    context.moveTo(0, spring[2]);
    context.lineTo(w(), spring[2]);
    context.strokeStyle = "lightgray";
    context.stroke();

    context.beginPath();
    context.moveTo(0, spring[0] + spring[2]);
    for (let x = 0; x < w(); x += step) {
      const y = positionAt(...spring, x);
      context.lineTo(x, y);
    }
    context.strokeStyle = "blue";
    context.stroke();

    context.beginPath();
    context.moveTo(0, spring[2]);
    for (let x = 0; x < w(); x += step) {
      const y = velocityAt(...spring, x);
      context.lineTo(x, spring[2] + y * 100);
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

  return (
    <main>
      <Controls>
        <ControlsSlider
          label="Damping Ratio"
          value={dampingRatio()}
          onChange={setDampingRatio}
          minValue={0}
          maxValue={1}
          step={0.001}
        />
        <ControlsSlider
          label="Half-life"
          value={halflife()}
          onChange={setHalflife}
          minValue={0}
          maxValue={1}
          step={0.001}
        />
      </Controls>
      {canvas}
    </main>
  );
}
