import React from "react";
import Screen from "../Nav/Screen";
import { Alert, Platform, Vibration } from "react-native";
import { Icon, ListItem } from "react-native-elements";
import * as firebase from "firebase";

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
  }

  signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.screenProps.functions.updateUser();
        this.props.navigation.navigate("Auth");
      })
      .catch(error => {
        alert(error.message);
        this.props.screenProps.functions.updateUser();
      });
  };

  deleteAccount = () => {
    // Use different Vibration schemes depending on the platform
    const pattern = Platform.IOS ? [0] : [0, 500];
    // Vibrate to 
    Vibration.vibrate(pattern);

    Alert.alert(
      "Delete Account?",
      "By selecting confirm, you will delete your account and all of the data associated with it",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Confirm", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );
  };

  tempdeleteAccount = () => {
    //TODO: Delete user's ratings
    //TODO: Remove user from all groups
    user = firebase.auth().currentUser;
    //get list of friends
    //get list of individual ratings
    user
      .delete()
      .then(() => {
        fetch(
          "https://us-central1-courtsort-e1100.cloudfunctions.net/removeFromAllFriends",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name: this.state.id
            })
          }
        ).then(data => console.log(data._bodyText));
        fetch(
          "https://us-central1-courtsort-e1100.cloudfunctions.net/removeUserFromDatabase",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name: this.state.id
            })
          }
        ).then(data => console.log(data._bodyText));
        //navigate to SignIn Screen
        this.props.screenProps.functions.updateUser();
        this.props.navigation.navigate("Auth");
      })
      .catch(function(error) {
        alert("ERROR: " + error.message);
        this.props.screenProps.functions.updateUser();
      });
  };

  render() {
    return (
      <Screen
        title="Settings"
        navigation={{ ...this.props.navigation }}
        backButton={true}
      >
        <ListItem
          title="Edit Profile"
          subtitle="Make changes to your profile"
          leftIcon={<Icon name="edit" />}
          onPress={() => {
            this.props.navigation.navigate("EditProfile");
          }}
          topDivider
          bottomDivider
          chevron
        />
        <ListItem
          title="Blocked Users"
          subtitle="View and edit your blocked users"
          leftIcon={<Icon name="block" />}
          onPress={() => {}}
          topDivider
          bottomDivider
          chevron
        />
        <ListItem
          title="Sign Out"
          subtitle="Sign out of your account"
          leftIcon={<Icon name="log-out" type="feather" />}
          onPress={this.signOut}
          topDivider
          bottomDivider
        />
        <ListItem
          title="Delete Account"
          subtitle="Delete your account and all your data"
          leftIcon={<Icon name="delete-forever" color="darkred" />}
          onPress={this.deleteAccount}
          titleStyle={{ color: "darkred" }}
          subtitleStyle={{ color: "darkred" }}
          topDivider
          bottomDivider
        />
      </Screen>
    );
  }
}
