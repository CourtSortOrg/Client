import React from "react";
import { View, Text } from "react-native";
import {
  createStackNavigator,
  createAppContainer
} from "react-navigation";

import DiningCourt from "./DiningCourt";
import Friend from "./Friend";
import Group from "./Group";
import Home from "./Home";
import Map from "./Map";
import MealItem from "./MealItem";
import Meals from "./Meals";
import Message from "./Message";
import Messages from "./Messages";
import Notifications from "./Notifications";
import Profile from "./Profile";
import EditProfile from "./EditProfile"

const Stack = createStackNavigator(
  {
    Messages: {
      screen: Messages
    },
    Profile: {
      screen: Profile
    },
    EditProfile: {
      screen: EditProfile
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

//const TabContainer = createAppContainer(Tab);
const StackContainer = createAppContainer(Stack);

//export default TabContainer;
export default StackContainer;
