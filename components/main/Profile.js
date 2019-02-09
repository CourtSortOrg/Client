import React from "react";
import {View, Text} from "react-native";
import { Button } from "react-native-elements";

import Screen from "../Nav/Screen";

export default class Profile extends React.Component {
  render() {
    return (
      <Screen title="Profile" navigation={{...this.props.navigation}} backButton={false}>
        <Text>Profile</Text>
        <Button
          title="Friend"
          onPress={() => this.props.navigation.navigate("Friend")}
        />
        <Button
          title="Group"
          onPress={() => this.props.navigation.navigate("Group")}
        />
      </Screen>
    )
  }
}
