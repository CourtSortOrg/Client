import React from "react";
import Screen from "../Nav/Screen";
import { Icon, ListItem } from "react-native-elements";

export default class Settings extends React.Component {
  constructor(props) {
    super(props);
  }

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
          onPress={() => {}}
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
