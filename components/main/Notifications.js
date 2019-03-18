import React from "react";
import { ActivityIndicator, Alert, FlatList } from "react-native";
import { ListItem } from "react-native-elements";
import * as firebase from "firebase";

import Screen from "../Nav/Screen";
import List from "../components/List";
import ListElement from "../components/ListElement";

export default class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingGroups: true,
      loadingFriends: true,
      loadingWarnings: true,
      notifications: [],

      ...this.props.screenProps.user
    };
  }

  getNotifications = () => {};

  parseNotifications = (type, id) => {
    switch (type) {
      case "new friend":
        addNotification(newFriendNotification(id));
        break;
      case "new friend request":
        break;
      case "unfriended":
        addNotification(newUnfriendNotification(id));
        break;
      case "blocked":
        addNotification(newBlockedNotification(id));
      case "invited to group":
        break;
      case "user joined group":
        addNotification(newGroupJoinNotification(id));
        break;
      case "user left group":
        addNotification(newGroupLeaveNotification(id));
        break;
      default:
        console.error(`invalid notification type: ${type}\nid: ${id}`);
    }
  };

  addNotification = item => {};

  removeNotification = (list, id) => {
    let n = this.state.notifications.slice();
    for (let i = 0; i < n.length; i++) {
      if (n[i].Name == list) {
        n[i].items = n[i].items.filter(req => req.id != id);
      }
    }

    this.setState({
      notifications: n
    });
  }

  dismissNotification = id => {
    Alert.alert(`Dismiss notification?`, [
      {
        text: "Cancel"
      },
      {
        text: "No"
      },
      {
        text: "Yes",
        onPress: () => this.removeNotification(list, id)
      }
    ]);
  };

  newFriendRequestNotification = id => {
    return {
      Name: `${id.friendName}  @${
        id.friendHandle
      } would like to become friends`,
      id: friendHandle,
      ...item,
      onPress: () => this.friendAlert(id.friendHandle)
    };
  };

  newFriendNotification = id => {
    return {
      Name: `${id.friendName} @${
        id.friendHandle
      } accepted your friend request.`,
      ...id,
      onPress: () => this.dismissNotification(id)
    };
  };

  newUnfriendNotification = id => {
    return {
      Name: `${id.friendName} @${id.friendHandle} unfriended you.`,
      ...id,
      onPress: () => this.dismissNotification(id)
    };
  };

  newBlockedNotification = id => {
    return {
      Name: `${id.userName} @${id.userHandle} blocked you.`,
      ...id,
      onPress: () => this.dismissNotification(id)
    };
  };

  newGroupJoinNotification = id => {
    return {
      Name: `@${
        id.userHandle
      } accepted your group invitation to join the group: ${id.groupName}.`,
      ...id,
      onPress: () => this.dismissNotification(id)
    };
  };

  newGroupLeaveNotification = id => {
    return {
      Name: `@${id.userHandle} has left the group: ${id.groupName}.`,
      ...id,
      onPress: () => this.dismissNotification(id)
    };
  };

  newGroupInvitationNotification = id => {
    return {
      Name: `@${id.friendHandle} invited you to join ${id.groupName}`,
      id: groupID,
      ...id,
      onPress: () => this.groupAlert(id.groupName, id.groupID, id.friendHandle)
    };
  };

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
          userHandle: this.state.id
        })
      }
    )
      .then(data => {
        //try {
        const arr = this.state.notifications.slice();
        let items = JSON.parse(data._bodyText);
        items = items.map(item => newFriendRequestNotification(item));

        if (items.length != 0) {
          arr.push({
            Name: "Friend Requests",
            items: items
          });
          this.setState({
            notifications: arr
          });
        }
        this.setState({
          loadingFriends: false
        });
        /*} catch (error) {
          console.error(
            `getIncomingFriendRequests: ${error}: ${data._bodyText}`
          );
        }*/
      })
      .catch(error => console.error(`getIncomingFriendRequests: ${error}`));
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
        try {
          console.log(data._bodyText);
          const arr = this.state.notifications.slice();
          const items = [...JSON.parse(data._bodyText)].map(item =>
            newGroupInvitationNotification(item)
          );

          if (items.length != 0) {
            arr.push({
              Name: "Group Invites",
              items: items
            });

            this.setState({
              notifications: arr
            });
          }

          this.setState({
            loadingGroups: false
          });
        } catch (error) {
          console.error(`getGroupInvites: ${error}: ${data._bodyText}`);
        }
      })
      .catch(error => console.error(`getGroupInvites: ${error}`));
  };

  getDiningCourtNotifications = () => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/getDiningCourtNotifications",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify()
      }
    )
      .then(data => {
        try {
          console.log(data._bodyText);
          const arr = this.state.notifications.slice();
          const items = [...JSON.parse(data._bodyText)].map(item => {
            return {
              Name: `${item.diningCourtNotification}`,
              ...item,
              onPress: () =>
                Alert.alert("Warning", item.diningCourtNotification)
            };
          });
          if (items.length != 0) {
            arr.push({
              Name: "Dining Court Warnings",
              items: items
            });

            this.setState({
              notifications: arr
            });
          }

          this.setState({
            loadingWarnings: false
          });
        } catch (error) {
          console.error(
            `getDiningCourtNotifications: ${error} - ${data._bodyText}`
          );
        }
      })
      .catch(error => console.error(`getDiningCourtNotifications: ${error}`));
  };

