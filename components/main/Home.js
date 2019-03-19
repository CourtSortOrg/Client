import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-elements";

import Screen from "../Nav/Screen";
import CheckInCard from "./CheckInCard";
import Card from "../components/Card";

export default class Home extends React.Component {
  render() {
    return (
      <Screen
        title="Home"
        navigation={this.props.navigation}
        backButton={false}
      >
        {this.props.screenProps.user.checkInLocation != undefined ? (
          <CheckInCard
            navigation={this.props.navigation}
            screenProps={this.props.screenProps}
          />
        ) : (
          <Card header="Check into a Dining Court!">
            <Card
              footer={[
                {
                  text: "Hillenbrand",
                  onPress: () =>
                    this.props.screenProps.functions.checkIn("Hillenbrand")
                }
              ]}
            />
            <Card
              footer={[
                {
                  text: "Ford",
                  onPress: () =>
                    this.props.screenProps.functions.checkIn("Ford")
                }
              ]}
            />
            <Card
              footer={[
                {
                  text: "Wiley",
                  onPress: () =>
                    this.props.screenProps.functions.checkIn("Wiley")
                }
              ]}
            />
            <Card
              footer={[
                {
                  text: "Windsor",
                  onPress: () =>
                    this.props.screenProps.functions.checkIn("Windsor")
                }
              ]}
            />
            <Card
              footer={[
                {
                  text: "Earhart",
                  onPress: () =>
                    this.props.screenProps.functions.checkIn("Earhart")
                }
              ]}
            />
          </Card>
        )}
      </Screen>
    );
  }
}
