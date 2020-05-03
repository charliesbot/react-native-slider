import React, { useState, useEffect } from "react";

import {
  Animated,
  Image,
  StyleSheet,
  PanResponder,
  View,
  I18nManager,
} from "react-native";
import { SliderProps } from "./Slider.type";
import { defaultStyles } from "./Slider.style";

const ThumbImage: React.FC<Pick<SliderProps, "thumbImage">> = props => {
  const { thumbImage } = props;

  if (!thumbImage) {
    return null;
  }

  return <Image source={thumbImage} />;
};

export const Slider: React.FC<SliderProps> = props => {
  let panResponder;

  const {
    animateTransitions,
    animationType = "timing",
    debugTouchArea = false,
    maximumTrackTintColor = "#b3b3b3",
    maximumValue = 1,
    minimumTrackTintColor = "#3f3f3f",
    minimumValue = 0,
    step = 0,
    style,
    styles,
    thumbImage,
    thumbStyle,
    thumbTintColor = "#343434",
    thumbTouchSize = { width: 40, height: 40 },
    trackStyle,
    value = 0,
  } = props;

  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [trackSize, setTrackSize] = useState({ width: 0, height: 0 });
  const [thumbSize, setThumbSize] = useState({ width: 0, height: 0 });
  const [allMeasured, setAllMeasured] = useState(false);
  const [currentValue, setCurrentValue] = useState(new Animated.Value(value));

  useEffect(() => {
    panResponder = PanResponder.create({
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
      setCurrentValueAnimated(value);
    } else {
      setCurrentValue(value);
    }
  }, [value]);

  const mainStyles = styles || defaultStyles;
  const thumbLeft = currentValue.interpolate({
    inputRange: [minimumValue, maximumValue],
    outputRange: I18nManager.isRTL
      ? [0, -(containerSize.width - thumbSize.width)]
      : [0, containerSize.width - thumbSize.width],
  });
  const minimumTrackWidth = currentValue.interpolate({
    inputRange: [minimumValue, maximumValue],
    outputRange: [0, containerSize.width - thumbSize.width],
  });

  const valueVisibleStyle = {};

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
  const getPropsForComponentUpdate = props => {
    const {
      value,
      onValueChange,
      onSlidingStart,
      onSlidingComplete,
      style,
      trackStyle,
      thumbStyle,
      ...otherProps
    } = props;

    return otherProps;
  };

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
        {...panResponder.panHandlers}
      >
        {debugTouchArea && renderDebugThumbTouchRect(minimumTrackWidth)}
      </View>
    </View>
  );
};

export default class Slider extends PureComponent {
  _handleStartShouldSetPanResponder = (
    e: Object /* gestureState: Object */
  ): boolean =>
    // Should we become active when the user presses down on the thumb?
    this._thumbHitTest(e);

  _handleMoveShouldSetPanResponder(/* e: Object, gestureState: Object */): boolean {
    // Should we become active when the user moves a touch over the thumb?
    return false;
  }

  _handlePanResponderGrant = (/* e: Object, gestureState: Object */) => {
    this._previousLeft = this._getThumbLeft(this._getCurrentValue());
    this._fireChangeEvent("onSlidingStart");
  };

  _handlePanResponderMove = (e: Object, gestureState: Object) => {
    if (this.props.disabled) {
      return;
    }

    this._setCurrentValue(this._getValue(gestureState));
    this._fireChangeEvent("onValueChange");
  };

  _handlePanResponderRequestEnd(e: Object, gestureState: Object) {
    // Should we allow another component to take over this pan?
    return false;
  }

  _handlePanResponderEnd = (e: Object, gestureState: Object) => {
    if (this.props.disabled) {
      return;
    }

    this._setCurrentValue(this._getValue(gestureState));
    this._fireChangeEvent("onSlidingComplete");
  };

  _measureContainer = (x: Object) => {
    this._handleMeasure("containerSize", x);
  };

  _measureTrack = (x: Object) => {
    this._handleMeasure("trackSize", x);
  };

  _measureThumb = (x: Object) => {
    this._handleMeasure("thumbSize", x);
  };

