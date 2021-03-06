import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Rating } from "react-native-elements";

import { MaterialIcons } from "@expo/vector-icons";

import Card from "../components/Card";
import Separator from "../components/Separator";
import Text from "../components/Text";
import ProfileList from "../components/ProfileList";
import List from "../components/List";
import ListElement from "../components/ListElement";

class RecommendationsCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: undefined,
      renderReport: false,
      renderBusyness: false,
      hasRatedCourt: false,
      userCourtRating: 0,
      dishes: this.props.court.dishes.sort((a, b) => b.rating - a.rating)
    };

    this.state.dishes = this.state.dishes.splice(0, 5);
  }

  componentDidMount = () => {
    this.getMalfunctions();
    this.props.navigation.addListener("willFocus", payload => {
      this.getMalfunctions();
    });
  };

  getMalfunctions = () => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/getMalfunctionReports",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          diningCourt: this.props.court.court
        })
      }
    )
      .then(async data => {
        let mal = await JSON.parse(data._bodyText);

        if (mal.length != 0)
          this.setState({
            reports: mal
          });
      })
      .catch(error => console.error(`getMalfunctions: ${error}`));
  };

  renderDish = item => {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate("MealItem", {
            ID: item.props.Name
          })
        }
        style={{
          padding: 8,
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor:
            item.props.backgroundIndex % 2 == 0 ? "white" : "#ccc"
        }}
      >
        <Text type="bold">{item.props.Name}</Text>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end"
          }}
        >
          <Text>{item.props.rating}</Text>
          <MaterialIcons size={32} name="keyboard-arrow-right" color="black" />
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <Card
        expand={this.props.expand}
        header={`${this.props.index + 1}. ${this.props.court.court}`}
        buttonList={[
          {
            text: "Go to dining court page",
            onPress: () =>
              this.props.navigation.navigate("Map", {
                ID: this.props.court.court
              })
          }
        ]}
        footer={[
          {
            text: "Check In",
            onPress: () =>
              this.props.screenProps.functions.checkIn(this.props.court.court)
          }
        ]}
      >
        <View
          style={{
            flex: 1
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              padding: 16,
              paddingTop: 0
            }}
          >
            <Text type="bold">{"Busyness: "}</Text>
            <Text>{this.props.screenProps.globals.busynessMessage[0]}</Text>
          </View>
        </View>

        {this.props.friends === true && (
          <Card header="Friends Checked In">
            <ProfileList
              screenProps={this.props.screenProps}
              navigation={this.props.navigation}
              list={this.props.screenProps.user.friends.filter(
                f => f.location == this.props.court.court && f.status == 1
              )}
            />
          </Card>
        )}

        <Card header="Top Rated">
          {this.state.dishes.length > 0 ? (
            <List
              list={this.state.dishes.map((d, index) => ({
                ...d,
                backgroundIndex: index
              }))}
              renderElement={this.renderDish}
              type="element"
            />
          ) : (
            <ListElement
              Name={
                "Please rate dishes to receive personalized recommendations."
              }
              type="element"
            />
          )}
        </Card>

        <Card header="Reports" expand={this.state.reports != undefined}>
          {this.state.reports != undefined ? (
            <List
              list={this.state.reports.map(item => {
                return {
                  Name: `${item.malfunction} with ${item.numOfReports} reports`
                };
              })}
              type="element"
              rank={1}
            />
          ) : (
            <ListElement Name="No Reports" rank={1} type="element" />
          )}
        </Card>
      </Card>
    );
  }
}

export default RecommendationsCard;
