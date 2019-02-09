import React from "react";
import { View } from "react-native";

export default class Body extends React.Component {
  render() {
    return (
      <View
        style={{
          backgroundColor: "green",
          flex: 1,
          flexGrow: 1
        }}
      >
      {this.props.children}
      </View>
    )
  }
}
