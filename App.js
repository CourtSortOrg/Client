import React from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer
} from "react-navigation";
import { Font } from "expo";

import Main from "./components/main/Main";
import Splash from "./components/auth/Splash";
import SignIn from "./components/auth/SignIn";
import CreateAccount from "./components/auth/CreateAccount";
import ResetPassword from "./components/auth/ResetPassword";

const AuthNavigation = createStackNavigator({
  Signin: {
    screen: SignIn
  },
  ResetPassword: {
    screen: ResetPassword
  },
  CreateAccount: {
    screen: CreateAccount
  }
});

const AppNavigation = createSwitchNavigator(
  {
    CreateAccount: {
      screen: CreateAccount
    },
    ResetPassword: {
      screen: ResetPassword
    },
    Home: {
      screen: Main
    },
    Auth: {
      screen: AuthNavigation
    }
  },
  {
    initialRouteName: "Auth"
  }
);

const Navigation = createAppContainer(AppNavigation);

export default class App extends React.Component {
  state = {
    fontLoaded: false
  };

  async componentDidMount() {
    await Font.loadAsync({
      Lobster: require("./assets/fonts/Lobster/Lobster-Regular.ttf"),
      "Quicksand-Regular": require("./assets/fonts/Quicksand/Quicksand-Regular.ttf"),
      "Quicksand-Light": require("./assets/fonts/Quicksand/Quicksand-Light.ttf"),
      "Quicksand-Medium": require("./assets/fonts/Quicksand/Quicksand-Medium.ttf"),
      "Quicksand-Bold": require("./assets/fonts/Quicksand/Quicksand-Bold.ttf")
    });

    this.setState({ fontLoaded: true });
  }

  render() {
    if (this.state.fontLoaded) return <Navigation />;
    return <Splash />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