  _handleMeasure = (name: string, x: Object) => {
    const { width, height } = x.nativeEvent.layout;
    const size = { width, height };

    const storeName = `_${name}`;
    const currentSize = this[storeName];
    if (
      currentSize &&
      width === currentSize.width &&
      height === currentSize.height
    ) {
      return;
    }
    this[storeName] = size;

    if (this._containerSize && this._trackSize && this._thumbSize) {
      this.setState({
        containerSize: this._containerSize,
        trackSize: this._trackSize,
        thumbSize: this._thumbSize,
        allMeasured: true,
      });
    }
  };

  _getRatio = (value: number) =>
    (value - this.props.minimumValue) /
    (this.props.maximumValue - this.props.minimumValue);

  _getThumbLeft = (value: number) => {
    const nonRtlRatio = this._getRatio(value);
    const ratio = I18nManager.isRTL ? 1 - nonRtlRatio : nonRtlRatio;
    return (
      ratio * (this.state.containerSize.width - this.state.thumbSize.width)
    );
  };

  _getValue = (gestureState: Object) => {
    const length = this.state.containerSize.width - this.state.thumbSize.width;
    const thumbLeft = this._previousLeft + gestureState.dx;

    const nonRtlRatio = thumbLeft / length;
    const ratio = I18nManager.isRTL ? 1 - nonRtlRatio : nonRtlRatio;

    if (this.props.step) {
      return Math.max(
        this.props.minimumValue,
        Math.min(
          this.props.maximumValue,
          this.props.minimumValue +
            Math.round(
              (ratio * (this.props.maximumValue - this.props.minimumValue)) /
                this.props.step
            ) *
              this.props.step
        )
      );
    }
    return Math.max(
      this.props.minimumValue,
      Math.min(
        this.props.maximumValue,
        ratio * (this.props.maximumValue - this.props.minimumValue) +
          this.props.minimumValue
      )
    );
  };

  _getCurrentValue = () => this.state.value.__getValue();

  _setCurrentValue = (value: number) => {
    this.state.value.setValue(value);
  };

  _setCurrentValueAnimated = (value: number) => {
    const animationType = this.props.animationType;
    const animationConfig = Object.assign(
      {},
      DEFAULT_ANIMATION_CONFIGS[animationType],
      this.props.animationConfig,
      {
        toValue: value,
      }
    );

    Animated[animationType](this.state.value, animationConfig).start();
  };

  _fireChangeEvent = event => {
    if (this.props[event]) {
      this.props[event](this._getCurrentValue());
    }
  };

  _getTouchOverflowSize = () => {
    const state = this.state;
    const props = this.props;

    const size = {};
    if (state.allMeasured === true) {
      size.width = Math.max(
        0,
        props.thumbTouchSize.width - state.thumbSize.width
      );
      size.height = Math.max(
        0,
        props.thumbTouchSize.height - state.containerSize.height
      );
    }

    return size;
  };

  _getTouchOverflowStyle = () => {
    const { width, height } = this._getTouchOverflowSize();

    const touchOverflowStyle = {};
    if (width !== undefined && height !== undefined) {
      const verticalMargin = -height / 2;
      touchOverflowStyle.marginTop = verticalMargin;
      touchOverflowStyle.marginBottom = verticalMargin;

      const horizontalMargin = -width / 2;
      touchOverflowStyle.marginLeft = horizontalMargin;
      touchOverflowStyle.marginRight = horizontalMargin;
    }

    if (this.props.debugTouchArea === true) {
      touchOverflowStyle.backgroundColor = "orange";
      touchOverflowStyle.opacity = 0.5;
    }

    return touchOverflowStyle;
  };

  _thumbHitTest = (e: Object) => {
    const nativeEvent = e.nativeEvent;
    const thumbTouchRect = this._getThumbTouchRect();
    return thumbTouchRect.containsPoint(
      nativeEvent.locationX,
      nativeEvent.locationY
    );
  };

  _getThumbTouchRect = () => {
    const state = this.state;
    const props = this.props;
    const touchOverflowSize = this._getTouchOverflowSize();

    return new Rect(
      touchOverflowSize.width / 2 +
        this._getThumbLeft(this._getCurrentValue()) +
        (state.thumbSize.width - props.thumbTouchSize.width) / 2,
      touchOverflowSize.height / 2 +
        (state.containerSize.height - props.thumbTouchSize.height) / 2,
      props.thumbTouchSize.width,
      props.thumbTouchSize.height
    );
  };
}
