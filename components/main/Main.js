import React from "react";
import {View, Text} from "react-native";
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

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

/*
* For navigation, the paths need to be absolutely defined.
* A navigator exists for everything.
*/

/*
const SocialStack = createStackNavigator(
  {
    Friend: {
      screen: Friend
    },
    Group: {
      screen: Group
    }
  },
);

const MessageStack = createStackNavigator(
  {
    Message: {
      screen: Message
    },
    Social: {
      screen: SocialStack
    }
  },
)

const DiningDetailsStack = createStackNavigator(
  {
    MealItem: {
      screen: MealItem
    },
    DiningCourt: {
      screen: DiningCourt
    },
  },
  {
    mode: "modal",
    cardStyle: {
      backgroundColor:"transparent",
      opacity:0.99,
    },
  }
);
*/

/*
const HomeStack = createStackNavigator(
  {
    Home: {
      screen: Home
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
    MealItem: {
      screen: MealItem
    },
    DiningCourt: {
      screen: DiningCourt
    },
  },
  {
    headerMode: "screen",
    headerBackTitleVisible: false,
  }
);

const MealsStack = createStackNavigator(
  {
    Meals: {
      screen: Meals
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
    MealItem: {
      screen: MealItem
    },
    DiningCourt: {
      screen: DiningCourt
    },
    Map: {
      screen: Map
    }
  },
);
*/

/*
const MessagesStack = createStackNavigator(
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
      screen: Message//Stack
    },
  },
);
*/

/*
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
},
{
  backBehavior: "initalRoute",
  lazy: false
});
*/

const Switch = createStackNavigator(
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
    },
  },
  {
    initialRouteName: "Home",
    headerMode: "none",
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,
      }}),
  }
);

//const TabContainer = createAppContainer(Tab);
const SwitchContainer = createAppContainer(Switch);

//export default TabContainer;
export default SwitchContainer;
