import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-elements";

import Screen from "../Nav/Screen";

export default class Message extends React.Component {
  render() {
    return (
      <Screen
        title="Message"
        navigation={{ ...this.props.navigation }}
        backButton={true}
      >
        <Text>Message</Text>
        <Button
          title="Friend"
          onPress={() => this.props.navigation.push("Friend")}
        />
      </Screen>
    );
  }
}
