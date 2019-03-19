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
import CreateThirdParty from "./components/auth/CreateThirdParty";
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
import AddUser from "./components/main/AddUser";

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
  },
  CreateThirdParty: {
    screen: CreateThirdParty,
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
    AddUser: {
      screen: AddUser
    },
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
      if (value != "") {
        await AsyncStorage.setItem(key, value);
      } else {
        await AsyncStorage.removeItem(key);
      }
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
    return await fetch(
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
    );
  };

  updateUser = async (action, user, callback, errorHandler) => {
    console.log("Before:");
    console.log(this.state.user);
    console.log(":Before");
    let errorGetUserHandle = false;
    if (user != undefined) {
      if (user.userHandle == undefined) {
        await this.getUserHandle(user.uid, errorHandler)
          .then(async data => {
            try {
              await this.setState({
                user: {
                  ...this.state.user,
                  userHandle: JSON.parse(data._bodyText).userHandle
                }
              });
            } catch (error) {
              if (errorHandler) errorHandler();
              else console.error(`getUserHandle: ${error} -- ${data}`);
              errorGetUserHandle = true;
            }
          })
          .catch(error => {
            if (errorHandler) errorHandler();
            else console.error(`getUserHandle: ${error}`);
            errorGetUserHandle = true;
          });
      } else {
        await this.setState({
          user: {
            userHandle: user.userHandle
          }
        });
      }

      if (!errorGetUserHandle)
        await this.setState({
          user: {
            id: this.state.user.userHandle,
            userHandle: this.state.user.userHandle,
            uid: user.uid
          }
        });
    }

    if (
      !errorGetUserHandle &&
      this.state.user != undefined &&
      this.state.user.userHandle != undefined &&
      action
    ) {
      await this.updateProfile(() => console.log("profile loaded"));
      await this.updateFriends(() => console.log("friends loaded"));
      await this.updateGroups(() => console.log("groups loaded"));

      await this._storeData(`user`, JSON.stringify(this.state.user));

      await this.setState({ firebaseLoaded: true }, () => {
        console.log("After:");
        console.log(this.state.user);
        console.log(":After");
        if (callback) callback();
      });
    } else {
      await this._storeData("user", "");
      await this.setState({ firebaseLoaded: true }, () => {
        console.log("After::After");
        if (callback && !errorGetUserHandle) callback();
      });
    }
  };

  updateProfile = async callback => {
    await this.fetchUser(this.state.user.userHandle, async data => {
      await this.setState({
        user: {
          ...this.state.user,
          ...data,
          friends: [],
          groups: []
        }
      });
    });

    await this.fetchDiningCourtRating(
      this.state.user.userHandle,
      async data => {
        await this.setState({
          user: {
            ...this.state.user,
            diningCourtRatings: data
          }
        });
      }
    );

    if (callback) callback();
  };

  updateFriends = async callback => {
    await this.fetchFriends(
      this.state.user.userHandle,
      async data =>
        await data.forEach(
          async friend => await this.updateFriend(friend.friendHandle, true)
        )
    );

    if (callback) callback();
  };

  updateGroups = async callback => {
    await this.fetchGroups(this.state.user.userHandle, async data => {
      await data.forEach(
        async groupID => await this.updateGroup(groupID, true)
      );
    });

    if (callback) callback();
  };

  updateFriend = async (id, action) => {
    // action == true, add friend.
    if (action) {
      await this.fetchUser(id, async data => {
        const arr = this.state.user.friends.slice();
        arr.push(data);
        await this.setState({
          user: {
            ...this.state.user,
            friends: arr
          }
        });
      });
    }
    // action == false, remove friend.
    else {
      await this.setState({
        user: {
          ...this.state.user,
          friends: this.state.user.friends.filter(f => f.userHandle != id)
        }
      });
    }
  };

  updateGroup = async (id, action) => {
    // action == true, add friend.
    if (action) {
      await this.fetchGroup(id, async data => {
        const arr = this.state.user.groups.slice();
        arr.push({ ...data, groupID: id });
        await this.setState({
          user: {
            ...this.state.user,
            groups: arr
          }
        });
      });
    }
    // action == false, remove group.
    else {
      await this.setState({
        user: {
          ...this.state.user,
          groups: this.state.user.groups.filter(g => g.groupID != id)
        }
      });
    }
  };

  checkOut = callback => {
    Alert.alert("Check Out", `Would you like to check out?`, [
      {
        text: "Cancel"
      },
      {
        text: "No"
      },
      {
        text: "Yes",
        onPress: () =>
          this.checkOutOfDiningCourt(() =>
            this.setStatus("not eating", callback)
          )
      }
    ]);
  };

  updateDietaryRestrictions = async restrictions => {
    await this.setState({
      user: {
        ...this.state.user,
        dietaryRestrictions: restrictions
      }
    });

    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/setDietaryRestrictions",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userHandle: this.state.user.userHandle,
          dietaryRestrictionArray: restrictions
        })
      }
    )
      .then(data => {
        // try {
        //   this.updateUser(true, user, callback);
        // } catch (error) {
        //   console.error(`setDietaryRestrictions : ${error}--${data._bodyText}`);
        // }
      })
      .catch(error => console.error(`setDietaryRestrictions : ${error}`));
  };

  checkIn = (courtId, callback) => {
    Alert.alert(
      "Check In",
      `What status would you like to have while you eat at ${courtId}?`,
      [
        {
          text: "Cancel"
        },
        {
          text: "Come eat with me!",
          onPress: () =>
            this.checkIntoDiningCourt(courtId, () =>
              this.setStatus("available", callback)
            )
        },
        {
          text: "Sorry, I'm busy.",
          onPress: () =>
            this.checkIntoDiningCourt(courtId, () =>
              this.setStatus("busy", callback)
            )
        },
        {
          text: "I'm no longer eating",
          onPress: () =>
            this.checkOutOfDiningCourt(() =>
              this.setStatus("not eating", callback)
            )
        }
      ]
    );
  };

  changeStatus = callback => {
    let courtId = "set to user court id!";
    console.log(courtId);

    Alert.alert("Change Status", `What status would you like to have?`, [
      {
        text: "Cancel"
      },
      {
        text: "Come eat with me!",
        onPress: () =>
          this.checkIntoDiningCourt(courtId, () =>
            this.setStatus("available", callback)
          )
      },
      {
        text: "Sorry, I'm busy.",
        onPress: () =>
          this.checkIntoDiningCourt(courtId, () =>
            this.setStatus("busy", callback)
          )
      },
      {
        text: "I'm no longer eating",
        onPress: () =>
          this.checkOutOfDiningCourt(() =>
            this.setStatus("not eating", callback)
          )
      }
    ]);
  };

  setStatus = (status, callback) => {
    // fetch.
    console.log(`set status to be ${status}`);
    if (callback) callback();
  };

  checkIntoDiningCourt = (courtId, callback) => {
    console.log(`checked into ${courtId}`);
    if (callback) callback();
  };

  checkOutOfDiningCourt = callback => {
    console.log(`checked out`);
    if (callback) callback();
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

  fetchUser = async (id, callback) => {
    await fetch(
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

  fetchFriends = async (id, callback) => {
    await fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/getFriends",
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
      .then(data => this.handleData(`fetchFriends`, data, callback))
      .catch(error => console.error(`fetchFriends: ${error}`));
  };

  // Update to get friend.
  fetchFriend = async (id, callback) => {
    await fetch(
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

  fetchGroups = async (id, callback) => {
    await fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/getGroups",
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
      .then(data => this.handleData(`fetchGroups`, data, callback))
      .catch(error => console.error(`fetchFriends: ${error}`));
  };

  fetchGroup = async (id, callback) => {
    await fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/getGroup",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          groupID: id,
          userHandle: this.state.user.userHandle
        })
      }
    )
      .then(data => this.handleData(`getGroup`, data, callback))
      .catch(error => console.error(`getGroup: ${error}`));
  };

  fetchDiningCourtRating = async (id, callback) => {
    await fetch(
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
    /*console.log("render:")
    console.log(this.state.user);
    console.log(":render")*/
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
              updateGroup: this.updateGroup,
              changeStatus: this.changeStatus,
              checkIn: this.checkIn,
              checkOut: this.checkOut,
              updateDietaryRestrictions: this.updateDietaryRestrictions
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
