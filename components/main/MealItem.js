import React from "react";
import {View, Text} from "react-native";
import { Button } from "react-native-elements"

import Screen from "../Nav/Screen"


export default class MealItem extends React.Component {
  render() {
    return (
      <Screen title="Dining Court" navigation={{...this.props.navigation}} backButton={true}>
        <Text>MealItem</Text>
        <Button
          title="Go to dining court"
          onPress={() => this.props.navigation.push("DiningCourt")}
        />
      </Screen>
    )
  }
}
