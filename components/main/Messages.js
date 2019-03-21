import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-elements";

import Screen from "../Nav/Screen";

export default class Messages extends React.Component {
  render() {
    return (
      <Screen
        title="Messages"
        navigation={{ ...this.props.navigation }}
        backButton={false}
      >
        <Text>Messages</Text>
      </Screen>
    );
  }
}
