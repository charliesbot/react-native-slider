import React, { useState } from "react";
import { ScrollView, View, Text } from "react-native";
import Slider from "./react-native-slider/react-native-slider.esm";
import {
  styles,
  iosStyles,
  customStyles2,
  customStyles3,
  customStyles4,
  customStyles5,
  customStyles6,
  customStyles7,
  customStyles8,
  customStyles9,
} from "./App.style";

const DEFAULT_VALUE = 0.2;

const SliderContainer = props => {
  const { caption, children } = props;
  const [value, setValue] = useState(DEFAULT_VALUE);
  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.caption} numberOfLines={1}>
          {caption}
        </Text>
        <Text style={styles.value} numberOfLines={1}>
          {value}
        </Text>
      </View>
      {React.Children.map(children, child => {
        if (child.type === Slider || child.type === ReactNative.Slider) {
          return React.cloneElement(child, {
            value: value,
            onValueChange: val => setValue(val),
          });
        }

        return child;
      })}
    </View>
  );
};

const SliderExample = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SliderContainer caption="<React.Slider/>">
        <ReactNative.Slider />
      </SliderContainer>
      <SliderContainer caption="<Slider/> with default style">
        <Slider />
      </SliderContainer>
      <SliderContainer caption="<Slider/> with min, max and custom tints ">
        <Slider
          minimumValue={-10}
          maximumValue={42}
          minimumTrackTintColor="#1fb28a"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#1a9274"
        />
      </SliderContainer>
      <SliderContainer caption="<Slider/> with custom style">
        <Slider
          trackStyle={iosStyles.track}
          thumbStyle={iosStyles.thumb}
          minimumTrackTintColor="#1073ff"
          maximumTrackTintColor="#b7b7b7"
        />
      </SliderContainer>
      <SliderContainer caption="<Slider/> with custom style #2">
        <Slider
          trackStyle={customStyles2.track}
          thumbStyle={customStyles2.thumb}
          minimumTrackTintColor="#30a935"
        />
      </SliderContainer>
      <SliderContainer caption="<Slider/> with custom style #3">
        <Slider
          trackStyle={customStyles3.track}
          thumbStyle={customStyles3.thumb}
          minimumTrackTintColor="#eecba8"
        />
      </SliderContainer>
      <SliderContainer caption="<Slider/> with custom style #4">
        <Slider
          trackStyle={customStyles4.track}
          thumbStyle={customStyles4.thumb}
          minimumTrackTintColor="#d14ba6"
        />
      </SliderContainer>
      <SliderContainer caption="<Slider/> with custom style #5">
        <Slider
          trackStyle={customStyles5.track}
          thumbStyle={customStyles5.thumb}
          minimumTrackTintColor="#ec4c46"
        />
      </SliderContainer>
      <SliderContainer caption="<Slider/> with custom style #6">
        <Slider
          trackStyle={customStyles6.track}
          thumbStyle={customStyles6.thumb}
          minimumTrackTintColor="#e6a954"
        />
      </SliderContainer>
      <SliderContainer caption="<Slider/> with custom style #7">
        <Slider
          trackStyle={customStyles7.track}
          thumbStyle={customStyles7.thumb}
          minimumTrackTintColor="#2f2f2f"
        />
      </SliderContainer>
      <SliderContainer caption="<Slider/> with custom style #8 and thumbTouchSize">
        <Slider
          style={customStyles8.container}
          trackStyle={customStyles8.track}
          thumbStyle={customStyles8.thumb}
          minimumTrackTintColor="#31a4db"
          thumbTouchSize={{ width: 50, height: 40 }}
        />
      </SliderContainer>
      <SliderContainer caption="<Slider/> with custom style #9 and thumbImage">
        <Slider
          minimumTrackTintColor="#13a9d6"
          thumbImage={require("./img/thumb.png")}
          thumbStyle={customStyles9.thumb}
          thumbTintColor="#0c6692"
        />
      </SliderContainer>
    </ScrollView>
  );
};

export default SliderExample;
