import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  View,
  ScrollView
} from "react-native";
import Carousel from "react-native-snap-carousel";

import { MapView } from "expo";
const { Marker } = MapView;

import Header from "../Nav/Header";
import Footer from "../Nav/Footer";
import Card from "../components/Card";
import Text from "../components/Text";
import List from "../components/List";
import Separator from "../components/Separator";

const locations = {
  Hillenbrand: {
    latitude: 40.4269,
    longitude: -86.9264,
    index: 0
  },
  Ford: { latitude: 40.4321, longitude: -86.9196, index: 1 },
  Wiley: {
    latitude: 40.4285,
    longitude: -86.9208,
    index: 2
  },
  Windsor: {
    latitude: 40.4266,
    longitude: -86.9213,
    index: 3
  },
  Earhart: { latitude: 40.4256, longitude: -86.9249, index: 4 }
};

let date = new Date();
const dateStr = `${date.getFullYear()}-${
  date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
}-${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;

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
    const initialCourt = this.props.navigation.getParam("ID", "NO-ID");
    this.state = {
      diningLocations: { locations: [] },
      initialIndex: locations[initialCourt].index,
      region: {
        latitude: locations[initialCourt].latitude - .001,
        longitude: locations[initialCourt].longitude,
        latitudeDelta: 0.004,
        longitudeDelta: 0.003
      },
      loading: true
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
          date: this.props.screenProps.functions.generateDateString(new Date())
        })
      }
    )
      .then(data => {
        try {
          let parsedJSON = JSON.parse(data._bodyText);
          this.setState({
            diningLocations: parsedJSON,
            loading: false
          });
        } catch (error) {
          console.error(`fetchDiningTimes: ${error}: ${data._bodyText}`);
        }
      })
      .catch(error => console.error(`fetchDiningTimes: ${error}`));
  }

  renderDiningCard = ({ item, index }) => {
    return (
      <Card
        buttonList={[
          {
            text: item.name,
            onPress: () => {
              this.props.navigation.navigate("DiningCourt", {
                name: item.name,
                location: {
                  latitude: locations[item.name].latitude,
                  longitude: locations[item.name].longitude
                },
                meals: this.state.diningLocations.locations[index].meals,
                busyness: this.state.diningLocations.locations[index].busyness
              });
            }
          }
        ]}
        footer={[
          {
            text: "Check In",
            onPress: () =>
              this.props.screenProps.functions.checkIn(item.name, () =>
                this.props.navigation.navigate("Home")
              )
          }
        ]}
      >
        <List
          list={item.meals.map((meal, index) => {
            if (meal.hours) {
              return {
                Name: `${meal.name}: ${convertToTwelveHour(
                  meal.hours.StartTime
                )}-${convertToTwelveHour(meal.hours.EndTime)}`
              };
            } else {
              return {
                Name: `${meal.name}: Not serving`
              };
            }
          })}
          type="element"
          subList={false}
          rank={1}
        />
      </Card>
    );
  };

  render() {
    var { height, width } = Dimensions.get("window");
    return (
      <View style={{ flex: 1 }}>
        <Header
          screenProps={this.props.screenProps}
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
            {this.state.loading ? null : (
              <Carousel
                ref={c => {
                  this._carousel = c;
                }}
                data={
                  this.state.diningLocations.locations
                    ? this.state.diningLocations.locations
                    : []
                }
                renderItem={this.renderDiningCard}
                sliderWidth={width}
                itemWidth={width * 0.75}
                firstItem={this.state.initialIndex}
                onSnapToItem={index => {
                  var latlng =
                    locations[this.state.diningLocations.locations[index].name];
                  this.mapView.animateToRegion(
                    {
                      latitude: latlng.latitude - .001,
                      longitude: latlng.longitude,
                      latitudeDelta: 0.004,
                      longitudeDelta: 0.003
                    },
                    500
                  );
                }}
              />
            )}
          </View>
        </View>

        <Footer
          styles={styles}
          screenProps={this.props.screenProps}
          navigation={{ ...this.props.navigation }}
        />
      </View>
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
