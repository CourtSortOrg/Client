import React from "react";
import { View, Text } from "react-native";

import Screen from "../Nav/Screen";
import SelectList from "../components/SelectList";
import Card from "../components/Card";
import ProfileList from "../components/ProfileList";
import Separator from "../components/Separator";

export default class GroupResults extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      groupID: this.props.navigation.getParam("ID", "NO-ID"),
      messageID: this.props.navigation.getParam("MESSAGEID", "NO-ID"),
      group: {
        groupName: "",
        memberObjects: []
      },
      poll: undefined,

      ...this.props.screenProps.user
    };

    if (this.state.groupID !== "NO-ID") {
      this.state.group = this.props.screenProps.user.groups.find(
        g => g.groupID === this.state.groupID
      );
      this.state.poll = this.state.group.messages.find(
        msg => msg.messageID == this.state.messageID
      );
    }
  }

  render() {
    let d = new Date(this.state.poll.timeOptions[0]);

    return (
      <Screen
        title="Poll Results"
        navigation={this.props.navigation}
        screenProps={this.props.screenProps}
        backButton={true}
      >
        <Card
          header={`${this.state.poll.meal} on ${
            this.props.screenProps.globals.dayNames[d.getDay()]
          }`}
        >
          <Text>GROUP RESULTS</Text>
        </Card>
      </Screen>
    );
  }
}
