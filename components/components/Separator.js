import React from "react";
import { View } from "react-native";

export default class Separator extends React.Component {
  render() {
    return (
      <View
        style={{
          borderTopWidth: 3,
          borderColor: "black",
          //marginTop: 10,
          //marginBottom: 10
        }}
      />
    );
  }
}
