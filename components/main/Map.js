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
      diningCourts: diningData.courts
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
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
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
