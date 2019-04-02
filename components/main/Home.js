import React from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { Button, Overlay } from "react-native-elements";

import Screen from "../Nav/Screen";
import CheckInCard from "./CheckInCard";
import RecommendationsCard from "./RecommendationsCard";
import ListElement from "../components/ListElement";
import Card from "../components/Card";
import Text from "../components/Text";

export default class Home extends React.Component {
  state = {
    meal: this.props.screenProps.functions.getNextMeal(),
    date: this.props.screenProps.functions.getDay(),
    showDate: false,
    showMeal: false
  };

  updateDate = () => {};

  updateMeal = () => {};

  render() {
    let diningCourt = ["Hillenbrand", "Wiley", "Windsor", "Ford", "Earhart"];
    let days = [];
    let day = new Date();

    for (let i = 0; i < 7; i++) {
      days.push((day.getDate() + i) % 7);
    }

    return (
      <Screen
        title="Home"
        navigation={this.props.navigation}
        screenProps={this.props.screenProps}
        backButton={false}
      >
        {this.props.screenProps.user == undefined ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 100
            }}
          >
            <Text
              style={{ paddingLeft: 50, paddingRight: 50, paddingBottom: 10 }}
            >
              Please Sign in to use account functionality.
            </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("Auth")}
              style={{
                backgroundColor: "#E86515",
                padding: 10,
                borderRadius: 10,
                flex: 1,
                justifyContent: "center"
              }}
            >
              <Text style={{ textAlign: "center" }}>Sign In</Text>
            </TouchableOpacity>
          </View>
        ) : this.props.screenProps.user.location != undefined ? (
          <CheckInCard
            navigation={this.props.navigation}
            screenProps={this.props.screenProps}
          />
        ) : (
          <View>
            <ListElement Name="Recommendations" type="expandable" />
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-evenly"
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  margin: 16,
                  padding: 8,
                  backgroundColor: "#E86515",
                  borderColor: "black",
                  borderRadius: 8,
                  borderWidth: 2
                }}
                onPress={() => this.setState({ showDate: true })}
              >
                <Text type="bold">{"Date: "}</Text>
                <Text>
                  {this.props.screenProps.globals.dayNames[this.state.date]}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  margin: 16,
                  padding: 8,
                  backgroundColor: "#E86515",
                  borderColor: "black",
                  borderRadius: 8,
                  borderWidth: 2
                }}
                onPress={() => this.setState({ showMeal: true })}
              >
                <Text type="bold">{"Meal: "}</Text>
                <Text>{this.state.meal}</Text>
              </TouchableOpacity>
            </View>
            {diningCourt.map((court, index) => (
              <RecommendationsCard
                diningCourt={{
                  name: court,
                  dishes: [
                    {
                      dish: "Cauliflower",
                      location: "Ford",
                      rating: 1.9
                    },
                    {
                      dish: "Creole Jambalaya",
                      location: "Ford",
                      rating: 4.3
                    },
                    {
                      dish: "Four Cheese Pizza",
                      location: "Ford",
                      rating: 3.2
                    },
                    {
                      dish: "Spicy Red Beans and Rice",
                      location: "Ford",
                      rating: 1.8
                    }
                  ],
                  aggregate: 11.2,
                  total: 4
                }}
                navigation={this.props.navigation}
                screenProps={this.props.screenProps}
                expand={index == 0}
              />
            ))}
            <Overlay
              overlayStyle={{ padding: 0 }}
              containerStyle={{ padding: 0, margin: 0 }}
              isVisible={this.state.showMeal}
            >
              <Card header="Choose a meal" overlay={true}>
                {this.props.screenProps.globals.mealNames.map(m => (
                  <Card
                    footer={[
                      {
                        text: m,
                        onPress: () =>
                          this.setState({
                            showMeal: false,
                            meal: m
                          })
                      }
                    ]}
                  />
                ))}
              </Card>
            </Overlay>
            <Overlay
              overlayStyle={{ padding: 0 }}
              containerStyle={{ padding: 0, margin: 0 }}
              isVisible={this.state.showDate}
            >
              <Card header="Choose a day" overlay={true}>
                <ScrollView>
                {days.map(d => (
                  <Card
                    footer={[
                      {
                        text: this.props.screenProps.globals.dayNames[d],
                        onPress: () =>
                          this.setState({ showDate: false, date: d })
                      }
                    ]}
                  />
                ))}
                </ScrollView>
              </Card>
            </Overlay>
          </View>
        )}
      </Screen>
    );
  }
}
