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

import Group from "./components/Groups/Group";
import GroupInvite from "./components/Groups/GroupInvite";
import GroupSettings from "./components/Groups/GroupSettings";

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

const GroupNavigation = createSwitchNavigator(
  {
    Group: {
      screen: Group
    },
    GroupInvite: {
      screen: GroupInvite
    },
    GroupSettings: {
      screen: GroupSettings
    }
  },
  {
    initialRouteName: "Group",
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
      screen: GroupNavigation
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

  componentDidMount = async () => {
    this.fetchMeals(0, 1);
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
          .then(data => console.log(data._bodyText))
          .catch(error => console.log(`updateUser: ${error}`));

        this.updateProfile();
        this.updateFriends();
        this.updateGroups();

        this.setState({ firebaseLoaded: true });
      } else {
        this.setState({
          user: undefined,
          firebaseLoaded: true
        });
      }
    });
  };

  updateProfile = () => {
    this.fetchUser(this.state.user.id, data => {
      this.setState({
        user: { ...this.state.user, ...data }
      });
    });
  };

  updateFriends = () => {
    this.fetchFriends(this.state.user.id, data => {
      //data.forEach(friend => this.updateFriend(friend, true));
      this.setState({
        user: { ...this.state.user, friends: data.slice() }
      });
    });
  };

  updateGroups = () => {
    this.fetchGroups(this.state.user.id, data => {
      this.setState({
        user: { ...this.state.user, groups: data.slice() }
      });
    });
  };

  updateFriend = (friend, action) => {
    // action == true, add friend.
    if (action) {
      this.fetchUser(friend, data => {
        const arr = this.state.user.friends.slice();
        arr.push(data.id);

        this.setState({
          user: {
            ...this.state.user,
            friends: arr
          }
        });
      });
    }
    // action == false, remove friend.
    else {
      this.setState({
        user: {
          ...this.state.user,
          friends: this.state.user.friends.filter(f => f != friend)
        }
      });
    }
  };

  updateGroup = (group, action) => {
    // action == true, add friend.
    if (action) {
      this.fetchGroup(group, data => {
        const arr = this.state.user.friends.slice();
        arr.push(data.id);

        this.setState({
          user: {
            ...this.state.user,
            groups: arr
          }
        });
      });
    }
    // action == false, remove group.
    else {
      this.setState({
        user: {
          ...this.state.user,
          groups: this.state.user.groups.filter(g => g != group)
        }
      });
    }
  };

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
      .then(data => {
        if (callback) callback(JSON.parse(data._bodyText));
      })
      .catch(error => console.log(`fetchUser: ${error}`));
  }

  fetchFriends(id, callback) {
    /*
     * TODO: update with change log version.
     */

    fetch("https://us-central1-courtsort-e1100.cloudfunctions.net/getFriends", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: this.state.user.id
      })
    })
      .then(data => {
        if (callback) callback(JSON.parse(data._bodyText));
      })
      .catch(error => console.log(`fetchFriends: ${error}`));
  }

  fetchGroups(callback) {
    console.log("getGroups does not run");
    /*fetch("https://us-central1-courtsort-e1100.cloudfunctions.net/getGroups", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: this.state.user.id
      })
    })
      .then(data => {
        console.log("\n\nfetch groups\n\n");
        //console.log(data._bodyText)
        JSON.parse(data._bodyText);
      })
      .then(data => {
        if (callback) callback(data);
      })
      .catch(error => console.log(error));
      */
  }

  fetchMeals(from, left) {
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
            this.fetchMeals(from + 1, left - 1);
          }
        );
      })
      .catch(error => console.log(`fetchMeals: ${error}`));
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
              fetchUser: this.fetchUser,
              updateUser: this.updateUser,
              updateFriend: this.updateFriend,
              updateGroup: this.updateGroup
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
