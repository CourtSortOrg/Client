import React from "react";
import { View } from "react-native";
import Screen from "../Nav/Screen";
import SelectMultiple from "react-native-select-multiple";
import { Overlay, Button } from "react-native-elements";

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
    this.state = { restrictions: [], isVisible: true };
  }

  onSelectionsChange = restrictions => {
    // selectedFruits is array of { label, value }
    this.setState({ restrictions });
  };

  render() {
    return (
      <Screen
        title="Edit Profile"
        navigation={{ ...this.props.navigation }}
        backButton={true}
      >
        <Overlay isVisible={this.state.isVisible}>
          <SelectMultiple
            style={{ borderColor: "black" }}
            items={restrictions}
            selectedItems={this.state.restrictions}
            onSelectionsChange={this.onSelectionsChange}
          />
          <Button title="Close" onPress={()=>{this.setState({isVisible: !this.state.isVisible})}} />
        </Overlay>
      </Screen>
    );
  }
}
