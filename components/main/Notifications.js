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
      loadingNotifications: false,
      notifications: this.props.screenProps.user.notifications
    };
  }

  componentDidMount = () => {
    this.getNotifications(() => console.log(this.props.screenProps.user.notifications));
    this.props.navigation.addListener("willFocus", () => {
      this.setState({
        notifications: this.props.screenProps.user.notifications
      });
    });
  };

  componentDidUpdate = prevProps => {
    // Typical usage (don't forget to compare props):
    if (
      this.props.screenProps.user.notifications !==
      prevProps.screenProps.user.notifications
    ) {
      this.setState({
        notifications: this.props.screenProps.user.notifications
      });
    }
  };

  getNotifications = () => {
    if (!this.state.loadingNotifications) {
      this.setState({
        loadingNotifications: true
      });
      this.props.screenProps.functions.updateNotifications(() =>
        this.setState({
          loadingNotifications: false
        }), false
      );
    }
  };

  render() {
    return (
      <Screen
        screenProps={this.props.screenProps}
        title="Notifications"
        navigation={{ ...this.props.navigation }}
        backButton={false}
        noNotifications={true}
        refresh={() => this.getNotifications()}
      >
        {this.state.notifications.length > 0 ? (
          <List
            list={this.state.notifications}
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
