import React from "react";
import { ActivityIndicator, Alert, FlatList } from "react-native";
import { ListItem } from "react-native-elements";
import * as firebase from "firebase";

import Screen from "../Nav/Screen";

export default class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      friendRequests: [],

      ...this.props.screenProps.user
    };
  }

  removeFriendRequest = index => {
    var array = [...this.state.friendRequests]; // make a separate copy of the array
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ friendRequests: array });
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
        this.removeFriendRequest(index);
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
        //TODO: Error checking
        this.removeFriendRequest(index);
      })
      .catch(error => console.log(`denyFriendRequest: ${error}`));
  };

  componentDidMount() {
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
        this.setState({
          friendRequests: JSON.parse(data._bodyText),
          loading: false
        });
      })
      .catch(error => `componentDidMount: getIncomingFriendRequests: ${error}`);
  }

  render() {
    return (
      <Screen
        title="Notifications"
        navigation={{ ...this.props.navigation }}
        backButton={false}
      >
        {this.state.loading ? (
          <ActivityIndicator size="large" color="#e9650d" />
        ) : (
          <FlatList
            data={this.state.friendRequests}
            keyExtractor={(item, index) => index.toString()}
            renderItem={item => {
              return (
                <ListItem
                  title={"Friend Request from " + item.item}
                  topDivider
                  bottomDivider
                  onPress={() => {
                    Alert.alert(
                      "Friend Request",
                      `Accept request from ${item.item}?`,
                      [
                        {
                          text: "Cancel"
                        },
                        {
                          text: "Deny",
                          onPress: () =>
                            this.denyFriendRequest(item.item, item.index)
                        },
                        {
                          text: "Accept",
                          onPress: () =>
                            this.acceptFriendRequest(item.item, item.index)
                        }
                      ]
                    );
                  }}
                />
              );
            }}
          />
        )}
      </Screen>
    );
  }
}
