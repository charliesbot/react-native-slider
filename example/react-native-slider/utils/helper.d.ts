import { Animated } from "react-native";
import { SliderProps } from "../components/Slider/Slider.type";
export declare const setCurrentValue: (currentValue: Animated.Value, value: number) => void;
declare type SetCurrentValueAnimatedArgs = Pick<SliderProps, "value" | "animationType" | "animationConfig"> & {
    currentValue: Animated.Value;
};
export declare const setCurrentValueAnimated: (args: SetCurrentValueAnimatedArgs) => void;
export declare const getCurrentValue: (currentValue: Animated.Value) => any;
export {};
