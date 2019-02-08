import React from "react";
import { View } from "react-native";

import Header from "./Header";
import Footer from "./Footer";
import Body from "./Body";

export default class Screen extends React.Component {
  render() {
    return (
      <View
        style={{
          backgroundColor: "red",
          flex: 1,
        }}
      >
      <Header
        navigation={{ ...this.props.navigation}}
        title="Home"
        backButton={this.props.backButton}
      />
      <Body>
      {this.props.children}
      </Body>
      <Footer
      navigation={{ ...this.props.navigation}}
      />
      </View>
    )
  }
}
