import React from "react";
import {
  Alert,
  Button,
  Image,
  Keyboard,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View
} from "react-native";

import { Facebook, Google } from "expo";
import { FontAwesome } from "@expo/vector-icons";
import * as firebase from "firebase";

import Text from "../components/Text";

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };

    /*firebase.auth().onAuthStateChanged(user => {
      this.props.screenProps.functions.updateUser(user, () =>
        this.props.navigation.navigate("Home")
      );
    });*/
  }

  handleAuthenticationUpdate = async signInNative => {
    const user = firebase.auth().currentUser;
    this.props.screenProps.functions.updateUser(
      true,
      firebase.auth().currentUser,
      () => this.props.navigation.navigate("Home"),
      this.handleNoUserHandle
    );
  };

  handleNoUserHandle = () => {
    console.error("NO USER HANDLE");
  };

  signInNative = () => {
    //Dismiss the keyboard
    Keyboard.dismiss();

    //Attempt to sign the user in with firebase
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.handleAuthenticationUpdate(true);
      })
      .catch(function(error) {
        alert(error.message);
      });
  };

  createAccount = () => {
    this.props.navigation.navigate("CreateAccount");
  };

  forgotPassword = () => {
    this.props.navigation.navigate("ResetPassword");
  };

  useAsGuest = () => {
    this.props.navigation.navigate("Home");
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

      //this.props.navigation.navigate("Home");

      if (result.type === "success") {
        firebase
          .auth()
          .signInWithCredential(
            firebase.auth.GoogleAuthProvider.credential(
              result.idToken,
              result.accessToken
            )
          )
          .then(() => {
            this.handleAuthenticationUpdate(false);
          })
          .catch(function(error) {
            alert("Error", error.message);
          });
        return result.accessToken;
      } else {
        return { cancelled: true };
      }

      //TODO: Add Android support
      //TODO: Create ability to log back into a google account
    } catch (e) {
      alert("ERROR: " + e.message);
      return { error: true };
    }
  };

  signInFacebookAsync = async () => {
    // TODO: Maybe need to add Android hashes?? APPID 279514589383224
    try {
      const { type, token } = await Facebook.logInWithReadPermissionsAsync(
        "279514589383224",
        {
          permissions: ["public_profile"]
        }
      );
      if (type === "success") {
        // Get the user's name using Facebook's Graph API
        firebase
          .auth()
          .signInAndRetrieveDataWithCredential(
            firebase.auth.FacebookAuthProvider.credential(token)
          )
          .then(() => {
            this.handleAuthenticationUpdate(false);
          });
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  };

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
            onChangeText={email => this.setState({ email: email })}
            underlineColorAndroid="transparent"
          />

          {/* The TextInput for the password, on pressing the return key it attempts to sign in the user */}
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            onSubmitEditing={() => {
              this.signInNative();
            }}
            placeholder="Password"
            placeholderTextColor="#999"
            ref={input => {
              this.password = input;
            }}
            secureTextEntry={true}
            onChangeText={password => this.setState({ password })}
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
            {/* The branded Button for Google Authentification */}
            <TouchableHighlight
              onPress={this.signInGoogleAsync}
              underlayColor="white"
              style={{
                borderRadius: 5
              }}
            >
              <View
                style={[
                  styles.brandedButton,
                  {
                    backgroundColor: "#DB4437"
                  }
                ]}
              >
                <FontAwesome name="google" size={24} color="white" />
                <Text style={styles.brandedButtonText}>
                  Sign In With Google
                </Text>
              </View>
            </TouchableHighlight>

            {/* The branded Button for Facebook Authentification */}
            <TouchableHighlight
              onPress={this.signInFacebookAsync}
              underlayColor="white"
              style={{
                borderRadius: 5
              }}
            >
              <View
                style={[
                  styles.brandedButton,
                  {
                    backgroundColor: "#3C5A99",
                    width: "66%"
                  }
                ]}
              >
                <FontAwesome name="facebook-official" size={24} color="white" />
                <Text style={styles.brandedButtonText}>
                  Sign In With Facebook
                </Text>
              </View>
            </TouchableHighlight>

            {/* Find icons at https://expo.github.io/vector-icons/ (must import the 'type'/source of icon i.e. FontAwesome, Ionicon, etc.) */}

            {/* The linked Text that navigates to the CreateAccount screen */}
            <View
              styles={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableHighlight
                onPress={this.createAccount}
                activeOpacity={0.65}
                underlayColor="#FFF"
              >
                <Text style={styles.linkingText}>Create an account</Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={this.forgotPassword}
                activeOpacity={0.65}
                underlayColor="#FFF"
              >
                <Text style={styles.linkingText}>Forgot your password?</Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={this.useAsGuest}
                activeOpacity={0.65}
                underlayColor="#FFF"
              >
                <Text style={styles.linkingText}>Use as guest</Text>
              </TouchableHighlight>
            </View>
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
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end"
  },
  logo: {
    aspectRatio: 1,
    height: "55%"
  },
  greeting: {
    fontSize: 20,
    fontWeight: "500",
    marginVertical: 15
  },
  body: {
    alignItems: "center",
    flex: 2,
    flexDirection: "column",
    justifyContent: "flex-start"
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
  },
  dividerContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30
  },
  divider: {
    borderBottomColor: "#BBB",
    borderBottomWidth: 1,
    borderTopColor: "#BBB",
    borderTopWidth: 1,
    height: 2,
    width: "40%"
  },
  dividerText: {
    color: "#BBB",
    marginHorizontal: 15
  },
  authentication: {
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-evenly"
  },
  brandedButton: {
    alignItems: "center",
    borderRadius: 5,
    elevation: 2,
    flexDirection: "row",
    height: 40,
    justifyContent: "space-around",
    padding: 5,
    width: "65%"
  },
  brandedButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center"
  },
  linkingText: {
    color: "#AAA",
    marginTop: 10,
    textAlign: "center",
    textDecorationLine: "underline"
  }
});
