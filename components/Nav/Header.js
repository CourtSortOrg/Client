import React from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { Button, Avatar } from "react-native-elements";

export default class Header extends React.Component {
  render() {
    return (
      <View style={{flex: 0.15, flexDirection: "column", justifyContent: "flex-end", backgroundColor: "#e86515"}}>
        <View style={{flex: 0.33}}/>
        <View style={{flexDirection: "row", flex: 0.67, alignItems: "space"}}>
          <View style={{flex: 1, flexDirection: "row"}}>
          <Avatar
            small
            rounded
            title="IN"
            onPress={() => this.props.navigation.navigate("Profile")}
          />
          {
            this.props.backButton &&
            <TouchableOpacity style={this.props.styles.button} onPress={() => this.props.navigation.goBack()} >
            <Image style={this.props.styles.icon} source={require('../../assets/icons/baseline_arrow_back_ios_black_18dp.png')} />
            </TouchableOpacity>
          }
          </View>
          <View style={{
        flex: 2,
        alignItems: "center",
        justifyContent: "center"
      }}>
      <Text style={{
        fontSize: 25,
        fontFamily: "Lobster"
      }}>
      {this.props.title}
      </Text>
        </View>
        <TouchableOpacity style={this.props.styles.button} onPress={() => this.props.navigation.navigate("Notifications")}>
      {
        this.props.active == "Notifications" ?
        <Image style={this.props.styles.icon} source={require('../../assets/icons/baseline-notifications-24px.png')} /> :
        <Image style={this.props.styles.icon} source={require('../../assets/icons/outline-notifications-24px.png')} />
      }
        </TouchableOpacity>
      </View>
      </View>
    )
  }
}
