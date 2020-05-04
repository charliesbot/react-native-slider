import React, { useState, useEffect, useRef } from "react";

import {
  Animated,
  PanResponder,
  View,
  I18nManager,
  GestureResponderEvent,
  PanResponderGestureState,
  PanResponderCallbacks,
  LayoutChangeEvent,
  PanResponderInstance,
} from "react-native";
import { SliderProps, SliderPropsEvents, LayoutEvent } from "./Slider.type";
import { defaultStyles } from "./Slider.style";
import { ThumbImage } from "../ThumbImage/ThumbImage";
import { Rect } from "../../utils/Rect";
import { getValue, setValue, setAnimatedValue } from "../../utils/helper";
import { DebugThumbTouchRect } from "../DebugThumbTouchRect/DebugThumbTouchRect";

const initialState = {
  width: 0,
  height: 0,
};

const sizes: {
  [key: string]: {
    width: number;
    height: number;
  };
} = {};

const Slider: React.FC<SliderProps> = props => {
  let panResponder = useRef<PanResponderInstance | null>(null);

  const {
    animationConfig,
    animateTransitions,
    animationType = "timing",
    debugTouchArea = false,
    maximumTrackTintColor = "#b3b3b3",
    maximumValue = 1,
    minimumTrackTintColor = "#3f3f3f",
    minimumValue = 0,
    step = 0,
    styles,
    style,
    thumbImage,
    thumbStyle,
    thumbTintColor = "#343434",
    thumbTouchSize = { width: 40, height: 40 },
    trackStyle,
    value = 0,
    disabled,
  } = props;

  let previousLeft: any;
  const [containerSize, setContainerSize] = useState(initialState);
  const [, setTrackSize] = useState(initialState);
  const [thumbSize, setThumbSize] = useState(initialState);
  const [allMeasured, setAllMeasured] = useState(false);
  const [currentValue, setCurrentValue] = useState(new Animated.Value(value));

  useEffect(() => {
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: handleMoveShouldSetPanResponder,
      onPanResponderGrant: handlePanResponderGrant,
      onPanResponderMove: handlePanResponderMove,
      onPanResponderRelease: handlePanResponderEnd,
      onPanResponderTerminationRequest: handlePanResponderRequestEnd,
      onPanResponderTerminate: handlePanResponderEnd,
    });
  }, []);

  useEffect(() => {
    if (animateTransitions) {
      setCurrentValueAnimated({
        value,
        currentValue,
        animationConfig,
        animationType,
      });
    } else {
      setCurrentValue(new Animated.Value(value));
    }
  }, [value]);

  const mainStyles = styles || defaultStyles;
  const thumbLeft = currentValue.interpolate({
    inputRange: [minimumValue, maximumValue],
    outputRange: I18nManager.isRTL
      ? [0, -(containerSize.width - thumbSize.width)]
      : [0, containerSize.width - thumbSize.width],
  });

  const getValue = (gestureState: PanResponderGestureState) => {
    const length = containerSize.width - thumbSize.width;
    const thumbLeft = previousLeft + gestureState.dx;

    const nonRtlRatio = thumbLeft / length;
    const ratio = I18nManager.isRTL ? 1 - nonRtlRatio : nonRtlRatio;

    if (step) {
      return Math.max(
        minimumValue,
        Math.min(
          maximumValue,
          minimumValue +
            Math.round((ratio * (maximumValue - minimumValue)) / step) * step
        )
      );
    }
    return Math.max(
      minimumValue,
      Math.min(
        maximumValue,
        ratio * (maximumValue - minimumValue) + minimumValue
      )
    );
  };

  const handlePanResponderMove: PanResponderCallbacks["onPanResponderMove"] = (
    _,
    gestureState
  ) => {
    if (disabled) {
      return;
    }

    setCurrentValue(new Animated.Value(getValue(gestureState)));
    fireChangeEvent("onValueChange");
  };

  const handlePanResponderRequestEnd: PanResponderCallbacks["onPanResponderTerminationRequest"] = () => {
    // Should we allow another component to take over this pan?
    return false;
  };

  const handlePanResponderEnd: PanResponderCallbacks["onPanResponderEnd"] = (
    _,
    gestureState
  ) => {
    if (disabled) {
      return;
    }

    setCurrentValue(new Animated.Value(getValue(gestureState)));
    fireChangeEvent("onSlidingComplete");
  };

  const handleMeasure = (name: LayoutEvent, x: LayoutChangeEvent) => {
    const { width, height } = x.nativeEvent.layout;
    const size = { width, height };

    const currentSize = sizes[name];
    if (
      currentSize &&
      width === currentSize.width &&
      height === currentSize.height
    ) {
      return;
    }

    sizes[name] = size;

    if (sizes.containerSize && sizes.trackSize && sizes.thumbSize) {
      setContainerSize(sizes.containerSize);
      setTrackSize(sizes.trackSize);
      setThumbSize(sizes.thumbSize);
      setAllMeasured(true);
    }
  };

  const onLayoutChange = (eventName: LayoutEvent) => (
    event: LayoutChangeEvent
  ) => handleMeasure(eventName, event);

  const measureContainer = onLayoutChange("containerSize");

  const measureTrack = onLayoutChange("trackSize");

  const measureThumb = onLayoutChange("thumbSize");

  const minimumTrackWidth = currentValue.interpolate({
    inputRange: [minimumValue, maximumValue],
    outputRange: [0, containerSize.width - thumbSize.width],
  });

  const fireChangeEvent = (event: SliderPropsEvents) => {
    props[event]?.(getCurrentValue(currentValue));
  };

  const handlePanResponderGrant = () => {
    previousLeft = getThumbLeft(getCurrentValue(currentValue));
    fireChangeEvent("onSlidingStart");
  };

  const getTouchOverflowSize = () => {
    const size: { width?: number; height?: number } = {};
    if (allMeasured) {
      size.width = Math.max(0, thumbTouchSize.width - thumbSize.width);
      size.height = Math.max(0, thumbTouchSize.height - containerSize.height);
    }

    return size;
  };

  const getTouchOverflowStyle = () => {
    const { width, height } = getTouchOverflowSize();

    const touchOverflowStyle: {
      backgroundColor?: string;
      marginBottom?: number;
      marginLeft?: number;
      marginRight?: number;
      marginTop?: number;
      opacity?: number;
    } = {};

    if (width !== undefined && height !== undefined) {
      const verticalMargin = -height / 2;
      touchOverflowStyle.marginTop = verticalMargin;
      touchOverflowStyle.marginBottom = verticalMargin;

      const horizontalMargin = -width / 2;
      touchOverflowStyle.marginLeft = horizontalMargin;
      touchOverflowStyle.marginRight = horizontalMargin;
    }

    if (debugTouchArea) {
      touchOverflowStyle.backgroundColor = "orange";
      touchOverflowStyle.opacity = 0.5;
    }

    return touchOverflowStyle;
  };

  const getRatio = (value: number) =>
    (value - minimumValue) / (maximumValue - minimumValue);

  const getThumbLeft = (value: number) => {
    const nonRtlRatio = getRatio(value);
    const ratio = I18nManager.isRTL ? 1 - nonRtlRatio : nonRtlRatio;
    return ratio * (containerSize.width - thumbSize.width);
  };

  const handleStartShouldSetPanResponder = (
    e: GestureResponderEvent
  ): boolean => {
    // Should we become active when the user presses down on the thumb?
    const nativeEvent = e.nativeEvent;
    const thumbTouchRect = getThumbTouchRect();
    return thumbTouchRect.containsPoint({
      x: nativeEvent.locationX,
      y: nativeEvent.locationY,
    });
  };

  const handleMoveShouldSetPanResponder = () => {
    // Should we become active when the user moves a touch over the thumb?
    return false;
  };

  const getThumbTouchRect = () => {
    const touchOverflowSize = getTouchOverflowSize();

    return new Rect({
      x:
        touchOverflowSize.width! / 2 +
        getThumbLeft(getCurrentValue(currentValue)) +
        (thumbSize.width - thumbTouchSize.width) / 2,
      y:
        touchOverflowSize.height! / 2 +
        (containerSize.height - thumbTouchSize.height) / 2,
      width: thumbTouchSize.width,
      height: thumbTouchSize.height,
    });
  };

  const valueVisibleStyle: { opacity?: number } = {};

  if (!allMeasured) {
    valueVisibleStyle.opacity = 0;
  }

  const minimumTrackStyle = {
    position: "absolute",
    width: Animated.add(minimumTrackWidth, thumbSize.width / 2),
    backgroundColor: minimumTrackTintColor,
    ...valueVisibleStyle,
  };

  const touchOverflowStyle = getTouchOverflowStyle();

  console.log("teeest ", panResponder.current);

  if (!panResponder.current) {
    return null;
  }

  return (
    <View
      {...props}
      style={[mainStyles.container, style]}
      onLayout={measureContainer}
    >
      <View
        style={[
          { backgroundColor: maximumTrackTintColor },
          mainStyles.track,
          trackStyle,
        ]}
        renderToHardwareTextureAndroid
        onLayout={measureTrack}
      />
      <Animated.View
        renderToHardwareTextureAndroid
        style={[mainStyles.track, trackStyle, minimumTrackStyle]}
      />
      <Animated.View
        onLayout={measureThumb}
        renderToHardwareTextureAndroid
        style={[
          { backgroundColor: thumbTintColor },
          mainStyles.thumb,
          thumbStyle,
          {
            transform: [{ translateX: thumbLeft }, { translateY: 0 }],
            ...valueVisibleStyle,
          },
        ]}
      >
        <ThumbImage thumbImage={thumbImage} />
      </Animated.View>
      <View
        renderToHardwareTextureAndroid
        style={[defaultStyles.touchArea, touchOverflowStyle]}
        {...panResponder.current.panHandlers}
      >
        <DebugThumbTouchRect
          debugTouchArea={debugTouchArea}
          thumbLeft={minimumTrackWidth}
          thumbTouchRect={getThumbTouchRect()}
        />
      </View>
    </View>
  );
};

export default Slider;
