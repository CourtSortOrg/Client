import React from "react";
import { View, Text, Alert } from "react-native";

import Screen from "../Nav/Screen";
import SelectList from "../components/SelectList";
import Card from "../components/Card";
import ProfileList from "../components/ProfileList";
import Separator from "../components/Separator";

export default class GroupCreateEvent extends React.Component {
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

    let date = new Date();
    for (let i = 0; i < 7; i++) {
      this.state.days.push({
        Name: this.props.screenProps.globals.dayNames[date.getDay()],
        type: "element",
        index: i
      });

      date.setDate(date.getDate() + 1);
    }

    this.state.meals = this.props.screenProps.globals.mealNames.map(
      (meal, index) => ({
        Name: meal,
        type: "element",
        index: index
      })
    );
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

  vote = () => {
    let date = new Date();
    date.setDate(date.getDate() + this.state.date);

    let times = {
      Breakfast: [
        { hr: 7, min: 0 },
        { hr: 7, min: 30 },
        { hr: 8, min: 0 },
        { hr: 8, min: 30 },
        { hr: 9, min: 0 },
        { hr: 9, min: 30 }
      ],
      Lunch: [
        { hr: 11, min: 0 },
        { hr: 11, min: 30 },
        { hr: 12, min: 0 },
        { hr: 12, min: 30 },
        { hr: 1, min: 0 },
        { hr: 1, min: 30 },
        { hr: 2, min: 0 },
        { hr: 2, min: 30 },
        { hr: 3, min: 0 }
      ],
      "Late Lunch": [
        { hr: 2, min: 0 },
        { hr: 2, min: 30 },
        { hr: 3, min: 0 },
        { hr: 3, min: 30 }
      ],
      Dinner: [
        { hr: 5, min: 0 },
        { hr: 5, min: 30 },
        { hr: 6, min: 0 },
        { hr: 6, min: 30 },
        { hr: 7, min: 0 },
        { hr: 7, min: 30 },
        { hr: 8, min: 0 },
        { hr: 8, min: 30 }
      ]
    };

    let dateTimes = times[this.state.meal].map(time => {
      date.setHours(time.hr, time.min);
      return date.toISOString();
    });

    let expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 24);

    this.props.screenProps.functions.createPoll(
      expirationTime,
      this.state.groupID,
      dateTimes,
      this.state.meal,
      messageID => {
        console.log(messageID);
        this.props.screenProps.functions.updateGroup(
          this.state.groupID,
          true,
          () =>
            this.props.navigation.navigate("GroupPoll", {
              ID: this.state.groupID,
              MESSAGEID: messageID
            })
        );
      }
    );
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
                if (this.state.date == undefined) {
                  Alert.alert("Error!", "Please choose a date!");
                } else if (this.state.meal == undefined) {
                  Alert.alert("Error!", "Please choose a meal to eat!");
                } else {
                  this.vote();
                }
              }
            }
          ]}
        />
      </Screen>
    );
  }
}
