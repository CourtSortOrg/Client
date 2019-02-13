import React from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import { ListItem, Rating } from "react-native-elements";

import { Avatar, ButtonGroup, Divider } from "react-native-elements";
import { EvilIcons } from "@expo/vector-icons";

import Screen from "../Nav/Screen";

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    var userData = require("../../testData/userData.json");
    var friendData = require("../../testData/friendData.json");
    var ratingData = require("../../testData/ratingData.json");

    this.state = {
      name: userData.name,
      initials: userData.initials,
      image: userData.image,
      restrictions: userData.restrictions,
      selectedIndex: 1,
      friends: friendData.users,
      ratings: ratingData.ratings
    };
  }

  updateIndex = selectedIndex => {
    this.setState({ selectedIndex });
  };

  shouldRender = (expr, comp1, comp2) => {
    return expr ? comp1 : comp2;
  };

  render() {
    const buttons = ["Ratings", "Friends", "Groups"];
    const { selectedIndex, restrictions, ratings } = this.state;
    return (
      <Screen
        backButton={false}
        navigation={{ ...this.props.navigation }}
        title="Profile"
      >
        {/* "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png" */}
        <ScrollView style={styles.backgroundColor}>
          <View style={styles.profileInformation}>
            <Avatar
              containerStyle={styles.profilePicture}
              rounded
              size={100}
              source={{ uri: this.state.image }}
              title={this.state.initials}
            />
            <Text style={styles.profileName}>{this.state.name}</Text>
            <EvilIcons
              name="pencil"
              size={35}
              color="gray"
              style={styles.editInformation}
            />
            {restrictions.length > 0 ? (
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
            ) : null}
          </View>

          <View style={styles.sectionLists}>
            <ButtonGroup
              buttons={buttons}
              onPress={this.updateIndex}
              selectedIndex={selectedIndex}
            />

            {this.shouldRender(
              this.state.selectedIndex == 0,
              <RatingList ratings={this.state.ratings} />,
              null
            )}
            {this.shouldRender(
              this.state.selectedIndex == 1,
              <FriendList friends={this.state.friends} />,
              null
            )}
            {/* {this.shouldRender(
              this.state.selectedIndex == 2,
              this.state.friends.map((data, key) => {
                return <Text key={key}>Group #{data}</Text>;
              }),
              null
            )} */}
          </View>
        </ScrollView>
      </Screen>
    );
  }
}

// function RatingList(props) {
//   return (
//     <List>
//       <FlatList
//         data={props.ratings}
//         renderItem={({ item }) => {
//           return <ListItem title={item.dish} />;
//         }}
//         keyExtractor={item => item.key}
//       />
//     </List>
//   );
// }

function RatingList(props) {
  return (
    <FlatList
      keyExtractor={item => item.key}
      data={props.ratings}
      renderItem={({ item, index }) => (
        <ListItem
          title={item.dish}
          bottomDivider={index!=props.ratings.length-1}
          topDivider={index!=0}
          subtitle={
            <Rating 
              style={{alignItems:"flex-start"}}
              imageSize={20}
              readonly
              startingValue={item.averageRating}
            />
          }
        />
      )}
    />
  );
}

function FriendList(props) {
  return (
    <FlatList
      style={styles.friendList}
      data={props.friends}
      renderItem={({ item, index }) => (
        <FriendRow
          key={item.key}
          endIndex={props.friends.length}
          name={item.name}
          index={index}
          image={item.image}
          initials={item.initials}
        />
      )}
    />
  );
}

function FriendRow(props) {
  return (
    <View>
      {props.index != 0 ? <Divider /> : null}
      <View style={styles.friendRow}>
        <Avatar
          containerStyle={styles.friendPicture}
          rounded
          size="medium"
          source={{ uri: props.image }}
          title={props.initials}
        />
        <Text style={styles.friendName}>{props.name}</Text>
      </View>
      {props.index == props.endIndex ? <Divider /> : null}
    </View>
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
  sectionLists: {
    backgroundColor: "white",
    flexDirection: "column",
    justifyContent: "center",
    marginHorizontal: 5,
    marginBottom: 5,
    borderRadius: 5
  },
  friendList: {
    width: "100%"
  },
  friendRow: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5
  },
  friendPicture: {
    borderColor: "#e9650d",
    borderWidth: 2
  },
  friendName: {
    marginHorizontal: 10,
    fontSize: 20,
    fontWeight: "bold"
  }
});
