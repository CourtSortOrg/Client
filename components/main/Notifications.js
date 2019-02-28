import React from "react";
import { ActivityIndicator, Alert, FlatList } from "react-native";
import { ListItem } from "react-native-elements";
import * as firebase from "firebase";

import Screen from "../Nav/Screen";
import List from "../components/List";

export default class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingGroups: false,
      loadingFriends: true,
      notifications: [],

      ...this.props.screenProps.user
    };
  }

  getIncomingFriendRequests = () => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/getIncomingFriendRequests",
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
    )
      .then(data => {
        const arr = this.state.notifications.slice();
        const items = [...JSON.parse(data._bodyText)].map(item => {
          return { Name: item };
        });

        if (items.length != 0) {
          arr.push({
            Name: "Friend Requests",
            items: items
          });

          this.setState({
            notifications: arr,
            loadingFriends: false
          });
        }
      })
      .catch(error => `getIncomingFriendRequests: ${error}`);
  };

  getGroupInvites = () => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/getGroupInvites",
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
        const arr = this.state.notifications.slice();
        const items = [...JSON.parse(data._bodyText)].map(item => {
          return { Name: item };
        });
        if (items.length != 0) {
          arr.push({
            Name: "Group Invites",
            items: items
          });

          this.setState({
            notifications: arr,
            loadingGroups: false
          });
        }
      })
      .catch(error => `getGroupInvites: ${error}`);
  };

  removeNotification = index => {
    var array = [...this.state.notifications]; // make a separate copy of the array
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ notifications: array });
    }
  };

  acceptFriendRequest = (friend, index) => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/acceptFriendRequest",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: this.state.id,
          friendName: friend
        })
      }
    )
      .then(data => {
        this.removeNotification(index);
        this.props.screenProps.functions.updateFriend(data, true);
      })
      .catch(error => console.log(`acceptFriendRequest: ${error}`));
  };

  denyFriendRequest = (friend, index) => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/denyFriendRequest",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: this.setState.id,
          friendName: friend
        })
      }
    )
      .then(data => {
        this.removeNotification(index);
      })
      .catch(error => console.log(`denyFriendRequest: ${error}`));
  };

  acceptGroupInvitation = (group, index) => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/acceptGroupInvitation",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userHandle: this.state.id,
          groupId: group
        })
      }
    )
      .then(data => {
        this.removeNotification(index);
        this.props.screenProps.functions.updateGroup(data, true);
      })
      .catch(error => console.log(`acceptGroupInvitation: ${error}`));
  };

  denyGroupInvitation = (group, index) => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/denyGroupInvitation",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userHandle: this.setState.id,
          groupId: group
        })
      }
    )
      .then(data => {
        this.removeNotification(index);
      })
      .catch(error => console.log(`denyGroupInvitation: ${error}`));
  };

  componentDidMount() {
    this.getIncomingFriendRequests();
    //this.getGroupInvites();
    //this.getGroupEvents();
    //this.getDiningCourtNotifications();
  }

  render() {
    return (
      <Screen
        title="Notifications"
        navigation={{ ...this.props.navigation }}
        backButton={false}
      >
        {this.state.loadingGroups || this.state.loadingFriends ? (
          <ActivityIndicator size="large" color="#e9650d" />
        ) : (
          <List
            list={this.state.notifications}
            type="expandable"
            expanded={true}
            subList={{
              list: "items",
              type: "element"
            }}
          />
        )}
      </Screen>
    );
  }
}
