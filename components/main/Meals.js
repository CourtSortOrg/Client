import React from "react";
import { View, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Button, SearchBar } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";

import Screen from "../Nav/Screen";
import List from "../components/List";
import ListElement from "../components/ListElement";
import Text from "../components/Text";
import SearchList from "../components/SearchList";

export default class Meals extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: 0,
      meals: this.props.screenProps.meals,
      times: [
        { Order: 1, Name: "Breakfast" },
        { Order: 2, Name: "Lunch" },
        { Order: 3, Name: "Late Lunch" },
        { Order: 4, Name: "Dinner" }
      ],
      dateFilteredMeals: [],
      currentMeal: 0,
      resetSearch: false
    };

    this.state.times.forEach((t, index) => {
      if (t.Name == this.props.screenProps.functions.getNextMeal())
        this.state.currentMeal = index;
    });
  }

  componentDidMount() {
    this.updateMeals();
  }

  previousDate() {
    this.setState(
      {
        date: this.state.date - 1 < 0 ? 0 : this.state.date - 1
      },
      this.updateMeals
    );
  }

  nextDate() {
    this.setState(
      {
        date:
          this.state.date + 1 >= this.state.meals.length
            ? this.state.meals.length - 1
            : this.state.date + 1
      },
      this.updateMeals
    );
  }

  differentMeal(index) {
    this.setState(
      {
        currentMeal: index
      },
      this.updateMeals
    );
  }

  updateMeals() {
    let dateFilteredMeals;
    try {
      dateFilteredMeals = this.state.meals[this.state.date].Courts.map(
        court => {
          return {
            Name: court.Name,
            Meals: court.Meals.filter(
              meal =>
                meal.Order == this.state.times[this.state.currentMeal].Order &&
                meal.Stations.length != 0
            )
          };
        }
      );
      dateFilteredMeals = dateFilteredMeals.filter(
        obj => obj.Meals.length != 0
      );
    } catch (error) {
      dateFilteredMeals = [];
    }

    this.setState({
      dateFilteredMeals,
      resetSearch: !this.state.resetSearch
    });
  }

  filterMeals(meals, text) {
    const temp = meals;
    try {
      if (text.length != 0) {
        for (let i = 0; i < meals.length; i++) {
          for (let j = 0; j < meals[i].Meals[0].Stations.length; j++) {
            meals[i].Meals[0].Stations[j].Items = meals[i].Meals[0].Stations[
              j
            ].Items.filter(item => item.Name.includes(text));
          }
          meals[i].Meals[0].Stations = meals[i].Meals[0].Stations.filter(
            station => station.Items.length != 0
          );
        }
        meals = meals.filter(court => {
          return court.Meals[0].Stations.length != 0;
        });
      }
      return meals;
    } catch (error) {
      return temp;
    }
  }

  render() {
    const date = new Date();
    date.setDate(date.getDate() + this.state.date);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    return (
      <Screen
        screenProps={this.props.screenProps}
        title="Meals"
        navigation={{ ...this.props.navigation }}
        backButton={false}
        map={true}
      >
        <View style={{ flex: 2, height: 75, flexDirection: "row" }}>
          <TouchableOpacity
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={() => this.previousDate()}
          >
            <MaterialIcons
              size={32}
              name="keyboard-arrow-left"
              color="#E86515"
            />
          </TouchableOpacity>
          <View
            style={{ flex: 4, justifyContent: "center", alignItems: "center" }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text>{days[date.getDay()]}</Text>
            </View>
            <ScrollView
              style={{ flex: 1, flexDirection: "row" }}
              horizontal={true}
            >
              {this.state.times.map((meal, index) => (
                <TouchableOpacity
                  style={
                    this.state.currentMeal == index
                      ? {
                          borderStyle: "solid",
                          borderColor: "black",
                          borderBottomWidth: 3,
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          paddingLeft: 8,
                          paddingRight: 8
                        }
                      : {
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          paddingLeft: 8,
                          paddingRight: 8
                        }
                  }
                  key={index}
                  onPress={event => {
                    this.differentMeal(index);
                  }}
                >
                  <Text>{meal.Name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <TouchableOpacity
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={() => this.nextDate()}
          >
            <MaterialIcons
              size={32}
              name="keyboard-arrow-right"
              color="#E86515"
            />
          </TouchableOpacity>
        </View>
        {this.state.dateFilteredMeals.length != 0 ? (
          <SearchList
            navigation={this.props.navigation}
            filterFunction={this.filterMeals}
            reset={this.state.resetSearch}
            list={{
              list: this.state.dateFilteredMeals,
              type: "expandable",
              viewMore: {
                page: "Map",
                item: "Name"
              },
              subList: {
                list: "Meals",
                extend: "Stations",
                expand: true,
                type: "dropDown",
                subList: {
                  list: "Items",
                  type: "element",
                  subList: false,
                  viewMore: {
                    page: "MealItem",
                    item: "Name"
                  }
                }
              }
            }}
          />
        ) : (
          <ListElement
            type="expandable"
            Name="No meals found"
            subList={false}
          />
        )}
      </Screen>
    );
  }
}
