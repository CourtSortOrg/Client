import React from "react";
import { View, Text } from "react-native";
import { Font } from "expo";

import Splash from "./Splash";

import * as firebase from "firebase";

export default class LoginSplash extends React.Component {
  render() {
    return <Splash />;
  }

  componentDidMount() {
    if (firebase.auth().currentUser) {
      this.props.navigation.navigate("Home");
    } else {
      this.props.navigation.navigate("Auth");
    }
  }
}
