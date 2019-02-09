import React from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { createSwitchNavigator, createAppContainer } from "react-navigation"
import { Font } from "expo";

import Main from "./components/main/Main";
import Splash from "./components/auth/Splash"
import SignIn from "./components/auth/SignIn"

const AuthNavigation = createSwitchNavigator(
  {
    Splash: {
      screen: Splash
    },
    Home: {
      screen: Main
    },
    Auth: {
      screen: SignIn
    },
  },
  {
    initialRouteName: "Home"
  }
);

const Navigation = createAppContainer(AuthNavigation);

export default class App extends React.Component {
  state = {
    fontLoaded: false
  };

  async componentDidMount() {
    await Font.loadAsync({
      'Lobster': require('./assets/fonts/Lobster/Lobster-Regular.ttf'),
      'Quicksand-Regular': require('./assets/fonts/Quicksand/Quicksand-Regular.ttf'),
      'Quicksand-Light': require('./assets/fonts/Quicksand/Quicksand-Light.ttf'),
      'Quicksand-Medium': require('./assets/fonts/Quicksand/Quicksand-Medium.ttf'),
      'Quicksand-Bold': require('./assets/fonts/Quicksand/Quicksand-Bold.ttf'),
    });

    this.setState({fontLoaded: true});
  }

  render() {
    if(this.state.fontLoaded)
      return <Navigation />
    return <Splash />
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
