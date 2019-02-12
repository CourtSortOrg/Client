import React from "react";
import { ScrollView } from "react-native";

export default class Body extends React.Component {
  render() {
    return (
      <ScrollView
        style={{
          flex: 1,
          flexGrow: 1
        }}
      >
        {this.props.children}
      </ScrollView>
    );
  }
}
