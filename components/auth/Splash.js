import React from "react";
import { View, Text, Image } from "react-native";
import { Font } from "expo";

import * as firebase from "firebase";

export default class Splash extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image
          style={{
            aspectRatio: 1,
            height: 100
          }}
          source={require("../../assets/logo.png")}
        />
      </View>
    );
  }
}
