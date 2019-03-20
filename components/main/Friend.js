import React from "react";
import * as firebase from "firebase";
import { View, Alert, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";

import Screen from "../Nav/Screen";
import List from "../components/List";
import Text from "../components/Text";
import Card from "../components/Card";
import Separator from "../components/Separator";

export default class Friend extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      otherUser: {
        userHandle: this.props.navigation.getParam("ID", "NO-ID")
      },
      initials: "",
      groups: [],

      ...this.props.screenProps.user
    };
  }

  componentDidMount() {
    const friend = this.props.screenProps.user.friends.filter(
      friend => friend.userHandle === this.state.otherUser.userHandle
    );
    if (friend.length == 1)
      this.setState({
        otherUser: { ...friend[0] }
      });
    else {
      console.log("Refetching friend");
      this.props.screenProps.functions.fetchFriend(
        this.state.otherUser.userHandle,
        data =>
          this.setState({
            otherUser: { ...this.state.otherUser, ...data }
            //groups: this.state.user.groups.filter(group => group.members.includes(data.id))
          })
      );
    }
  }

  removeFriend() {
    Alert.alert(
      "Unfriend",
      `You are about to unfriend ${
        this.state.otherUser.userName
      }. You will remain in shared groups, but to make a new group with ${
        this.state.otherUser.userName
      }, they will have to consent.`,
      [
        {
          text: "Yes",
          onPress: () => this.removeFriendFirebaseFunction()
        },
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  }

  blockUser() {
    Alert.alert(
      "Block",
      `You are about to block ${
        this.state.otherUser.userName
      }. You will be removed from shared groups, and ${
        this.state.otherUser.userName
      } cannot send you any messages.`,
      [
        {
          text: "Yes",
          onPress: () => this.blockUserFirebaseFunction()
        },
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  }

  removeFriendFirebaseFunction() {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/removeFriend",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userHandle: this.state.id,
          friendHandle: this.state.otherUser.userHandle
        })
      }
    )
      .then(data => {
        try {
          //JSON.parse(data._bodyText);
          this.props.screenProps.functions.updateFriend(
            this.state.otherUser.userHandle,
            false
          );
          this.props.navigation.goBack();
        } catch (error) {
          console.error(
            `removeFriendFirebaseFunction: ${error}: ${data._bodyText}`
          );
        }
      })
      .catch(error => console.error(`removeFriendFirebaseFunction: ${error}`));
  }

  blockUserFirebaseFunction() {
    fetch("https://us-central1-courtsort-e1100.cloudfunctions.net/blockUser", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userHandle: this.state.id,
        blockedHandle: this.state.otherUser.userHandle
      })
    })
      .then(data => {
        try {
          //JSON.parse(data._bodyText);
          this.props.screenProps.functions.updateFriend(
            this.state.otherUser.userHandle,
            false
          );
          this.props.navigation.goBack();
        } catch (error) {
          console.error(
            `blockUserFirebaseFunction: ${error}: ${data._bodyText}`
          );
        }
      })
      .catch(error => console.error(`blockUserFirebaseFunction: ${error}`));
  }

  render() {
    const statusColor = ["#0F0", "#FF0", "#F00"];
    return (
      <Screen
        title="Friend"
        navigation={{ ...this.props.navigation }}
        backButton={true}
      >
        <Card
          header={this.state.otherUser.userName}
          footer={[
            { text: "Unfriend", onPress: () => this.removeFriend() },
            { text: "Block", onPress: () => this.blockUser() }
          ]}
        >
          <Text type="subHeader" style={{ padding: 8 }}>
            Status: {this.state.otherUser.status}
          </Text>
          <Icon
            reverse
            color={statusColor[this.state.otherUser.status]}
            size="5"
          />
          <Separator />
          <List
            navigation={this.props.navigation}
            list={[]}
            type={"expandable"}
            expand={true}
            rank={0}
            subList={{
              list: "groups",
              type: "element",
              subList: false,
              viewMore: { page: "Message", item: "ID" }
            }}
          />
        </Card>
      </Screen>
    );
  }
}
