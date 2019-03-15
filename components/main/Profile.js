import React from "react";
import * as firebase from "firebase";
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import { ListItem, Rating, Button } from "react-native-elements";
import { Avatar, ButtonGroup, Icon, Overlay } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";

import Text from "../components/Text";
import Card from "../components/Card";
import Screen from "../Nav/Screen";
import SearchList from "../components/SearchList";

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    // Dummy data used for now, should not be hardcoded
    //var ratingData = require("../../testData/ratingData.json");
    //var groupData = require("../../testData/groupData.json");

    this.state = {
      selectedIndex: 0,
      isEditing: false,
      changeStatus: false,

      name: "",
      initials: "",
      restrictions: "",
      status: 0,

      image: "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png"
    };
  }

  componentDidMount() {
    // If the user is a guest, send them to the sign in screen
    if (this.props.screenProps.user == undefined) {
      this.props.navigation.navigate("Auth");
    }
  }

  // Method to change the currently selected index of the button group
  updateIndex = selectedIndex => {
    this.setState({ selectedIndex });
  };

  // Method to change the user's current status
  // TODO: Firebase call
  updateStatus = status => {
    this.setState({status, changeStatus: false})
  }

  // Helper method to choose whether to render a component
  shouldRender = (expr, comp1, comp2) => {
    return expr ? comp1 : comp2;
  };

  getUserStatus = () => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/getUserStatus",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: this.state.name
        })
      }
    ).then(data => {
      // Update the user's current stauts
    })
    .catch(error => `getUserStatus: ${error}`);
  };

  setUserStatus = () => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/setUserStatus",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: this.state.name,
          status: this.state.status
        })
      }
    )
    /*
    .then(data => {
      // Update the user's current stauts
    })
    .catch(error => `setUserStatus: ${error}`);
    */
  };

  deleteAccount = () => {
    //TODO: Delete user's ratings
    //TODO: Remove user from all groups

    user = firebase.auth().currentUser;
    //get list of friends
    //get list of individual ratings
    user
      .delete()
      .then(() => {
        fetch(
          "https://us-central1-courtsort-e1100.cloudfunctions.net/removeFromAllFriends",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name: this.props.screenProps.user.id
            })
          }
        )
          .then(data => console.log(data._bodyText))
          .catch(error =>
            console.log(`deleteAccount: removeFromAllFriends: ${error}`)
          );
        fetch(
          "https://us-central1-courtsort-e1100.cloudfunctions.net/removeUserFromDatabase",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name: this.props.screenProps.user.id
            })
          }
        )
          .then(data => console.log(data._bodyText))
          .catch(error =>
            console.log(`deleteAccount: removeUserFromDatabase: ${error}`)
          );
        //navigate to SignIn Screen
        this.props.screenProps.functions.updateUser();
        this.props.navigation.navigate("Auth");
        this.setState({ isEditing: false });
      })
      .catch(function(error) {
        alert("ERROR: " + error.message);
        this.props.screenProps.functions.updateUser();
      });
  };

  render() {
    // Create an array of named buttons
    const buttons = ["Ratings", "Friends", "Groups"];
    // Create an array of buttons for changing status
    const statusColor = ['#0F0', '#FF0', '#F00']
    const statusButtons = ["Available", "Eating", "Busy"];
    // Retrieve user data from state
    const { friends, groups, ratings, selectedIndex, status } = this.state;

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
            {this.props.screenProps.user.displayName}
          </Text>
          {/* Icon to navigate to Settings */}
          <MaterialIcons
            color="gray"
            name="settings"
            // TODO: Navigate to settings
            onPress={() => {
              this.props.navigation.navigate("Settings");
              // this.setState({ isEditing: true });
            }}
            size={28}
            style={styles.settingsIcon}
          />
          // Icon that displays the user's status
          <Icon
            reverse
            color = {stateColors[this.state.status]}
            size = "15"
            onPress={() => {
              console.log("Press status button")
              this.setState({ changeStatus: true });
            }}
          />
        </Card>

        {/* TODO: Add user dietary restrictions */}

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
            <FriendsList
              id={this.props.screenProps.user.id}
              navigation={this.props.navigation}
              friends={this.props.screenProps.user.friends}
            />,
            null
          )}

          {/* Render the groups list if on the groups tab */}
          {this.shouldRender(
            selectedIndex == 2,
            <GroupsList
              id={this.props.screenProps.user.id}
              groups={this.props.screenProps.user.groups}
              navigation={this.props.navigation}
            />,
            null
          )}
        </Card>

        {/* TODO: Phase this out into Settings screen */}

        // Overlay to let the user change their status
        <Overlay
          isVisible={this.state.changeStatus}
          height="30%"
          width="90%"
        >
          <Text style={styles.changeStatusText}>Change your status</Text>
          <ButtonGroup
            onPress={this.updateStatus}
            selectedIndex={this.state.status}
            buttons={statusButtons}
            containerStyle={{height: 60}}
          />
        </Overlay>

        <Overlay
          borderRadius={4}
          height="90%"
          isVisible={this.state.isEditing}
          overlayBackgroundColor="white"
          width="90%"
          windowBackgroundColor="rgba(0, 0, 0, .5)"
        >
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 15
            }}
          >
            <MaterialIcons
              color="gray"
              name="close"
              onPress={() => {
                this.setState({ isEditing: false });
              }}
              size={24}
              style={styles.settingsIcon}
            />
            <Text>Edit Profile</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <Button
                title="Sign Out"
                onPress={this.signOut}
                containerStyle={{ flex: 1, marginHorizontal: 5 }}
              />
              <Button
                title="Delete Account"
                onPress={this.deleteAccount}
                containerStyle={{ flex: 1, marginHorizontal: 5 }}
              />
            </View>
          </View>
        </Overlay>
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

