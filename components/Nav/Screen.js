import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";

import { Overlay } from "react-native-elements";

import Header from "./Header";
import Footer from "./Footer";
import Body from "./Body";
import Text from "../components/Text";

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
        <Body
          screenProps={this.props.screenProps}
          refreshControl={this.props.refreshControl}
        >
          {this.props.children}
        </Body>
        <Footer
          styles={styles}
          screenProps={this.props.screenProps}
          showNavigation={this.props.showNavigation}
          navigation={{ ...this.props.navigation }}
          active={this.props.title}
        />
        <Overlay
          borderRadius={8}
          isVisible={this.props.loading == undefined ? false : this.props.loading}
          overlayBackgroundColor="#E86515"
          overlayStyle={{
            borderWidth: 3,
            borderColor: "black",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ActivityIndicator size="large" color="black" />
          <Text type="header" style={{margin: 20}}>Loading</Text>
        </Overlay>
      </View>
    );
  }

  componentDidMount = () => {
    this.props.screenProps.functions.updateNotifications();
  };
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
