import React from "react";
import {View, Text} from "react-native";
import { Button } from "react-native-elements"


export default class Notifications extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Notifications",
      headerLeft: (
        <Button
        title="Profile"
        onPress={() => navigation.push("Profile")}
        />
      ),
      headerRight: (
        <Button
        title="Notifications"
        onPress={() => navigation.goBack()}
        />
      )
    }
  }

  render() {
    return (
      <View>
      <Text>Notifications</Text>
      </View>
    )
  }
}
