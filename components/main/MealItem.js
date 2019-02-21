import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, ButtonGroup } from "react-native-elements";

import Screen from "../Nav/Screen";
import AllergenIcon from "./AllergenIcon";
import NutritionFact from "./NutritionFact";
import List from "./List";
import Text from "../Nav/Text";
import Card from "../Nav/Card";

export default class MealItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 1,
      Nutrition: [
        {
          Name: "Serving Size",
          LabelValue: "Thigh",
          DailyValue: null,
          Ordinal: 0
        },
        {
          Name: "Calories",
          Value: 208.5644,
          LabelValue: "209",
          DailyValue: null,
          Ordinal: 1
        },
        {
          Name: "Calories from fat",
          LabelValue: "135",
          DailyValue: null,
          Ordinal: 2
        },
        {
          Name: "Total fat",
          Value: 14.5871,
          LabelValue: "15g",
          DailyValue: "22%",
          Ordinal: 3
        },
        {
          Name: "Saturated fat",
          Value: 3.9605,
          LabelValue: "4g",
          DailyValue: "20%",
          Ordinal: 4
        },
        {
          Name: "Cholesterol",
          Value: 85.4033,
          LabelValue: "85mg",
          DailyValue: "28%",
          Ordinal: 5
        },
        {
          Name: "Sodium",
          Value: 338.4744,
          LabelValue: "340mg",
          DailyValue: "14%",
          Ordinal: 6
        },
        {
          Name: "Total Carbohydrate",
          Value: 4.1259,
          LabelValue: "4g",
          DailyValue: "1%",
          Ordinal: 7
        },
        {
          Name: "Sugar",
          Value: 3.2754,
          LabelValue: "3g",
          DailyValue: null,
          Ordinal: 8
        },
        {
          Name: "Dietary Fiber",
          Value: 0.2971,
          LabelValue: "0g",
          DailyValue: "",
          Ordinal: 9
        },
        {
          Name: "Protein",
          Value: 14.5488,
          LabelValue: "15g",
          DailyValue: "15%",
          Ordinal: 10
        },
        {
          Name: "Vitamin A",
          Value: 355.1237,
          LabelValue: null,
          DailyValue: "10%",
          Ordinal: 11
        },
        {
          Name: "Vitamin C",
          Value: 0.0986,
          LabelValue: null,
          DailyValue: "0%",
          Ordinal: 12
        },
        {
          Name: "Calcium",
          Value: 12.178,
          LabelValue: null,
          DailyValue: "2%",
          Ordinal: 13
        },
        {
          Name: "Iron",
          Value: 0.7756,
          LabelValue: null,
          DailyValue: "4%",
          Ordinal: 14
        }
      ],
      Ingredients:
        "Chicken Thigh CVP, Rub Princess Dry(Sugar Brown Light 25#(Sugar, Cane Molasses), Spice Salt Seasoned Lawry's 5#(Salt, Sugar, Spices (Including Paprika And Tumeric), Onion, Cornstarch, Garlic, Tricalcium Phosphate (Prevents Caking), Natural Flavor, Paprika Oleoresin (For Color)), Spice Paprika Spanish, Spice Onion Powder(Dehydrated Onion), Spice Chipotle Powder 1.5#(Chipotle Chile Peppers And Silicon Dioxide.), Spice Pepper Black Ground 18 oz, Spice Mustard Ground, Spice Ginger Ground, Spice Pepper Cayenne Ground 16 oz(Crushed Red Pepper), Spice Allspice 16 oz)",
      ID: "4f2aff44-1257-4f64-8f8d-e545dabb661b",
      Name: "Chicken Thighs with Princess Rub",
      IsVegetarian: false,
      Allergens: [
        {
          Name: "Eggs",
          Value: true
        },
        {
          Name: "Fish",
          Value: true
        },
        {
          Name: "Gluten",
          Value: true
        },
        {
          Name: "Milk",
          Value: true
        },
        {
          Name: "Peanuts",
          Value: true
        },
        {
          Name: "Shellfish",
          Value: true
        },
        {
          Name: "Soy",
          Value: true
        },
        {
          Name: "Tree Nuts",
          Value: true
        },
        {
          Name: "Vegetarian",
          Value: true
        },
        {
          Name: "Vegan",
          Value: true
        },
        {
          Name: "Wheat",
          Value: true
        }
      ]
    };
  }

  updateIndex = selectedIndex => {
    this.setState({ selectedIndex });
  };

  componentWillMount() {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/fetchDishes",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      }
    ).then(data =>
      JSON.parse(data._bodyText).then(
        this.setState({ ...data }, () => this.updateMeals())
      )
    );

    console.log(
      `Load menu item ${this.props.navigation.getParam("ID", "NO-ID")}`
    );
  }

  renderElement(item) {
    return <NutritionFact {...item} />;
  }

  renderNutrition() {
    if (this.state.selectedIndex == 0) {
      return (
        <View>
          <Card header="Allergens">
            <View style={styles.allergens}>
              {this.state.Allergens.filter(allergen => allergen.Value).map(
                (allergen, index) => {
                  return <AllergenIcon key={index} {...allergen} />;
                }
              )}
            </View>
          </Card>
          <Card header="Nutrition Facts">
            <List
              list={this.state.Nutrition}
              type="element"
              subList={false}
              renderElement={this.renderElement}
            />
          </Card>
          <Card header="Ingredients">
            <Text type="body" style={styles.ingredientsText}>
              {this.state.Ingredients}
            </Text>
          </Card>
        </View>
      );
    }
  }

  renderServing() {
    if (this.state.selectedIndex == 1) {
      return (
        <Button
          style={styles.button}
          title="Go to dining court"
          onPress={() => this.props.navigation.push("DiningCourt")}
        />
      );
    }
  }

  renderRatings() {}

  render() {
    const buttons = ["Nutrition", "Serving", "Ratings"];
    return (
      <Screen
        title={this.state.Name}
        navigation={{ ...this.props.navigation }}
        backButton={true}
      >
        <ButtonGroup
          onPress={selectedIndex => this.updateIndex(selectedIndex)}
          selectedIndex={this.state.selectedIndex}
          buttons={buttons}
          containerStyle={{ height: 40 }}
        />
        {this.renderNutrition()}
        {this.renderServing()}
        {this.renderRatings()}
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  allergens: { flex: 1, padding: 10, flexDirection: "row", flexWrap: "wrap" },
  ingredients: { padding: 10 },
  header: {
    backgroundColor: "#E86515",
    borderColor: "black",
    borderBottomWidth: 2,
    borderStyle: "solid",
    padding: 16
  },
  ingredientsText: {
    padding: 16
  },
  button: {}
});
