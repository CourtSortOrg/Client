import React from "react";
import { ActivityIndicator, Alert, FlatList } from "react-native";
import { ListItem } from "react-native-elements";

import Screen from "../Nav/Screen";
import List from "../components/List";
import ListElement from "../components/ListElement";

export default class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingNotifications: false
    };
    this.getNotifications();
  }

  getNotifications = () => {
    if (!this.state.loadingNotifications) {
      this.setState({
        loadingNotifications: true
      });
      this.props.screenProps.functions.updateNotifications(
        () =>
          this.setState({
            loadingNotifications: false
          }),
        false
      );
    }
  };

  render() {
    let notifications = [];
    if (this.props.screenProps.user != undefined)
      notifications = this.props.screenProps.user.notifications;

    return (
      <Screen
        screenProps={this.props.screenProps}
        title="Notifications"
        navigation={{ ...this.props.navigation }}
        backButton={false}
        noNotifications={true}
        refresh={() => this.getNotifications()}
      >
        {notifications.length > 0 ? (
          <List
            list={notifications}
            type="expandable"
            expand={true}
            subList={{
              list: "items",
              type: "element",
              renderElement: item => {
                return (
                  <ListItem
                    chevron
                    bottomDivider
                    title={item.props.Name}
                    onPress={() => item.props.onPress()}
                    topDivider
                  />
                );
              }
            }}
          />
        ) : (
          <ListElement Name="No new notifications" type="expandable" />
        )}
      </Screen>
    );
  }
}
