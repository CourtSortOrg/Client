import React from "react";
import { View, Text } from "react-native";
import { Font } from "expo";

import Splash from "./Splash"

import * as firebase from "firebase";

export default class LoginSplash extends React.Component {
  render() {
    return (
      <Splash/>
    );
  }

  componentDidMount() {
    //If the authentification state changes
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user.uid);
        console.log(user.displayName);
        fetch(
          "https://us-central1-courtsort-e1100.cloudfunctions.net/addUserToDatabase",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              uid: user.uid,
              name: user.displayName
            })
          }
        ).then(data => {
          console.log(data._bodyText);
        });
        this.props.navigation.navigate("Home");
      } else {
        this.props.navigation.navigate("Auth");
      }
    });
  }
}
