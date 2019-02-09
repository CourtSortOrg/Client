import React from "react";
import {View, Text} from "react-native";

import Screen from "../Nav/Screen";

export default class Map extends React.Component {
  render() {
    return (
      <Screen title="Map" navigation={{...this.props.navigation}} backButton={true}>
        <Text>Map</Text>
      </Screen>
    )
  }
}
