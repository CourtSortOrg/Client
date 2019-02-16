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
          justifyContent: "space-between",
          paddingRight: 8,
          alignItems: "center",
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
    padding: 8,
    paddingLeft: 24,
    flex: 7
  },
  bold: {
    fontFamily: "Quicksand-Bold",
    paddingLeft: 0
  },
  end: {
    flex: 1,
    textAlign: "right",
  }
});
