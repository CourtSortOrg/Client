import React from "react";
import * as firebase from "firebase";
import { View, Alert, TouchableOpacity } from "react-native";

import Screen from "../Nav/Screen";
import List from "../components/List";
import Text from "../components/Text";
import Card from "../components/Card";
import Separator from "../components/Separator";

export default class Friend extends React.Component {
  constructor(props) {
    super(props);

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
      otherUser: {
        id: this.props.navigation.getParam("ID", "NO-ID")
      },
      initials: userData.initials,
      image: userData.image,
      groups: sharedGroups,
      status: "Not currently eating",

      ...this.props.screenProps.user
    };
  }

  componentDidMount() {
    this.props.screenProps.functions.fetchUser(this.state.otherUser.id, data =>
      this.setState({
        otherUser: { ...this.state.otherUser, ...data }
      })
    );
  }

  unFriend() {
    Alert.alert(
      "Unfriend",
      `You are about to unfriend ${
        this.state.otherUser.name
      }. You will remain in shared groups, but to make a new group with ${
        this.state.otherUser.name
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
        this.state.otherUser.name
      }. You will be removed from shared groups, and ${
        this.state.otherUser.name
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
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/removeFriend",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: this.state.id,
          friendName: this.state.otherUser.id
        })
      }
    )
      .then(data => console.log(data._bodyText))
      .then(() => {
        this.props.screenProps.functions.updateFriends(
          this.state.otherUser.id,
          false
        );
        this.props.navigation.goBack();
      });

    //TODO: success or error.
  }

  blockFirebaseFunction() {
    fetch("https://us-central1-courtsort-e1100.cloudfunctions.net/blockUser", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: this.state.id,
        blockedName: this.state.otherUser.id
      })
    })
      .then(data => console.log(data))
      .then(() => {
        this.props.screenProps.functions.updateFriends(
          this.state.otherUser.id,
          false
        );
        this.props.navigation.goBack();
      });

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
          header={this.state.otherUser.name}
          footer={[
            { text: "Unfriend", onPress: () => this.unFriend() },
            { text: "Block", onPress: () => this.block() }
          ]}
        >
          <Text type="subHeader" style={{ padding: 8 }}>
            Status: {this.state.otherUser.status}
          </Text>
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
