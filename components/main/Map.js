import React from "react";
import { Button, Dimensions, StyleSheet, View } from "react-native";
import Carousel from "react-native-snap-carousel";

import { MapView } from "expo";
const { Marker } = MapView;

import Header from "../Nav/Header";
import Footer from "../Nav/Footer";
import Card from "../Nav/Card";
import Text from "../Nav/Text";
import List from "./List";

const locations = {
  Earhart: { latitude: 40.4256, longitude: -86.9249 },
  Hillenbrand: {
    latitude: 40.4269,
    longitude: -86.9264
  },
  Ford: { latitude: 40.4321, longitude: -86.9196 },
  Wiley: {
    latitude: 40.4285,
    longitude: -86.9208
  },
  Windsor: {
    latitude: 40.4266,
    longitude: -86.9213
  }
};

const mapStyle = [
  {
    featureType: "poi.business",
    stylers: [
      {
        visibility: "off"
      }
    ]
  },
  {
    featureType: "poi.park",
    elementType: "labels.text",
    stylers: [
      {
        visibility: "off"
      }
    ]
  }
];

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      diningLocations: { locations: [] },
      region: {
        latitude: locations["Hillenbrand"].latitude,
        longitude: locations["Hillenbrand"].longitude,
        latitudeDelta: 0.004,
        longitudeDelta: 0.003
      }
    };
  }

  componentDidMount() {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/fetchDiningTimes",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          date: "2019-02-18" //TODO: Don't hardcode this
        })
      }
    ).then(data => {
      this.setState({ diningLocations: JSON.parse(data._bodyText) });
    });
  }

  renderDiningCard = ({ item }) => {
    return (
      <Card header={item.name}>
        <List
          list={item.meals.map((meal, index) => {
            return {
              Name: `${meal.name}: ${meal.hours.StartTime} - ${
                meal.hours.EndTime
              }`
            };
          })}
          type="element"
          subList={false}
          rank={1}
        />
      </Card>
    );
  };

  render() {
    var { width } = Dimensions.get("window");
    return (
      <View style={{ flex: 1 }}>
        <Header
          styles={styles}
          title="Map"
          navigation={{ ...this.props.navigation }}
          backButton={true}
        />
        <View style={{ flex: 1, flexGrow: 1 }}>
          <MapView
            ref={ref => {
              this.mapView = ref;
            }}
            style={{ flex: 1 }}
            initialRegion={this.state.region}
            customMapStyle={mapStyle}
          >
            {Object.keys(locations).map((key, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: locations[key].latitude,
                  longitude: locations[key].longitude
                }}
                title={key}
              />
            ))}
          </MapView>
          <View style={{ position: "absolute", bottom: 25 }}>
            <Carousel
              ref={c => {
                this._carousel = c;
              }}
              data={this.state.diningLocations.locations}
              renderItem={this.renderDiningCard}
              sliderWidth={width}
              itemWidth={width * 0.75}
              onSnapToItem={index => {
                var latlng =
                  locations[this.state.diningLocations.locations[index].name];
                this.mapView.animateToRegion(
                  {
                    latitude: latlng.latitude,
                    longitude: latlng.longitude,
                    latitudeDelta: 0.004,
                    longitudeDelta: 0.003
                  },
                  500
                );
              }}
            />
          </View>
        </View>

        <Footer styles={styles} navigation={{ ...this.props.navigation }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    aspectRatio: 1,
    height: "55%"
  }
});
