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
      loadingNotifications: true,
      loadingGroups: true,
      loadingFriends: true,
      loadingWarnings: true,
      notifications: [],

      ...this.props.screenProps.user
    };
  }

  date = new Date();

  dateStr = `${this.date.getFullYear()}-${
    this.date.getMonth() + 1 < 10
      ? `0${this.date.getMonth() + 1}`
      : this.date.getMonth() + 1
  }-${
    this.date.getDate() < 10 ? `0${this.date.getDate()}` : this.date.getDate()
  }`;

  getNotifications = () => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/getNotifications",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userHandle: this.state.userHandle
        })
      }
    )
      .then(data => {
        let items = JSON.parse(data._bodyText);
        items.forEach(e => this.parseNotifications(e.type, e.id));

        this.setState(
          {
            loadingNotifications: false
          },
          () =>
            this.props.screenProps.functions.updateNotifications(
              this.state.notifications
            )
        );
        /*} catch (error) {
          console.error(
            `getIncomingFriendRequests: ${error}: ${data._bodyText}`
          );
        }*/
      })
      .catch(error => console.error(`getNotifications: ${error}`));
  };

  parseNotifications = (type, id) => {
    switch (type) {
      case "new friend":
        this.addNotification(this.newFriendNotification(id));
        break;
      case "new friend request":
        this.addNotification(this.newFriendRequestNotification(id));
        break;
      case "unfriended":
        this.addNotification(this.newUnfriendNotification(id));
        break;
      case "blocked":
        this.addNotification(this.newBlockedNotification(id));
        break;
      case "invited to group":
        this.addNotification(this.newGroupInvitationNotification(id));
        break;
      case "user joined group":
        this.addNotification(this.newGroupJoinNotification(id));
        break;
      case "user left group":
        this.addNotification(this.newGroupLeaveNotification(id));
        break;
      default:
        console.error(`invalid notification type: ${type}\nid: ${id}`);
    }
  };

  addNotification = item => {
    let arr = this.state.notifications.slice();
    let list = arr.find(l => l.date === item.date);
    if (list == undefined) {
      list = {
        date: this.dateStr,
        Name: this.dateStr,
        items: []
      };
      arr.push(list);
    } else {
      list.items = list.items.slice();
    }

    list.items.push(item);

    this.setState(
      {
        notifications: arr
      },
      () => console.log(this.state.notifications)
    );
  };

  removeNotification = id => {
    console.log(id);
    let n = this.state.notifications.slice();
    for (let i = 0; i < n.length; i++) {
      if (n[i].date == id.date) {
        n[i].items = n[i].items.filter(req => req.Name != id.Name);
      }
    }

    this.setState(
      {
        notifications: n
      },
      () =>
        this.props.screenProps.functions.updateNotifications(
          this.state.notifications
        )
    );
  };

  dismissNotification = id => {
    Alert.alert(`Dismiss notification?`, undefined, [
      {
        text: "Cancel"
      },
      {
        text: "No"
      },
      {
        text: "Yes",
        onPress: () => this.removeNotification(id)
      }
    ]);
  };

  newFriendRequestNotification = id => {
    id = {
      Name: `${id.friendName}  @${
        id.friendHandle
      }  would like to become friends`,
      id: id.friendHandle,
      date: this.dateStr,
      ...id
    };

    let obj = { ...id, onPress: () => this.friendAlert(id) };
    return obj;
  };

  newFriendNotification = id => {
    this.props.screenProps.functions.updateFriend(id.friendHandle, true);

    id = {
      Name: `${id.friendName} @${
        id.friendHandle
      } accepted your friend request.`,
      date: this.dateStr,
      ...id
    };
    let obj = { ...id, onPress: () => this.dismissNotification(id) };
    return obj;
  };

  newUnfriendNotification = id => {
    this.props.screenProps.functions.updateFriend(id.friendHandle, false);

    id = {
      Name: `${id.friendName} @${id.friendHandle} unfriended you.`,
      date: this.dateStr,
      ...id
    };
    let obj = { ...id, onPress: () => this.dismissNotification(id) };
    return obj;
  };

  newBlockedNotification = id => {
    this.props.screenProps.functions.updateFriend(id.friendHandle, false);

    id = {
      Name: `${id.userName} @${id.userHandle} blocked you.`,
      date: this.dateStr,
      ...id
    };

    let obj = { ...id, onPress: () => this.dismissNotification(id) };
    return obj;
  };

  newGroupJoinNotification = id => {
    this.props.screenProps.functions.updateGroup(id.groupID, true);

    id = {
      Name: `@${
        id.userHandle
      } joined the group: ${id.groupName}.`,
      date: this.dateStr,
      ...id
    };
    let obj = { ...id, onPress: () => this.dismissNotification(id) };
    return obj;
  };

  newGroupLeaveNotification = id => {
    this.props.screenProps.functions.updateGroup(id.groupID, true);

    id = {
      Name: `@${id.userHandle} has left the group: ${id.groupName}.`,
      date: this.dateStr,
      ...id
    };
    let obj = { ...id, onPress: () => this.dismissNotification(id) };
    return obj;
  };

  newGroupInvitationNotification = id => {
    id = {
      Name: `@${id.friendHandle} invited you to join ${id.groupName}`,
      id: this.groupID,
      date: this.dateStr,
      ...id
    };
    let obj = { ...id, onPress: () => this.groupAlert(id) };
    return obj;
  };

  /*
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
    Alert.alert("Friend Request", `Accept request from @${id.friendHandle}?`, [
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
    Alert.alert(
      "Group Invite",
      `Join group ${id.groupName} made by @${id.friendHandle}?`,
      [
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
          friendHandle: id.friendHandle
        })
      }
    )
      .then(data => {
        try {
          //JSON.parse(data._bodyText);
          this.removeNotification(id);
          this.props.screenProps.functions.updateFriend(id.friendHandle, true);
        } catch (error) {
          console.error(`acceptFriendRequest: ${error} -- ${data._bodyText}`);
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
          friendHandle: id.friendHandle
        })
      }
    )
      .then(data => {
        try {
          //JSON.parse(data._bodyText);
          this.removeNotification(id);
        } catch (error) {
          console.error(`denyFriendRequest: ${error}: ${data._bodyText}`);
        }
      })
      .catch(error => console.error(`denyFriendRequest: ${error}`));
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
          friendHandle: id.friendHandle,
          groupID: id.groupID
        })
      }
    )
      .then(data => {
        try {
          //JSON.parse(data._bodyText);
          this.removeNotification(id);
          this.props.screenProps.functions.updateGroup(id.groupID, true);
        } catch (error) {
          console.error(`acceptGroupInvitation: ${error}- ${data._bodyText}`);
        }
      })
      .catch(error => console.error(`acceptGroupInvitation: ${error}`));
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
          userHandle: this.state.id,
          friendHandle: id.friendHandle,
          groupID: id.groupID
        })
      }
    )
      .then(data => {
        try {
          //JSON.parse(data._bodyText);
          this.removeNotification(id);
        } catch (error) {
          console.error(`denyGroupInvitation: ${error}- ${data._bodyText}`);
        }
      })
      .catch(error => console.error(`denyGroupInvitation: ${error}`));
  };

  componentDidMount() {
    this.getNotifications();
    //this.getIncomingFriendRequests();
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
        refresh={() => this.getNotifications()}
      >
        {this.state.loadingNotifications ? (
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
