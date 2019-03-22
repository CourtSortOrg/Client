import React from "react";
import { Alert } from "react-native";
import ProfileList from "../components/ProfileList";
import Screen from "../Nav/Screen";

export default class AddUser extends React.Component {
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
        //console.error(`sendFriendRequest: Successful: ${data._bodyText}`);
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
    return (
      <Screen
        screenProps={this.props.screenProps}
        navigation={{ ...this.props.navigation }}
        title={"Add a Friend"}
        showNavigation={false}
        backButton={true}
      >
        <ProfileList
          navigation={this.props.navigation}
          extendedSearch={text => this.sendFriendRequest(text)}
          list={[]}
        />
      </Screen>
    );
  }
}
