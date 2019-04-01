import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Button } from "react-native-elements";

import Screen from "../Nav/Screen";
import CheckInCard from "./CheckInCard";
import RecommendationsCard from "./RecommendationsCard";
import Card from "../components/Card";
import Text from "../components/Text";

export default class Home extends React.Component {
  render() {
    let diningCourt = ["Hillenbrand", "Wiley", "Windsor", "Ford", "Earhart"];

    return (
      <Screen
        title="Home"
        navigation={this.props.navigation}
        screenProps={this.props.screenProps}
        backButton={false}
      >
        {this.props.screenProps.user == undefined ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 100
            }}
          >
            <Text
              style={{ paddingLeft: 50, paddingRight: 50, paddingBottom: 10 }}
            >
              Please Sign in to use account functionality.
            </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Auth")}
              style={{
                backgroundColor: "#E86515",
                padding: 10,
                borderRadius: 10,
                flex: 1,
                justifyContent: "center"
              }}
            >
              <Text style={{ textAlign: "center" }}>Sign In</Text>
            </TouchableOpacity>
          </View>
        ) : this.props.screenProps.user.location != undefined ? (
          <CheckInCard
            navigation={this.props.navigation}
            screenProps={this.props.screenProps}
          />
        ) : (
          diningCourt.map((court, index) => (
            <RecommendationsCard
              navigation={this.props.navigation}
              screenProps={this.props.screenProps}
              expand={index == 0}
            />
          ))
        )}
      </Screen>
    );
  }
}
