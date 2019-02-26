import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

import Text from "./Text";

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
        {this.props.footer != undefined && Array.isArray(this.props.footer) && (
          <View style={styles.footer}>
            {this.props.footer.map((button, index) => (
              <TouchableOpacity key={index} onPress={button.onPress} style={styles.button}>
                <Text type="header">{button.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#E86515",
    padding: 8,
    paddingLeft: 16,
    borderBottomWidth: 3,
    borderColor: "black"
  },
  footer: {
    backgroundColor: "#E86515",
    borderTopWidth: 3,
    borderColor: "black",
    flex: 1,
    flexDirection: "row"
  },
  button: {
    flex: 1,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  card: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 3,
    margin: 10,
    borderRadius: 10
  }
});
