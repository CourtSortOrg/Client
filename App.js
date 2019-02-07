import React from 'react';
import { Alert, Button, StyleSheet, Text, View, StyleSheet } from 'react-native';
import { createSwitchNavigator, createAppContainer } from "react-navigation"

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

const App = createAppContainer(AuthNavigation);
export default App;

/*export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <AuthContainer />
        <Text>Open up App.js to start working on your app!</Text>
        <Button
          onPress={() => {Alert.alert('You tapped the button!');}}
          title="Press Me"
        />
      </View>
    );
  }
}*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
