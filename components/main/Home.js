import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-elements";

import Screen from "../Nav/Screen";
import CheckInCard from "./CheckInCard";

export default class Home extends React.Component {
  render() {
    return (
      <Screen
        title="Home"
        navigation={this.props.navigation}
        backButton={false}
      >
        <CheckInCard
          navigation={this.props.navigation}
          screenProps={this.props.screenProps}
        />
      </Screen>
    );
  }
}
