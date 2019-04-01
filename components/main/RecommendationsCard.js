import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Rating } from "react-native-elements";

import Card from "../components/Card";
import Separator from "../components/Separator";
import Text from "../components/Text";
import ProfileList from "../components/ProfileList";
import List from "../components/List";
import ListElement from "../components/ListElement";

export default class Recommendations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: undefined,
      renderReport: false,
      renderBusyness: false,
      hasRatedCourt: false,
      userCourtRating: 0
    };
  }

  componentDidMount = () => {
    //this.getMalfunctions();
    this.props.navigation.addListener("willFocus", payload => {
      //this.getMalfunctions();
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
          diningCourt: this.props.screenProps.user.location
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

  render() {
    return (
      <Card
        header={[
          {
            text: "Dining court name",
            onPress: () => console.log("take me to the dining court")
          }
        ]}
        footer={[
          {
            text: "Check In",
            onPress: () =>
              this.props.screenProps.functions.checkIn("Hillenbrand")
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
              padding: 16
            }}
          >
            <Text type="bold">{"Meal: "}</Text>
            <Text>{this.props.screenProps.globals.mealNames[0]}</Text>
          </View>
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

        <Card header="Dishes" />

        <Card header="Friends Checked In">
          <ProfileList
            navigation={this.props.navigation}
            list={this.props.screenProps.user.friends.filter(
              f => f.location == "Hillenbrand" && f.status == 1
            )}
          />
        </Card>

        <Card header="Reports">
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
