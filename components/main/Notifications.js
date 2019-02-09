import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-elements";

import Screen from "../Nav/Screen";

export default class Notifications extends React.Component {
  render() {
    return (
      <Screen
        title="Notifications"
        navigation={{ ...this.props.navigation }}
        backButton={false}
      >
        <Text>Notifications</Text>
      </Screen>
    );
  }
}
