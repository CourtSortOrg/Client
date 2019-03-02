import React from "react";
import { Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Button } from "react-native-elements";

export default class Footer extends React.Component {
  render() {
    if(this.props.showNavigation == false)
      return <View/>
    return (
      <View
        style={{
          flex: 0.1,
          flexDirection: "row",
          backgroundColor: "#e86515",
          borderTopWidth: 5,
          borderColor: "black"
        }}
      >
        <TouchableOpacity
          style={this.props.styles.button}
          onPress={() => this.props.navigation.navigate("Home")}
        >
          {this.props.active == "Home" ? (
            <Image
              style={this.props.styles.icon}
              source={require("../../assets/icons/round-home-24px.png")}
            />
          ) : (
            <Image
              style={this.props.styles.icon}
              source={require("../../assets/icons/outline-home-24px.png")}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={this.props.styles.button}
          onPress={() => this.props.navigation.navigate("Meals")}
        >
          {this.props.active == "Meals" ? (
            <Image
              style={this.props.styles.icon}
              source={require("../../assets/icons/baseline-fastfood-24px.png")}
            />
          ) : (
            <Image
              style={this.props.styles.icon}
              source={require("../../assets/icons/outline-fastfood-24px.png")}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={this.props.styles.button}
          onPress={() => this.props.navigation.navigate("Messages")}
        >
          {this.props.active == "Messages" ? (
            <Image
              style={this.props.styles.icon}
              source={require("../../assets/icons/round-chat_bubble-24px.png")}
            />
          ) : (
            <Image
              style={this.props.styles.icon}
              source={require("../../assets/icons/round-chat_bubble_outline-24px.png")}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  }
}
