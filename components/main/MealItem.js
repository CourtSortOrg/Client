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
import Separator from "../components/Separator";

export default class MealItem extends React.Component {
  constructor(props) {
    super(props);

    let name = this.props.navigation.getParam("ID", "NO-ID");
    let rating = 0;
    if (this.props.screenProps.user != undefined)
      for (let i in this.props.screenProps.user.ratings) {
        if (this.props.screenProps.user.ratings[i].dish == name) {
          rating = this.props.screenProps.user.ratings[i].rating;
        }
      }

    this.state = {
      loading: false,

      name: name,
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
      ],
      rating: 0,
      userRating: rating
    };
  }

  updateIndex = selectedIndex => {
    this.setState({ selectedIndex });
  };

  addRating = async (dishName, rating, userHandle) => {
    fetch("https://us-central1-courtsort-e1100.cloudfunctions.net/addRating", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        dish: dishName,
        rating: rating,
        userHandle: userHandle
      })
    })
      .then(() => {
        this.getRating(dishName);
        this.props.screenProps.functions.updateRatings();
      })
      .catch(error => console.error(`addRating: ${error}`));
  };

  getRating = async dishName => {
    fetch("https://us-central1-courtsort-e1100.cloudfunctions.net/getRating", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        dish: dishName
      })
    })
      .then(data => {
        let parsedData = JSON.parse(data._bodyText);
        parsedData = parsedData.rating ? parsedData.rating : 0;
        if (parsedData > 0) {
          parsedData = Math.round(parsedData * 100) / 100;
        }
        this.setState({ rating: parsedData });
      })
      .catch(error => console.error(`getRating: ${error}`));
  };

  componentDidMount = async () => {
    this.setState({ loading: true });

    await this.getRating(this.state.name);

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
            },
            () => {
              this.setState(
                {
                  allergens: this.state.allergens.filter(a => a.Value == true)
                },
                () => {
                  allergens = this.state.allergens.map(a => ({
                    ...a,
                    enabled:
                      this.props.screenProps.user.dietaryRestrictions.find(
                        b => {
                          if (b == a.Name) {
                            this.setState({
                              warning: true
                            });
                            return true;
                          }
                          return false;
                        }
                      ) != undefined
                  }));
                  this.setState({
                    allergens,
                    loading: false
                  });
                }
              );
            }
          );
        } catch (error) {
          console.error(`fetchAllOffered: ${error}: ${data._bodyText}`);
        }
      })
      .catch(error => console.error(`fetchAllOffered: ${error}`));
    //TODO: Call getRating on this item
    //TODO: Call getRating for user?
  };

  renderElement(item) {
    return <NutritionFact {...item.props} />;
  }

  renderNutrition() {
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
                <Separator />
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
          {this.props.screenProps.user != undefined ? (
            <Card
              header={`Your Rating`}
              footer={[{ text: "Submit Rating", onPress: this.confirmRating }]}
            >
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

  confirmRating = () => {
    Alert.alert(
      "Update meal rating?",
      `By clicking confirm you will update your rating for ${this.state.name}`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Confirm",
          onPress: () => {
            this.addRating(
              this.state.name,
              this.state.userRating,
              this.props.screenProps.user.userHandle
            );
          }
        }
      ]
    );
  };

  render() {
    const buttons = ["Nutrition", "Serving", "Ratings"];
    return (
      <Screen
        screenProps={this.props.screenProps}
        title={"Dish"}
        navigation={{ ...this.props.navigation }}
        backButton={true}
        loading={this.state.loading}
      >
        <Card
          header={this.state.name}
          buttonList={[
            {
              text: "Nutrition",
              style: { fontSize: 16 },
              onPress: this.updateIndex
            },
            {
              text: "Serving",
              style: { fontSize: 16 },
              onPress: this.updateIndex
            },
            {
              text: "Ratings",
              style: { fontSize: 16 },
              onPress: this.updateIndex
            }
          ]}
        >
          {this.renderNutrition()}
          {this.renderServing()}
          {this.renderRatings()}
        </Card>
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
