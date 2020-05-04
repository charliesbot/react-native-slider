import React, { PureComponent } from 'react';
import { StyleSheet, Easing, PanResponder, I18nManager, Animated, View, Image } from 'react-native';

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

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var TRACK_SIZE = 4;
var THUMB_SIZE = 20;
var defaultStyles = /*#__PURE__*/StyleSheet.create({
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

var DEFAULT_ANIMATION_CONFIGS = {
  spring: {
    friction: 7,
    tension: 100
  },
  timing: {
    duration: 150,
    easing: /*#__PURE__*/Easing.inOut(Easing.ease),
    delay: 0
  }
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

var Slider = /*#__PURE__*/function (_PureComponent) {
  _inheritsLoose(Slider, _PureComponent);

  function Slider() {
    var _this;

    _this = _PureComponent.apply(this, arguments) || this;
    _this.state = {
      containerSize: {
        width: 0,
        height: 0
      },
      trackSize: {
        width: 0,
        height: 0
      },
      thumbSize: {
        width: 0,
        height: 0
      },
      allMeasured: false,
      value: new Animated.Value(_this.props.value)
    };

    _this._handleStartShouldSetPanResponder = function (e
    /* gestureState: Object */
    ) {
      return (// Should we become active when the user presses down on the thumb?
        _this._thumbHitTest(e)
      );
    };

    _this._handlePanResponderGrant = function ()
    /* e: Object, gestureState: Object */
    {
      _this._previousLeft = _this._getThumbLeft(_this._getCurrentValue());

      _this._fireChangeEvent("onSlidingStart");
    };

    _this._handlePanResponderMove = function (e, gestureState) {
      if (_this.props.disabled) {
        return;
      }

      _this._setCurrentValue(_this._getValue(gestureState));

      _this._fireChangeEvent("onValueChange");
    };

    _this._handlePanResponderEnd = function (e, gestureState) {
      if (_this.props.disabled) {
        return;
      }

      _this._setCurrentValue(_this._getValue(gestureState));

      _this._fireChangeEvent("onSlidingComplete");
    };

    _this._measureContainer = function (x) {
      _this._handleMeasure("containerSize", x);
    };

    _this._measureTrack = function (x) {
      _this._handleMeasure("trackSize", x);
    };

    _this._measureThumb = function (x) {
      _this._handleMeasure("thumbSize", x);
    };

    _this._handleMeasure = function (name, x) {
      var _x$nativeEvent$layout = x.nativeEvent.layout,
          width = _x$nativeEvent$layout.width,
          height = _x$nativeEvent$layout.height;
      var size = {
        width: width,
        height: height
      };
      var storeName = "_" + name;
      var currentSize = _this[storeName];

      if (currentSize && width === currentSize.width && height === currentSize.height) {
        return;
      }

      _this[storeName] = size;

      if (_this._containerSize && _this._trackSize && _this._thumbSize) {
        _this.setState({
          containerSize: _this._containerSize,
          trackSize: _this._trackSize,
          thumbSize: _this._thumbSize,
          allMeasured: true
        });
      }
    };

    _this._getRatio = function (value) {
      return (value - _this.props.minimumValue) / (_this.props.maximumValue - _this.props.minimumValue);
    };

    _this._getThumbLeft = function (value) {
      var nonRtlRatio = _this._getRatio(value);

      var ratio = I18nManager.isRTL ? 1 - nonRtlRatio : nonRtlRatio;
      return ratio * (_this.state.containerSize.width - _this.state.thumbSize.width);
    };

    _this._getValue = function (gestureState) {
      var length = _this.state.containerSize.width - _this.state.thumbSize.width;
      var thumbLeft = _this._previousLeft + gestureState.dx;
      var nonRtlRatio = thumbLeft / length;
      var ratio = I18nManager.isRTL ? 1 - nonRtlRatio : nonRtlRatio;

      if (_this.props.step) {
        return Math.max(_this.props.minimumValue, Math.min(_this.props.maximumValue, _this.props.minimumValue + Math.round(ratio * (_this.props.maximumValue - _this.props.minimumValue) / _this.props.step) * _this.props.step));
      }

      return Math.max(_this.props.minimumValue, Math.min(_this.props.maximumValue, ratio * (_this.props.maximumValue - _this.props.minimumValue) + _this.props.minimumValue));
    };

    _this._getCurrentValue = function () {
      return _this.state.value.__getValue();
    };

    _this._setCurrentValue = function (value) {
      _this.state.value.setValue(value);
    };

    _this._setCurrentValueAnimated = function (value) {
      var animationType = _this.props.animationType;
      var animationConfig = Object.assign({}, DEFAULT_ANIMATION_CONFIGS[animationType], _this.props.animationConfig, {
        toValue: value
      });
      Animated[animationType](_this.state.value, animationConfig).start();
    };

    _this._fireChangeEvent = function (event) {
      if (_this.props[event]) {
        _this.props[event](_this._getCurrentValue());
      }
    };

    _this._getTouchOverflowSize = function () {
      var state = _this.state;
      var props = _this.props;
      var size = {};

      if (state.allMeasured === true) {
        size.width = Math.max(0, props.thumbTouchSize.width - state.thumbSize.width);
        size.height = Math.max(0, props.thumbTouchSize.height - state.containerSize.height);
      }

      return size;
    };

    _this._getTouchOverflowStyle = function () {
      var _this$_getTouchOverfl = _this._getTouchOverflowSize(),
          width = _this$_getTouchOverfl.width,
          height = _this$_getTouchOverfl.height;

      var touchOverflowStyle = {};

      if (width !== undefined && height !== undefined) {
        var verticalMargin = -height / 2;
        touchOverflowStyle.marginTop = verticalMargin;
        touchOverflowStyle.marginBottom = verticalMargin;
        var horizontalMargin = -width / 2;
        touchOverflowStyle.marginLeft = horizontalMargin;
        touchOverflowStyle.marginRight = horizontalMargin;
      }

      if (_this.props.debugTouchArea === true) {
        touchOverflowStyle.backgroundColor = "orange";
        touchOverflowStyle.opacity = 0.5;
      }

      return touchOverflowStyle;
    };

    _this._thumbHitTest = function (e) {
      var nativeEvent = e.nativeEvent;

      var thumbTouchRect = _this._getThumbTouchRect();

      return thumbTouchRect.containsPoint({
        x: nativeEvent.locationX,
        y: nativeEvent.locationY
      });
    };

    _this._getThumbTouchRect = function () {
      var state = _this.state;
      var props = _this.props;

      var touchOverflowSize = _this._getTouchOverflowSize();

      return new Rect({
        x: touchOverflowSize.width / 2 + _this._getThumbLeft(_this._getCurrentValue()) + (state.thumbSize.width - props.thumbTouchSize.width) / 2,
        y: touchOverflowSize.height / 2 + (state.containerSize.height - props.thumbTouchSize.height) / 2,
        width: props.thumbTouchSize.width,
        height: props.thumbTouchSize.height
      });
    };

    _this._renderDebugThumbTouchRect = function (thumbLeft) {
      var thumbTouchRect = _this._getThumbTouchRect();

      var positionStyle = {
        left: thumbLeft,
        top: thumbTouchRect.y,
        width: thumbTouchRect.width,
        height: thumbTouchRect.height
      };
      return React.createElement(Animated.View, {
        style: [defaultStyles.debugThumbTouchArea, positionStyle],
        pointerEvents: "none"
      });
    };

    _this._renderThumbImage = function () {
      var thumbImage = _this.props.thumbImage;
      if (!thumbImage) return;
      return React.createElement(Image, {
        source: thumbImage
      });
    };

    return _this;
  }

  var _proto = Slider.prototype;

  _proto.componentWillMount = function componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminationRequest: this._handlePanResponderRequestEnd,
      onPanResponderTerminate: this._handlePanResponderEnd
    });
  };

  _proto.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var newValue = nextProps.value;

    if (this.props.value !== newValue) {
      if (this.props.animateTransitions) {
        this._setCurrentValueAnimated(newValue);
      } else {
        this._setCurrentValue(newValue);
      }
    }
  };

  _proto.render = function render() {
    var _this$props = this.props,
        minimumValue = _this$props.minimumValue,
        maximumValue = _this$props.maximumValue,
        minimumTrackTintColor = _this$props.minimumTrackTintColor,
        maximumTrackTintColor = _this$props.maximumTrackTintColor,
        thumbTintColor = _this$props.thumbTintColor,
        styles = _this$props.styles,
        style = _this$props.style,
        trackStyle = _this$props.trackStyle,
        thumbStyle = _this$props.thumbStyle,
        debugTouchArea = _this$props.debugTouchArea,
        other = _objectWithoutPropertiesLoose(_this$props, ["minimumValue", "maximumValue", "minimumTrackTintColor", "maximumTrackTintColor", "thumbTintColor", "thumbImage", "styles", "style", "trackStyle", "thumbStyle", "debugTouchArea", "onValueChange", "thumbTouchSize", "animationType", "animateTransitions"]);

    var _this$state = this.state,
        value = _this$state.value,
        containerSize = _this$state.containerSize,
        thumbSize = _this$state.thumbSize,
        allMeasured = _this$state.allMeasured;
    var mainStyles = styles || defaultStyles;
    var thumbLeft = value.interpolate({
      inputRange: [minimumValue, maximumValue],
      outputRange: I18nManager.isRTL ? [0, -(containerSize.width - thumbSize.width)] : [0, containerSize.width - thumbSize.width]
    });
    var minimumTrackWidth = value.interpolate({
      inputRange: [minimumValue, maximumValue],
      outputRange: [0, containerSize.width - thumbSize.width]
    });
    var valueVisibleStyle = {};

    if (!allMeasured) {
      valueVisibleStyle.opacity = 0;
    }

    var minimumTrackStyle = _extends({
      position: "absolute",
      width: Animated.add(minimumTrackWidth, thumbSize.width / 2),
      backgroundColor: minimumTrackTintColor
    }, valueVisibleStyle);

    var touchOverflowStyle = this._getTouchOverflowStyle();

    return React.createElement(View, Object.assign({}, other, {
      style: [mainStyles.container, style],
      onLayout: this._measureContainer
    }), React.createElement(View, {
      style: [{
        backgroundColor: maximumTrackTintColor
      }, mainStyles.track, trackStyle],
      renderToHardwareTextureAndroid: true,
      onLayout: this._measureTrack
    }), React.createElement(Animated.View, {
      renderToHardwareTextureAndroid: true,
      style: [mainStyles.track, trackStyle, minimumTrackStyle]
    }), React.createElement(Animated.View, {
      onLayout: this._measureThumb,
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
    }, this._renderThumbImage()), React.createElement(View, Object.assign({
      renderToHardwareTextureAndroid: true,
      style: [defaultStyles.touchArea, touchOverflowStyle]
    }, this._panResponder.panHandlers), debugTouchArea === true && this._renderDebugThumbTouchRect(minimumTrackWidth)));
  };

  _proto._getPropsForComponentUpdate = function _getPropsForComponentUpdate(props) {
    var otherProps = _objectWithoutPropertiesLoose(props, ["value", "onValueChange", "onSlidingStart", "onSlidingComplete", "style", "trackStyle", "thumbStyle"]);

    return otherProps;
  };

  _proto._handleMoveShouldSetPanResponder = function _handleMoveShouldSetPanResponder()
  /* e: Object, gestureState: Object */
  {
    // Should we become active when the user moves a touch over the thumb?
    return false;
  };

  _proto._handlePanResponderRequestEnd = function _handlePanResponderRequestEnd(e, gestureState) {
    // Should we allow another component to take over this pan?
    return false;
  };

  return Slider;
}(PureComponent);
Slider.defaultProps = {
  value: 0,
  minimumValue: 0,
  maximumValue: 1,
  step: 0,
  minimumTrackTintColor: "#3f3f3f",
  maximumTrackTintColor: "#b3b3b3",
  thumbTintColor: "#343434",
  thumbTouchSize: {
    width: 40,
    height: 40
  },
  debugTouchArea: false,
  animationType: "timing"
};

export default Slider;
//# sourceMappingURL=react-native-slider.esm.js.map
