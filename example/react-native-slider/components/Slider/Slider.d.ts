import { PureComponent } from "react";
import { Animated } from "react-native";
import { Rect } from "../../utils/Rect";
export default class Slider extends PureComponent {
    static defaultProps: {
        value: number;
        minimumValue: number;
        maximumValue: number;
        step: number;
        minimumTrackTintColor: string;
        maximumTrackTintColor: string;
        thumbTintColor: string;
        thumbTouchSize: {
            width: number;
            height: number;
        };
        debugTouchArea: boolean;
        animationType: string;
    };
    state: {
        containerSize: {
            width: number;
            height: number;
        };
        trackSize: {
            width: number;
            height: number;
        };
        thumbSize: {
            width: number;
            height: number;
        };
        allMeasured: boolean;
        value: Animated.Value;
    };
    componentWillMount(): void;
    componentWillReceiveProps(nextProps: any): void;
    render(): JSX.Element;
    _getPropsForComponentUpdate(props: any): any;
    _handleStartShouldSetPanResponder: (e: Object) => boolean;
    _handleMoveShouldSetPanResponder(): boolean;
    _handlePanResponderGrant: () => void;
    _handlePanResponderMove: (e: Object, gestureState: Object) => void;
    _handlePanResponderRequestEnd(e: Object, gestureState: Object): boolean;
    _handlePanResponderEnd: (e: Object, gestureState: Object) => void;
    _measureContainer: (x: Object) => void;
    _measureTrack: (x: Object) => void;
    _measureThumb: (x: Object) => void;
    _handleMeasure: (name: string, x: Object) => void;
    _getRatio: (value: number) => number;
    _getThumbLeft: (value: number) => number;
    _getValue: (gestureState: Object) => number;
    _getCurrentValue: () => any;
    _setCurrentValue: (value: number) => void;
    _setCurrentValueAnimated: (value: number) => void;
    _fireChangeEvent: (event: any) => void;
    _getTouchOverflowSize: () => {};
    _getTouchOverflowStyle: () => {};
    _thumbHitTest: (e: Object) => boolean;
    _getThumbTouchRect: () => Rect;
    _renderDebugThumbTouchRect: (thumbLeft: any) => JSX.Element;
    _renderThumbImage: () => JSX.Element | undefined;
}
