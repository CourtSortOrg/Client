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
import Settings from "./components/Settings/Settings";
import EditProfile from "./components/Settings/EditProfile";

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

const SettingsNavigation = createStackNavigator(
  {
    Profile: {
      screen: Profile
    },
    Settings: {
      screen: Settings
    },
    EditProfile: {
      screen: EditProfile
    }
  },
  {
    initialRouteName: "Profile",
    headerMode: "none"
  }
);

const MainNavigation = createStackNavigator(
  {
    Messages: {
      screen: Messages
    },
    Profile: {
      screen: SettingsNavigation
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
      fontLoaded: false,
      firebaseLoaded: false,
      user: {},
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

  updateUser = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          user: {
            displayName: user.displayName,
            email: user.email,
            emailVerified: user.emailVerified,
            phoneNumber: user.phoneNumber,
            photoURL: user.photoURL,
            providerData: user.providerData,
            uid: user.uid,
            isAnonymous: user.isAnonymous,
            id: user.displayName
          }
        });

        fetch(
          "https://us-central1-courtsort-e1100.cloudfunctions.net/addUserToDatabase",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              uid: user.uid,
              name: user.displayName
            })
          }
        )
          .then(data => {
            console.log(data._bodyText);
            this.fetchProfile();
            this.fetchFriends();
            this.fetchGroups();
            console.log("loaded");
            this.setState({ firebaseLoaded: true });
          })
          .catch(error => this.setState({ firebaseLoaded: true }));
      } else {
        this.setState({
          user: undefined,
          firebaseLoaded: true
        });
      }
    });
  };

  updateFriends = (friend, action) => {
    // action == true, add friend.
    if (action) {
      console.log(this.state.user);
      // make firebase call.

      // get profile.
      // push public profile to friends.

      this.fetchUser(friend, data =>
        this.setState({
          user: {
            ...this.state.user,
            friends: this.state.user.friends.slice().push(data)
          }
        })
      );
    }
    // action == false, remove friend.
    else {
      // make firebase call.
      // remove friend.
      this.setState({
        user: {
          ...this.state.user,
          friends: this.state.user.friends.filter(f => f.id != friend)
        }
      });
    }
  };

  updateGroups = (group, action) => {
    // action == true, add friend.
    if (action) {
      // make firebase call.
      // get group.
      // push group to group.
      this.fetchGroup(group, data =>
        this.setState({
          user: {
            ...this.state.user,
            groups: this.state.user.groups.slice().push(data)
          }
        })
      );
    }
    // action == false, remove group.
    else {
      // make firebase call.
      // remove group.
      this.setState({
        user: {
          ...this.state.user,
          groups: this.state.user.groups.filter(g => g.id != group)
        }
      });
    }
  };

  componentDidMount = async () => {
    this.fetchDates(0, 1);
    this.updateUser();
    //If the authentification state changes
    await Font.loadAsync({
      Lobster: require("./assets/fonts/Lobster/Lobster-Regular.ttf"),
      "Quicksand-Regular": require("./assets/fonts/Quicksand/Quicksand-Regular.ttf"),
      "Quicksand-Light": require("./assets/fonts/Quicksand/Quicksand-Light.ttf"),
      "Quicksand-Medium": require("./assets/fonts/Quicksand/Quicksand-Medium.ttf"),
      "Quicksand-Bold": require("./assets/fonts/Quicksand/Quicksand-Bold.ttf")
    });

    this.setState({ fontLoaded: true });
  };

  fetchProfile() {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/getUserProfile",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: this.state.user.id
        })
      }
    ).then(data => {
      this.setState({
        user: { ...this.state.user, ...JSON.parse(data._bodyText) }
      });
    });
  }

  fetchUser(id, callback) {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/getUserProfile",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: id
        })
      }
    )
      .then(data => JSON.parse(data._bodyText).then(data => callback(data)))
      .catch(error => console.log(error));
  }

  fetchFriends(id, callback) {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/getFriends",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: id
        })
      }
    )
      .then(data => JSON.parse(data._bodyText).then(data => callback(data)))
      .catch(error => console.log(error));
  }

  fetchGroups(id, callback) {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/getGroups",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: id
        })
      }
    )
      .then(data => JSON.parse(data._bodyText).then(data => callback(data)))
      .catch(error => console.log(error));
  }

  render() {
    if (
      this.state.mealsLoaded &&
      this.state.fontLoaded &&
      this.state.firebaseLoaded
    ) {
      return (
        <Navigation
          screenProps={{
            functions: {
              updateUser: this.updateUser,
              fetchUser: this.fetchUser,
              updateFriends: this.updateFriends
            },
            user: this.state.user,
            meals: this.state.meals
          }}
        />
      );
    }
    return <Splash />;
  }
}
