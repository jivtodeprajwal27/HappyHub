import React from 'react';
import { View, StyleSheet, PanResponder, Animated, GestureResponderEvent, PanResponderGestureState } from 'react-native';

interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onValueChange: (value: number[]) => void;
  width?: number;
  height?: number;
  thumbSize?: number;
  thumbColor?: string;
  trackColor?: string;
  trackActiveColor?: string;
}

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step,
  value,
  onValueChange,
  width = 300,
  height = 40,
  thumbSize = 30,
  thumbColor = '#3B82F6',
  trackColor = '#E2E8F0',
  trackActiveColor = '#60A5FA',
}) => {
  const sliderValue = React.useRef(new Animated.Value(value)).current; // Use useRef for Animated.Value

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          sliderValue.setOffset(sliderValue._value);
        },
        onPanResponderMove: (
          _: GestureResponderEvent,
          gestureState: PanResponderGestureState
        ) => {
          const newValue = sliderValue._offset + gestureState.dx;
          const clampedValue = Math.max(0, Math.min(newValue, width - thumbSize));
          sliderValue.setValue(clampedValue);

          const scaledValue = ((clampedValue / (width - thumbSize)) * (max - min) + min);
          const steppedValue = Math.round(scaledValue / step) * step;
          onValueChange([steppedValue]);
        },
        onPanResponderRelease: () => {
          sliderValue.flattenOffset();
        },
      }),
    [min, max, step, width, thumbSize, onValueChange]
  );

  const thumbPosition = sliderValue.interpolate({
    inputRange: [0, width - thumbSize],
    outputRange: [0, width - thumbSize],
    extrapolate: 'clamp',
  });

  const activeTrackWidth = sliderValue.interpolate({
    inputRange: [0, width - thumbSize],
    outputRange: [0, width - thumbSize],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { width, height }]}>
      <View style={[styles.track, { backgroundColor: trackColor }]} />
      <Animated.View
        style={[
          styles.activeTrack,
          {
            backgroundColor: trackActiveColor,
            width: activeTrackWidth,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.thumb,
          {
            width: thumbSize,
            height: thumbSize,
            borderRadius: thumbSize / 2,
            backgroundColor: thumbColor,
            transform: [{ translateX: thumbPosition }],
          },
        ]}
        {...panResponder.panHandlers}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  track: {
    height: 4,
    borderRadius: 2,
  },
  activeTrack: {
    position: 'absolute',
    height: 4,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
