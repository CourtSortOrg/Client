import React from "react";
import {
  Button,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from "react-native";

import * as firebase from "firebase";

import Text from "../components/Text";

export default class CreateAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = { handle: "" };
  }

  // Method that creates a third party account based on the handle
  createAccount = () => {
    Keyboard.dismiss();
    console.log(firebase.auth().currentUser.uid);
    console.log(firebase.auth().currentUser.displayName);
    console.log(`Third Party Handle: ${this.state.handle}`);
    this.props.screenProps.functions.addUserToDatabase(
      {
        uid: firebase.auth().currentUser.uid,
        userName: firebase.auth().currentUser.displayName,
        userHandle: this.state.handle
      },
      () => this.props.navigation.navigate("Home")
    );
  };

  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={Keyboard.dismiss}
      >
        {/* Text to inform the user to add a user handle */}
        <Text type="sectionName">Almost there!</Text>
        <Text>Please provide a handle</Text>
        {/* TextInput to let the user input a handle */}
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          blurOnSubmit={false}
          onSubmitEditing={this.createAccount}
          placeholder="Handle"
          placeholderTextColor="#999"
          onChangeText={handle => this.setState({ handle: handle })}
          underlineColorAndroid="transparent"
        />
        {/* Button that when clicked submits the user handle */}
        <Button
          color="#e9650d"
          onPress={this.createAccount}
          title="Create Account"
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
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
