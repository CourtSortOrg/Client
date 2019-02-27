import React from "react";
import Screen from "../Nav/Screen";
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
        //go back to SignIn screen
      })
      .catch(error => {
        alert(error.message);
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
          leftIcon={<Icon name="delete-forever" />}
          onPress={() => {}}
          topDivider
          bottomDivider
        />
      </Screen>
    );
  }
}
