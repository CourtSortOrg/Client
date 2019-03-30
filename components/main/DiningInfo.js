import React from "react";
import { View } from "react-native";
import Text from "../components/Text";
import Screen from "../Nav/Screen";
import Card from "../components/Card";
import { Rating } from "react-native-ratings";
import { MapView } from "expo";
const { Marker } = MapView;

export default class DiningInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Screen
        title="Work in Progress"
        screenProps={this.props.screenProps}
        showNavigation={false}
        navigation={{ ...this.props.navigation }}
        backButton={true}
      >
        <Card header={"Overall Rating"}>
          <Rating readonly />
        </Card>
        <Card header={"Today's Hours"} />
        <Card header={"Time Spent"} />
        <Card header={"Location"}>
          <MapView
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
          >
            <Marker coordinate={{ latitude: 37.78825, longitude: -122.4324 }} />
          </MapView>
        </Card>
      </Screen>
    );
  }
}
