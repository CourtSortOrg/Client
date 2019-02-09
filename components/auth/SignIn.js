import React from "react";
import {
  Alert,
  Button,
  Image,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View
} from "react-native";

import { Google } from "expo";

export default class SignIn extends React.Component {
  signInNative = () => {
    Alert.alert("You tapped the button!");
    Keyboard.dismiss();
  };
  createAccount = () => {
    Alert.alert("Should now navigate to creating account screen");
  };

  signInGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId:
          "41918470748-ci8cpn0tpcmt26hjtamo4qic8eo1olpf.apps.googleusercontent.com",
        iosClientId:
          "41918470748-lgi689vhab9g6hnctjfcivfrc1hf329j.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      });

      console.log(result);

      if (result.type === "success") {
        console.log(result.email);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }

      //TODO: Do something with the token that is returned
    } catch (e) {
      return { error: true };
    }
  };

  signInFacebookAsync = async () => {};

  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={Keyboard.dismiss}
      >
        {/* Wrapped in a TouchableOpacity so the keyboard can dismiss upon clicking outside of the TextInputs */}

        {/* Hide the StatusBar for the SignIn Screen */}
        <StatusBar hidden />

        {/* The header for the SignIn Screen (purely visual) */}
        <View style={styles.header}>
          <Image
            style={styles.logo}
            source={require("../../assets/logo.png")}
          />
          <Text style={styles.greeting}>Sign in and get started!</Text>
        </View>

        {/* The body of the SignIn Screen (user interactable) */}
        <View style={styles.body}>
          {/* The TextInput for the email, on pressing the return key it focuses to the TextInput for the password */}
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              this.password.focus();
            }}
            placeholder="Email"
            placeholderTextColor="#999"
            returnKeyType={"next"}
            underlineColorAndroid="transparent"
          />

          {/* The TextInput for the password, on pressing the return key it attempts to sign in the user */}
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onSubmitEditing={() => {
              this.signInUserNative();
            }}
            placeholder="Password"
            placeholderTextColor="#999"
            ref={input => {
              this.password = input;
            }}
            secureTextEntry={true}
            underlineColorAndroid="transparent"
          />

          {/* The Button to sign in the user */}
          <Button color="#e9650d" onPress={this.signInNative} title="Sign In" />

          {/* A visual block to separate native sign in and third part sign in */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.authentication}>
            {/* TODO: Set up Facebook authentication */}
            {/* TODO: Style Google and Facebook buttons */}

            <Button
              onPress={this.signInGoogleAsync}
              title="Sign In With Google"
            />
            <Button
              onPress={this.signInFacebookAsync}
              title="Sign In With Facebook"
            />

            {/* The linked Text that navigates to the CreateAccount screen */}
            <TouchableHighlight
              onPress={this.createAccount}
              activeOpacity={0.65}
              underlayColor="#FFF"
            >
              <Text
                style={{
                  textDecorationLine: "underline",
                  color: "#AAA"
                }}
              >
                Create an Account
              </Text>
            </TouchableHighlight>
          </View>
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
  dividerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30
  },
  divider: {
    borderBottomColor: "#BBB",
    borderTopColor: "#BBB",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    height: 2,
    width: "40%"
  },
  dividerText: {
    marginHorizontal: 15,
    color: "#BBB"
  },
  authentication: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly"
  }
});
