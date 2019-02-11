import React from "react";
import { View, Text } from "react-native";

export default class NutritionFact extends React.Component {
  render() {
    return (
      <View>
        <Text>{this.props.Name}</Text>
        <Text>{this.props.Value}</Text>
        <Text>{this.props.LabelValue}</Text>
        <Text>{this.props.DailyValue}</Text>
      </View>
    );
  }
}
