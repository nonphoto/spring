import { Slider } from "@kobalte/core";
import { SliderRootProps } from "@kobalte/core/slider";
import clsx from "clsx";
import { ComponentProps, splitProps } from "solid-js";
import classes from "./Controls.module.css";

export interface ControlsProps extends ComponentProps<"div"> {}

export function Controls(props: ControlsProps) {
  return <div {...props} class={clsx(props.class, classes.controls)} />;
}

export interface ControlsSliderProps extends SliderRootProps {
  label?: string;
}

export function ControlsSlider(props: ControlsSliderProps) {
  const [, childProps] = splitProps(props, ["label"]);
  return (
    <Slider.Root {...childProps} class={classes.sliderRoot}>
      <div class={classes.sliderLabel}>
        <Slider.Label>{props.label}</Slider.Label>
        <Slider.ValueLabel />
      </div>
      <Slider.Track class={classes.sliderTrack}>
        <Slider.Fill class={classes.sliderRange} />
        <Slider.Thumb class={classes.sliderThumb}>
          <Slider.Input />
        </Slider.Thumb>
      </Slider.Track>
    </Slider.Root>
  );
}
