import { createWindowSize } from "@solid-primitives/resize-observer";
import { createEffect, createSignal } from "solid-js";
import { duration, positionAt, velocityAt } from "~/../../src";
import { Controls, ControlsSlider } from "~/components/Controls";

export default function GraphRoute() {
  const size = createWindowSize();
  const w = () => size.width * 2;
  const h = () => size.height * 2;

  const [stiffness, setStiffness] = createSignal([0.005]);
  const [damping, setDamping] = createSignal([0.005]);
  const [target, setTarget] = createSignal([0.75]);

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

    const spring = {
      position: h() * 0.5,
      velocity: 0,
      target: h() * target()[0],
      damping: damping()[0],
      stiffness: stiffness()[0],
    };

    const context = canvas.getContext("2d")!;
    context.lineWidth = 4;

    context.beginPath();
    context.moveTo(0, spring.target);
    context.lineTo(w(), spring.target);
    context.strokeStyle = "lightgray";
    context.stroke();

    context.beginPath();
    for (let x = 0; x < w(); x += step) {
      const y = positionAt(spring, x);
      context[x === 0 ? "moveTo" : "lineTo"](x, y);
    }
    context.strokeStyle = "blue";
    context.stroke();

    context.beginPath();
    for (let x = 0; x < w(); x += step) {
      const y = velocityAt(spring, x);
      context[x === 0 ? "moveTo" : "lineTo"](x, spring.target + y * 100);
    }
    context.strokeStyle = "orange";
    context.stroke();

    context.beginPath();
    const x = duration(spring);
    context.moveTo(x, 0);
    context.lineTo(x, h());
    context.strokeStyle = "red";
    context.stroke();
  });

  return (
    <main>
      <Controls>
        <ControlsSlider
          label="Target"
          value={target()}
          onChange={setTarget}
          minValue={-1}
          maxValue={2}
          step={0.001}
        />
        <ControlsSlider
          label="Stiffness"
          value={stiffness()}
          onChange={setStiffness}
          minValue={-2}
          maxValue={2}
          step={0.001}
        />
        <ControlsSlider
          label="Damping"
          value={damping()}
          onChange={setDamping}
          minValue={-1}
          maxValue={2}
          step={0.001}
        />
      </Controls>
      {canvas}
    </main>
  );
}
