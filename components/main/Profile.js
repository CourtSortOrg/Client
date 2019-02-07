import React from "react";
import {View, Text} from "react-native";
import { Button } from "react-native-elements";

export default class Profile extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Profile",
      headerLeft: (
        <Button
          title="Profile"
          onPress={() => navigation.goBack()}gg=G
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
        <Text>Profile</Text>
        <Button
          title="Friend"
          onPress={() => this.props.navigation.navigate("Friend")}
        />
        <Button
          title="Group"
          onPress={() => this.props.navigation.navigate("Group")}
        />
      </View>
    )
  }
}
