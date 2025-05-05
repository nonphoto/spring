import { createWindowSize } from "@solid-primitives/resize-observer";
import { createEffect, createSignal } from "solid-js";
import {
  dampingFromHalflife,
  duration,
  stiffnessFromDamping,
  velocityAt,
} from "~/../../src";
import { Controls, ControlsSlider } from "~/components/Controls";
import { spring_damper_exact_stiffness_damping } from "../../../src/internal";

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
      velocity: 0,
      target: h() * target()[0],
      damping: damping()[0],
      stiffness: stiffness()[0],
    };

    console.log(
      duration(
        {
          damping: damping2,
          stiffness: stiffness2,
          position: 16,
          target: 192,
          velocity: 0,
        },
        10 // Why doesn't this do anything?
      )
    );

    const context = canvas.getContext("2d")!;
    context.lineWidth = 2;

    context.strokeStyle = "lightgray";
    drawPolyline(context, () => spring.target, "x", w());

    context.strokeStyle = "orange";
    drawPolyline(
      context,
      (t) => spring.target + velocityAt(spring, t),
      "x",
      w()
    );

    context.strokeStyle = "blue";
    drawPolyline(
      context,
      (t) =>
        spring_damper_exact_stiffness_damping(
          spring.position,
          spring.target,
          spring.velocity,
          0,
          spring.stiffness,
          spring.damping,
          t
        ),
      "x",
      w()
    );
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
