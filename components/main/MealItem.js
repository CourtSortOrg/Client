import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, ButtonGroup, ListItem } from "react-native-elements";

import Screen from "../Nav/Screen";
import AllergenIcon from "./AllergenIcon";
import NutritionFact from "./NutritionFact";
import List from "../components/List";
import Text from "../components/Text";
import Card from "../components/Card";
import ListElement from "../components/ListElement";
import Separator from "../components/Separator";

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
      warning: false,
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
    )
      .then(data => {
        try {
          this.setState(
            {
              ...JSON.parse(data._bodyText)
            } /*,
            () => {
              this.setState(
                {
                  allergens: this.state.allergens.filter(a => a.Value == true)
                },
                () => {
                  this.setState({
                    allergens: this.state.allergens.map(a => ({
                      ...a,
                      enabled:
                        this.props.screenProps.user.dietaryRestrictions.filter(
                          b => {
                            if (b.Name == a.Name) {
                              this.setState({
                                warning: true
                              });
                              return true;
                            }
                            return false;
                          }
                        ).length != 0
                    }))
                  });
                }
              );
            }*/
          );
        } catch (error) {
          console.error(`fetchAllOffered: ${error}: ${data._bodyText}`);
        }
      })
      .catch(error => console.error(`fetchAllOffered: ${error}`));
  }

  renderElement(item) {
    return <NutritionFact {...item.props} />;
  }

  renderNutrition() {
    console.log(this.state.allergens);
    if (this.state.selectedIndex == 0) {
      return (
        <View>
          <Card header="Dietary Restrictions">
            {this.state.warning == true && (
              <View>
                <ListElement type="expandable" Name="Important!" />
                <ListElement
                  type="element"
                  Name="This dish matches a dietary restriction!"
                  rank={1}
                />
                <Separator/>
              </View>
            )}
            {this.state.allergens.length != 0 ? (
              <View style={styles.allergens}>
                {this.state.allergens
                  .filter(allergen => allergen.Value)
                  .map((allergen, index) => {
                    return (
                      <AllergenIcon
                        key={index}
                        name={allergen.Name}
                        enabled={allergen.enabled}
                      />
                    );
                  })}
              </View>
            ) : (
              <ListElement rank={1} Name="No listed allergens" type="element" />
            )}
          </Card>
          <Card header="Nutrition Facts">
            {this.state.nutrition.length != 0 ? (
              <List
                list={this.state.nutrition}
                type="element"
                subList={false}
                renderElement={this.renderElement}
              />
            ) : (
              <ListElement
                rank={1}
                Name="No listed nutrition facts"
                type="element"
              />
            )}
          </Card>
          <Card header="Ingredients">
            {this.state.ingredients.length != 0 ? (
              <Text type="body" style={styles.ingredientsText}>
                {this.state.ingredients == ""
                  ? "No listed ingredients"
                  : this.state.ingredients}
              </Text>
            ) : (
              <ListElement
                rank={1}
                Name="No listed nutrition facts"
                type="element"
              />
            )}
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
                subtitle={item.props.date + " " + item.props.meal}
                title={item.props.location}
                onPress={() =>
                  this.props.navigation.navigate("Map", {
                    ID: item.props.location
                  })
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
  allergens: {
    flex: 1,
    padding: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start"
  },
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
