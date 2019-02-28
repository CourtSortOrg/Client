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
          return { Name: item, onPress: () => this.friendAlert(item) };
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
          return { Name: item, onPress: () => this.groupAlert(item) };
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

  removeNotificationFriend = id => {
    let n = this.state.notifications.splice();
    for (let i = 0; i < n.length; i++) {
      if (n[i].Name == "Friend Requests") {
        n[i].items = items.filter(req => req != id);
      }
    }

    this.setState({
      notifications: n
    });
  };

  removeNotificationGroup = id => {
    let n = this.state.notifications.splice();
    for (let i = 0; i < n.length; i++) {
      if (n[i].Name == "Group Invites") {
        n[i].items = items.filter(req => req != id);
      }
    }

    this.setState({
      notifications: n
    });
  };

  friendAlert = id => {
    Alert.alert("Friend Request", `Accept request from ${id}?`, [
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
    Alert.alert("Group Invite", `Join ${id} group?`, [
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
    ]);
  };

  acceptFriendRequest = id => {
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
          friendName: id
        })
      }
    )
      .then(data => {
        this.removeNotificationFriend(id);
        this.props.screenProps.functions.updateFriend(id, true);
      })
      .catch(error => console.log(`acceptFriendRequest: ${error}`));
  };

  denyFriendRequest = id => {
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
          friendName: id
        })
      }
    )
      .then(data => {
        this.removeNotificationFriend(id);
      })
      .catch(error => console.log(`denyFriendRequest: ${error}`));
  };

  acceptGroupInvitation = id => {
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
          groupId: id
        })
      }
    )
      .then(data => {
        console.log(data);
        this.removeNotificationGroup(id);
        this.props.screenProps.functions.updateGroup(id, true);
      })
      .catch(error => console.log(`acceptGroupInvitation: ${error}`));
  };

  denyGroupInvitation = id => {
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
          groupId: id
        })
      }
    )
      .then(data => {
        this.removeNotificationGroup(id);
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
              type: "element",
              renderElement: item => {
                return (
                  <ListItem
                    chevron
                    bottomDivider
                    title={item.Name}
                    onPress={() => item.onPress()}
                    topDivider
                  />
                );
              }
            }}
          />
        )}
      </Screen>
    );
  }
}
