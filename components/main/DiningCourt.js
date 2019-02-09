import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-elements";

import Screen from "../Nav/Screen";

export default class DiningCourt extends React.Component {
  render() {
    return (
      <Screen
        title="Dining Court"
        navigation={{ ...this.props.navigation }}
        backButton={true}
      >
        <Button
          title="Go to meal item"
          onPress={() => this.props.navigation.push("MealItem")}
        />
      </Screen>
    );
  }
}
