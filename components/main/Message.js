import React from "react";
import {View, Text} from "react-native";
import { Button } from "react-native-elements";

export default class Message extends React.Component {
  render() {
    return (
      <View>
      <Text>Message</Text>
      <Button
      title="Friend"
      onPress={() => this.props.navigation.push("Friend")}
      />
      </View>
    )
  }
}
