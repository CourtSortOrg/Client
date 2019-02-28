import React from "react";
import { View, StyleSheet } from "react-native";

import Header from "./Header";
import Footer from "./Footer";
import Body from "./Body";

export default class Screen extends React.Component {
  render() {
    if (this.props.showNavigation == false) {
      return (
        <View
          style={{
            flex: 1
          }}
        >
          <Body>{this.props.children}</Body>
        </View>
      );
    }
    return (
      <View
        style={{
          flex: 1
        }}
      >
        <Header
          styles={styles}
          navigation={{ ...this.props.navigation }}
          title={this.props.title}
          backButton={this.props.backButton}
          active={this.props.title}
          {...this.props.header}
        />
        <Body>{this.props.children}</Body>
        <Footer
          styles={styles}
          navigation={{ ...this.props.navigation }}
          active={this.props.title}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    aspectRatio: 1,
    height: "55%"
  }
});
