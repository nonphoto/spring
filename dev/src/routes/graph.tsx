import { createWindowSize } from "@solid-primitives/resize-observer";
import { createEffect, createSignal } from "solid-js";
import {
  dampingFromHalflife,
  duration,
  positionAt,
  stiffnessFromDamping,
  velocityAt,
} from "~/../../src";
import { Controls, ControlsSlider } from "~/components/Controls";

function drawPolyline(
  context: CanvasRenderingContext2D,
  fn: (t: number) => number,
  direction: "x" | "y",
  length: number
) {
  context.beginPath();
  for (let t = 0; t <= length; t += 2) {
    context[t === 0 ? "moveTo" : "lineTo"](
      direction === "x" ? t : fn(t),
      direction === "y" ? t : fn(t)
    );
  }
  context.stroke();
}

export default function GraphRoute() {
  const size = createWindowSize();
  const w = () => size.width * 2;
  const h = () => size.height * 2;
  const damping2 = dampingFromHalflife(200);
  const stiffness2 = stiffnessFromDamping(1, damping2);
  const [stiffness, setStiffness] = createSignal([stiffness2]);
  const [damping, setDamping] = createSignal([damping2]);
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

    const spring = {
      position: h() * 0.5,
      positionTarget: h() * target()[0],
      velocity: 0,
      velocityTarget: 0,
      damping: damping()[0],
      stiffness: stiffness()[0],
    };

    console.log(
      duration(
        {
          damping: damping2,
          stiffness: stiffness2,
          position: 16,
          positionTarget: 192,
          velocity: 0,
          velocityTarget: 0,
        },
        10 // Why doesn't this do anything?
      )
    );

    const context = canvas.getContext("2d")!;
    context.lineWidth = 2;

    context.strokeStyle = "lightgray";
    drawPolyline(context, () => spring.positionTarget, "x", w());

    context.strokeStyle = "orange";
    drawPolyline(
      context,
      (t) => spring.positionTarget + 20 * velocityAt(spring, t),
      "x",
      w()
    );

    context.strokeStyle = "blue";
    drawPolyline(context, (t) => positionAt(spring, t), "x", w());
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
          minValue={0}
          maxValue={0.001}
          step={0.000001}
        />
        <ControlsSlider
          label="Damping"
          value={damping()}
          onChange={setDamping}
          minValue={0}
          maxValue={0.1}
          step={0.0001}
        />
      </Controls>
      {canvas}
    </main>
  );
}
