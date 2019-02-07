import React from "react";
import { View } from "react-native";
import { Avatar } from "react-native-elements";

export default class AllergenIcon extends React.Component {
  render() {
    return (
      <Avatar
        small
        rounded
        source={`./${this.Name}.png`}
        {
          // Look disabled if not true.
          this.Value ? activeOpacity={0.2} : ""
        }
        //onPress to edit preferences?
      />
    )
  }
}
