import React from "react";
import { View } from "react-native";
import { Avatar } from "react-native-elements";

export default class AllergenIcon extends React.Component {
  render() {
    return (
      <Avatar
        small
        rounded
        source={`../../assets/images/${this.Name}.png`}
        activeOpacity={
          this.Value ? 0.2 : 1
        }
          //onPress to edit preferences?
      />
    )
  }
}
