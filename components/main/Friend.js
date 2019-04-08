import React from "react";
import * as firebase from "firebase";
import { View, Alert, TouchableOpacity } from "react-native";
import { Icon, ButtonGroup } from "react-native-elements";

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
    const friend = this.props.screenProps.user.friends.find(
      friend => friend.userHandle === this.state.otherUser.userHandle
    );

    this.setState({ friend: friend !== undefined });
    
    if (friend !== undefined) {
      this.props.screenProps.functions.updateFriend(
        this.state.otherUser.userHandle,
        true,
        () =>
          this.setState({
            otherUser: this.props.screenProps.user.friends.find(
              friend => friend.userHandle === this.state.otherUser.userHandle
            )
          })
      );
    } else {
      this.props.screenProps.functions.fetchFriend(
        this.state.otherUser.userHandle,
        data =>
          this.setState({
            otherUser: { ...this.state.otherUser, ...data }
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
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  }

  addFriend() {
    Alert.alert(
      "Friend",
      `You are about to friend ${this.state.otherUser.userName}.`,
      [
        {
          text: "Yes",
          onPress: () => this.sendFriendRequest()
        },
        {
          text: "No",
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
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  }

  // Copied from AddUser.js
  sendFriendRequest = () => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/sendFriendRequest",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userHandle: this.state.userHandle,
          friendHandle: this.state.otherUser.userHandle
        })
      }
    )
      .then(data => {
        //console.error(`sendFriendRequest: Successful: ${data._bodyText}`);
        if (data._bodyText == "success")
          Alert.alert(
            "Friend Request",
            `You sent a friend request to ${this.state.otherUser.userHandle}.`,
            [
              {
                text: "Ok"
              }
            ],
            { cancelable: false }
          );
        else
          Alert.alert(
            "Friend Request",
            `Friend request to ${
              this.state.otherUser.userHandle
            } could not be sent.`,
            [
              {
                text: "Ok"
              }
            ],
            { cancelable: false }
          );
      })
      .catch(error => console.error(`sendFriendRequest: ${error}`));
  };

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
          userHandle: this.state.userHandle,
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
        userHandle: this.state.userHandle,
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

  // Method to change the user's current status
  inviteOrJoin = status => {
    if(status == 0) {
      // Invite them to eat
      console.log("Invite to eat");
      //TODO: this.inviteToEat();
    } else {
      // Join them
      console.log("Join friend");
      //TODO: this.joinFriend();
    }
  };

  // Calls firebase function to send an invite to the user's friend in order to get them to join the user to eat
  // TODO: Verify that the firebase function exists and works
  inviteToEat = () => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/inviteToEat",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userHandle: this.state.userHandle,
          friendHandle: this.state.otherUser.userHandle
        })
      }
    )
      .then(data => {
        if (data._bodyText == "success")
          Alert.alert(
            "Success",
            `You sent an invite to ${this.state.otherUser.userHandle}.`,
          );
        else
          Alert.alert(
            "Error",
            "Invite could not be sent"
          );
      })
      .catch(error => console.error(`inviteToEat: ${error}`));
  }

  // Calls firebase function to send a request for the user to join a friend who is currently eating
  // TODO: Verify that the firebase function exists and works
  joinFriend = () => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/joinFriend",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userHandle: this.state.userHandle,
          friendHandle: this.state.otherUser.userHandle
        })
      }
    )
      .then(data => {
        if (data._bodyText == "success")
          Alert.alert(
            "Success",
            `You will join ${this.state.otherUser.userHandle} to eat.`,
          );
        else
          Alert.alert(
            "Error"
          );
      })
      .catch(error => console.error(`joinFriend: ${error}`));
  }

  render() {
    const statusColor = ["#0F0", "#FF0", "#F00"];
    const eatingButtons = ["Invite to eat", "Join friend"];
    return (
      <Screen
        screenProps={this.props.screenProps}
        title={this.state.friend ? "Friend" : "Stranger"}
        navigation={{ ...this.props.navigation }}
        backButton={true}
      >
        <Card
          header={this.state.otherUser.userName}
          footer={[
            {
              text: this.state.friend ? "Unfriend" : "Friend",
              onPress: () =>
                this.state.friend ? this.removeFriend() : this.addFriend()
            },
            { text: "Block", onPress: () => this.blockUser() }
          ]}
        >
          <Text type="subHeader" style={{ padding: 8 }}>
            {"Status: "}
            {
              this.props.screenProps.globals.statusMessage[
                this.state.otherUser.status
              ]
            }
          </Text>
          <Text type="subHeader" style={{ padding: 8 }}>
            {"Location: "}
            {this.state.otherUser.location
              ? this.state.otherUser.location
              : " Not Currently Eating"}
          </Text>
          <Separator />
          {/* Button group for joining a friend already eating or inviting a friend to eat with the user*/}
          <ButtonGroup
            onPress={this.inviteOrJoin}
            buttons={eatingButtons}
            containerStyle={{ height: 60 }}
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
