import React from "react";
import { View, Text } from "react-native";

import Screen from "../Nav/Screen";
import SelectList from "../components/SelectList";
import Card from "../components/Card";
import Separator from "../components/Separator";

export default class GroupPoll extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      groupID: this.props.navigation.getParam("ID", "NO-ID"),
      messageID: this.props.navigation.getParam("MESSAGEID", "NO-ID"),
      group: {
        groupName: "",
        memberObjects: []
      },
      options: [],
      poll: undefined,
      time: undefined,

      ...this.props.screenProps.user
    };

    if (this.state.groupID !== "NO-ID") {
      this.state.group = this.props.screenProps.user.groups.find(
        g => g.groupID === this.state.groupID
      );
      this.state.poll = this.state.group.messages.find(
        msg => msg.messageID == this.state.messageID
      );

      this.state.options = this.state.poll.timeOptions.map((time, index) => {
        let d = new Date(time);
        return {
          Name: `${d.getHours()}:${
            d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()
          }`,
          time: index
        };
      });
    }
  }

  vote = selected => {
    if (selected.length == 0) {
      this.setState({
        time: undefined
      });
    } else {
      this.setState({
        time: selected[0].item.time
      });
    }
  };

  render() {
    let d = new Date(this.state.poll.timeOptions[0]);
    return (
      <Screen
        title="Poll"
        navigation={this.props.navigation}
        screenProps={this.props.screenProps}
        backButton={true}
      >
        <Card
          header={`${this.state.poll.meal} on ${
            this.props.screenProps.globals.dayNames[d.getDay()]
          }`}
          footer={[
            {
              text: "Vote",
              onPress: () => {
                if (this.state.time == undefined) {
                  Alert.alert("Error", "Please pick a time!");
                } else {
                  this.props.screenProps.functions.vote(
                    this.state.time,
                    this.state.groupID,
                    this.state.poll.messageID
                  );

                  this.props.navigation.navigate("Group", {
                    ID: this.state.groupID
                  });
                }
              }
            }
          ]}
        >
          <SelectList
            navigation={this.props.navigation}
            list={{
              list: this.state.options,
              type: "element",
              selectable: true,
              radio: true
            }}
            updateSelectedList={this.vote}
          />
        </Card>
      </Screen>
    );
  }
}
