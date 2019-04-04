import React from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
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
      busyness: "",
      malfunctions: [],
      rating: 0,
      refreshing: true,
      ...this.props.navigation.state.params
    };
    console.log(this.state);
  }

  componentDidMount() {
    this.refreshDiningInfo();
  }

  refreshDiningInfo = () => {
    this.setState({ refreshing: true });
    this.getDiningInfo(() => {
      this.setState({ refreshing: false });
    });
  };

  getDiningInfo = async callback => {
    let data = await fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/getAggregateDiningCourtRatings",
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
    let rating = parseFloat((Math.round(data._bodyText * 2) / 2).toFixed(1));

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

    await this.setState({
      busyness: busyness,
      malfunctions: malfunctions,
      rating: rating
    });
    if (callback) callback();
  };

  mealKeyExtractor = meal => meal.name;

  renderMealTime = ({ item }) => {
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

  renderBusynessBlock(busyness) {
    return (
      <View style={styles.busynessBlock}>
        <Text type="sectionName" style={styles.busynessHeader}>
          Busyness:
        </Text>
        <Text style={styles.busynessSubHeader}>{busyness}</Text>
      </View>
    );
  }

  renderRatingBlock(rating) {
    return (
      <View style={styles.ratingBlock}>
        <Text type="sectionName" style={styles.ratingHeader}>
          Rating:
        </Text>
        <Rating
          readonly
          style={styles.ratingIcons}
          startingValue={rating}
          imageSize={25}
        />
        <Text style={styles.ratingSubHeader}>{`(${rating}/5)`}</Text>
      </View>
    );
  }

  renderMalfunctionsBlock(malfunctions) {
    if (malfunctions.length == 0) {
      return null;
    }
    return (
      <View>
        <Separator />
        <View style={styles.malfunctionsBlock}>
          <Text type="sectionName" style={styles.subHeader}>
            Malfunctions
          </Text>
          <FlatList
            keyExtractor={this.malfunctionKeyExtractor}
            data={malfunctions}
            renderItem={this.renderMalfunction}
          />
        </View>
      </View>
    );
  }

  renderHoursBlock(meals) {
    return (
      <FlatList
        keyExtractor={this.mealKeyExtractor}
        data={meals}
        renderItem={this.renderMealTime}
      />
    );
  }

  renderMapBlock(location) {
    return (
      <MapView
        rotateEnabled={false}
        scrollEnabled={false}
        style={styles.mapBlock}
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
    );
  }

  render() {
    const {
      busyness,
      location,
      malfunctions,
      meals,
      name,
      rating
    } = this.state;

    let refreshController = (
      <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={this.refreshDiningInfo}
      />
    );
    return (
      <Screen
        title={name}
        screenProps={this.props.screenProps}
        showNavigation={false}
        navigation={{ ...this.props.navigation }}
        backButton={true}
        refreshControl={refreshController}
      >
        {/* Card to display general dining court information */}
        <Card header={"Important Information"}>
          {this.renderBusynessBlock(busyness)}
          {this.renderRatingBlock(rating)}
          {this.renderMalfunctionsBlock(malfunctions)}
        </Card>
        {/* Card to display dining court hours */}
        <Card header={"Today's Hours"}>{this.renderHoursBlock(meals)}</Card>
        {/* Card to display time spent by user in dining cours */}
        <Card header={"Time Spent"} />
        {/* Card to display location of dining court */}
        <Card header={"Location"}>{this.renderMapBlock(location)}</Card>
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
  busynessBlock: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  busynessHeader: {
    fontSize: 20,
    marginHorizontal: 5
  },
  busynessSubHeader: {
    marginHorizontal: 3
  },
  ratingBlock: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  ratingIcons: {
    marginHorizontal: 5
  },
  ratingHeader: {
    fontSize: 20,
    marginHorizontal: 5
  },
  ratingSubHeader: {
    marginHorizontal: 3
  },
  malfunctionsBlock: {
    marginVertical: 15
  },
  mapBlock: {
    flex: 1,
    height: 200
  },
  subHeader: {
    textAlign: "center",
    fontSize: 20
  },
  description: {
    textAlign: "center"
  }
});
