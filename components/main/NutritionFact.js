import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default class NutritionFact extends React.Component {
  render() {
    let textStyle={...styles.text}
    if(this.props.Name.includes("Total")
    || this.props.Name.includes("Vitamin"))
        textStyle = {...styles.text, ...styles.bold}
    switch(this.props.Name) {
      case "Serving Size":
      case "Calories":
      case "Cholesterol":
      case "Sodium":
      case "Protein":
      case "Calcium":
      case "Iron":
        textStyle = {...styles.text, ...styles.bold}
        break;
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between"
        }}
      >
        <Text style={textStyle}>
          {this.props.Name}   {this.props.LabelValue}
        </Text>
        <Text style={styles.end}>{this.props.DailyValue}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    paddingLeft: 24,
    flex: 1
  },
  bold: {
    padding: 0,
  },
  end: {
    flex: 1
  }
});
