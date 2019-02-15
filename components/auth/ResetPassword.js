import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Button } from "react-native-elements";
import * as firebase from "firebase";

export default class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ""
    };
  }

  resetPassword = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(this.state.email.toString())
      .then(function() {
        alert("Email Sent");
      })
      .catch(function(error) {
        alert(error.message);
      });
  };

  render() {
    return (
      <View
        style={{
          flex:1 ,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <TextInput
          style={{ borderColor: "black" }}
          autoCapitalize="none"
          blurOnSubmit={false}
          placeholder="Email"
          placeholderTextColor="#999"
          onChangeText={text => this.setState({ email: text })}
          underlineColorAndroid="transparent"
        />
        <Button onPress={this.resetPassword} title="Submit" />
      </View>
    );
  }
}
