import React from "react";
import { View } from "react-native";

import Screen from "../Nav/Screen";
import SelectList from "../components/SelectList";
import List from "../components/List";
import Card from "../components/Card";
import Separator from "../components/Separator";
import Text from "../components/Text";

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
      dishes: [], //this.props.court.dishes.sort((a, b) => b.rating - a.rating),

      ...this.props.screenProps.user
    };

    if (this.state.groupID !== "NO-ID") {
      this.state.group = this.props.screenProps.user.groups.find(
        g => g.groupID === this.state.groupID
      );
      this.state.poll = this.state.group.events.find(
        msg => msg.messageID == this.state.messageID
      );
      this.state.poll.votes = this.state.poll.votes.filter(
        v => v.numVotes !== 0
      );
      this.state.poll.votes.sort((a, b) => b.numVotes - a.numVotes);

      this.state.poll.votes = this.state.poll.votes.map((v, index) => {
        let d = new Date(v.time);
        return {
          Name: `${index + 1}. ${v.numVotes} member${
            index != 0 ? "s " : ""
          } voted to eat at ${d.getHours()}:${
            d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()
          } `,
          time: index
        };
      });

      console.log(this.state.poll);
    }
  }

  render() {
    let d = new Date(this.state.poll.votes[0].time);

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
          <View style={{ padding: 16 }}>
            <Text type="bold">
              {"Best Dining Court: "}
              <Text>{this.state.poll.diningCourt}</Text>
            </Text>
          </View>
          <Card header={"Voting Results"}>
            <List list={this.state.poll.votes} type="element" />
          </Card>
        </Card>
      </Screen>
    );
  }
}
