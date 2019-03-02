import React from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
  AsyncStorage
} from "react-native";
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
import GroupRouter from "./components/Groups/GroupRouter";
import GroupCreate from "./components/Groups/GroupCreate";

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
    headerMode: "none"
  }
);

const GroupNavigation = createSwitchNavigator(
  {
    Group: {
      screen: Group
    },
    GroupRouter: {
      screen: GroupRouter
    },
    GroupCreate: {
      screen: GroupCreate
    },
    GroupInvite: {
      screen: GroupInvite
    },
    GroupSettings: {
      screen: GroupSettings
    }
  },
  {
    headerMode: "none",
    initialRouteName: "GroupRouter"
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
      userHandleLoaded: false,
      user: {},
      meals: []
    };
  }

  _storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`_storeData: ${error}`);
    }
  };

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("user");
      if (value !== null) {
        this.setState({
          user: { ...this.state.user, ...JSON.parse(value) }
        });
        console.log(
          `componentDidMount: Success: AsyncStorage.getItem ${value}`
        );
      }
      this.setState({
        userHandleLoaded: true
      });
    } catch (error) {
      console.error(`componentDidMount: AsyncStorage.getItem: ${error}`);
      this.setState({
        userHandleLoaded: true
      });
    }
  };

  componentDidMount = async () => {
    this._retrieveData();
    this.fetchMeals(0, 7);
    //this.updateUser();
    //If the authentification state changes
    firebase.auth().onAuthStateChanged(user => this.updateUser(user));
    await Font.loadAsync({
      Lobster: require("./assets/fonts/Lobster/Lobster-Regular.ttf"),
      "Quicksand-Regular": require("./assets/fonts/Quicksand/Quicksand-Regular.ttf"),
      "Quicksand-Light": require("./assets/fonts/Quicksand/Quicksand-Light.ttf"),
      "Quicksand-Medium": require("./assets/fonts/Quicksand/Quicksand-Medium.ttf"),
      "Quicksand-Bold": require("./assets/fonts/Quicksand/Quicksand-Bold.ttf")
    });

    this.setState({ fontLoaded: true });
  };

  updateUser = (user, callback) => {
    try {
      console.log(this.state.user);
      if (user && this.state.user.userHandle) {
        this.setState(
          {
            user: {
              ...this.state.user,
              id: this.state.user.userHandle,
              displayName: user.displayName,
              email: user.email,
              emailVerified: user.emailVerified,
              phoneNumber: user.phoneNumber,
              photoURL: user.photoURL,
              providerData: user.providerData,
              uid: user.uid,
              isAnonymous: user.isAnonymous
            }
          },
          () => {
            fetch(
              "https://us-central1-courtsort-e1100.cloudfunctions.net/addUserToDatabase",
              {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  userHandle: this.state.user.userHandle,
                  uid: this.state.user.uid,
                  name: this.state.user.name
                })
              }
            )
              .then(data => {
                try {
                  //JSON.parse(data._bodyText);
                  console.log("running");
                  this.updateProfile(() =>
                    this.updateFriends(() =>
                      this.updateGroups(() => {
                        console.log(this.state.user);
                        this._storeData(
                          `user`,
                          JSON.stringify(this.state.user)
                        );
                        this.setState({ firebaseLoaded: true }, callback);
                      })
                    )
                  );
                } catch (error) {
                  console.error(
                    `updateUser: addUserToDatabase: ${error}: ${data._bodyText}`
                  );
                }
              })
              .catch(error => console.error(`updateUser: ${error}`));
          }
        );
      } else {
        this._storeData("user", "");
        this.setState({
          user: undefined,
          firebaseLoaded: true
        });
      }
    } catch (error) {
      this._storeData("user", "");
      this.setState({
        user: undefined,
        firebaseLoaded: true
      });
    }
  };

  updateProfile = callback => {
    this.fetchUser(this.state.user.userHandle, data => {
      this.setState(
        {
          user: { ...this.state.user, ...data, id: data.userHandle }
        },
        callback
      );
    });
  };

  updateFriends = callback => {
    this.fetchFriends(this.state.user.id, data => {
      //data.forEach(friend => this.updateFriend(friend, true));
      this.setState(
        {
          user: { ...this.state.user, friends: data.slice() }
        },
        callback
      );
    });
  };

  updateGroups = callback => {
    this.fetchGroups(this.state.user.id, data => {
      this.setState(
        {
          user: { ...this.state.user, groups: data.slice() }
        },
        callback
      );
    });
  };

  updateFriend = (friend, action) => {
    // action == true, add friend.
    if (action) {
      const arr = this.state.user.friends.slice();
      arr.push(friend);

      this.setState({
        user: {
          ...this.state.user,
          friends: arr
        }
      });
      /*this.fetchUser(friend, data => {
        const arr = this.state.user.friends.slice();
        arr.push(data.id);

        this.setState({
          user: {
            ...this.state.user,
            friends: arr
          }
        });
      });*/
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
      const arr = this.state.user.groups.slice();
      arr.push(group);

      this.setState({
        user: {
          ...this.state.user,
          groups: arr
        }
      });
      /*this.fetchGroup(group, data => {
        const arr = this.state.user.groups.slice();
        arr.push(data.id);

        this.setState({
          user: {
            ...this.state.user,
            groups: arr
          }
        });
      });*/
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

  getUserHandle = (userHandle, callback) => {
    this.setState(
      {
        user: {
          ...this.state.user,
          userHandle: userHandle
        }
      },
      () => {
        this._storeData(`user`, JSON.stringify(this.state.user));
        callback();
      }
    );
  };

  handleData(functionName, data, callback) {
    try {
      if (callback) callback(JSON.parse(data._bodyText));
    } catch (error) {
      console.error(`${functionName}: ${error}: ${data._bodyText}`);
    }
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
          userHandle: id
        })
      }
    )
      .then(data => this.handleData(`fetchUser`, data, callback))
      .catch(error => console.error(`fetchUser: ${error}`));
  }

  fetchFriends(id, callback) {
    fetch("https://us-central1-courtsort-e1100.cloudfunctions.net/getFriends", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userHandle: id
      })
    })
      .then(data => this.handleData(`fetchFriends`, data, callback))
      .catch(error => console.error(`fetchFriends: ${error}`));
  }

  fetchGroups(id, callback) {
    fetch("https://us-central1-courtsort-e1100.cloudfunctions.net/getGroups", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userHandle: id
      })
    })
      .then(data => this.handleData(`fetchGroups`, data, callback))
      .catch(error => console.error(`fetchFriends: ${error}`));
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
    }-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;
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
        try {
          console.log(data);
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
        } catch (error) {
          console.error(`fetchMeals: ${error}: ${data._bodyText}`);
        }
      })
      .catch(error => console.error(`fetchMeals: ${error}`));
  }

  render() {
    if (
      this.state.mealsLoaded &&
      this.state.fontLoaded &&
      this.state.firebaseLoaded &&
      this.state.userHandleLoaded
    ) {
      return (
        <Navigation
          screenProps={{
            functions: {
              fetchUser: this.fetchUser,
              updateUser: this.updateUser,
              updateFriend: this.updateFriend,
              updateGroup: this.updateGroup,
              getUserHandle: this.getUserHandle
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
