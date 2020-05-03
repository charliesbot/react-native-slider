import React from "react";
import { Animated } from "react-native";
import { SliderProps } from "../Slider/Slider.type";
import { Rect } from "../../utils/Rect";
import { defaultStyles } from "../Slider/Slider.style";

type DebugThumbTouchRectProps = Pick<SliderProps, "debugTouchArea"> & {
  thumbLeft: Animated.AnimatedInterpolation;
  thumbTouchRect: Rect | undefined;
};

const DebugThumbTouchRect: React.FC<DebugThumbTouchRectProps> = props => {
  const { debugTouchArea, thumbLeft, thumbTouchRect } = props;
  if (!debugTouchArea || !thumbTouchRect) {
    return null;
  }

  const positionStyle = {
    left: thumbLeft,
    top: thumbTouchRect.y,
    width: thumbTouchRect.width,
    height: thumbTouchRect.height,
  };

  return (
    <Animated.View
      style={[defaultStyles.debugThumbTouchArea, positionStyle]}
      pointerEvents="none"
    />
  );
};

export { DebugThumbTouchRect };
