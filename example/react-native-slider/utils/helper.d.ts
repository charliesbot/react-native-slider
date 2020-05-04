import { Animated } from "react-native";
import { SliderProps } from "../components/Slider/Slider.type";
declare type SetCurrentValueAnimatedArgs = Pick<SliderProps, "value" | "animationType" | "animationConfig"> & {
    currentValue: Animated.Value;
};
export declare const setValue: (currentValue: Animated.Value, value: number) => void;
export declare const setAnimatedValue: (args: SetCurrentValueAnimatedArgs) => void;
export declare const getValue: (currentValue: Animated.Value) => any;
export {};
