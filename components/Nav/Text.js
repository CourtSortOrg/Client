import React from "react";
import { Text as NativeText, StyleSheet } from "react-native";

export default class Text extends React.Component {
  render() {
    let style = { ...this.props };
    delete style.type;

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
  subHeader: {},
  default: {},
  sectionName: {}
});
