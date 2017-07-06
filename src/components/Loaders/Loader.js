import React, { Component } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  Dimensions,
  StyleSheet,
} from 'react-native';
const { windowHeight } = Dimensions.get('window');

const Loader = props => {
  return (
    <View
      style={{
        backgroundColor: props.backColor,
        flex: 1,
        height: windowHeight,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator color={props.color} size="large" />
    </View>
  );
};

export default Loader;
