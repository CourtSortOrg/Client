import React from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer
} from "react-navigation";
import { Font } from "expo";

import Splash from "./components/auth/Splash";
import LoginSplash from "./components/auth/LoginSplash";
import SignIn from "./components/auth/SignIn";
import CreateAccount from "./components/auth/CreateAccount";
import ResetPassword from "./components/auth/ResetPassword";
import DiningCourt from "./components/main/DiningCourt";
import Friend from "./components/main/Friend";
import Group from "./components/main/Group";
import Home from "./components/main/Home";
import Map from "./components/main/Map";
import MealItem from "./components/main/MealItem";
import Meals from "./components/main/Meals";
import Message from "./components/main/Message";
import Messages from "./components/main/Messages";
import Notifications from "./components/main/Notifications";
import Profile from "./components/main/Profile";

import * as firebase from "firebase";
import config from "./config";

//Only initialize the app config if there are no apps running
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const AuthNavigation = createStackNavigator({
  Signin: {
    screen: SignIn,
    navigationOptions: {
      header: null //this will hide the header
    }
  },
  ResetPassword: {
    screen: ResetPassword,
    navigationOptions: {
      header: null //this will hide the header
    }
  },
  CreateAccount: {
    screen: CreateAccount,
    navigationOptions: {
      header: null //this will hide the header
    }
  }
});

const MainNavigation = createStackNavigator(
  {
    Messages: {
      screen: Messages
    },
    Profile: {
      screen: Profile
    },
    Friend: {
      screen: Friend
    },
    Group: {
      screen: Group
    },
    Notifications: {
      screen: Notifications
    },
    Message: {
      screen: Message
    },
    Meals: {
      screen: Meals
    },
    MealItem: {
      screen: MealItem
    },
    DiningCourt: {
      screen: DiningCourt
    },
    Map: {
      screen: Map
    },
    Home: {
      screen: Home
    }
  },
  {
    initialRouteName: "Home",
    headerMode: "none",
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0
      }
    })
  }
);

const AppNavigation = createSwitchNavigator(
  {
    Splash: {
      screen: LoginSplash
    },
    Home: {
      screen: MainNavigation
    },
    Auth: {
      screen: AuthNavigation
    }
  },
  {
    initialRouteName: "Splash"
  }
);

const Navigation = createAppContainer(AppNavigation);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mealsLoaded: false,
      user: {
        uid: ""
      },
      meals: []
    };
  }

  fetchDates(from, left) {
    if (left == 0) {
      this.setState({ mealsLoaded: true });
      return;
    }
    let date = new Date();
    date.setDate(date.getDate() + from);
    const dateStr = `${date.getFullYear()}-${
      date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    }-${date.getDate()}`;
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/fetchDishes",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          date: dateStr
        })
      }
    )
      .then(data => {
        const meals = this.state.meals.slice(0);
        meals.push(JSON.parse(data._bodyText));
        this.setState(
          {
            meals
          },
          () => {
            //this.updateMeals();
            date = date.setDate(date.getDate() + 1);
            this.fetchDates(from + 1, left - 1);
          }
        );
      })
      .catch(err => console.log(err));
  }

  componentDidMount = async () => {
    this.fetchDates(0, 1);

    await Font.loadAsync({
      Lobster: require("./assets/fonts/Lobster/Lobster-Regular.ttf"),
      "Quicksand-Regular": require("./assets/fonts/Quicksand/Quicksand-Regular.ttf"),
      "Quicksand-Light": require("./assets/fonts/Quicksand/Quicksand-Light.ttf"),
      "Quicksand-Medium": require("./assets/fonts/Quicksand/Quicksand-Medium.ttf"),
      "Quicksand-Bold": require("./assets/fonts/Quicksand/Quicksand-Bold.ttf")
      /*Lobster: require("../../assets/fonts/Lobster/Lobster-Regular.ttf"),
      "Quicksand-Regular": require("../../assets/fonts/Quicksand/Quicksand-Regular.ttf"),
      "Quicksand-Light": require("../../assets/fonts/Quicksand/Quicksand-Light.ttf"),
      "Quicksand-Medium": require("../../assets/fonts/Quicksand/Quicksand-Medium.ttf"),
      "Quicksand-Bold": require("../../assets/fonts/Quicksand/Quicksand-Bold.ttf")*/
    });

    this.setState({ fontLoaded: true });
  };

  render() {
    if (this.state.mealsLoaded && this.state.fontLoaded) {
      return <Navigation screenProps={{ meals: this.state.meals }} />;
    }
    return <Splash />;
  }
}
