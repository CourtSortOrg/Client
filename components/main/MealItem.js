import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-elements";

import Screen from "../Nav/Screen";
import AllergenIcon from "./AllergenIcon";
import NutritionFact from "./NutitionFact";

export default class MealItem extends React.Component {
  render() {
    return (
      <Screen
        title={this.props.name}
        navigation={{ ...this.props.navigation }}
        backButton={true}
      >
        // Flex flow row. Just a box.
        <View>
          {this.props.Allergens &&
            this.props.Allergens.filter(allergen => allergen.Value).map(
              allergen => <AllergenIcon {...allergen} />
            )}
        </View>
        // Start with a list.
        <View>
          {this.props.Nutrition &&
            this.props.Nutrition.map(fact => <NutritionFact {...fact} />)}
        </View>
        // Just a list.
        <View>
          <Text>{this.props.Ingredients}</Text>
        </View>
        <Button
          title="Go to dining court"
          onPress={() => this.props.navigation.push("DiningCourt")}
        />
      </Screen>
    );
  }
}
