import React from "react";
import { Text as NativeText, StyleSheet } from "react-native";

export default class Text extends React.Component {
  render() {
    let style = { ...this.props.style };

    if (this.props.type) {
      style = { ...styles[this.props.type], ...style };
    }
    return <NativeText style={style}>{this.props.children}</NativeText>;
  }
}

const styles = StyleSheet.create({
  header: {
    fontFamily: "Lobster",
    fontSize: 24
  },
  body: {},
  subHeader: {
    fontSize: 16
  },
  default: {},
  sectionName: {}
});
