import React from "react";
import { View } from "react-native";
import { Avatar } from "react-native-elements";

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
      <View style={{ margin: 5 }}>
        <Avatar size="medium" rounded source={this.getImage(this.props.Name)} />
      </View>
    );
  }
}
