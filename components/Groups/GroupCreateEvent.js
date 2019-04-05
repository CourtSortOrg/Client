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
      expiration: [],
      loading: false,

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

    this.state.expiration.push({
      Name: "Tonight at midnight",
      type: "element"
    });
    this.state.expiration.push({
      Name: "Tommorrow at midnight",
      type: "element"
    });
    this.state.expiration.push({
      Name: `Hour before dining courts open for that meal`,
      type: "element"
    });
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

  voteTime = selected => {
    if (selected.length == 0) {
      this.setState({
        expiration: undefined
      });
    } else {
      this.setState({
        time: selected[0].item.Name
      });
    }
  };

  vote = () => {
    this.setState({ loading: true });
    let date = new Date();
    date.setDate(date.getDate() + this.state.date);
    date.setSeconds(0);

    let times = {
      Breakfast: [
        { long: 7, hr: 7, min: 0 },
        { long: 7, hr: 7, min: 30 },
        { long: 8, hr: 8, min: 0 },
        { long: 8, hr: 8, min: 30 },
        { long: 9, hr: 9, min: 0 },
        { long: 9, hr: 9, min: 30 }
      ],
      Lunch: [
        { long: 11, hr: 11, min: 0 },
        { long: 11, hr: 11, min: 30 },
        { long: 12, hr: 12, min: 0 },
        { long: 12, hr: 12, min: 30 },
        { long: 13, hr: 1, min: 0 },
        { long: 13, hr: 1, min: 30 },
        { long: 14, hr: 2, min: 0 },
        { long: 14, hr: 2, min: 30 },
        { long: 15, hr: 3, min: 0 }
      ],
      "Late Lunch": [
        { long: 14, hr: 2, min: 0 },
        { long: 14, hr: 2, min: 30 },
        { long: 15, hr: 3, min: 0 },
        { long: 15, hr: 3, min: 30 }
      ],
      Dinner: [
        { long: 17, hr: 5, min: 0 },
        { long: 17, hr: 5, min: 30 },
        { long: 18, hr: 6, min: 0 },
        { long: 18, hr: 6, min: 30 },
        { long: 19, hr: 7, min: 0 },
        { long: 19, hr: 7, min: 30 },
        { long: 20, hr: 8, min: 0 },
        { long: 20, hr: 8, min: 30 }
      ]
    };

    let dateTimes = times[this.state.meal].map(time => {
      date.setHours(time.long, time.min);
      return date.toJSON();
    });

    let expirationTime = new Date();
    expirationTime.setDate(date.getDate() + this.state.date);
    expirationTime.setHours(times[this.state.meal][0].long - 1, 0, 0);
    //expirationTime.setMinutes(expirationTime.getMinutes() + 1, 0);

    if (expirationTime < new Date())
      Alert.alert("Error", "This event has either already passed or is too close to give members enough time to vote! Try another day or meal time!");
    else {
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
            () => {
              this.setState({ loading: false });
              this.props.navigation.navigate("GroupPoll", {
                ID: this.state.groupID,
                MESSAGEID: messageID
              });
            }
          );
        }
      );
    }
  };

  render() {
    return (
      <Screen
        title="Group Poll"
        loading={this.state.loading}
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
        <Card header="Expiration Time">
          <SelectList
            navigation={this.props.navigation}
            list={{
              list: this.state.expiration,
              type: "element",
              selectable: true,
              radio: true
            }}
            updateSelectedList={this.voteTime}
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
