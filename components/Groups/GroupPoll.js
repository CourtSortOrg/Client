import React from "react";
import { View, Text } from "react-native";

import Screen from "../Nav/Screen";
import SelectList from "../components/SelectList";
import Card from "../components/Card";
import ProfileList from "../components/ProfileList";
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
      let groups = this.props.screenProps.user.groups.filter(
        group => group.groupID === this.state.groupID
      );
      if (groups.length === 0) {
        this.props.screenProps.functions.updateGroup(this.state.groupID, true);
        groups = this.props.screenProps.user.groups.filter(
          group => group.groupID === this.state.groupID
        );
      }
      this.state.group = { ...groups[0] };

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
    return (
      <Screen
        title="Group Poll"
        navigation={this.props.navigation}
        screenProps={this.props.screenProps}
        backButton={true}
      >
        <Card
          header={`Vote on a time for $MEAL on $DATE`}
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
                  this.props.navigation.goBack();
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
