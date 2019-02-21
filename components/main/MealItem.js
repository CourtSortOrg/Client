import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, ButtonGroup, ListItem } from "react-native-elements";

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
      name: this.props.navigation.getParam("ID", "NO-ID"),
      selectedIndex: 0,
      nutrition: [],
      ingredients: "",
      id: "",
      isVeg: false,
      allergens: [],
      offered: [
        {
          meal: "",
          station: "",
          date: "",
          id: "",
          location: ""
        }
      ]
    };
  }

  updateIndex = selectedIndex => {
    this.setState({ selectedIndex });
  };

  componentDidMount() {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/fetchAllOffered",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: this.state.name
        })
      }
    ).then(data =>
      this.setState(
        {
          ...JSON.parse(data._bodyText)
        },
      )
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
              {this.state.allergens
                .filter(allergen => allergen.Value)
                .map((allergen, index) => {
                  return <AllergenIcon key={index} {...allergen} />;
                })}
            </View>
          </Card>
          <Card header="Nutrition Facts">
            <List
              list={this.state.nutrition}
              type="element"
              subList={false}
              renderElement={this.renderElement}
            />
          </Card>
          <Card header="Ingredients">
            <Text type="body" style={styles.ingredientsText}>
              {this.state.ingredients}
            </Text>
          </Card>
        </View>
      );
    }
  }

  renderServing() {
    if (this.state.selectedIndex == 1) {
      return (
        <List
          list={this.state.offered}
          type="element"
          subList={false}
          rank={1}
          renderElement={item => {
            return (
              <ListItem
                chevron
                bottomDivider
                // leftAvatar={{
                //   source: { uri: item.image },
                //   containerStyle: styles.friendPicture
                // }}
                subtitle={item.date + " " + item.meal}
                title={item.location}
                onPress={() =>
                  this.props.navigation.navigate("Map", { ID: item.location })
                }
                topDivider
              />
            );
          }}
        />
      );
    }
  }

  renderRatings() {}

  render() {
    const buttons = ["Nutrition", "Serving", "Ratings"];
    return (
      <Screen
        title={this.state.name}
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
