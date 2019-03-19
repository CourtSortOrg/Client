import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Button, Avatar } from "react-native-elements";

import Text from "../components/Text";

export default class Header extends React.Component {
  render() {
    return (
      <View
        style={{
          flex: 0.1,
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#e86515",
          borderBottomWidth: 5,
          borderColor: "black",
          padding: 10
        }}
      >
        <View style={{ flex: 0.13 }} />
        <View
          style={{
            flexDirection: "row",
            flex: 0.87,
            alignItems: "space-around"
          }}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            {this.props.showNavigation != false && (
              <Avatar
                small
                rounded
                title="IN"
                onPress={() => this.props.navigation.navigate("Profile")}
              />
            )}
            {this.props.backButton && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.props.navigation.goBack()}
              >
                <Image
                  style={styles.icon}
                  source={require("../../assets/icons/baseline_arrow_back_ios_black_18dp.png")}
                />
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              flex: 2,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {this.props.center ? (
              this.props.center
            ) : (
              <Text type="header">{this.props.title}</Text>
            )}
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-end",
              paddingTop: 10
            }}
          >
            {this.props.map == true && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.props.navigation.navigate("Map", {
                  ID: "Hillenbrand"
                })}
              >
                <Image
                  style={styles.icon}
                  source={require("../../assets/icons/baseline-map-24px.png")}
                />
              </TouchableOpacity>
            )}
            {this.props.showNavigation != false && (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Notifications")}
              >
                {this.props.active == "Notifications" ? (
                  <Image
                    style={styles.icon}
                    source={require("../../assets/icons/baseline-notifications-24px.png")}
                  />
                ) : (
                  <Image
                    style={styles.icon}
                    source={require("../../assets/icons/outline-notifications-24px.png")}
                  />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
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
