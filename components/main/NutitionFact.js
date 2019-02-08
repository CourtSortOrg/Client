import React from "react";
import { View, Text } from "react-native";

export default class NutritionFact extends React.Component {
  render() {
    return (
      <View>
        <Text>{this.props.Name} {this.props.Value}{this.props.LabelValue}</Text>
        <Text>{this.props.DailyValue}</Text>
      </View>
    );
  }
}
