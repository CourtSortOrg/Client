import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, ButtonGroup, ListItem } from "react-native-elements";
import { Rating } from "react-native-elements";

import Screen from "../Nav/Screen";
import AllergenIcon from "./AllergenIcon";
import NutritionFact from "./NutritionFact";
import List from "../components/List";
import Text from "../components/Text";
import Card from "../components/Card";
import ListElement from "../components/ListElement";

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
      ],
      rating: 0,
      userRating: 0
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
          this.setState({
            ...JSON.parse(data._bodyText)
          });
        } catch (error) {
          console.error(`fetchAllOffered: ${error}: ${data._bodyText}`);
        }
      })
      .catch(error => console.error(`fetchAllOffered: ${error}`));
    //TODO: Call getRating on this item
    //TODO: Call getRating for user?
  }

  renderElement(item) {
    return <NutritionFact {...item} />;
  }

  renderNutrition() {
    if (this.state.selectedIndex == 0) {
      return (
        <View>
          <Card header="Allergens">
            {this.state.allergens.length != 0 ? (
              <View style={styles.allergens}>
                {this.state.allergens
                  .filter(allergen => allergen.Value)
                  .map((allergen, index) => {
                    return <AllergenIcon key={index} {...allergen} />;
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

  renderRatings() {
    if (this.state.selectedIndex == 2) {
      return (
        <View>
          <Card header={"Overall Rating"}>
            <View style={{ alignItems: "center" }}>
              <Text type="sectionName">
                {`${this.state.rating}`} out of 5 stars
              </Text>
              <Rating
                style={{ margin: 10 }}
                imageSize={45}
                readonly
                startingValue={this.state.rating}
              />
            </View>
          </Card>
          {this.props.screenProps.user ? (
            <Card header={`Your Rating`}>
              <View>
                <View style={{ alignItems: "center" }}>
                  <Text type="sectionName">
                    {`${this.state.userRating}`} out of 5 stars
                  </Text>
                  <Rating
                    style={{ marginTop: 10 }}
                    fractions={1}
                    imageSize={45}
                    startingValue={this.state.userRating}
                    onFinishRating={userRating => {
                      this.setState({ userRating: userRating });
                    }}
                  />
                  <Text style={{ color: "gray", marginBottom: 10 }}>
                    Press and drag to edit rating
                  </Text>
                </View>

                <Button
                  title="Submit Rating"
                  buttonStyle={{ backgroundColor: "#e9650d" }}
                  titleStyle={{ color: "black", fontFamily: "Quicksand-Bold" }}
                  onPress={() => {
                    Alert.alert(
                      "Update meal rating?",
                      `By clicking confirm you will update your rating for ${
                        this.state.name
                      }`,
                      [
                        {
                          text: "Cancel",
                          onPress: () => console.log("Cancel Pressed"),
                          style: "cancel"
                        },
                        {
                          text: "Confirm",
                          onPress: () => console.log("Confirm Pressed")
                        }
                      ]
                    );
                  }}
                />
              </View>
            </Card>
          ) : (
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => {
                this.props.navigation.navigate("Auth");
              }}
            >
              <Text style={{ textDecorationLine: "underline" }}>
                Sign to rate dishes
              </Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }
  }

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
