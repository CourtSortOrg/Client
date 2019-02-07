import React from "react";
import {View, Text} from "react-native";
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';

import DiningCourt from "./DiningCourt";
import Friend from "./Friend";
import Group from "./Group";
import Home from "./Home";
//import Map from "./Map";
import MealItem from "./MealItem";
import Meals from "./Meals";
import Message from "./Message";
import Messages from "./Messages";
import Notifications from "./Notifications";
import Profile from "./Profile";

/*
 * For navigation, the paths need to be absolutely defined.
 * A navigator exists for everything.
*/

const SocialStack = createStackNavigator({
  Friend: {
    screen: Friend
  },
  Group: {
    screen: Group
  }
});

const ProfileStack = createStackNavigator({
  Profile: {
    screen: Profile
  },
  Social: {
    screen: SocialStack
  }
});

const MessageStack = createStackNavigator({
  Message: {
    screen: Message
  },
  Social: {
    screen: SocialStack
  }
})

const DiningDetailsStack = createStackNavigator({
  MealItem: {
    screen: MealItem
  },
  DiningCourt: {
    screen: DiningCourt
  },
});

const HomeStack = createStackNavigator({
  Home: {
    screen: Home
  },
  Profile: {
    screen: ProfileStack
  },
  Notifications: {
    screen: Notifications
  },
  DiningDetails: {
    screen: DiningDetailsStack
  }
});

const MealsStack = createStackNavigator({
  Meals: {
    screen: Meals
  },
  Profile: {
    screen: ProfileStack
  },
  Notifications: {
    screen: Notifications
  },
  DiningDetails: {
    screen: DiningDetailsStack
  },
});

const MessagesStack = createStackNavigator({
  Messages: {
    screen: Messages
  },
  Profile: {
    screen: ProfileStack
  },
  Notifications: {
    screen: Notifications
  },
  Message: {
    screen: MessageStack
  }
})

const Tab = createBottomTabNavigator({
  Home: {
    screen: HomeStack
  },
  Meals: {
    screen: MealsStack
  },
  Messages: {
    screen: MessagesStack
  }
});

const TabContainer = createAppContainer(Tab);

export default TabContainer;
