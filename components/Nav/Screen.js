import React from "react";
import { View, StyleSheet } from "react-native";

import Header from "./Header";
import Footer from "./Footer";
import Body from "./Body";

export default class Screen extends React.Component {
  render() {
    return (
      <View
        style={{
          flex: 1
        }}
      >
        <Header
          styles={styles}
          showNavigation={this.props.showNavigation}
          navigation={{ ...this.props.navigation }}
          screenProps={this.props.screenProps}
          title={this.props.title}
          backButton={this.props.backButton}
          backButtonCallback={this.props.backButtonCallback}
          map={this.props.map}
          refresh={this.props.refresh}
          active={this.props.title}
          {...this.props.header}
        />
        <Body>{this.props.children}</Body>
        <Footer
          styles={styles}
          screenProps={this.props.screenProps}
          showNavigation={this.props.showNavigation}
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
    height: 25
  }
});
