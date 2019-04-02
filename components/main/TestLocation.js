import React from "react";
import { NavigationEvents } from "react-navigation";
import { Button, StyleSheet, Text, View } from "react-native";
import { BlurView, Location, MapView, Notifications, TaskManager } from "expo";

const GEOFENCING_TASK = "geofencing";

export default class TestLocation extends React.Component {
  static navigationOptions = {
    title: "Geofencing Map"
  };

  mapViewRef = React.createRef();

  state = {
    isGeofencing: false,
    geofencingRegions: [],
    initialRegion: null
  };

  didFocus = async () => {
    await Location.requestPermissionsAsync();

    const { coords } = await Location.getCurrentPositionAsync();
    const isGeofencing = await Location.hasStartedGeofencingAsync(
      GEOFENCING_TASK
    );
    const geofencingRegions = await getSavedRegions();

    this.setState({
      isGeofencing,
      geofencingRegions,
      initialRegion: {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.004,
        longitudeDelta: 0.002
      }
    });
  };

  toggleGeofencing = async () => {
    if (this.state.isGeofencing) {
      await Location.stopGeofencingAsync(GEOFENCING_TASK);
      this.setState({ geofencingRegions: [] });
    } else {
      await Location.startGeofencingAsync(
        GEOFENCING_TASK,
        this.state.geofencingRegions
      );
    }
    this.setState({ isGeofencing: !this.state.isGeofencing });
  };

  centerMap = async () => {
    const { coords } = await Location.getCurrentPositionAsync();
    const mapView = this.mapViewRef.current;

    if (mapView) {
      mapView.animateToRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.004,
        longitudeDelta: 0.002
      });
    }
  };

  onMapPress = async ({ nativeEvent: { coordinate } }) => {
    const geofencingRegions = [...this.state.geofencingRegions];

    geofencingRegions.push({
      identifier: `${coordinate.latitude},${coordinate.longitude}`,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      radius: 50
    });
    this.setState({ geofencingRegions });

    if (await Location.hasStartedGeofencingAsync(GEOFENCING_TASK)) {
      // update existing geofencing task
      await Location.startGeofencingAsync(GEOFENCING_TASK, geofencingRegions);
    }
  };

  renderRegions() {
    const { geofencingRegions } = this.state;

    return geofencingRegions.map(region => {
      return (
        <MapView.Circle
          key={region.identifier}
          center={region}
          radius={region.radius}
          strokeColor="rgba(78,155,222,0.8)"
          fillColor="rgba(78,155,222,0.2)"
        />
      );
    });
  }

  render() {
    if (!this.state.initialRegion) {
      return <NavigationEvents onDidFocus={this.didFocus} />;
    }

    return (
      <View style={styles.screen}>
        <View style={styles.heading}>
          <BlurView tint="light" intensity={70} style={styles.blurView}>
            <Text style={styles.headingText}>
              {this.state.isGeofencing
                ? "You will be receiving notifications when the device enters or exits from selected regions."
                : "Click `Start geofencing` to start getting geofencing notifications. Tap on the map to select geofencing regions."}
            </Text>
          </BlurView>
        </View>

        <MapView
          ref={this.mapViewRef}
          style={styles.mapView}
          initialRegion={this.state.initialRegion}
          onPress={this.onMapPress}
          showsUserLocation
        >
          {this.renderRegions()}
        </MapView>
        <View style={styles.buttons}>
          <View style={styles.leftButtons}>
            <Button
              disabled={
                !this.state.isGeofencing &&
                this.state.geofencingRegions.length === 0
              }
              buttonStyle={styles.button}
              title={
                this.state.isGeofencing ? "Stop geofencing" : "Start geofencing"
              }
              onPress={this.toggleGeofencing}
            />
          </View>
          <Button
            buttonStyle={styles.button}
            title="Center"
            onPress={this.centerMap}
          />
        </View>
      </View>
    );
  }
}

async function getSavedRegions() {
  const tasks = await TaskManager.getRegisteredTasksAsync();
  const task = tasks.find(({ taskName }) => taskName === GEOFENCING_TASK);
  return task ? task.options.regions : [];
}

TaskManager.defineTask(GEOFENCING_TASK, async ({ data: { region } }) => {
  const stateString = Location.GeofencingRegionState[
    region.state
  ].toLowerCase();

  console.log(`${stateString} region ${region.identifier}`);

  await Notifications.presentLocalNotificationAsync({
    title: "Expo Geofencing",
    body: `You're ${stateString} a region ${region.identifier}`,
    data: region
  });
});

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  heading: {
    backgroundColor: "rgba(255, 255, 0, 0.1)",
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    zIndex: 2
  },
  blurView: {
    flex: 1,
    padding: 5
  },
  headingText: {
    textAlign: "center"
  },
  mapView: {
    flex: 1
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 10,
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0
  },
  leftButtons: {
    alignItems: "flex-start"
  },
  button: {
    padding: 10,
    marginVertical: 5
  }
});
