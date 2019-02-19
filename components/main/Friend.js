import React from "react";
import * as firebase from "firebase";
import { View, Alert, TouchableOpacity } from "react-native";

import Screen from "../Nav/Screen";
import List from "./List";
import Text from "../Nav/Text";
import Card from "../Nav/Card";
import Separator from "../Nav/Separator";

export default class Friend extends React.Component {
  constructor(props) {
    super(props);

    const user = firebase.auth().currentUser;

    var userData = require("../../testData/userData.json");
    var ratingData = require("../../testData/ratingData.json");
    var friendData = require("../../testData/friendData.json");

    var groupData = {
      groups: [
        {
          Name: "Group1",
          id: "1"
        },
        {
          Name: "Group2",
          id: "2"
        },
        {
          Name: "Group3",
          id: "3"
        },
        {
          Name: "Group4",
          id: "4"
        },
        {
          Name: "Group5",
          id: "5"
        }
      ]
    };

    let sharedGroups = [{ Name: "Shared Messages", groups: groupData.groups }]; //.filter(group => group.members.includes("USER") && group.members.includes(userData.name));

    this.state = {
      uid: user.uid,
      name: userData.name,
      initials: userData.initials,
      image: userData.image,
      groups: sharedGroups,
      status: "Not currently eating"
    };
  }

  componentWillMount() {
    this.setState({ otherUid: this.props.navigation.getParam("ID", "NO-ID") });
  }

  componentDidMount() {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/getUserProfile",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          otherUid: this.state.uid
        })
      }
    ).then(data => {
      this.setState({ ...JSON.parse(data._bodyText) });
    });
  }

  unFriend() {
    Alert.alert(
      "Unfriend",
      `You are about to unfriend ${
        this.state.name
      }. You will remain in shared groups, but to make a new group with ${
        this.state.name
      }, they will have to consent.`,
      [
        {
          text: "Yes",
          onPress: () => this.unFriendFirebaseFunction()
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

  block() {
    Alert.alert(
      "Block",
      `You are about to block ${
        this.state.name
      }. You will be removed from shared groups, and ${
        this.state.name
      } cannot send you any messages.`,
      [
        {
          text: "Yes",
          onPress: () => this.blockFirebaseFunction()
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

  unFriendFirebaseFunction() {
    console.log("Unfriend");
    fetch("https://us-central1-courtsort-e1100.cloudfunctions.net/blockUser", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        uid: this.state.uid,
        blockedUid: this.state.otherUid
      })
    }).then(data => console.log(data)).then(() => this.props.navigation.goBack());

    //TODO: success or error.
  }

  blockFirebaseFunction() {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/removeFriend",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          uid: this.state.uid,
          friendId: this.state.otherUid
        })
      }
    ).then(data => console.log(data)).then(() => this.props.navigation.goBack());

    //TODO: success or error.
  }

  render() {
    return (
      <Screen
        title="Friend"
        navigation={{ ...this.props.navigation }}
        backButton={true}
      >
        <Card
          header={this.state.name}
          footer={[
            { text: "Unfriend", onPress: () => this.unFriend() },
            { text: "Block", onPress: () => this.block() }
          ]}
        >
          <Text type="subHeader" style={{ padding: 8 }}>
            Status: {this.state.status}
          </Text>
          <Separator />
          <List
            navigation={this.props.navigation}
            list={this.state.groups}
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