class FriendsList extends React.Component {
  sendFriendRequest(text) {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/sendFriendRequest",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: this.props.id,
          friendName: text
        })
      }
    )
      .then(data => {
        console.log(data);
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
      .catch(error => console.log(`sendFriendRequest: ${error}`));
  }

  filterProfile(list, text) {
    return list.filter(item => item.Name.includes(text));
  }

  render() {
    return (
      <SearchList
        navigation={this.props.navigation}
        filterFunction={this.filterProfile}
        extendedSearch={text => this.sendFriendRequest(text)}
        list={{
          list: this.props.friends.map(friend => ({ Name: friend })),
          type: "element",
          subList: false,
          rank: 1,
          renderElement: item => {
            return (
              <ListItem
                chevron
                bottomDivider
                // leftAvatar={{
                //   source: { uri: item.image },
                //   containerStyle: styles.friendPicture
                // }}
                // subtitle={`@${item.username}`}
                title={item.Name}
                onPress={() =>
                  this.props.navigation.navigate("Friend", { ID: item.Name })
                }
                topDivider
              />
            );
          },
          viewMore: {
            page: "Message",
            item: "ID"
          }
        }}
      />
    );
  }
}

class GroupsList extends React.Component {
  filterGroup(list, text) {
    return list.filter(item => item.Name.includes(text));
  }

  render() {
    return (
      <SearchList
        navigation={this.props.navigation}
        filterFunction={this.filterGroup}
        list={{
          list: this.props.groups,
          type: "element",
          subList: false,
          rank: 1,
          viewMore: {
            page: "Message",
            item: "ID"
          }
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  backgroundColor: {
    backgroundColor: "lightgray"
  },
  changeStatusText: {
    textAlign: "center",
    fontSize: 30
  },
  settingsIcon: {
    position: "absolute",
    top: 8,
    right: 8
  },
  statusIndicator: {
    borderWidth: 1,
    borderColor: "#000000",
    width: 25,
    height: 25,
    backgroundColor: "#FF0000",
    borderRadius: 10
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
