import { createWindowSize } from "@solid-primitives/resize-observer";
import { createEffect, createSignal } from "solid-js";
import { dampingFromHalflife, Spring, stiffnessFromDamping } from "~/../../src";
import { Controls, ControlsSlider } from "~/components/Controls";

export default function GraphRoute() {
  const size = createWindowSize();
  const w = () => size.width * 2;
  const h = () => size.height * 2;

  const [dampingRatio, setDampingRatio] = createSignal([0.5]);
  const [halflife, setHalflife] = createSignal([0.25]);
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

    const damping = dampingFromHalflife((w() / 2) * halflife()[0]);
    const stiffness = stiffnessFromDamping(dampingRatio()[0], damping);
    const spring = new Spring({
      position: h() * 0.5,
      target: h() * target()[0],
      damping,
      stiffness,
    });

    const context = canvas.getContext("2d")!;
    context.lineWidth = 4;

    context.beginPath();
    context.moveTo(0, spring.target);
    context.lineTo(w(), spring.target);
    context.strokeStyle = "lightgray";
    context.stroke();

    context.beginPath();
    for (let x = 0; x < w(); x += step) {
      const y = spring.positionAt(x);
      context[x === 0 ? "moveTo" : "lineTo"](x, y);
    }
    context.strokeStyle = "blue";
    context.stroke();

    context.beginPath();
    for (let x = 0; x < w(); x += step) {
      const y = spring.velocityAt(x);
      context[x === 0 ? "moveTo" : "lineTo"](x, spring.target + y * 100);
    }
    context.strokeStyle = "orange";
    context.stroke();

    context.beginPath();
    const x = spring.duration();
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
          label="Damping Ratio"
          value={dampingRatio()}
          onChange={setDampingRatio}
          minValue={-1}
          maxValue={2}
          step={0.001}
        />
        <ControlsSlider
          label="Half-life"
          value={halflife()}
          onChange={setHalflife}
          minValue={-1}
          maxValue={2}
          step={0.001}
        />
      </Controls>
      {canvas}
    </main>
  );
}
