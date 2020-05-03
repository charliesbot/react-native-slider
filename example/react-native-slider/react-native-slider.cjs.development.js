'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var reactNative = require('react-native');
var DebugThumbTouchRect = require('components/DebugThumbTouchRect/DebugThumbTouchRect');

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var TRACK_SIZE = 4;
var THUMB_SIZE = 20;
var defaultStyles = /*#__PURE__*/reactNative.StyleSheet.create({
  container: {
    height: 40,
    justifyContent: "center"
  },
  track: {
    height: TRACK_SIZE,
    borderRadius: TRACK_SIZE / 2
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2
  },
  touchArea: {
    position: "absolute",
    backgroundColor: "transparent",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  debugThumbTouchArea: {
    position: "absolute",
    backgroundColor: "green",
    opacity: 0.5
  }
});

var ThumbImage = function ThumbImage(props) {
  var thumbImage = props.thumbImage;

  if (!thumbImage) {
    return null;
  }

  return React__default.createElement(reactNative.Image, {
    source: thumbImage
  });
};

var Rect = /*#__PURE__*/function () {
  function Rect(_ref) {
    var x = _ref.x,
        y = _ref.y,
        width = _ref.width,
        height = _ref.height;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  var _proto = Rect.prototype;

  _proto.containsPoint = function containsPoint(_ref2) {
    var x = _ref2.x,
        y = _ref2.y;
    return x >= this.x && y >= this.y && x <= this.x + this.width && y <= this.y + this.height;
  };

  return Rect;
}();

var DEFAULT_ANIMATION_CONFIGS = {
  spring: {
    friction: 7,
    tension: 100
  },
  timing: {
    duration: 150,
    easing: /*#__PURE__*/reactNative.Easing.inOut(reactNative.Easing.ease),
    delay: 0
  }
};

var setCurrentValueAnimated = function setCurrentValueAnimated(args) {
  var value = args.value,
      animationType = args.animationType,
      animationConfig = args.animationConfig,
      currentValue = args.currentValue;

  var customAnimationConfig = _extends(_extends(_extends({}, DEFAULT_ANIMATION_CONFIGS[animationType]), animationConfig), {}, {
    toValue: value
  });

  reactNative.Animated[animationType](currentValue, customAnimationConfig).start();
};
var getCurrentValue = function getCurrentValue(currentValue) {
  return currentValue.__getValue();
};

var initialState = {
  width: 0,
  height: 0
};
var sizes = {};

var Slider = function Slider(props) {
  var _panResponder$current;

  var panResponder = React.useRef(null);
  var animationConfig = props.animationConfig,
      animateTransitions = props.animateTransitions,
      _props$animationType = props.animationType,
      animationType = _props$animationType === void 0 ? "timing" : _props$animationType,
      _props$debugTouchArea = props.debugTouchArea,
      debugTouchArea = _props$debugTouchArea === void 0 ? false : _props$debugTouchArea,
      _props$maximumTrackTi = props.maximumTrackTintColor,
      maximumTrackTintColor = _props$maximumTrackTi === void 0 ? "#b3b3b3" : _props$maximumTrackTi,
      _props$maximumValue = props.maximumValue,
      maximumValue = _props$maximumValue === void 0 ? 1 : _props$maximumValue,
      _props$minimumTrackTi = props.minimumTrackTintColor,
      minimumTrackTintColor = _props$minimumTrackTi === void 0 ? "#3f3f3f" : _props$minimumTrackTi,
      _props$minimumValue = props.minimumValue,
      minimumValue = _props$minimumValue === void 0 ? 0 : _props$minimumValue,
      _props$step = props.step,
      step = _props$step === void 0 ? 0 : _props$step,
      styles = props.styles,
      style = props.style,
      thumbImage = props.thumbImage,
      thumbStyle = props.thumbStyle,
      _props$thumbTintColor = props.thumbTintColor,
      thumbTintColor = _props$thumbTintColor === void 0 ? "#343434" : _props$thumbTintColor,
      _props$thumbTouchSize = props.thumbTouchSize,
      thumbTouchSize = _props$thumbTouchSize === void 0 ? {
    width: 40,
    height: 40
  } : _props$thumbTouchSize,
      trackStyle = props.trackStyle,
      _props$value = props.value,
      value = _props$value === void 0 ? 0 : _props$value,
      disabled = props.disabled;
  var previousLeft;

  var _useState = React.useState(initialState),
      containerSize = _useState[0],
      setContainerSize = _useState[1];

  var _useState2 = React.useState(initialState),
      setTrackSize = _useState2[1];

  var _useState3 = React.useState(initialState),
      thumbSize = _useState3[0],
      setThumbSize = _useState3[1];

  var _useState4 = React.useState(false),
      allMeasured = _useState4[0],
      setAllMeasured = _useState4[1];

  var _useState5 = React.useState(new reactNative.Animated.Value(value)),
      currentValue = _useState5[0],
      setCurrentValue = _useState5[1];

  React.useEffect(function () {
    panResponder.current = reactNative.PanResponder.create({
      onStartShouldSetPanResponder: handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: handleMoveShouldSetPanResponder,
      onPanResponderGrant: handlePanResponderGrant,
      onPanResponderMove: handlePanResponderMove,
      onPanResponderRelease: handlePanResponderEnd,
      onPanResponderTerminationRequest: handlePanResponderRequestEnd,
      onPanResponderTerminate: handlePanResponderEnd
    });
  }, []);
  React.useEffect(function () {
    if (animateTransitions) {
      setCurrentValueAnimated({
        value: value,
        currentValue: currentValue,
        animationConfig: animationConfig,
        animationType: animationType
      });
    } else {
      setCurrentValue(new reactNative.Animated.Value(value));
    }
  }, [value]);
  var mainStyles = styles || defaultStyles;
  var thumbLeft = currentValue.interpolate({
    inputRange: [minimumValue, maximumValue],
    outputRange: reactNative.I18nManager.isRTL ? [0, -(containerSize.width - thumbSize.width)] : [0, containerSize.width - thumbSize.width]
  });

  var getValue = function getValue(gestureState) {
    var thumbLeft = previousLeft + gestureState.dx;
    var nonRtlRatio = thumbLeft / length;
    var ratio = reactNative.I18nManager.isRTL ? 1 - nonRtlRatio : nonRtlRatio;

    if (step) {
      return Math.max(minimumValue, Math.min(maximumValue, minimumValue + Math.round(ratio * (maximumValue - minimumValue) / step) * step));
    }

    return Math.max(minimumValue, Math.min(maximumValue, ratio * (maximumValue - minimumValue) + minimumValue));
  };

  var handlePanResponderMove = function handlePanResponderMove(_, gestureState) {
    if (disabled) {
      return;
    }

    setCurrentValue(new reactNative.Animated.Value(getValue(gestureState)));
    fireChangeEvent("onValueChange");
  };

  var handlePanResponderRequestEnd = function handlePanResponderRequestEnd() {
    // Should we allow another component to take over this pan?
    return false;
  };

  var handlePanResponderEnd = function handlePanResponderEnd(_, gestureState) {
    if (disabled) {
      return;
    }

    setCurrentValue(new reactNative.Animated.Value(getValue(gestureState)));
    fireChangeEvent("onSlidingComplete");
  };

  var handleMeasure = function handleMeasure(name, x) {
    var _x$nativeEvent$layout = x.nativeEvent.layout,
        width = _x$nativeEvent$layout.width,
        height = _x$nativeEvent$layout.height;
    var size = {
      width: width,
      height: height
    };
    var currentSize = sizes[name];

    if (currentSize && width === currentSize.width && height === currentSize.height) {
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

  var onLayoutChange = function onLayoutChange(eventName) {
    return function (event) {
      return handleMeasure(eventName, event);
    };
  };

  var measureContainer = onLayoutChange("containerSize");
  var measureTrack = onLayoutChange("trackSize");
  var measureThumb = onLayoutChange("thumbSize");
  var minimumTrackWidth = currentValue.interpolate({
    inputRange: [minimumValue, maximumValue],
    outputRange: [0, containerSize.width - thumbSize.width]
  });

  var fireChangeEvent = function fireChangeEvent(event) {
    var _props$event;

    (_props$event = props[event]) === null || _props$event === void 0 ? void 0 : _props$event.call(props, getCurrentValue(currentValue));
  };

  var handlePanResponderGrant = function handlePanResponderGrant() {
    previousLeft = getThumbLeft(getCurrentValue(currentValue));
    fireChangeEvent("onSlidingStart");
  };

  var getTouchOverflowSize = function getTouchOverflowSize() {
    var size = {};

    if (allMeasured) {
      size.width = Math.max(0, thumbTouchSize.width - thumbSize.width);
      size.height = Math.max(0, thumbTouchSize.height - containerSize.height);
    }

    return size;
  };

  var getTouchOverflowStyle = function getTouchOverflowStyle() {
    var _getTouchOverflowSize = getTouchOverflowSize(),
        width = _getTouchOverflowSize.width,
        height = _getTouchOverflowSize.height;

    var touchOverflowStyle = {};

    if (width !== undefined && height !== undefined) {
      var verticalMargin = -height / 2;
      touchOverflowStyle.marginTop = verticalMargin;
      touchOverflowStyle.marginBottom = verticalMargin;
      var horizontalMargin = -width / 2;
      touchOverflowStyle.marginLeft = horizontalMargin;
      touchOverflowStyle.marginRight = horizontalMargin;
    }

    if (debugTouchArea) {
      touchOverflowStyle.backgroundColor = "orange";
      touchOverflowStyle.opacity = 0.5;
    }

    return touchOverflowStyle;
  };

  var getRatio = function getRatio(value) {
    return (value - minimumValue) / (maximumValue - minimumValue);
  };

  var getThumbLeft = function getThumbLeft(value) {
    var nonRtlRatio = getRatio(value);
    var ratio = reactNative.I18nManager.isRTL ? 1 - nonRtlRatio : nonRtlRatio;
    return ratio * (containerSize.width - thumbSize.width);
  };

  var handleStartShouldSetPanResponder = function handleStartShouldSetPanResponder(e) {
    var _thumbTouchRect$conta;

    // Should we become active when the user presses down on the thumb?
    var nativeEvent = e.nativeEvent;
    var thumbTouchRect = getThumbTouchRect();
    return (_thumbTouchRect$conta = thumbTouchRect === null || thumbTouchRect === void 0 ? void 0 : thumbTouchRect.containsPoint({
      x: nativeEvent.locationX,
      y: nativeEvent.locationY
    })) !== null && _thumbTouchRect$conta !== void 0 ? _thumbTouchRect$conta : false;
  };

  var handleMoveShouldSetPanResponder = function handleMoveShouldSetPanResponder() {
    // Should we become active when the user moves a touch over the thumb?
    return false;
  };

  var getThumbTouchRect = function getThumbTouchRect() {
    var touchOverflowSize = getTouchOverflowSize();

    if (!touchOverflowSize.width || !touchOverflowSize.height) {
      return;
    }

    return new Rect({
      x: touchOverflowSize.width / 2 + getThumbLeft(getCurrentValue(currentValue)) + (thumbSize.width - thumbTouchSize.width) / 2,
      y: touchOverflowSize.height / 2 + (containerSize.height - thumbTouchSize.height) / 2,
      width: thumbTouchSize.width,
      height: thumbTouchSize.height
    });
  };

  var valueVisibleStyle = {};

  if (!allMeasured) {
    valueVisibleStyle.opacity = 0;
  }

  var minimumTrackStyle = _extends({
    position: "absolute",
    width: reactNative.Animated.add(minimumTrackWidth, thumbSize.width / 2),
    backgroundColor: minimumTrackTintColor
  }, valueVisibleStyle);

  var touchOverflowStyle = getTouchOverflowStyle();
  return React__default.createElement(reactNative.View, Object.assign({}, props, {
    style: [mainStyles.container, style],
    onLayout: measureContainer
  }), React__default.createElement(reactNative.View, {
    style: [{
      backgroundColor: maximumTrackTintColor
    }, mainStyles.track, trackStyle],
    renderToHardwareTextureAndroid: true,
    onLayout: measureTrack
  }), React__default.createElement(reactNative.Animated.View, {
    renderToHardwareTextureAndroid: true,
    style: [mainStyles.track, trackStyle, minimumTrackStyle]
  }), React__default.createElement(reactNative.Animated.View, {
    onLayout: measureThumb,
    renderToHardwareTextureAndroid: true,
    style: [{
      backgroundColor: thumbTintColor
    }, mainStyles.thumb, thumbStyle, _extends({
      transform: [{
        translateX: thumbLeft
      }, {
        translateY: 0
      }]
    }, valueVisibleStyle)]
  }, React__default.createElement(ThumbImage, {
    thumbImage: thumbImage
  })), React__default.createElement(reactNative.View, Object.assign({
    renderToHardwareTextureAndroid: true,
    style: [defaultStyles.touchArea, touchOverflowStyle]
  }, (_panResponder$current = panResponder.current) === null || _panResponder$current === void 0 ? void 0 : _panResponder$current.panHandlers), React__default.createElement(DebugThumbTouchRect.DebugThumbTouchRect, {
    debugTouchArea: debugTouchArea,
    thumbLeft: minimumTrackWidth,
    thumbTouchRect: getThumbTouchRect()
  })));
};

var Slider$1 = /*#__PURE__*/React__default.memo(Slider);

exports.default = Slider$1;
//# sourceMappingURL=react-native-slider.cjs.development.js.map
