import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { MapView } from "expo";
import Carousel from "react-native-snap-carousel";

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
      currLongitude: diningData.courts[1].latitude,
      region: {
        latitude: diningData.courts[0].latitude - 0.0005,
        longitude: diningData.courts[1].latitude,
        latitudeDelta: 0.004,
        longitudeDelta: 0.003
      }
    };
  }

  renderDiningCard = ({ item, index }) => {
    return (
      <Card header={item.name}>
        <Text>This is where data will go</Text>
        <Text>This is where data will go</Text>
        <Text>This is where data will go</Text>
        <Text>This is where data will go</Text>
      </Card>
    );
  };

  render() {
    var { height, width } = Dimensions.get("window");
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
            style={{ flex: 1 }}
            initialRegion={this.state.region}
            region={this.state.region}
          />
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
                this.setState({
                  region: {
                    latitude: this.state.diningCourts[index].latitude - 0.0005,
                    longitude: this.state.diningCourts[index].longitude,
                    latitudeDelta: 0.004,
                    longitudeDelta: 0.003
                  }
                });
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
