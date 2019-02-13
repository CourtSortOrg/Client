import React from "react";
import {
  Alert,
  FlatList,
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
    var friendData = require("../../testData/friendData.json");

    this.state = {
      name: "Profile Name",
      initials: "IN",
      allergens: ["Soy", "Gluten"],
      selectedIndex: 1,
      friends: friendData.users
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
    const { selectedIndex } = this.state;

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
              source={require("../../assets/carlo.jpg")}
              title={this.state.initials}
            />
            <Text style={styles.profileName}>{this.state.name}</Text>
            <EvilIcons
              name="pencil"
              size={35}
              color="gray"
              style={styles.editInformation}
            />
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

          <View style={styles.sectionLists}>
            <ButtonGroup
              buttons={buttons}
              onPress={this.updateIndex}
              selectedIndex={selectedIndex}
            />
            {/* {this.shouldRender(
              this.state.selectedIndex == 0,
              this.state.friends.map((data, key) => {
                return <Text key={key}>Rating #{data}</Text>;
              }),
              null
            )} */}
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
    alignItems: "center",
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
