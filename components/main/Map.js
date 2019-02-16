import React from "react";
import { View, Text } from "react-native";
import { MapView } from 'expo';

import Screen from "../Nav/Screen";

export default class Map extends React.Component {
  render() {
    return (
      <Screen
        title="Map"
        navigation={{ ...this.props.navigation }}
        backButton={true}
      >
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />
      </Screen>
    );
  }
}
