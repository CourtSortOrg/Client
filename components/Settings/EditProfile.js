import React from "react";
import Screen from "../Nav/Screen";

const restrictions = [
  "Eggs",
  "Fish",
  "Gluten",
  "Milk",
  "Peanuts",
  "Shellfish",
  "Soy",
  "Tree Nuts",
  "Vegan",
  "Vegetarian",
  "Wheat"
];

export default class EditProfile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Screen
        title="Edit Profile"
        navigation={{ ...this.props.navigation }}
        backButton={true}
      />
    );
  }
}
