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
    GroupSettings: {
      screen: GroupSettings
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
      userLoaded: false,
      user: undefined,
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
          user: { ...JSON.parse(value) }
        });
      }
      this.setState({
        userLoaded: true
      });
    } catch (error) {
      console.error(`componentDidMount: AsyncStorage.getItem: ${error}`);
      this.setState({
        userLoaded: true
      });
    }
  };

  componentDidMount = async () => {
    await this._retrieveData();
    this.fetchMeals(0, 7);
    this.updateUser(true);
    //If the authentification state changes
    //firebase.auth().onAuthStateChanged(user => this.updateUser(user, true));
    await Font.loadAsync({
      Lobster: require("./assets/fonts/Lobster/Lobster-Regular.ttf"),
      "Quicksand-Regular": require("./assets/fonts/Quicksand/Quicksand-Regular.ttf"),
      "Quicksand-Light": require("./assets/fonts/Quicksand/Quicksand-Light.ttf"),
      "Quicksand-Medium": require("./assets/fonts/Quicksand/Quicksand-Medium.ttf"),
      "Quicksand-Bold": require("./assets/fonts/Quicksand/Quicksand-Bold.ttf")
    });
    this.setState({ fontLoaded: true });
  };

  getUserHandle = async (uid, errorHandler) => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/getUserHandle",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          uid
        })
      }
    )
      .then(data => {
        try {
          this.setState({
            user: {
              ...this.state.user,
              userHandle: JSON.parse(data._bodyText).userHandle
            }
          });
        } catch (error) {
          if (errorHandler) errorHandler();
          else console.error(`getUserHandle: ${error}: ${data}`);
        }
      })
      .catch(error => {
        if (errorHandler) errorHandler();
        else console.error(`getUserHandle: ${error}`);
      });
  };

  updateUser = async (action, user, callback, errorHandler) => {
    if (user != undefined) {
      if (user.userHandle == undefined)
        await this.getUserHandle(user.uid, errorHandler);
      else {
        await this.setState({
          user: {
            userHandle: user.userHandle
          }
        });
      }
      await this.setState({
        user: {
          id: this.state.user.userHandle,
          userHandle: this.state.user.userHandle,
          uid: user.uid
        }
      });
    }

    console.log(this.state.user);

    if (
      this.state.user != undefined &&
      this.state.user.userHandle != undefined &&
      action
    ) {
      await this.updateProfile(() => console.log("profile loaded"));
      await this.updateFriends();
      await this.updateGroups();

      //console.log(this.state.user);
      await this._storeData(`user`, JSON.stringify(this.state.user));
      console.log("finished");
    } else {
      await this._storeData("user", "");
    }
    this.setState({ firebaseLoaded: true }, callback);
  };

  updateProfile = async callback => {
    await this.fetchUser(this.state.user.userHandle, data => {
      this.setState({
        user: {
          ...this.state.user,
          ...data,
          friends: [],
          groups: []
        }
      });
    });

    await this.fetchDiningCourtRating(this.state.user.userHandle, data => {
      this.setState({
        user: {
          ...this.state.user,
          diningCourtRatings: data
        }
      });
    });

    if (callback) callback();
  };

  updateFriends = async callback => {
    this.fetchFriends(this.state.user.userHandle, data =>
      data.forEach(friend => this.updateFriend(friend.friendHandle, true))
    );
  };

  updateGroups = async callback => {
    this.fetchGroups(this.state.user.userHandle, data => {
      data.forEach(groupID => this.updateGroup(groupID, true));
    });
  };

  updateFriend = (id, action) => {
    // action == true, add friend.
    if (action) {
      this.fetchUser(id, data => {
        const arr = this.state.user.friends.slice();
        arr.push(data);
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
          friends: this.state.user.friends.filter(f => f.userHandle != id)
        }
      });
    }
  };

  updateGroup = (id, action) => {
    // action == true, add friend.
    if (action) {
      this.fetchGroup(id, data => {
        const arr = this.state.user.groups.slice();
        arr.push({ ...data, groupID: id });
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
          groups: this.state.user.groups.filter(g => g.groupID != id)
        }
      });
    }
  };

  addUserToDatabase = (user, callback) => {
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
          userHandle: user.userHandle,
          userName: user.userName
        })
      }
    )
      .then(data => {
        try {
          //JSON.parse(data._bodyText);
          this.updateUser(true, user, callback);
        } catch (error) {
          console.error(`addUserToDatabase: ${error}--${data._bodyText}`);
        }
      })
      .catch(error => console.error(`addUserToDatabase: ${error}`));
  };

  handleData = (functionName, data, callback) => {
    try {
      if (callback) callback(JSON.parse(data._bodyText));
    } catch (error) {
      console.error(`${functionName}: ${error}: ${data._bodyText}`);
    }
  };

  fetchUser = (id, callback) => {
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
  };

  fetchFriends = (id, callback) => {
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
  };

  // Update to get friend.
  fetchFriend = (id, callback) => {
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
      .then(data => this.handleData(`fetchFriend`, data, callback))
      .catch(error => console.error(`fetchFriend: ${error}`));
  };

  fetchGroups = (id, callback) => {
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
  };

  fetchGroup = (id, callback) => {
    fetch("https://us-central1-courtsort-e1100.cloudfunctions.net/getGroup", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        groupID: id,
        userHandle: this.state.user.userHandle
      })
    })
      .then(data => this.handleData(`getGroup`, data, callback))
      .catch(error => console.error(`getGroup: ${error}`));
  };

  fetchDiningCourtRating = (id, callback) => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/getDiningCourtRatings",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userHandle: this.state.user.userHandle
        })
      }
    )
      .then(data => this.handleData(`getDiningCourtRatings`, data, callback))
      .catch(error => console.error(`getDiningCourtRatings: ${error}`));
  };

  rateDiningCourt = (diningCourt, rating) => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/rateDiningCourt",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userHandle: this.state.user.userHandle,
          diningCourt,
          rating
        })
      }
    )
      .then(data => this.handleData(`getDiningCourtRatings`, data, callback))
      .catch(error => console.error(`getDiningCourtRatings: ${error}`));
  };

  fetchMeals = (from, left) => {
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
  };

  render() {
    if (
      this.state.mealsLoaded &&
      this.state.fontLoaded &&
      this.state.firebaseLoaded &&
      this.state.userLoaded
    ) {
      return (
        <Navigation
          screenProps={{
            functions: {
              fetchFriend: this.fetchFriend,
              updateUser: this.updateUser,
              addUserToDatabase: this.addUserToDatabase,
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
