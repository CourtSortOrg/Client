import React from "react";
import {View, Text} from "react-native";
import { Button } from "react-native-elements"


export default class MealItem extends React.Component {
  render() {
    return (
      <View>
      <Text>{this.props.Name}</Text>
      // Flex flow row. Just a box.
      <View>
      {
        this.props.Allergens
        .filter(allergen => allergen.Value)
        .map(allergen => <AllergenIcon {...allergen} />)
      }
      </View>

      // Start with a list.
      <View>
      {
        this.props.Nutrition.map(fact => <NutritionFact {...fact})
      }
      </View>

      // Just a list.
      <View>
        <Text>{this.props.Ingredients}</Text>
      </View>
        <Button
          title="Go to dining court"
          onPress={() => this.props.navigation.push("DiningCourt")}
        />
      </View>
    )
  }
}
