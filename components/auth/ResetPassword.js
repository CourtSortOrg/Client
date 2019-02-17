import React from "react";
import {
  Button,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from "react-native";
import * as firebase from "firebase";
import { Ionicons } from "@expo/vector-icons";
import Text from "../Nav/Text"

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
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={Keyboard.dismiss}
      >
        <Ionicons
          color="black"
          name="ios-arrow-back"
          onPress={() => {
            this.props.navigation.navigate("Signin");
          }}
          size={32}
          style={{ position: "absolute", top: 16, left: 16 }}
        />
        <Text style={styles.header}>Forgot your Password?</Text>
        <Text style={{ width: "70%", textAlign: "center", marginBottom: 15 }}>
          Enter you email we'll send you a link to reset your password
        </Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          blurOnSubmit={false}
          placeholder="Email"
          placeholderTextColor="#999"
          onChangeText={text => this.setState({ email: text })}
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
          underlineColorAndroid="transparent"
        />
        <Button
          color="#e9650d"
          onPress={this.resetPassword}
          title="Reset Password"
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    fontSize: 20,
    fontWeight: "500",
    marginVertical: 15
  },
  input: {
    backgroundColor: "#eee",
    borderColor: "#e9650d",
    borderRadius: 5,
    borderWidth: 2,
    height: 40,
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    width: "70%"
  }
});
