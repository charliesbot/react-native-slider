import { Animated } from "react-native";
import { SliderProps } from "../components/Slider/Slider.type";
import { DEFAULT_ANIMATION_CONFIGS } from "../constants/animationConfig";

export const setCurrentValue = (
  currentValue: Animated.Value,
  value: number
) => {
  currentValue.setValue(value);
};

type SetCurrentValueAnimatedArgs = Pick<
  SliderProps,
  "value" | "animationType" | "animationConfig"
> & {
  currentValue: Animated.Value;
};

export const setCurrentValueAnimated = (args: SetCurrentValueAnimatedArgs) => {
  const { value, animationType, animationConfig, currentValue } = args;

  const customAnimationConfig = {
    ...DEFAULT_ANIMATION_CONFIGS[animationType],
    ...animationConfig,
    toValue: value,
  };

  Animated[animationType](currentValue, customAnimationConfig).start();
};

export const getCurrentValue = (currentValue: Animated.Value) =>
  (currentValue as any).__getValue();
