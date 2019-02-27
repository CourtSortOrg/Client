import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
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
            <Avatar
              small
              rounded
              title="IN"
              onPress={() => this.props.navigation.navigate("Profile")}
            />
            {this.props.backButton && (
              <TouchableOpacity
                style={this.props.styles.button}
                onPress={() => this.props.navigation.goBack()}
              >
                <Image
                  style={this.props.styles.icon}
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
              justifyContent: "flex-end"
            }}
          >
            <TouchableOpacity
              style={{paddingTop: 10}}
              onPress={() => this.props.navigation.navigate("Notifications")}
            >
              {this.props.active == "Notifications" ? (
                <Image
                  style={{ ...this.props.styles.icon, height: "100%" }}
                  source={require("../../assets/icons/baseline-notifications-24px.png")}
                />
              ) : (
                <Image
                  style={{ ...this.props.styles.icon, height: "100%" }}
                  source={require("../../assets/icons/outline-notifications-24px.png")}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
