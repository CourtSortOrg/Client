import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";

import { Avatar, ButtonGroup, Divider } from "react-native-elements";
import { EvilIcons } from "@expo/vector-icons";

import Screen from "../Nav/Screen";

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Profile Name",
      initials: "IN",
      allergens: ["Soy", "Gluten"],
      selectedIndex: 0,
      numbers: []
    };
    for (var i = 0; i < 25; i++) {
      this.state.numbers.push(i);
    }
  }

  openFriends = () => {
    Alert.alert("Clicked Friends", "Navigate to friends page");
    //this.props.navigation.navigate("Friend")
  };

  openGroups = () => {
    Alert.alert("Clicked Groups", "Navigate to groups page");
    //this.props.navigation.navigate("Group")
  };

  openRatings = () => {
    Alert.alert("Clicked Ratings", "Navigate to ratings page");
  };

  updateIndex = selectedIndex => {
    this.setState({ selectedIndex });
  };

  shouldRender = (expr, comp1, comp2) => {
    if (expr) return comp1;
    else return comp2;
  };

  render() {
    const buttons = ["Ratings", "Friends", "Groups"];
    const { selectedIndex } = this.state;

    return (
      <Screen
        title="Profile"
        navigation={{ ...this.props.navigation }}
        backButton={false}
      >
        <ScrollView style={{ backgroundColor: "lightgray" }}>
          <View style={styles.profileInformation}>
            <Avatar
              title={this.state.initials}
              containerStyle={styles.profilePicture}
              rounded
              source={{
                uri:
                  "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
              }}
              size={100}
            />
            <Text style={styles.profileName}>{this.state.name}</Text>
            <EvilIcons
              name="pencil"
              size={35}
              color="gray"
              style={{ position: "absolute", top: 4, right: 4 }}
            />

            <Divider style={{ backgroundColor: "lightgray", height: 1 }} />

            {this.state.allergens.length > 0 ? (
              <View style={{ flex: 1, borderRadius: 5 }}>
                <View
                  style={{
                    backgroundColor: "white",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    paddingVertical: 5
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>
                    Allergens and Preferences
                  </Text>
                  {this.state.allergens.map((data, key) => {
                    return <Text key={key}>{data}</Text>;
                  })}
                </View>
              </View>
            ) : null}
          </View>

          <View
            style={{
              backgroundColor: "white",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginHorizontal: 5,
              marginBottom: 5,
              borderRadius: 5
            }}
          >
            <ButtonGroup
              onPress={this.updateIndex}
              selectedIndex={selectedIndex}
              buttons={buttons}
              containerStyle={{ height: 40 }}
            />
            {this.shouldRender(
              this.state.selectedIndex == 0,
              this.state.numbers.map((data, key) => { return(<Text key={key}>Rating #{data}</Text>)}) ,
              null
            )}
            {this.shouldRender(
              this.state.selectedIndex == 1,
              this.state.numbers.map((data, key) => { return(<Text key={key}>Friend #{data}</Text>)}) ,
              null
            )}
            {this.shouldRender(
              this.state.selectedIndex == 2,
              this.state.numbers.map((data, key) => { return(<Text key={key}>Group #{data}</Text>)}) ,
              null
            )}
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  profileInformation: {
    backgroundColor: "white",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    borderRadius: 5
  },
  profilePicture: {
    borderColor: "#e9650d",
    borderWidth: 4,
    marginVertical: 10
  },
  profileName: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: 20
  },
  profileActions: {
    flexDirection: "row",
    height: 45
  },
  actionButton: {
    backgroundColor: "#e8ebef",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  actionButtonText: {
    fontWeight: "bold"
  }
});
