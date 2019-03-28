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
      group: {
        groupName: "",
        memberObjects: []
      },
      options: [],
      date: undefined,
      time: undefined,

      ...this.props.screenProps.user
    };

    //if (this.state.groupID !== "NO-ID") {
    /*let groups = this.props.screenProps.user.groups.filter(
        group => group.groupID === this.state.groupID
      );
      if (groups.length === 0) {
        this.props.screenProps.functions.updateGroup(this.state.groupID, true);
        groups = this.props.screenProps.user.groups.filter(
          group => group.groupID === this.state.groupID
        );
      }
      this.state.group = { ...groups[0] };
      */

    let date = new Date();
    let times = {
      breakfast: [
        "7:00",
        "7:30",
        "8:00",
        "8:30",
        "9:00",
        "9:30",
        "10:00",
        "10:30",
        "11:00"
      ],
      lunch: [
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "1:00",
        "1:30",
        "2:00",
        "2:30",
        "3:00"
      ],
      dinner: ["5:00", "5:30", "6:00", "6:30", "7:00", "7:30", "8:00"]
    };
    let dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    for (let i = 0; i < 7; i++) {
      this.state.options.push({
        Name: dayNames[date.getDay()],
        type: "expandable",
        times: times["lunch"].map(time => ({
          Name: time,
          date: date,
          time: time
        }))
      });
      date.setDate(date.getDate() + 1);
    }
  }
  //}

  vote = selected => {
    if (selected.length == 0) {
      this.setState({
        date: undefined,
        time: undefined
      });
    } else {
      this.setState({
        date: selected[0].item.date,
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
                console.log("voted!");
                /*this.props.screenProps.functions.vote(
                  this.state.date,
                  this.state.time
                );*/
              }
            }
          ]}
        >
          <SelectList
            navigation={this.props.navigation}
            list={{
              list: this.state.options,
              type: "expandable",
              subList: {
                list: "times",
                type: "element",
                selectable: true,
                radio: true
              }
            }}
            updateSelectedList={this.vote}
          />
        </Card>
      </Screen>
    );
  }
}
