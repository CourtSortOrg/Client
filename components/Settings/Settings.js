import React from "react";
import { Alert, Platform, Switch, Vibration } from "react-native";
import { Icon, ListItem } from "react-native-elements";
import DialogInput from "react-native-dialog-input";

import { Permissions } from "expo";

import { auth } from "firebase";

import Screen from "../Nav/Screen";

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props.screenProps.user,
      showPasswordReset: false
    };
  }

  displayPasswordReset = display => {
    this.setState({ showPasswordReset: display });
  };

  submitPasswordReset = async email => {
    // Hide the TextInput Dialog
    this.displayPasswordReset(false);
    // Check if the current user is a third party account
    if (auth().currentUser.providerData[0].providerId != "password") {
      // Alert the user that they cannot reset a third party account's password
      Alert.alert(
        "Password Reset Error",
        "Can't reset the password of a third party account"
      );
    } else if (/[^@]+@[^\.]+\..+$/.test(email)) {
      // If the email matches the email regex
      try {
        // Send the reset email
        await auth().sendPasswordResetEmail(email);
        // Alert the user that the email was sent and sign them out
        Alert.alert(
          "Password Reset Email Sent",
          `An email has been sent to ${email}. You will be signed out`,
          [{ text: "OK", onPress: this.signOut }]
        );
      } catch (error) {
        // Alert any errors when sending a reset email
        alert(error.message);
      }
    } else {
      // The email doesn't match the regex so no action is taken
      Alert.alert("Invalid Email", "Please enter a valid email address");
    }
  };

  signOut = async () => {
    try {
      // Sign out the user on the backend
      await auth().signOut();
      // Remove stored user information and navigate them to the sign in screen
      this.props.screenProps.functions.updateUser(false, undefined, () =>
        this.props.navigation.navigate("Auth")
      );
    } catch (error) {
      // Alert any errors when signing the user out
      alert(error.message);
    }
  };

  // TODO: Refactor this function
  deleteAccount = () => {
    // Use different Vibration schemes depending on the platform
    const pattern = Platform.IOS ? [0] : [0, 500];
    // Vibrate to the pattern
    Vibration.vibrate(pattern);

    Alert.alert(
      "Delete Account?",
      "By selecting confirm, you will delete your account and all of the data associated with it",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Confirm",
          onPress: () => {
            user = auth().currentUser;
            user
              .delete()
              .then(async () => {
                await fetch(
                  "https://us-central1-courtsort-e1100.cloudfunctions.net/removeFromAllFriends",
                  {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      userHandle: this.state.id
                    })
                  }
                )
                  .then(data => {
                    try {
                      //JSON.parse(data._bodyText);
                      console.log(
                        `deleteAccount: removeFromAllFriends: Successful: ${
                          data._bodyText
                        }`
                      );
                    } catch (error) {
                      console.error(
                        `deleteAccount: removeFromAllFriends: ${error}: ${
                          data._bodyText
                        }`
                      );
                    }
                  })
                  .catch(error =>
                    console.error(
                      `deleteAccount: removeFromAllFriends: ${error}`
                    )
                  );
                await fetch(
                  "https://us-central1-courtsort-e1100.cloudfunctions.net/removeUserFromDatabase",
                  {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      userHandle: this.state.id
                    })
                  }
                )
                  .then(data => {
                    try {
                      //JSON.parse(data._bodyText);
                      console.log(
                        `deleteAccount: removeUserFromDatabase: Successful: ${
                          data._bodyText
                        }`
                      );
                    } catch (error) {
                      console.error(
                        `deleteAccount: removeUserFromDatabase: ${error}: ${
                          data._bodyText
                        }`
                      );
                    }
                  })
                  .catch(error =>
                    console.error(
                      `deleteAccount: removeUserFromDatabase: ${error}`
                    )
                  );
                //navigate to SignIn Screen
                this.props.screenProps.functions.updateUser(
                  false,
                  undefined,
                  () => this.props.navigation.navigate("Auth")
                );
              })
              .catch(function(error) {
                alert("Firebase Delete User: " + error.message);
                this.props.screenProps.functions.updateUser(
                  false,
                  undefined,
                  () => this.props.navigation.navigate("Auth")
                );
              });
          }
        }
      ]
    );
  };

  toggleLocationTracking = async toggle => {
    if (toggle) {
      const { status } = await Permissions.getAsync(Permissions.LOCATION);
      if (status !== "granted") {
        const { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== "granted") {
          Alert.alert(
            "Permission Error",
            "Please allow location permissions in the settings"
          );
          return;
        }
      }
    }
    await this.setState({
      locationTracking: !this.state.locationTracking
    });
    this.props.screenProps.functions.toggleLocationTracking(() => {
      this.props.screenProps.functions.getLocationTracking();
    });
  };

  render() {
    // Use a different icon based on whether location tracking is on or off
    let locationIcon = this.state.locationTracking
      ? "location-on"
      : "location-off";

    return (
      <Screen
        title="Settings"
        screenProps={this.props.screenProps}
        navigation={{ ...this.props.navigation }}
        backButton={true}
      >
        {/* A ListItem that navigates the user to EditProfile */}
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

        {/* A ListItem that navigates the user to BlockedUsers */}
        <ListItem
          title="Blocked Users"
          subtitle="View and manage your blocked users"
          leftIcon={<Icon name="block" />}
          onPress={() => {
            this.props.navigation.navigate("BlockedUsers");
          }}
          topDivider
          bottomDivider
          chevron
        />

        {/* A ListItem that toggles location tracking*/}
        <ListItem
          title="Track Location"
          subtitle="Use location tracking"
          leftIcon={<Icon name={locationIcon} />}
          rightElement={
            <Switch
              value={this.state.locationTracking}
              onValueChange={this.toggleLocationTracking}
            />
          }
          topDivider
          bottomDivider
        />

        {/* A ListItem that clears all the user dish ratings */}
        {/* TODO: Implement functionality */}
        <ListItem
          title="Clear Ratings"
          subtitle="Delete your account's ratings"
          leftIcon={<Icon name="food-off" type="material-community" />}
          onPress={() => {
            this.props.navigation.navigate("TestLocation");
          }}
          topDivider
          bottomDivider
        />

        {/* A ListItem that using a TextInput, prompts for an email to reset the users password */}
        <ListItem
          title="Reset Password"
          subtitle="Send an email to reset your password"
          leftIcon={<Icon name="lock-reset" type="material-community" />}
          onPress={() => {
            this.displayPasswordReset(true);
          }}
          topDivider
          bottomDivider
        />

        {/* A DialogInput that displays a TextInput to enter the user email */}
        <DialogInput
          isDialogVisible={this.state.showPasswordReset}
          title={"Submit email"}
          hintInput={"Email Address"}
          submitInput={inputText => {
            this.submitPasswordReset(inputText);
          }}
          closeDialog={() => {
            this.displayPasswordReset(false);
          }}
        />

        {/* A ListItem that signs the user out */}
        <ListItem
          title="Sign Out"
          subtitle="Sign out of your account"
          leftIcon={<Icon name="log-out" type="feather" />}
          onPress={this.signOut}
          topDivider
          bottomDivider
        />

        {/* A ListItem that deletes the user */}
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
