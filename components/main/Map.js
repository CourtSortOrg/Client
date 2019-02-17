import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { MapView } from "expo";

import Screen from "../Nav/Screen";
import Header from "../Nav/Header";
import Footer from "../Nav/Footer";


export default class Map extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          styles={styles}
          title="Map"
          navigation={{ ...this.props.navigation }}
          backButton={true}
        />
        <MapView
          style={{flex: 1, flexGrow: 1}}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />
        <Footer
        styles={styles}
        navigation={{ ...this.props.navigation }}
      />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    aspectRatio: 1,
    height: "55%"
  }
});
