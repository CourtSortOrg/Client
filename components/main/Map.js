import React from "react";
import { Button, Dimensions, StyleSheet, View } from "react-native";
import Carousel from "react-native-snap-carousel";

import { MapView } from "expo";
const { Marker } = MapView;

import Header from "../Nav/Header";
import Footer from "../Nav/Footer";
import Card from "../Nav/Card";
import Text from "../Nav/Text";

export default class Map extends React.Component {
  constructor(props) {
    super(props);

    var diningData = require("../../testData/diningCourtData.json");

    this.state = {
      diningCourts: diningData.courts,
      currLatitute: diningData.courts[0].latitude,
      currLongitude: diningData.courts[0].latitude,
      region: {
        latitude: diningData.courts[0].latitude,
        longitude: diningData.courts[0].longitude,
        latitudeDelta: 0.004,
        longitudeDelta: 0.003
      }
    };
  }

  renderDiningCard = ({ item }) => {
    return (
      <Card header={item.name}>
        <Text>Breakfast:</Text>
        <Text>Lunch: </Text>
        <Text>Dinner: </Text>
        <Button
          title="View Court"
          color="#E86515"
          onPress={() => {
            alert(`Navigate to ${item.name}`);
          }}
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
            showsPointsOfInterest={false}
            style={{ flex: 1 }}
            initialRegion={this.state.region}
            customMapStyle={[
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
            ]}
          >
            {this.state.diningCourts.map((marker, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude
                }}
                title={marker.name}
              />
            ))}
          </MapView>
          <View style={{ position: "absolute", bottom: 25 }}>
            <Carousel
              ref={c => {
                this._carousel = c;
              }}
              data={this.state.diningCourts}
              renderItem={this.renderDiningCard}
              sliderWidth={width}
              itemWidth={width * 0.75}
              onSnapToItem={index => {
                this.mapView.animateToRegion(
                  {
                    latitude: this.state.diningCourts[index].latitude,
                    longitude: this.state.diningCourts[index].longitude,
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
