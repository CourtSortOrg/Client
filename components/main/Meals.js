import React from "react";
import {View, Text} from "react-native";
import { Button } from "react-native-elements"

import Screen from "../Nav/Screen"

export default class Meals extends React.Component {
  render() {
    return (
      <Screen title="Meals" navigation={{...this.props.navigation}} backButton={false}>
      <Text>Meals</Text>
      <Button
      title="Dining Court"
      onPress={() => this.props.navigation.push("DiningCourt")}
      />
      <Button
      title="MealItem"
      onPress={() => this.props.navigation.push("MealItem")}
      />
      </Screen>
    )
  }
}
