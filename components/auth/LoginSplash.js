import React from "react";
import { View, Text } from "react-native";
import { Font } from "expo";

import Splash from "./Splash";

import * as firebase from "firebase";

export default class LoginSplash extends React.Component {
  render() {
    return (
      <View>
        <Text>LOGIN</Text>
        <Splash />
      </View>
    );
  }

  componentDidMount() {
    try {
      if (this.props.screenProps.user.userHandle != undefined) {
        this.props.navigation.navigate("Home");
      } else {
        this.props.navigation.navigate("Auth");
      }
    } catch (error) {
      this.props.navigation.navigate("Auth");
    }
  }
}
