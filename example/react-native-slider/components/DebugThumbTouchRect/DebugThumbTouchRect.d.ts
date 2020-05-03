import React from "react";
import { Animated } from "react-native";
import { SliderProps } from "components/Slider/Slider.type";
import { Rect } from "utils/Rect";
declare type DebugThumbTouchRectProps = Pick<SliderProps, "debugTouchArea"> & {
    thumbLeft: Animated.AnimatedInterpolation;
    thumbTouchRect: Rect | undefined;
};
declare const DebugThumbTouchRect: React.FC<DebugThumbTouchRectProps>;
export { DebugThumbTouchRect };
