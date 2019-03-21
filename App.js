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

import Card from "./components/components/Card";

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

  busynessMessage = [
    "No one else is here!",
    "Still easy to find a table.",
    "It's crowded.",
    "The line is out the door.",
    "There is no more space!"
  ];

  statusMessage = ["Not Eating", "Available", "Busy"];

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
    /*await this.setState({
      user: {
        ...this.state.user,
        friends: []
      }
    });*/

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
    /*await this.setState({
      user: {
        ...this.state.user,
        groups: []
      }
    });*/

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

  updateGroup = async (id, action) => {
    // action == true, add friend.
    if (action) {
      await this.fetchGroup(id, async data => {
        const arr = this.state.user.groups.filter(g => g.groupID != id);
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
          this.checkOutOfDiningCourt(() => this.setStatus(0, callback))
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
    ).catch(error => console.error(`setDietaryRestrictions : ${error}`));
  };

  checkIn = (courtId, callback) => {
    Alert.alert(
      "Check In",
      `What status would you like to have while you eat at ${courtId}?`,
      [
        {
          text: this.statusMessage[0],
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
        text: this.statusMessage[0],
        onPress: () =>
          this.checkOutOfDiningCourt(() => this.setStatus(0, callback))
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

  // status is an integer.
  setStatus = (status, callback) => {
    console.log(`set status to be ${this.statusMessage[status]}`);
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
          {
            text: "Cancel",
            onPress: 0
          },
          {
            text: "Ice cream machine is nonfunctional.",
            onPress: 1
          },
          {
            text: "Menu is inaccurate.",
            onPress: 1
          },
          {
            text: "Inadequate utensils.",
            onPress: 1
          },
          {
            text: "All dishes are paper and plastic.",
            onPress: 1
          }
        ]
      };

      render() {
        return (
          <Overlay
            overlayStyle={{ padding: 0 }}
            containerStyle={{ padding: 0, margin: 0 }}
            isVisible={this.state.visible}
          >
            <Card
              style={{ margin: -20 }}
              header={`Report at ${diningCourt}?`}
              footer={[
                {
                  text: "Submit",
                  onPress: () => {
                    switch (this.state.options[this.state.chosen].onPress) {
                      case 0:
                        break;
                      case 1:
                        reportMalfunction(
                          diningCourt,
                          this.state.options[this.state.chosen].text
                        );
                        break;
                      case 2:
                        busynessAlert();
                        break;
                    }
                    this.setState({
                      visible: false
                    });
                    if (callback) callback();
                  }
                }
              ]}
            >
              <Picker
                selectedValue={this.state.chosen}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({ chosen: itemValue });
                }}
              >
                {this.state.options.map((o, index) => {
                  return <Picker.Item label={o.text} value={index} />;
                })}
              </Picker>
            </Card>
          </Overlay>
        );
      }
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

      render() {
        return (
          <Overlay
            overlayStyle={{ padding: 0 }}
            containerStyle={{ padding: 0, margin: 0 }}
            isVisible={this.state.visible}
          >
            <Card
              style={{ margin: -20 }}
              header={`Busyness at ${diningCourt}?`}
              footer={[
                {
                  text: "Submit",
                  onPress: () => {
                    reportBusyness(diningCourt, this.state.chosen);
                    this.setState({
                      visible: false
                    });
                    if (callback) callback();
                  }
                }
              ]}
            >
              <Picker
                selectedValue={this.state.chosen}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({ chosen: itemValue });
                }}
              >
                {this.state.options.map((o, index) => {
                  return <Picker.Item label={o} value={index} />;
                })}
              </Picker>
            </Card>
          </Overlay>
        );
      }
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
    console.log(id);
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

  updateNotifications = notifications => {
    this.setState({
      user: {
        ...this.state.user,
        notifications
      }
    });
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
              setStatus: this.setStatus,
              checkIn: this.checkIn,
              checkOut: this.checkOut,
              updateDietaryRestrictions: this.updateDietaryRestrictions,
              updateNotifications: this.updateNotifications,
              reportAlert: this.reportAlert,
              busynessAlert: this.busynessAlert
            },
            globals: {
              statusMessage: this.statusMessage,
              busynessMessage: this.busynessMessage
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
