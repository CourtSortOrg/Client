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
          onPress={() => {
            this.props.navigation.navigate("EditProfile");
          }}
          subtitle="Make changes to your profile"
          topDivider
          bottomDivider
          chevron
          leftIcon={<Icon name="edit" />}
        />
        <ListItem
          title="Blocked Users"
          subtitle="View and edit your blocked users"
          topDivider
          bottomDivider
          chevron
          leftIcon={<Icon name="block" />}
        />
        <ListItem
          title="Sign Out"
          subtitle="Sign out of your account"
          topDivider
          bottomDivider
          leftIcon={<Icon name="log-out" type="feather" />}
        />
        <ListItem
          title="Delete Account"
          subtitle="Delete your account and all your data"
          topDivider
          bottomDivider
          leftIcon={<Icon name="delete-forever" />}
        />
      </Screen>
    );
  }
}
