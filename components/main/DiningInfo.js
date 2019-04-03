import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { ListItem, Rating } from "react-native-elements";
import { MapView } from "expo";

import Card from "../components/Card";
import Screen from "../Nav/Screen";
import Separator from "../components/Separator";
import Text from "../components/Text";

export default class DiningInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      malfunctions: [],
      rating: 0,
      ...this.props.navigation.state.params
    };
    console.log(this.state);
    this.getDiningInfo(this.state.name);
  }

  getDiningInfo = async name => {
    let data = await fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/getAggregateDiningCourtRatings",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          diningCourt: name
        })
      }
    );
    let parsedData = parseFloat((Math.round(data._bodyText * 2) / 2).toFixed(1));

    data = await fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/getMalfunctionReports",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          diningCourt: this.state.name
        })
      }
    );
    let malfunctions = await JSON.parse(data._bodyText);

    data = await fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/getBusyness",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          diningCourt: this.state.name
        })
      }
    );

    let busyness;
    if (data._bodyText != "No ratings") {
      busyness = this.props.screenProps.globals.busynessMessage[data._bodyText];
    } else {
      busyness = data._bodyText;
    }

    console.log(busyness);

    this.setState({
      busyness: busyness,
      malfunctions: malfunctions,
      rating: parseFloat(parsedData)
    });
  };

  mealKeyExtractor = meal => meal.name;

  renderMealTime = ({ item }) => {
    console.log(item);
    let subtitle = "Not Serving";
    if (item.hours) {
      subtitle = convertToTwelveHour(item.hours.StartTime);
      subtitle += " - ";
      subtitle += convertToTwelveHour(item.hours.EndTime);
    }
    return (
      <ListItem
        title={item.name}
        subtitle={subtitle}
        bottomDivider
        topDivider
      />
    );
  };

  malfunctionKeyExtractor = malfunction => malfunction.malfunction;

  renderMalfunction = ({ item, index }) => {
    let reportString = `Reported ${item.numOfReports} time`;
    reportString += item.numOfReports > 1 ? "s" : "";
    return (
      <ListItem
        title={item.malfunction}
        subtitle={reportString}
        bottomDivider
        topDivider={index != 0}
      />
    );
  };

  render() {
    const { name, location, rating, malfunctions, meals } = this.state;
    return (
      <Screen
        title={name}
        screenProps={this.props.screenProps}
        showNavigation={false}
        navigation={{ ...this.props.navigation }}
        backButton={true}
      >
        <Card header={"Important Information"}>
          <View style={styles.ratingDiv}>
            <Text type="sectionName" style={styles.subHeader}>
              Rating
            </Text>
            <Rating readonly startingValue={rating} />
            <Text style={styles.description}>{`${rating} out of 5 stars`}</Text>
          </View>

          <Separator />
          <Text type="sectionName" style={styles.subHeader}>
            Malfunctions
          </Text>
          <FlatList
            keyExtractor={this.malfunctionKeyExtractor}
            data={malfunctions}
            renderItem={this.renderMalfunction}
          />
        </Card>
        <Card header={"Today's Hours"}>
          <FlatList
            keyExtractor={this.mealKeyExtractor}
            data={meals}
            renderItem={this.renderMealTime}
          />
        </Card>
        <Card header={"Time Spent"} />
        <Card header={"Location"}>
          <MapView
            rotateEnabled={false}
            scrollEnabled={false}
            style={{ flex: 1, height: 200 }}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0025,
              longitudeDelta: 0.0025
            }}
          >
            <MapView.Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude
              }}
            />
          </MapView>
        </Card>
      </Screen>
    );
  }
}

function convertToTwelveHour(rawTime) {
  var hour = parseInt(rawTime.substring(0, 2));
  var suffix = hour >= 12 ? "PM" : "AM";
  rawTime =
    ((hour + 11) % 12) + 1 + ":" + rawTime.substring(3, 5) + " " + suffix;
  return rawTime;
}

const styles = StyleSheet.create({
  ratingDiv: {
    marginVertical: 15
  },
  subHeader: {
    textAlign: "center",
    fontSize: 20
  },
  description: {
    textAlign: "center",
    marginBottom: 15
  }
});
