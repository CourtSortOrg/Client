import React from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";

import { ListItem, Rating, Button } from "react-native-elements";
import { Avatar, ButtonGroup, Overlay } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";

import Text from "../components/Text";
import Card from "../components/Card";
import VariableGrid from "../components/VariableGrid";
import Screen from "../Nav/Screen";
import ProfileList from "../components/ProfileList";
import GroupList from "../components/GroupList";
import AllergenIcon from "./AllergenIcon";

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    // Dummy data used for now, should not be hardcoded

    this.state = {
      selectedIndex: 0,
      isEditing: false,

      userName: "",
      initials: "",
      restrictions: ["Fish", "Tree Nuts", "Vegan", "Vegetarian"],

      image: "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
    };
    //this.props.screenProps.user.dietaryRestrictions
  }

  componentDidMount() {
    // If the user is a guest, send them to the sign in screen
    if (this.props.screenProps.user == undefined) {
      this.props.navigation.navigate("Auth");
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.screenProps.user == undefined) {
      this.props.navigation.navigate("Auth");
    }
  }

  // Method to change the currently selected index of the button group
  updateIndex = selectedIndex => {
    this.setState({ selectedIndex });
  };

  // Helper method to choose whether to render a component
  shouldRender = (expr, comp1, comp2) => {
    return expr ? comp1 : comp2;
  };

  sendFriendRequest = text => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/sendFriendRequest",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userHandle: this.props.screenProps.user.userHandle,
          friendHandle: text
        })
      }
    )
      .then(data => {
        console.error(`sendFriendRequest: Successful: ${data._bodyText}`);
        if (data._bodyText == "success")
          Alert.alert(
            "Friend Request",
            `You sent a friend request to ${text}.`,
            [
              {
                text: "Ok"
              }
            ],
            { cancelable: false }
          );
        else
          Alert.alert(
            "Friend Request",
            `Friend request to ${text} could not be sent.`,
            [
              {
                text: "Ok"
              }
            ],
            { cancelable: false }
          );
      })
      .catch(error => console.error(`sendFriendRequest: ${error}`));
  };

  render() {
    // Create an array of named buttons
    const buttons = ["Ratings", "Friends", "Groups"];
    // Retrieve user data from state
    const { friends, groups, ratings, selectedIndex } = this.state;

    if (this.props.screenProps.user == undefined) {
      this.props.navigation.navigate("Auth");
      return (
        <View>
          <Text>Navigation</Text>
        </View>
      );
    }

    return (
      <Screen
        backButton={false}
        navigation={{ ...this.props.navigation }}
        title="Profile"
      >
        {/* Card that shows user information */}
        <Card style={styles.profileInformation}>
          {/* Avatar to show profile picture */}
          <Avatar
            containerStyle={styles.profilePicture}
            rounded
            size={100}
            source={{ uri: this.state.image }}
            title={this.state.initials}
          />
          {/* Test to show profile name */}
          <Text style={styles.profileName}>
            {this.props.screenProps.user.userName}
          </Text>
          {/* Icon to navigate to Settings */}
          <MaterialIcons
            color="gray"
            name="settings"
            onPress={() => {
              this.props.navigation.navigate("Settings");
              // this.setState({ isEditing: true });
            }}
            size={28}
            style={styles.settingsIcon}
          />
        </Card>

        {/* TODO: Add user dietary restrictions */}
        <Card style={{ paddingVertical: 5 }}>
          <Text type="sectionName" style={{ textAlign: "center" }}>
            Dietary Restrictions
          </Text>
          <VariableGrid
            data={this.state.restrictions}
            colPattern={[4]}
            renderItem={(data, index) => {
              return (
                <View style={{ alignItems: "center" }}>
                  <AllergenIcon Name={data} />
                  <Text>{data}</Text>
                </View>
              );
            }}
          />
        </Card>

        {/* Card to show user ratings, friends, and groups */}

        <Card>
          {/* ButtonGroup to choose tab */}
          <ButtonGroup
            buttons={buttons}
            onPress={this.updateIndex}
            selectedIndex={selectedIndex}
          />

          {/* Render the ratings list if on the ratings tab */}
          {this.shouldRender(
            selectedIndex == 0,
            <RatingsList
              id={this.props.screenProps.user.id}
              ratings={this.props.screenProps.user.ratings}
            />,
            null
          )}

          {/* Render the friends list if on the friends tab */}
          {this.shouldRender(
            selectedIndex == 1,
            <ProfileList
              navigation={this.props.navigation}
              extendedSearch={this.sendFriendRequest}
              list={this.props.screenProps.user.friends}
            />,
            null
          )}

          {/* Render the groups list if on the groups tab */}
          {this.shouldRender(
            selectedIndex == 2,
            <GroupList
              navigation={this.props.navigation}
              extendedSearch={text =>
                this.props.navigation.navigate("GroupSettings")
              }
              list={this.props.screenProps.user.groups}
            />,
            null
          )}
        </Card>
      </Screen>
    );
  }
}

// Ratings List Component
// TODO: Add styles of Ratings List instead of hardcoding
function RatingsList(props) {
  return (
    <FlatList
      data={props.ratings}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <ListItem
          bottomDivider
          subtitle={
            <View style={{ alignItems: "flex-start", flexDirection: "row" }}>
              <Rating imageSize={20} readonly startingValue={item.userRating} />
              <Text style={{ marginLeft: 5 }}>({item.diningCourt})</Text>
            </View>
          }
          title={item.dish}
          topDivider
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  backgroundColor: {
    backgroundColor: "lightgray"
  },
  settingsIcon: {
    position: "absolute",
    top: 8,
    right: 8
  },
  profileInformation: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center"
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
  friendPicture: {
    borderColor: "#e9650d",
    borderWidth: 2
  }
});
