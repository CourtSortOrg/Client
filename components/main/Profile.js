import React from "react";
import * as firebase from "firebase";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import Text from "../Nav/Text";

import { ListItem, Rating, Button } from "react-native-elements";
import { Avatar, ButtonGroup, Overlay } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";

import Card from "../Nav/Card";
import Screen from "../Nav/Screen";
import SearchList from "../Nav/SearchList";

let userName;

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    // Dummy data used for now, should not be hardcoded
    var ratingData = require("../../testData/ratingData.json");
    var groupData = require("../../testData/groupData.json");

    const user = firebase.auth().currentUser;
    userName = user ? user.displayName : undefined;

    this.state = {
      uid: user ? user.uid : undefined,
      displayName: user ? user.displayName : undefined,
      selectedIndex: 0,
      isEditing: false,

      name: "",
      initials: "",
      image: "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png",
      restrictions: "",

      ratings: ratingData.ratings,
      friends: [],
      groups: groupData.groups
    };
  }

  componentDidMount() {
    // If the user is a guest, send them to the sign in screen
    if (this.state.uid == undefined) {
      this.props.navigation.navigate("Auth");
    } else {
      //Fetch the user profile data
      fetch(
        "https://us-central1-courtsort-e1100.cloudfunctions.net/getUserProfile",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: this.state.displayName
          })
        }
      ).then(data => {
        this.setState(
          {
            ...JSON.parse(data._bodyText)
          },
          () => {
            // TODO: Get rid of this in favor of real rating data
            this.setState({
              ratings: this.ratingData.ratings
            });
          }
        );
      });
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

  deleteAccount = () => {
    //TODO: Delete user's ratings
    //TODO: Remove user from all groups

    user = firebase.auth().currentUser;

    user.delete().then(() => {
      // Remove all the friends of the user
      fetch(
        "https://us-central1-courtsort-e1100.cloudfunctions.net/removeFromAllFriends",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: this.state.displayName
          })
        }
      );

      // Remove the user from the database
      fetch(
        "https://us-central1-courtsort-e1100.cloudfunctions.net/removeUserFromDatabase",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: this.state.displayName
          })
        }
      );

      //TODO: Get rid of this, will not have a popup
      this.setState({ isEditing: false });

      // Navigate to the SignIn screen
      this.props.navigation.navigate("Auth");
    });
  };

  signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        //TODO: Get rid of this, will not have a popup
        this.setState({ isEditing: false });
        // Navigate to the SignIn screen
        this.props.navigation.navigate("Auth");
      });
  };

  render() {
    // Create an array of named buttons
    const buttons = ["Ratings", "Friends", "Groups"];
    // Retrieve user data from state
    const { friends, groups, ratings, selectedIndex } = this.state;

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
          <Text style={styles.profileName}>{this.state.displayName}</Text>
          {/* Icon to navigate to Settings */}
          {/* TODO: Navigate to settings */}
          <MaterialIcons
            color="gray"
            name="settings"
            onPress={() => {
              this.setState({ isEditing: true });
            }}
            size={35}
            style={styles.editInformation}
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

          {/* Render the ratings list */}
          {this.shouldRender(
            selectedIndex == 0,
            <RatingsList ratings={ratings} />,
            null
          )}

          {/* Render the friends list */}
          {this.shouldRender(
            selectedIndex == 1,
            <FriendsList
              navigation={this.props.navigation}
              friends={friends}
            />,
            null
          )}

          {/* Render the groups list */}
          {this.shouldRender(
            selectedIndex == 2,
            <GroupsList groups={groups} navigation={this.props.navigation} />,
            null
          )}
        </Card>

        {/* TODO: Phase this out into Settings screen */}
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
            <EvilIcons
              color="gray"
              name="close"
              onPress={() => {
                this.setState({ isEditing: false });
              }}
              size={24}
              style={styles.editInformation}
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

// TODO: Put this somewhere else, add friend will have its own Screen
function sendFriendRequest(text) {
  fetch(
    "https://us-central1-courtsort-e1100.cloudfunctions.net/sendFriendRequest",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: userName,
        friendName: text
      })
    }
  ).then(data => {
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
  });
}

// Freinds List Component
function FriendsList(props) {
  // TODO: Clean this up? Maps an array to a JSON object
  let friends = props.friends.map(friend => {
    return { Name: friend };
  });
  return (
    <SearchList
      navigation={props.navigation}
      filterFunction={filterProfile}
      extendedSearch={text => sendFriendRequest(text)}
      list={{
        list: friends,
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
                props.navigation.navigate("Friend", { ID: item.Name })
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

function filterProfile(list, text) {
  return list.filter(item => item.Name.includes(text));
}

function filterGroup(list, text) {
  return list.filter(item => item.Name.includes(text));
}

// Groups List Component
function GroupsList(props) {
  return (
    <SearchList
      navigation={props.navigation}
      filterFunction={filterGroup}
      list={{
        list: props.groups,
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

const styles = StyleSheet.create({
  backgroundColor: {
    backgroundColor: "lightgray"
  },
  editInformation: {
    position: "absolute",
    top: 4,
    right: 4
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
