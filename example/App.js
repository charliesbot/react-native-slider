import React, { useState } from "react";
import { SafeAreaView, ScrollView, View, Text } from "react-native";
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
  const { caption, children, value } = props;
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
      {children}
    </View>
  );
};

const SliderExample = () => {
  const [value1, setValue1] = useState(DEFAULT_VALUE);
  const [value2, setValue2] = useState(DEFAULT_VALUE);
  const [value3, setValue3] = useState(DEFAULT_VALUE);
  const [value4, setValue4] = useState(DEFAULT_VALUE);
  const [value5, setValue5] = useState(DEFAULT_VALUE);
  const [value6, setValue6] = useState(DEFAULT_VALUE);
  const [value7, setValue7] = useState(DEFAULT_VALUE);
  const [value8, setValue8] = useState(DEFAULT_VALUE);
  const [value9, setValue9] = useState(DEFAULT_VALUE);
  const [value10, setValue10] = useState(DEFAULT_VALUE);
  const [value11, setValue11] = useState(DEFAULT_VALUE);

  return (
    <>
      <SafeAreaView />
      <ScrollView contentContainerStyle={styles.container}>
        <SliderContainer caption="<Slider/> with default style" value={value1}>
          <Slider value={value1} onValueChange={setValue1} />
        </SliderContainer>
        <SliderContainer
          caption="<Slider/> with min, max and custom tints "
          value={value2}
        >
          <Slider
            value={value2}
            onValueChange={setValue2}
            minimumValue={-10}
            maximumValue={42}
            minimumTrackTintColor="#1fb28a"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#1a9274"
          />
        </SliderContainer>
        <SliderContainer caption="<Slider/> with custom style" value={value3}>
          <Slider
            value={value3}
            onValueChange={setValue3}
            trackStyle={iosStyles.track}
            thumbStyle={iosStyles.thumb}
            minimumTrackTintColor="#1073ff"
            maximumTrackTintColor="#b7b7b7"
          />
        </SliderContainer>
        <SliderContainer
          caption="<Slider/> with custom style #2"
          value={value4}
        >
          <Slider
            value={value4}
            onValueChange={setValue4}
            trackStyle={customStyles2.track}
            thumbStyle={customStyles2.thumb}
            minimumTrackTintColor="#30a935"
          />
        </SliderContainer>
        <SliderContainer
          caption="<Slider/> with custom style #3"
          value={value5}
        >
          <Slider
            value={value5}
            onValueChange={setValue5}
            trackStyle={customStyles3.track}
            thumbStyle={customStyles3.thumb}
            minimumTrackTintColor="#eecba8"
          />
        </SliderContainer>
        <SliderContainer
          caption="<Slider/> with custom style #4"
          value={value6}
        >
          <Slider
            value={value6}
            onValueChange={setValue6}
            trackStyle={customStyles4.track}
            thumbStyle={customStyles4.thumb}
            minimumTrackTintColor="#d14ba6"
          />
        </SliderContainer>
        <SliderContainer
          caption="<Slider/> with custom style #5"
          value={value7}
        >
          <Slider
            value={value7}
            onValueChange={setValue7}
            trackStyle={customStyles5.track}
            thumbStyle={customStyles5.thumb}
            minimumTrackTintColor="#ec4c46"
          />
        </SliderContainer>
        <SliderContainer
          caption="<Slider/> with custom style #6"
          value={value8}
        >
          <Slider
            value={value8}
            onValueChange={setValue8}
            trackStyle={customStyles6.track}
            thumbStyle={customStyles6.thumb}
            minimumTrackTintColor="#e6a954"
          />
        </SliderContainer>
        <SliderContainer
          caption="<Slider/> with custom style #7"
          value={value9}
        >
          <Slider
            value={value9}
            onValueChange={setValue9}
            trackStyle={customStyles7.track}
            thumbStyle={customStyles7.thumb}
            minimumTrackTintColor="#2f2f2f"
          />
        </SliderContainer>
        <SliderContainer
          caption="<Slider/> with custom style #8 and thumbTouchSize"
          value={value10}
        >
          <Slider
            value={value10}
            onValueChange={setValue10}
            style={customStyles8.container}
            trackStyle={customStyles8.track}
            thumbStyle={customStyles8.thumb}
            minimumTrackTintColor="#31a4db"
            thumbTouchSize={{ width: 50, height: 40 }}
          />
        </SliderContainer>
        <SliderContainer
          caption="<Slider/> with custom style #9 and thumbImage"
          value={value11}
        >
          <Slider
            value={value11}
            onValueChange={setValue11}
            minimumTrackTintColor="#13a9d6"
            thumbImage={require("./img/thumb.png")}
            thumbStyle={customStyles9.thumb}
            thumbTintColor="#0c6692"
          />
        </SliderContainer>
      </ScrollView>
    </>
  );
};

export default SliderExample;
