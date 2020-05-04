import { Animated } from "react-native";
import { SliderProps } from "../components/Slider/Slider.type";
import { DEFAULT_ANIMATION_CONFIGS } from "../constants/animationConfig";

type SetCurrentValueAnimatedArgs = Pick<
  SliderProps,
  "value" | "animationType" | "animationConfig"
> & {
  currentValue: Animated.Value;
};

export const setValue = (currentValue: Animated.Value, value: number) => {
  currentValue.setValue(value);
};

export const setAnimatedValue = (args: SetCurrentValueAnimatedArgs) => {
  const { value, animationType, animationConfig, currentValue } = args;

  const customAnimationConfig = {
    ...DEFAULT_ANIMATION_CONFIGS[animationType],
    ...animationConfig,
    toValue: value,
  };

  Animated[animationType](currentValue, customAnimationConfig).start();
};

export const getValue = (currentValue: Animated.Value) =>
  (currentValue as any).__getValue();
