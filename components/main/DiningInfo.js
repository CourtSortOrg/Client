import React from "react";
import { FlatList } from "react-native";
import Screen from "../Nav/Screen";
import Card from "../components/Card";
import { Rating } from "react-native-ratings";
import { MapView } from "expo";
import Text from "../components/Text";
import { ListItem } from "react-native-elements";
const { Marker } = MapView;

export default class DiningInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { rating: 0, ...this.props.navigation.state.params };
    console.log(this.state);
    this.getDiningInfo(this.state.name);
  }

  getDiningInfo = async name => {
    let response = await fetch(
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
    let parsedData = response._bodyText;
    if (parsedData > 0) {
      parsedData = (Math.round(parsedData * 2) / 2).toFixed(1);
    }
    let date = new Date();
    const dateStr = `${date.getFullYear()}-${
      date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    }-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;

    this.setState({ rating: parseFloat(parsedData) });
  };

  mealKeyExtractor = meal => meal.name;

  renderMealTime = ({ item }) => {
    console.log(item);
    return (
      <ListItem
        title={item.name}
        subtitle={`${convertToTwelveHour(
          item.hours.StartTime
        )} - ${convertToTwelveHour(item.hours.EndTime)}`}
        bottomDivider
        topDivider
      />
    );
  };

  render() {
    const { name, location, rating, meals } = this.state;
    return (
      <Screen
        title={name}
        screenProps={this.props.screenProps}
        showNavigation={false}
        navigation={{ ...this.props.navigation }}
        backButton={true}
      >
        <Card header={"Overall Rating"}>
          <Rating readonly startingValue={rating} />
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
            <Marker
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