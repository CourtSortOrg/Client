import React from "react";
import {View, Text} from "react-native";
import { Button } from "react-native-elements";

export default class Messages extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Messages",
      headerLeft: (
        <Button
        title="Profile"
        onPress={() => navigation.push("Profile")}
        />
      ),
      headerRight: (
        <Button
        title="Notifications"
        onPress={() => navigation.push("Notifications")}
        />
      )
    }
  }

  render() {
    return (
      <View>
      <Text>Messages</Text>
      <Button
      title="Message"
      onPress={() => this.props.navigation.push("Message")}
      />
      </View>
    )
  }
}
