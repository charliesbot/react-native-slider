import { StyleSheet } from "react-native";

const TRACK_SIZE = 4;
const THUMB_SIZE = 20;

const defaultStyles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: "center",
  },
  track: {
    height: TRACK_SIZE,
    borderRadius: TRACK_SIZE / 2,
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
  },
  touchArea: {
    position: "absolute",
    backgroundColor: "transparent",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  debugThumbTouchArea: {
    position: "absolute",
    backgroundColor: "green",
    opacity: 0.5,
  },
});

export { defaultStyles };
