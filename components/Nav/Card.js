import React from "react";
import { View, StyleSheet } from "react-native";

import Text from "../Nav/Text";

export default class Card extends React.Component {
  render() {
    return (
      <View
        style={{
          ...styles.card,
          ...this.props.style
        }}
      >
        {this.props.header && (
          <View style={styles.header}>
            <Text type="header">{this.props.header}</Text>
          </View>
        )}
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#E86515",
    padding: 8,
    paddingLeft: 16,
    borderBottomWidth: 5,
    borderColor: "black"
  },
  card: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 5,
    margin: 10,
    borderRadius: 10
  }
});
