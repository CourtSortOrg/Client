import React from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Picker
} from "react-native";
import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer
} from "react-navigation";

import { Overlay } from "react-native-elements";
import { Font } from "expo";

import NavigationService from "./NavigationService";

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
import BlockedUsers from "./components/Settings/BlockedUsers";

import Group from "./components/Groups/Group";
import GroupSettings from "./components/Groups/GroupSettings";
import GroupPoll from "./components/Groups/GroupPoll";
import GroupResults from "./components/Groups/GroupResults";
//import GroupEvent from "./components/Groups/GroupEvent";
import GroupCreateEvent from "./components/Groups/GroupCreateEvent";

import Card from "./components/components/Card";
import List from "./components/components/List";
import ListElement from "./components/components/ListElement";

import * as firebase from "firebase";
import config from "./config";

//Only initialize the app config if there are no apps running
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const AuthNavigation = createStackNavigator(
  {
    Signin: {
      screen: SignIn
    },
    ResetPassword: {
      screen: ResetPassword
    },
    CreateAccount: {
      screen: CreateAccount
    },
    CreateThirdParty: {
      screen: CreateThirdParty
    }
  },
  {
    headerMode: "none"
  }
);

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
    },
    BlockedUsers: {
      screen: BlockedUsers
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
    GroupCreateEvent: {
      screen: GroupCreateEvent
    },
    GroupResults: {
      screen: GroupResults
    },
    GroupPoll: {
      screen: GroupPoll
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

  date = new Date();

  dateStr = `${this.date.getFullYear()}-${
    this.date.getMonth() + 1 < 10
      ? `0${this.date.getMonth() + 1}`
      : this.date.getMonth() + 1
  }-${
    this.date.getDate() < 10 ? `0${this.date.getDate()}` : this.date.getDate()
  }`;

  busynessMessage = [
    "No one else is here!",
    "Still easy to find a table.",
    "It's crowded.",
    "The line is out the door.",
    "There is no more space!"
  ];

  statusMessage = ["Not Eating", "Available", "Busy"];

  dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  mealNames = ["Breakfast", "Lunch", "Late Lunch", "Dinner"];

  generateDateString = date => {
    return `${date.getFullYear()}-${
      date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    }-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;
  };

  getDay = () => {
    return this.date.getDay();
  };

  getNextMeal = () => {
    if (this.date.getHours() < 10) return this.mealNames[0];
    else if (this.date.getHours() < 14) return this.mealNames[1];
    else if (this.date.getHours() < 16 && this.date.getMinutes() < 15)
      return this.mealNames[2];
    else if (this.date.getHours() < 22) return this.mealNames[3];
  };

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
      await this.resetNotifications(
        () => console.log("notifications reset"),
        true
      );
      await this.updateNotifications(
        () => console.log("notifications loaded"),
        false,
        true
      );
      await this.updateRatings(() => console.log("ratings loaded"));
      // TODO: Get the user's ratings here

      await this._storeData(`user`, JSON.stringify(this.state.user));

      await this.setState({ firebaseLoaded: true }, () => {
        console.log("After:");
        console.log(this.state.user);
        console.log(":After");
        if (callback) callback();
      });
    } else {
      await this._storeData("user", "");
      await this.setState({ firebaseLoaded: true, user: undefined }, () => {
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
          notifications: this.state.user.notifications
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
    await this.setState({
      user: {
        ...this.state.user,
        friends: []
      }
    });

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
    await this.setState({
      user: {
        ...this.state.user,
        groups: []
      }
    });

    await this.fetchGroups(this.state.user.userHandle, async data => {
      await data.forEach(
        async groupID => await this.updateGroup(groupID, true)
      );
    });

    if (callback) callback();
  };

  updateBlockedUsers = async callback => {
    try {
      let data = await fetch(
        "https://us-central1-courtsort-e1100.cloudfunctions.net/getBlockedUsers",
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
      );
      let blockedUsersList = await JSON.parse(data._bodyText);
      await this.setState({
        user: { ...this.state.user, blockedUsers: blockedUsersList }
      });
      // Call the callback if provided
      if (callback) callback();
    } catch (error) {
      console.error(`updateBlockedUsers: ${error}`);
      // Call the callback if provided
      if (callback) callback();
    }
  };

  updateFriend = async (id, action) => {
    // action == true, add friend.
    if (action) {
      await this.fetchUser(id, async data => {
        const arr = this.state.user.friends.filter(f => f.userHandle != id);
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

  updateGroup = async (id, action, callback) => {
    // action == true, add friend.
    if (action) {
      await this.fetchGroup(id, async data => {
        const arr = this.state.user.groups.filter(g => g.groupID != id);
        arr.push({ ...data, groupID: id });
        await this.setState(
          {
            user: {
              ...this.state.user,
              groups: arr
            }
          },
          callback
        );
      });
    }
    // action == false, remove group.
    else {
      await this.setState({
        user: {
          ...this.state.user,
          groups: this.state.user.groups.filter(g => g.groupID != id)
        },
        callback
      });
    }
  };

  updateRatings = async callback => {
    try {
      let data = await fetch(
        "https://us-central1-courtsort-e1100.cloudfunctions.net/getUserDishRatings",
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
      );
      let ratingData = await JSON.parse(data._bodyText);
      await this.setState(
        {
          user: { ...this.state.user, ratings: ratingData }
        },
        callback
      );
    } catch (error) {
      console.error(`getUserDishRatings : ${error}`);
    }
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
    ).catch(error => console.error(`setDietaryRestrictions : ${error}`));
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
          this.checkOutOfDiningCourt(() => this.setStatus(0, callback))
      }
    ]);
  };

  checkIn = (courtId, callback) => {
    Alert.alert(
      "Check In",
      `What status would you like to have while you eat at ${courtId}?`,
      [
        {
          text: "Cancel",
          onPress: () =>
            this.checkOutOfDiningCourt(() => this.setStatus(0, callback))
        },
        {
          text: this.statusMessage[1],
          onPress: () =>
            this.checkIntoDiningCourt(courtId, () =>
              this.setStatus(1, callback)
            )
        },
        {
          text: this.statusMessage[2],
          onPress: () =>
            this.checkIntoDiningCourt(courtId, () =>
              this.setStatus(2, callback)
            )
        }
      ]
    );
  };

  changeStatus = callback => {
    let courtId = this.state.user.location;

    Alert.alert("Change Status", `What status would you like to have?`, [
      {
        text: "Cancel"
      },
      {
        text: this.statusMessage[1],
        onPress: () =>
          this.checkIntoDiningCourt(courtId, () => this.setStatus(1, callback))
      },
      {
        text: this.statusMessage[2],
        onPress: () =>
          this.checkIntoDiningCourt(courtId, () => this.setStatus(2, callback))
      }
    ]);
  };

  setStatus = (status, callback) => {
    this.setState({ user: { ...this.state.user, status: status } });

    // firebase function
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/setUserStatus",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userHandle: this.state.user.userHandle,
          status: status
        })
      }
    ).catch(error => console.error(`checkInLocation: ${error}`));

    if (callback) callback();
  };

  checkIntoDiningCourt = (courtId, callback) => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/checkInLocation",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userHandle: this.state.user.userHandle,
          location: courtId
        })
      }
    ).catch(error => console.error(`checkInLocation: ${error}`));

    this.setState({
      user: {
        ...this.state.user,
        location: courtId
      }
    });

    if (callback) callback();
  };

  unblockUser = async (blockedUserHandle, callback) => {
    try {
      await fetch(
        "https://us-central1-courtsort-e1100.cloudfunctions.net/unblockUser",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userHandle: this.state.user.userHandle,
            blockedHandle: blockedUserHandle
          })
        }
      );

      if (callback) callback();
    } catch (error) {
      console.error(`removeLocation: ${error}`);
      if (callback) callback();
    }
  };

  checkOutOfDiningCourt = callback => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/removeLocation",
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
    ).catch(error => console.error(`removeLocation: ${error}`));

    this.setState({
      user: {
        ...this.state.user,
        location: undefined
      }
    });

    if (callback) callback();
  };

  reportAlert = callback => {
    let diningCourt = this.state.user.location;
    let reportMalfunction = this.reportMalfunction;
    let busynessAlert = this.busynessAlert;

    class AlertPicker extends React.Component {
      state = {
        chosen: 0,
        visible: true,
        options: [
          "Cancel",
          "Ice cream machine is nonfunctional.",
          "Menu is inaccurate.",
          "Inadequate utensils."
        ]
      };

      render = () => {
        return (
          <Overlay
            overlayStyle={{ padding: 0 }}
            containerStyle={{ padding: 0, margin: 0 }}
            isVisible={this.state.visible}
          >
            <Card overlay={true} header={`Report at ${diningCourt}?`}>
              {this.state.options.map((o, index) => {
                return (
                  <Card
                    footer={[
                      {
                        text: o,
                        onPress: () => {
                          if (index != 0)
                            reportMalfunction(
                              diningCourt,
                              this.state.options[index]
                            );
                          this.setState({
                            visible: false
                          });
                          if (callback) callback();
                        }
                      }
                    ]}
                  />
                );
              })}
            </Card>
          </Overlay>
        );
      };
    }

    return <AlertPicker />;
  };

  busynessAlert = callback => {
    let diningCourt = this.state.user.location;
    let reportBusyness = this.reportBusyness;
    let busynessMessage = this.busynessMessage;

    class BusynessPicker extends React.Component {
      state = {
        chosen: 0,
        visible: true,
        options: busynessMessage
      };

      render = () => {
        return (
          <Overlay
            overlayStyle={{ padding: 0 }}
            containerStyle={{ padding: 0, margin: 0 }}
            isVisible={this.state.visible}
          >
            <Card overlay={true} header={`Busyness at ${diningCourt}?`}>
              {this.state.options.map((o, index) => {
                return (
                  <Card
                    footer={[
                      {
                        text: o,
                        onPress: () => {
                          if (index != 0) reportBusyness(diningCourt, index);
                          this.setState({
                            visible: false
                          });
                          if (callback) callback();
                        }
                      }
                    ]}
                  />
                );
              })}
            </Card>
          </Overlay>
        );
      };
    }

    return <BusynessPicker />;
  };

  reportBusyness = (diningCourt, busyness) => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/reportBusyness",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userHandle: this.state.user.userHandle,
          diningCourt,
          busyness
        })
      }
    ).catch(error => console.error(`reportBusyness: ${error}`));
  };

  reportMalfunction = (diningCourt, malfunction) => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/reportMalfunction",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userHandle: this.state.user.userHandle,
          diningCourt,
          malfunction
        })
      }
    ).catch(error => console.error(`reportMalfunction: ${error}`));
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
      console.error(`${functionName}: ${error} -- ${data}`);
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
    ).catch(error => console.error(`rateDiningCourt: ${error}`));
  };

  fetchMeals = (from, left) => {
    if (left == 0) {
      this.setState({ mealsLoaded: true });
      return;
    }
    let date = this.date;
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

  changeGroupName = (groupID, groupName) => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/changeGroupName",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          groupID: groupID,
          groupName: groupName
        })
      }
    )
      .then(data => {
        let g = this.state.user.groups.slice();
        g.find(g => g.groupID === groupID).groupName = groupName;
        this.setState({
          user: {
            ...this.state.user,
            groups: g
          }
        });
        console.log(`Update group name to ${groupName}`);
      })
      .catch(error => console.error(`changeGroupName: ${error}`));
  };

  resetNotifications = async callback => {
    let n = this.state.user.notifications;
    this.setState(
      {
        user: {
          ...this.state.user,
          notifications: []
        }
      },
      () => {
        if (n != undefined) {
          let arr = [];
          n.forEach(list =>
            list.items.forEach(e => this.parseNotifications(arr, e.type, e))
          );
          this.addNotifications(arr, callback);
        } else {
          if (callback) callback();
        }
      }
    );
  };

  updateNotifications = async (callback, alert, noStore) => {
    this.getNotifications(data => {
      let arr = [];
      data.forEach((e, index) => this.parseNotifications(arr, e.type, e.id));
      this.addNotifications(arr, () => {
        if (alert !== false) arr.forEach(i => this.notificationAlert(i));
        if (noStore !== true && arr.length > 0) {
          console.log("storing ...");
          console.log(this.state.user.notifications);
          this._storeData("user", JSON.stringify(this.state.user));
        }
        if (callback) callback();
      });
    });
  };

  getNotifications = async callback => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/getNotifications",
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
      .then(data => {
        this.handleData(`getNotifications`, data, callback);
      })
      .catch(error => console.error(`getNotifications: ${error}`));
  };

  parseNotifications = (notifications, type, id, callback) => {
    let obj = undefined;
    console.log(id);
    switch (type) {
      case "new friend":
        obj = this.newFriendNotification(id);
        break;
      case "new friend request":
        obj = this.newFriendRequestNotification(id);
        break;
      case "unfriended":
        obj = this.newUnfriendNotification(id);
        break;
      case "blocked":
        obj = this.newBlockedNotification(id);
        break;
      case "invited to group":
        obj = this.newGroupInvitationNotification(id);
        break;
      case "user joined group":
        obj = this.newGroupJoinNotification(id);
        break;
      case "user left group":
        obj = this.newGroupLeaveNotification(id);
        break;
      case "newPoll":
        obj = this.newNewPollNotification(id);
        break;
      case "closePoll":
        obj = this.newClosePollNotification(id);
        break;
      case "inviteToEat":
        obj = this.newInviteToEatNotification(id);
        break;
      case "requestToEat":
        obj = this.newRequestToEatNotification(id);
        break;
      case "joinedDiningCourt":
        obj = this.newJoinedDiningCourtNotification(id);
        break;
      case "eventStart":
        obj = this.newEventStartNotification(id);
        break;
      case "acceptedInvitationToEat":
        obj = this.newAcceptedInvitationToEat(id);
        break;
      case "deniedInvitationToEat":
        obj = this.newDeniedInvitationToEat(id);
        break;
      case "acceptedRequestToEat":
        obj = this.newAcceptedRequestToEat(id);
        break;
      case "deniedRequestToEat":
        obj = this.newDeniedRequestToEat(id);
        break;

      default:
        console.error(`invalid notification type: ${type}\nid: ${id}`);
    }

    if (obj) {
      notifications.push({
        ...id,
        ...obj,
        type: type,
        date: this.dateStr
      });
    }
  };

  addNotifications = (arr, callback) => {
    let n = [];
    if (this.state.user.notifications)
      n = this.state.user.notifications.slice();

    arr.forEach(item => this.addNotification(n, item));

    this.setState(
      {
        user: {
          ...this.state.user,
          notifications: n
        }
      },
      callback
    );
  };

  addNotification = (arr, item) => {
    let list = arr.find(l => l.date === item.date);
    if (list == undefined) {
      list = {
        date: this.dateStr,
        Name: this.dateStr,
        items: []
      };
      arr.push(list);
    } else {
      list.items = list.items.slice();
    }

    list.items.push(item);
  };

  removeNotification = async id => {
    this.setState(
      {
        user: {
          ...this.state.user,
          notifications: this.state.user.notifications
            .map(list =>
              list.date == id.date
                ? {
                    ...list,
                    items: list.items.filter(item => item.Name != id.Name)
                  }
                : list
            )
            .filter(list => list.items.length != 0)
        }
      },
      () => {
        console.log("storing ...");
        console.log(this.state.user.notifications);
        this._storeData("user", JSON.stringify(this.state.user));
      }
    );
  };

  newFriendRequestNotification = id => {
    id.Name = `${id.friendName}  @${
      id.friendHandle
    }  would like to become friends`;
    id.id = id.friendHandle;
    id.date = this.dateStr;
    let obj = { ...id, onPress: () => this.friendAlert(id) };
    return obj;
  };

  newFriendNotification = id => {
    this.updateFriend(id.friendHandle, true);

    id.Name = `${id.friendName} @${
      id.friendHandle
    } accepted your friend request.`;
    id.date = this.dateStr;
    let obj = { ...id, onPress: () => this.dismissNotification(id) };
    return obj;
  };

  newUnfriendNotification = id => {
    this.updateFriend(id.friendHandle, false);

    id.Name = `${id.friendName} @${id.friendHandle} unfriended you.`;
    id.date = this.dateStr;
    let obj = { ...id, onPress: () => this.dismissNotification(id) };
    return obj;
  };

  newBlockedNotification = id => {
    this.updateFriend(id.friendHandle, false);

    id.Name = `${id.userName} @${id.userHandle} blocked you.`;
    id.date = this.dateStr;
    let obj = { ...id, onPress: () => this.dismissNotification(id) };
    return obj;
  };

  newGroupJoinNotification = id => {
    this.updateGroup(id.groupID, true);

    id.Name = `@${id.userHandle} joined the group: ${id.groupName}.`;
    id.date = this.dateStr;
    let obj = { ...id, onPress: () => this.dismissNotification(id) };
    return obj;
  };

  newGroupLeaveNotification = id => {
    this.updateGroup(id.groupID, true);

    id.Name = `@${id.userHandle} has left the group: ${id.groupName}.`;
    id.date = this.dateStr;
    let obj = { ...id, onPress: () => this.dismissNotification(id) };
    return obj;
  };

  newGroupInvitationNotification = id => {
    id.Name = `@${id.friendHandle} invited you to join ${id.groupName}`;
    id.date = this.dateStr;
    id.id = id.groupID;

    let obj = { ...id, onPress: () => this.groupAlert(id) };
    return obj;
  };

  newNewPollNotification = id => {
    id.Name = `@${id.userHandle} has created a new event in ${
      id.groupName
    }.\nVote on a time! The poll will close an hour before dining courts begin serving that meal`;
    id.date = this.dateStr;
    let obj = { ...id, onPress: () => this.voteGroupAlert(id) };
    return obj;
  };

  newClosePollNotification = id => {
    console.log(id);
    let d = new Date(id.time);
    id.Name = `Members of ${id.groupName} have chosen to eat at ${
      id.diningCourt
    } for ${id.meal} at ${
      d.getHours() > 12 ? d.getHours() - 12 : d.getHours()
    }:${d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()}!`;
    id.date = this.dateStr;
    let obj = { ...id, onPress: () => this.dismissNotification(id) };
    return obj;
  };

  newInviteToEatNotification = id => {
    id.Name = `${id.friendName}  @${
      id.userHandle
    }  has invited you to eat with them at ${id.diningCourt} for ${id.time}!
    \nWould you like to join?`;
    id.date = this.dateStr;
    let obj = { ...id, onPress: () => this.respondToJoinAlert(id) };
    return obj;
  };

  newRequestToEatNotification = id => {
    id.Name = `${id.friendName}  @${
      id.friendHandle
    }  has asked to join you!\nAre you available?`;
    id.date = this.dateStr;
    let obj = { ...id, onPress: () => this.respondToJoinAlert(id) };
    return obj;
  };

  newJoinedDiningCourtNotification = id => {
    id.Name = `${id.friendName}  @${
      id.friendHandle
    }  has checked into your dining court!`;
    id.date = this.dateStr;
    let obj = { ...id, onPress: () => this.requestToJoinAlert(id) };
    return obj;
  };

  newEventStartNotification = id => {
    let d = new Date(id.time);
    id.Name = `${id.groupName}'s event on ${id.date} at ${id.diningCourt} in ${
      d.getHours() > 12 ? d.getHours() - 12 : d.getHours()
    }:${
      d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()
    } is about to start.`;
    id.date = this.dateStr;
    let obj = { ...id, onPress: () => this.dismissNotification(id) };
    return obj;
  };

  newAcceptedInvitationToEat = id => {
    id.Name = `${id.friendName}  @${
      id.friendHandle
    }  has accepted your invitation to eat!`;
    id.date = this.dateStr;
    let obj = { ...id, onPress: () => this.dismissNotification(id) };
    return obj;
  };

  newDeniedInvitationToEat = id => {
    id.Name = `${id.friendName}  @${
      id.friendHandle
    }  is not available to join you.`;
    id.date = this.dateStr;
    let obj = { ...id, onPress: () => this.dismissNotification(id) };
    return obj;
  };

  newAcceptedRequestToEat = id => {
    id.Name = `${id.friendName}  @${
      id.friendHandle
    }  has accepted your request to join!`;
    id.date = this.dateStr;
    let obj = { ...id, onPress: () => this.dismissNotification(id) };
    return obj;
  };

  newDeniedRequestToEat = id => {
    id.Name = `${id.friendName}  @${
      id.friendHandle
    }  has is not available for you to join.`;
    id.date = this.dateStr;
    let obj = { ...id, onPress: () => this.dismissNotification(id) };
    return obj;
  };

  notificationAlert = (id, callback) => {
    Alert.alert("Notification", id.Name, [
      {
        text: "Cancel"
      },
      {
        text: "Dismiss",
        onPress: () => this.removeNotification(id)
      },
      {
        text: "Handle",
        onPress: () => id.onPress()
      }
    ]);
  };

  dismissNotification = id => {
    Alert.alert(`Dismiss notification?`, undefined, [
      {
        text: "Cancel"
      },
      {
        text: "No"
      },
      {
        text: "Yes",
        onPress: () => this.removeNotification(id)
      }
    ]);
  };

  friendAlert = id => {
    Alert.alert("Friend Request", `Accept request from @${id.friendHandle}?`, [
      {
        text: "Cancel"
      },
      {
        text: "Deny",
        onPress: () => this.denyFriendRequest(id)
      },
      {
        text: "Accept",
        onPress: () => this.acceptFriendRequest(id)
      }
    ]);
  };

  groupAlert = id => {
    Alert.alert(
      "Group Invite",
      `Join group ${id.groupName} made by @${id.friendHandle}?`,
      [
        {
          text: "Cancel"
        },
        {
          text: "Deny",
          onPress: () => this.denyGroupInvitation(id)
        },
        {
          text: "Accept",
          onPress: () => this.acceptGroupInvitation(id)
        }
      ]
    );
  };

  sendInvitationAlert = friend => {
    Alert.alert(
      "Send invitation",
      `Would you like to invite ${friend.userName}  @${
        friend.userHandle
      }  to join you?`,
      [
        {
          text: "Cancel"
        },
        {
          text: "No"
        },
        {
          text: "Yes",
          onPress: () => this.inviteToEat(friend.userHandle)
        }
      ]
    );
  };

  sendRequestToJoinAlert = friend => {
    Alert.alert(
      "Send request to join",
      `Would you like to ask ${friend.userName}  @${
        friend.userHandle
      }  if you could join?`,
      [
        {
          text: "Cancel"
        },
        {
          text: "No"
        },
        {
          text: "Yes",
          onPress: () => this.requestToEat(friend.userHandle)
        }
      ]
    );
  };

  requestToJoinAlert = id => {
    Alert.alert(
      "Request to Join",
      `Would you like to ask to join ${id.friendName}  @${id.friendHandle}?`,
      [
        {
          text: "No",
          onPress: () => this.removeNotification(id)
        },
        {
          text: "Yes",
          onPress: () => this.requestToEat(id.friendHandle)
        }
      ]
    );
  };

  respondToJoinAlert = id => {
    Alert.alert(
      "Respond",
      `Would you like to join ${id.friendName}  @${id.friendHandle}?`,
      [
        {
          text: "No, I'm leaving soon",
          onPress: () => this.requestToEatResponse(id, false)
        },
        {
          text: "No, I'm busy",
          onPress: () => this.requestToEatResponse(id, false)
        },
        {
          text: "Yes, I would like to",
          onPress: () => this.requestToEatResponse(id, true)
        }
      ]
    );
  };

  respondToInvitationAlert = id => {
    console.log(
      "update to be different from request. Include time and location."
    );
    Alert.alert(
      "Respond",
      `Would you like to join ${id.friendName}  @${id.friendHandle}  ?`,
      [
        {
          text: "No, I'm leaving soon",
          onPress: () => this.inviteToEatResponse(id, false)
        },
        {
          text: "No, I'm busy",
          onPress: () => this.inviteToEatResponse(id, false)
        },
        {
          text: "Yes, I would like to",
          onPress: () => this.inviteToEatResponse(id, true)
        }
      ]
    );
  };

  voteGroupAlert = id => {
    this.updateGroup(id.groupID, true);

    Alert.alert(`Group Poll in ${id.groupName}`, `Would you like to vote?`, [
      {
        text: "Cancel"
      },
      {
        text: "No",
        onPress: () => this.removeNotification(id)
      },
      {
        text: "Yes",
        onPress: () => this.voteGroup(id)
      }
    ]);
  };

  acceptFriendRequest = id => {
    this.removeNotification(id);

    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/acceptFriendRequest",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userHandle: this.state.user.userHandle,
          friendHandle: id.friendHandle
        })
      }
    )
      .then(data => {
        try {
          //JSON.parse(data._bodyText);
          this.updateFriend(id.friendHandle, true);
        } catch (error) {
          console.error(`acceptFriendRequest: ${error} -- ${data._bodyText}`);
        }
      })
      .catch(error => console.error(`acceptFriendRequest: ${error}`));
  };

  denyFriendRequest = id => {
    this.removeNotification(id);

    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/denyFriendRequest",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userHandle: this.state.user.userHandle,
          friendHandle: id.friendHandle
        })
      }
    )
      .then(data => {
        try {
          //JSON.parse(data._bodyText);
        } catch (error) {
          console.error(`denyFriendRequest: ${error}: ${data._bodyText}`);
        }
      })
      .catch(error => console.error(`denyFriendRequest: ${error}`));
  };

  acceptGroupInvitation = id => {
    this.removeNotification(id);

    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/acceptGroupInvitation",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userHandle: this.state.user.userHandle,
          friendHandle: id.friendHandle,
          groupID: id.groupID
        })
      }
    )
      .then(data => {
        try {
          //JSON.parse(data._bodyText);
          this.updateGroup(id.groupID, true);
        } catch (error) {
          console.error(`acceptGroupInvitation: ${error}- ${data._bodyText}`);
        }
      })
      .catch(error => console.error(`acceptGroupInvitation: ${error}`));
  };

  denyGroupInvitation = id => {
    this.removeNotification(id);

    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/denyGroupInvitation",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userHandle: this.state.user.userHandle,
          friendHandle: id.friendHandle,
          groupID: id.groupID
        })
      }
    )
      .then(data => {
        try {
          //JSON.parse(data._bodyText);
        } catch (error) {
          console.error(`denyGroupInvitation: ${error}- ${data._bodyText}`);
        }
      })
      .catch(error => console.error(`denyGroupInvitation: ${error}`));
  };

  requestToEat = friendHandle => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/requestToEat",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userHandle: this.state.user.userHandle,
          friendHandle
        })
      }
    ).catch(error => console.error(`requestToEat: ${error}`));
  };

  inviteToEat = friendHandle => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/inviteToEat",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userHandle: this.state.user.userHandle,
          friendHandles: [friendHandle]
          //default to checkin, otherwise prompt.
        })
      }
    ).catch(error => console.error(`inviteToEat: ${error}`));
  };

  inviteToEatResponse = (id, accepted) => {
    this.removeNotification(id);

    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/inviteToEatResponse",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userHandle: this.state.user.userHandle,
          friendHandle: id.friendHandle,
          accepted
        })
      }
    ).catch(error => console.error(`inviteToEatResponse: ${error}`));
  };

  requestToEatResponse = (id, accepted) => {
    this.removeNotification(id);

    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/requestToEatResponse",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userHandle: this.state.user.userHandle,
          friendHandle: id.friendHandle,
          accepted
        })
      }
    ).catch(error => console.error(`requestToEatResponse: ${error}`));
  };

  voteGroup = id => {
    this.removeNotification(id);

    NavigationService.navigate("GroupPoll", {
      ID: id.groupID,
      MESSAGEID: id.messageID
    });
  };

  vote = (choiceIndex, groupID, messageID) => {
    fetch("https://us-central1-courtsort-e1100.cloudfunctions.net/vote", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userHandle: this.state.user.userHandle,
        choiceIndex,
        groupID,
        messageID
      })
    }).catch(error => console.error(`vote: ${error}`));
  };

  createPoll = (expirationTime, groupID, timeOptions, meal, callback) => {
    //userHandle, expirationTime, groupID, timeOptions, meal
    // time options is a list of date objects.
    fetch("https://us-central1-courtsort-e1100.cloudfunctions.net/createPoll", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userHandle: this.state.user.userHandle,
        expirationTime,
        groupID,
        timeOptions,
        meal
      })
    })
      .then(data => {
        if (callback) callback(JSON.parse(data._bodyText).messageID);
      })
      .catch(error => console.error(`createPoll: ${error}`));
  };

  render = () => {
    if (
      this.state.mealsLoaded &&
      this.state.fontLoaded &&
      this.state.firebaseLoaded &&
      this.state.userLoaded
    ) {
      return (
        <Navigation
          ref={navigatorRef =>
            NavigationService.setTopLevelNavigator(navigatorRef)
          }
          screenProps={{
            functions: {
              fetchFriend: this.fetchFriend,
              updateUser: this.updateUser,
              addUserToDatabase: this.addUserToDatabase,
              updateFriend: this.updateFriend,
              updateGroup: this.updateGroup,
              changeStatus: this.changeStatus,
              setStatus: this.setStatus,
              checkIn: this.checkIn,
              checkOut: this.checkOut,
              updateDietaryRestrictions: this.updateDietaryRestrictions,
              updateNotifications: this.updateNotifications,
              reportAlert: this.reportAlert,
              busynessAlert: this.busynessAlert,
              rateDiningCourt: this.rateDiningCourt,
              updateRatings: this.updateRatings,
              changeGroupName: this.changeGroupName,
              updateBlockedUsers: this.updateBlockedUsers,
              unblockUser: this.unblockUser,
              createPoll: this.createPoll,
              vote: this.vote,
              generateDateString: this.generateDateString,
              getNextMeal: this.getNextMeal,
              getDay: this.getDay,
              sendInvitationAlert: this.sendInvitationAlert,
              sendRequestToJoinAlert: this.sendRequestToJoinAlert
            },
            globals: {
              statusMessage: this.statusMessage,
              busynessMessage: this.busynessMessage,
              dayNames: this.dayNames,
              mealNames: this.mealNames
            },
            user: this.state.user,
            meals: this.state.meals
          }}
        />
      );
    }
    return <Splash />;
  };
}
