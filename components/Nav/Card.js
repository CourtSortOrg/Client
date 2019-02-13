import React from "react";
import { View } from "react-native";

export default class Card extends React.Component {
  render() {
    return (
      <View
        style={{
          backgroundColor: "white",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: 5,
          borderRadius: 5,
          ...this.props.style
        }}
      >
        {this.props.children}
      </View>
    );
  }
}
