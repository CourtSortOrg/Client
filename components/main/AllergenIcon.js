import React from "react";
import { View, Image } from "react-native";
import { Avatar } from "react-native-elements";

import Text from "../components/Text";

export default class AllergenIcon extends React.Component {
  getImage(name) {
    switch (name) {
      case "Eggs":
        return require("../../assets/images/Eggs.png");
      case "Fish":
        return require("../../assets/images/Fish.png");
      case "Gluten":
        return require("../../assets/images/Gluten.png");
      case "Milk":
        return require("../../assets/images/Milk.png");
      case "Peanuts":
        return require("../../assets/images/Peanuts.png");
      case "Shellfish":
        return require("../../assets/images/Shellfish.png");
      case "Soy":
        return require("../../assets/images/Soy.png");
      case "Tree Nuts":
        return require("../../assets/images/Tree_Nuts.png");
      case "Vegan":
        return require("../../assets/images/Vegan.png");
      case "Vegetarian":
        return require("../../assets/images/Vegetarian.png");
      case "Wheat":
        return require("../../assets/images/Wheat.png");
    }
  }

  render() {
    return (
      <View style={{ padding: 10, ...this.props.style }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {this.props.enabled ? (
            <Image
              source={this.getImage(this.props.name)}
              style={{
                width: 50,
                height: 50,
                resizeMode: "contain"
              }}
            />
          ) : (
            <View>
              <Image
                source={this.getImage(this.props.name)}
                style={{
                  width: 50,
                  height: 50,
                  resizeMode: "contain",
                  tintColor: "gray"
                }}
              />
              <Image
                source={this.getImage(this.props.name)}
                style={{
                  opacity: 0.3,
                  position: "absolute",
                  width: 50,
                  height: 50,
                  resizeMode: "contain"
                }}
              />
            </View>
          )}
          {this.props.enabled ? (
            <Text>{this.props.name}</Text>
          ) : (
            <Text style={{ color: "gray" }}>{this.props.name}</Text>
          )}
        </View>
      </View>
    );
  }
}
