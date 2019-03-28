import React from "react";
import { View, Text } from "react-native";

import Screen from "../Nav/Screen";
import SelectList from "../components/SelectList";
import Card from "../components/Card";
import ProfileList from "../components/ProfileList";
import Separator from "../components/Separator";

export default class GroupEvent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      groupID: this.props.navigation.getParam("ID", "NO-ID"),
      group: {
        groupName: "",
        memberObjects: []
      },

      meals: [],
      days: [],

      ...this.props.screenProps.user
    };
    let mealNames = ["Breakfast", "Lunch", "Late Lunch", "Dinner"];

    let dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    this.state.meals = mealNames.map((meal, index) => ({
      Name: meal,
      type: "element",
      index: index
    }));

    this.state.days = dayNames.map((day, index) => ({
      Name: day,
      type: "element",
      index: index
    }));

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
  }

  voteDay = selected => {
    if (selected.length == 0) {
      this.setState({
        date: undefined
      });
    } else {
      this.setState({
        date: selected[0].item.index
      });
    }
  };

  voteMeal = selected => {
    if (selected.length == 0) {
      this.setState({
        meal: undefined
      });
    } else {
      this.setState({
        meal: selected[0].item.Name
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
        <Card header="Day">
          <SelectList
            navigation={this.props.navigation}
            list={{
              list: this.state.days,
              type: "element",
              selectable: true,
              radio: true
            }}
            updateSelectedList={this.voteDay}
          />
        </Card>
        <Card header="Meal">
          <SelectList
            navigation={this.props.navigation}
            list={{
              list: this.state.meals,
              type: "element",
              selectable: true,
              radio: true
            }}
            updateSelectedList={this.voteMeal}
          />
        </Card>
        <Card
          footer={[
            {
              text: "Create!",
              onPress: () => {
                console.log("Created Event!");
                /*this.props.screenProps.functions.vote(
                  this.state.date,
                  this.state.time
                );*/
              }
            }
          ]}
        />
      </Screen>
    );
  }
}
