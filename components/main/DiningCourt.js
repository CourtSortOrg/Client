import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-elements";


export default class DiningCourt extends React.Component {
  render() {
    return (
      <View>
        <Text>DiningCourt</Text>
        <Button
          title="Go to meal item"
          onPress={() => this.props.navigation.push("MealItem")}
        />
      </View>
    )
  }
}
