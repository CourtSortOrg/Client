import React from "react";
import { View, Alert } from "react-native";

import Text from "../components/Text";
import Card from "../components/Card";
import Screen from "../Nav/Screen";
import GroupEdit from "./GroupEdit";
import GroupInvite from "./GroupInvite";

export default class GroupSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFriends: [],
      groupID: this.props.navigation.getParam("ID", "NO-ID"),
      group: {
        members: [],
        name: ""
      }
    };
  }

  componentDidMount = () => {
    // fetchGroup.
  };

  updateGroup = name => {
    console.log(`Update Group Name: ${name}`);
  };

  updateGroupName = name => {
    this.setState({
      group: {
        ...this.state.group,
        name
      }
    });
  };

  setGroupName = () => {
    // updateGroup.
  };

  updateSelectedList = list => {
    this.setState({
      selectedFriends: list
    });
  };

  handleInvites = () => {
    this.state.selectedFriends.forEach(friend =>
      inviteToGroup(friend.userHandle)
    );
  };

  inviteToGroup = id => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/inviteToGroup",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userHandle: this.props.screenProps.user.userHandle,
          friendHandle: id,
          groupID: this.state.groupID
        })
      }
    )
      //.then(data => )
      .catch(error => console.error(`fetchUser: ${error}`));
  };

  createGroup = () => {
    if (this.state.group.name !== "") {
      fetch(
        "https://us-central1-courtsort-e1100.cloudfunctions.net/createGroup",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userHandle: this.props.screenProps.user.userHandle,
            groupName: this.state.group.name
          })
        }
      )
        .then(data => {
          //this.handleInvites();
          this.props.screenProps.functions.updateGroup(this.state.group.name/*groupID*/, true);
        })
        .catch(error => console.error(`createGroup: ${error}`));
    } else {
      Alert.alert("Create Group", `Cannot create group. Please supply a name`, [
        {
          text: "Ok"
        }
      ]);
    }
  };

  render() {
    return (
      <Screen
        title={this.state.groupID !== "NO-ID" ? "Edit Group" : "Create Group"}
        navigation={this.props.navigation}
        showNavigation={this.state.groupID !== "NO-ID"}
      >
        <GroupEdit
          groupName={this.state.group.name}
          groupID={this.state.groupID}
          updateGroupName={this.updateGroupName}
          setGroupName={this.setGroupName}
        />
        <GroupInvite
          friends={this.props.screenProps.user.friends}
          members={this.state.group.members}
          groupID={this.state.groupID}
          updateSelectedList={this.updateSelectedList}
          handleInvites={this.handleInvites}
        />
        {this.state.groupID === "NO-ID" && (
          <Card
            footer={[
              {
                text: "Cancel",
                onPress: () => this.props.navigation.goBack()
              },
              {
                text: "Create",
                onPress: () => this.createGroup()
              }
            ]}
          />
        )}
      </Screen>
    );
  }
}
