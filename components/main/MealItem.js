import React from "react";
import {View, Text} from "react-native";
import { Button } from "react-native-elements"


export default class MealItem extends React.Component {
  render() {
    return (
      <View>
        <Text>MealItem</Text>
        <Button
          title="Go to dining court"
          onPress={() => this.props.navigation.push("DiningCourt")}
        />
      </View>
    )
  }
}