/*
  removeNotificationFriend = id => {
    let n = this.state.notifications.slice();
    for (let i = 0; i < n.length; i++) {
      if (n[i].Name == "Friend Requests") {
        n[i].items = n[i].items.filter(req => req.friendHandle != id);
      }
    }

    this.setState({
      notifications: n
    });
  };

  removeNotificationGroup = id => {
    let n = this.state.notifications.slice();
    for (let i = 0; i < n.length; i++) {
      if (n[i].Name == "Group Invites") {
        n[i].items = n[i].items.filter(req => req.groupID != id);
      }
    }

    this.setState({
      notifications: n
    });
  };
*/

  friendAlert = id => {
    Alert.alert("Friend Request", `Accept request from @${id}?`, [
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

  groupAlert = (groupName, groupID, friendHandle) => {
    Alert.alert(
      "Group Invite",
      `Join group ${groupName} made by @${friendHandle}?`,
      [
        {
          text: "Cancel"
        },
        {
          text: "Deny",
          onPress: () => this.denyGroupInvitation(groupID, friendHandle)
        },
        {
          text: "Accept",
          onPress: () => this.acceptGroupInvitation(groupID, friendHandle)
        }
      ]
    );
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
          userHandle: this.state.id,
          friendHandle: id
        })
      }
    )
      .then(data => {
        try {
          //JSON.parse(data._bodyText);
          this.removeNotification("Friend Requests", id);
          this.props.screenProps.functions.updateFriend(id, true);
        } catch (error) {
          console.error(`acceptFriendRequest: ${error}: ${data._bodyText}`);
        }
      })
      .catch(error => console.error(`acceptFriendRequest: ${error}`));
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
          userHandle: this.state.id,
          friendHandle: id
        })
      }
    )
      .then(data => {
        try {
          //JSON.parse(data._bodyText);
          this.removeNotification("Friend Requests", id);
        } catch (error) {
          console.error(`denyFriendRequest: ${error}: ${data._bodyText}`);
        }
      })
      .catch(error => console.error(`denyFriendRequest: ${error}`));
  };

  acceptGroupInvitation = (groupID, friendHandle) => {
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
          friendHandle: friendHandle,
          groupID: groupID
        })
      }
    )
      .then(data => {
        try {
          //JSON.parse(data._bodyText);
          this.removeNotification("Group Invites", id);
          this.props.screenProps.functions.updateGroup(groupID, true);
        } catch (error) {
          console.error(`acceptGroupInvitation: ${error}- ${data._bodyText}`);
        }
      })
      .catch(error => console.error(`acceptGroupInvitation: ${error}`));
  };

  denyGroupInvitation = (groupID, friendHandle) => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/denyGroupInvitation",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userHandle: this.state.id,
          friendHandle: friendHandle,
          groupID: groupID
        })
      }
    )
      .then(data => {
        try {
          //JSON.parse(data._bodyText);
          this.removeNotification("Group Invites", id);
        } catch (error) {
          console.error(`denyGroupInvitation: ${error}- ${data._bodyText}`);
        }
      })
      .catch(error => console.error(`denyGroupInvitation: ${error}`));
  };

  componentDidMount() {
    this.getIncomingFriendRequests();
    this.getGroupInvites();
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
        ) : this.state.notifications.length > 0 ? (
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
