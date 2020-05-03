declare const defaultStyles: {
    container: {
        height: number;
        justifyContent: "center";
    };
    track: {
        height: number;
        borderRadius: number;
    };
    thumb: {
        position: "absolute";
        width: number;
        height: number;
        borderRadius: number;
    };
    touchArea: {
        position: "absolute";
        backgroundColor: string;
        top: number;
        left: number;
        right: number;
        bottom: number;
    };
    debugThumbTouchArea: {
        position: "absolute";
        backgroundColor: string;
        opacity: number;
    };
};
export { defaultStyles };
