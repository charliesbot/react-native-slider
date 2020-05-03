import React from "react";
import { Image } from "react-native";
import { SliderProps } from "../Slider/Slider.type";

const ThumbImage: React.FC<Pick<SliderProps, "thumbImage">> = props => {
  const { thumbImage } = props;

  if (!thumbImage) {
    return null;
  }

  return <Image source={thumbImage} />;
};

export { ThumbImage };
