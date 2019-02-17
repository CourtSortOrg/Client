import React from "react";
import { View, TouchableOpacity } from "react-native";

import Screen from "../Nav/Screen";
import List from "./List";
import Text from "../Nav/Text";
import Card from "../Nav/Card";
import Separator from "../Nav/Separator";

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
      name: userData.name,
      initials: userData.initials,
      image: userData.image,
      groups: sharedGroups,
      status: "Not currently eating"
    };
  }

  componentWillMount() {
    console.log(`Load friend ${this.props.navigation.getParam("ID", "NO-ID")}`);
  }

  unFriend() {
    console.log("Unfriend");
  }

  block() {
    console.log("Block");
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
