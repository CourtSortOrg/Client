import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-elements";

import Screen from "../Nav/Screen";

export default class Home extends React.Component {
  render() {
    return (
      <Screen
        title="Home"
        navigation={{ ...this.props.navigation }}
        backButton={false}
      >
        <Button
          title="Dining Court"
          onPress={() => this.props.navigation.push("DiningCourt")}
        />
      </Screen>
    );
  }
}
