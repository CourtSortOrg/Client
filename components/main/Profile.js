import React from "react";
import * as firebase from "firebase";
import { Alert, FlatList, ScrollView, StyleSheet, View } from "react-native";
import Text from "../Nav/Text";

import { ListItem, Rating, Button } from "react-native-elements";
import { Avatar, ButtonGroup, Overlay } from "react-native-elements";
import { EvilIcons } from "@expo/vector-icons";

import Card from "../Nav/Card";
import Screen from "../Nav/Screen";
import SearchList from "../Nav/SearchList";

export default class Profile extends React.Component {
  constructor(props) {
    super(props);

    var userData = require("../../testData/userData.json");
    const ratingData = require("../../testData/ratingData.json");
    var friendData = require("../../testData/friendData.json");
    var groupData = require("../../testData/groupData.json");

    const user = firebase.auth().currentUser;
    console.log(user.displayName);
    this.state = {
      uid: user ? user.uid : undefined,
      displayName: user ? user.displayName : undefined,
      selectedIndex: 0,
      isEditing: false,

      name: userData.name,
      initials: userData.initials,
      image: userData.image,
      restrictions: userData.restrictions,

      ratings: ratingData.ratings,
      friends: friendData.users,
      groups: groupData.groups
    };
  }

  componentDidMount() {
    if (this.state.uid == undefined) {
      console.log("HOME");
      this.props.navigation.navigate("Auth");
      return;
    }

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
      console.log(data._bodyText);
      this.setState({
        ...JSON.parse(data._bodyText),
        ratings: this.ratingData.ratings
      }, () => {
        console.log("this");
        console.log(this.state.friends)
      });
    });

    fetch("https://us-central1-courtsort-e1100.cloudfunctions.net/getFriends", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: this.state.displayName
      })
    }).then(data => {
      console.log(data._bodyText);
      this.setState({ ...JSON.parse(data._bodyText) });
    });
  }

  updateIndex = selectedIndex => {
    this.setState({ selectedIndex });
  };

  shouldRender = (expr, comp1, comp2) => {
    return expr ? comp1 : comp2;
  };

  deleteAccount = () => {
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
              name: this.state.displayName
            })
          }
        ).then(data => console.log(data._bodyText));
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
        ).then(data => console.log(data._bodyText));
        //navigate to SignIn Screen
        this.props.navigation.navigate("Auth");
        this.setState({ isEditing: false });
      })
      .catch(function(error) {
        alert("ERROR: " + error.message);
      });
  };

  signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.setState({ isEditing: false });
        this.props.navigation.navigate("Auth");
        //go back to SignIn screen
      })
      .catch(error => {
        alert(error.message);
      });
  };

  render() {
    const buttons = ["Ratings", "Friends", "Groups"];
    const {
      friends,
      groups,
      restrictions,
      ratings,
      selectedIndex
    } = this.state;
    return (
      <Screen
        backButton={false}
        navigation={{ ...this.props.navigation }}
        title="Profile"
      >
        {/* "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png" */}
        <Card style={styles.profileInformation}>
          <Avatar
            containerStyle={styles.profilePicture}
            rounded
            size={100}
            source={{ uri: this.state.image }}
            title={this.state.initials}
          />
          <Text style={styles.profileName}>{this.state.displayName}</Text>
          <EvilIcons
            color="gray"
            name="pencil"
            onPress={() => {
              this.setState({ isEditing: true });
            }}
            size={35}
            style={styles.editInformation}
          />
          {/* {restrictions.length > 0 ? (
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
                  {restrictions.map((data, key) => {
                    return <Text key={key}>{data}</Text>;
                  })}
                </View>
              </View>
            ) : null} */}
        </Card>
        <Card>
          <ButtonGroup
            buttons={buttons}
            onPress={this.updateIndex}
            selectedIndex={selectedIndex}
          />

          {this.shouldRender(
            selectedIndex == 0,
            <RatingsList ratings={ratings} />,
            null
          )}
          {this.shouldRender(
            selectedIndex == 1,
            <FriendsList
              navigation={this.props.navigation}
              friends={friends}
            />,
            null
          )}
          {this.shouldRender(
            selectedIndex == 2,
            <GroupsList groups={groups} navigation={this.props.navigation} />,
            null
          )}
        </Card>
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

function RatingsList(props) {
  return (
    <FlatList
      data={props.ratings}
      keyExtractor={item => item.id}
      renderItem={({ item, index }) => (
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

function FriendsList(props) {
  return (
    <SearchList
      navigation={props.navigation}
      filterFunction={filterProfile}
      extendedSearch={() => props.navigation.navigate("Home")}
      list={{
        list: props.friends,
        type: "element",
        subList: false,
        rank: 1,
        renderElement: item => (
          <ListItem
            chevron
            bottomDivider
            leftAvatar={{
              source: { uri: item.image },
              containerStyle: styles.friendPicture
            }}
            subtitle={`@${item.username}`}
            title={item.name}
            onPress={() => props.navigation.navigate("Friend")}
            topDivider
          />
        ),
        viewMore: {
          page: "Message",
          item: "ID"
        }
      }}
    />
  );
}

function filterProfile(list, text) {
  return list.filter(item => item.name.includes(text));
}

function filterGroup(list, text) {
  return list.filter(item => item.Name.includes(text));
}

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
