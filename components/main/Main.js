import React from "react";
import {View, Text} from "react-native";
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';

import Home from "./Home";
import Profile from "./Profile";
import Notifications from "./Notifications";
import Meals from "./Meals";
import Messages from "./Messages";

const StackNavigator = createStackNavigator({
  Home: {
    screen: Home
  },
  Profile: {
    screen: Profile
  },
  Notifications: {
    screen: Notifications
  }
});

const TabNavigator = createBottomTabNavigator({
  Home: {
    screen: Home
  },
  Meals: {
    screen: Meals
  },
  Messages: {
    screen: Messages
  }
});

const StackContainer = createAppContainer(StackNavigator);
const TabContainer = createAppContainer(TabNavigator);

export default TabContainer;
/*export default class Main extends React.Component {
  render() {
    return (
        <TabNavigator/>
    )
  }
}*/
