import React from "react";
import * as firebase from "firebase";
import {
  Alert,
  Button,
  Image,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  View
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default class CreateAccount extends React.Component {
  constructor(props) {
    super(props);
    var allergenData = require("../../allergenInformation.json");
  }

  state = {
    userName: "",
    userHandle: "",
    email: "",
    password: ""
  };

  createAccount = () => {
    // Alert.alert(
    //   "Name: " +
    //     this.state.userName +
    //     "\nEmail: " +
    //     this.state.email +
    //     "\nPassword: " +
    //     this.state.password
    // );
    if (this.state.userHandle.indexOf(" ") !== -1) {
      Alert.alert("User handle cannot have a space");
      return;
    }

    Keyboard.dismiss();
    let email = this.state.email;
    let password = this.state.password;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        /*user = firebase.auth().currentUser;
        user
          .updateProfile({
            displayName: this.state.userName,
            userName: this.state.userName,
            userHandle: this.state.userHandle
          })
          .catch(function(error) {
            console.error(`createAccount: updateProfile: ${error.message}`);
          });
          */
        this.props.screenProps.functions.addUserToDatabase(
          {
            uid: firebase.auth().currentUser.uid,
            userName: this.state.userName,
            userHandle: this.state.userHandle
          },
          () => this.props.navigation.navigate("Home")
        );
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == "auth/weak-password") {
          Alert.alert("the password is too weak");
        } else {
          //console.error(`createAccount: createUserWithEmailAndPassword: ${error.message}`);
          Alert.alert("Error", error.message);
        }
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
        {/* Wrapped in a TouchableOpacity so the keyboard can dismiss upon clicking outside of the TextInputs */}

        {/* Hide the StatusBar for the CreateAccount Screen */}
        <StatusBar hidden />

        {/* The header for the CreateAccount Screen (purely visual) */}
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require("../../assets/logo.png")}
          />
          <Text style={styles.greeting}>Create a new account!</Text>
        </View>

        {/* The body of the CreateAcoount Screen (user interactable) */}
        <View style={styles.body}>
          {/* TextInput asking for the user's name */}
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              this.userHandle.focus();
            }}
            placeholder="Name"
            placeholderTextColor="#999"
            onChangeText={text => this.setState({ userName: text })}
            returnKeyType={"next"}
            underlineColorAndroid="transparent"
          />

          <TextInput
            style={styles.input}
            autoCapitalize="none"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              this.email.focus();
            }}
            ref={input => {
              this.userHandle = input;
            }}
            placeholder="Handle"
            placeholderTextColor="#999"
            onChangeText={text => this.setState({ userHandle: text })}
            returnKeyType={"next"}
            underlineColorAndroid="transparent"
          />
          {/* TextInput for the email */}
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              this.password.focus();
            }}
            placeholder="Email"
            placeholderTextColor="#999"
            ref={input => {
              this.email = input;
            }}
            onChangeText={text => this.setState({ email: text })}
            returnKeyType={"next"}
            underlineColorAndroid="transparent"
          />

          {/* TextInput for the password */}
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            blurfOnSubmit={false}
            placeholder="Password"
            placeholderTextColor="#999"
            ref={input => {
              this.password = input;
            }}
            onSubmitEditing={() => Keyboard.dismiss()}
            onChangeText={text => this.setState({ password: text })}
            secureTextEntry={true}
            underlineColorAndroid="transparent"
          />

          {/* The Button to create the account */}
          <Button
            color="#e9650d"
            onPress={this.createAccount}
            title="Create Account"
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end"
  },
  header: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  logo: {
    aspectRatio: 1,
    height: "55%"
  },
  greeting: {
    fontSize: 20,
    marginVertical: 15
  },
  body: {
    flex: 2,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  input: {
    marginBottom: 10,
    padding: 5,
    height: 40,
    width: "75%",
    borderColor: "#e9650d",
    backgroundColor: "#eee",
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 15
  },
  invalid_input: {
    marginBottom: 10,
    padding: 5,
    height: 40,
    width: "75%",
    borderColor: "#00FF00",
    backgroundColor: "#eee",
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 15
  },
  allergenList: {
    width: "100%"
  },
  image: {}
});
