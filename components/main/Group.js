import React from "react";
import { View, Text } from "react-native";

import Screen from "../Nav/Screen";

export default class Group extends React.Component {
  render() {
    return (
      <Screen
        title="Group"
        navigation={{ ...this.props.navigation }}
        backButton={true}
      >
        <Text>Group</Text>
      </Screen>
    );
  }
}
