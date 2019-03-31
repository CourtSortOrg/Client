import React from "react";
import { View } from "react-native";

import Screen from "../Nav/Screen";
import Card from "../components/Card";
import Text from "../components/Text";
import List from "../components/List";
import ProfileList from "../components/ProfileList";
import Separator from "../components/Separator";

export default class Group extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      groupID: this.props.navigation.getParam("ID", "NO-ID"),
      group: {
        groupName: "",
        memberObjects: []
      },

      ...this.props.screenProps.user
    };

    if (this.state.groupID !== "NO-ID") {
      this.props.screenProps.functions.updateGroup(this.state.groupID, true);
      groups = this.props.screenProps.user.groups.filter(
        group => group.groupID === this.state.groupID
      );

      this.state.group = this.props.screenProps.user.groups.find(
        g => g.groupID === this.state.groupID
      );
    }
  }

  componentDidMount = () => {
    this.props.navigation.addListener("willFocus", payload => {
      let nav = this.props.navigation.getParam("NAVIGATE", undefined);
      /*if (nav != undefined) {
        this.props.navigation.navigate(nav, {
          ID: this.state.groupID
        });
      }*/
      this.props.screenProps.functions.updateGroup(this.state.groupID, true);
      groups = this.props.screenProps.user.groups.filter(
        group => group.groupID === this.state.groupID
      );

      this.setState({
        group: this.props.screenProps.user.groups.find(
          g => g.groupID === this.state.groupID
        )
      });
    });
  };

  render() {
    return (
      <Screen
        title="Group"
        navigation={{ ...this.props.navigation }}
        screenProps={this.props.screenProps}
        backButton={true}
      >
        <Text>{JSON.stringify(this.state.group)}</Text>
        <Card
          header={this.state.group.groupName}
          footer={[
            {
              text: "Create New Event",
              onPress: () => {
                this.props.navigation.navigate("GroupCreateEvent", {
                  ID: this.state.groupID
                });
              }
            }
          ]}
        >
          <List
            navigation={this.props.navigation}
            list={this.state.group.messages.map((msg, index) => {
              let d = new Date(msg.timeOptions[0]);
              return {
                Name: `Vote on time for ${msg.meal} on ${
                  this.props.screenProps.globals.dayNames[d.getDay()]
                }`,
                ...msg,
                index: index,
                onPress: () =>
                  this.props.navigation.navigate("GroupPoll", {
                    ID: this.state.groupID,
                    MESSAGEID: msg.messageID
                  })
              };
            })}
            type="element"
          />
        </Card>
        <Card
          header="Members"
          footer={[
            {
              text: "Edit Group",
              onPress: () => {
                this.props.navigation.navigate("GroupSettings", {
                  ID: this.state.groupID
                });
              }
            }
          ]}
        >
          <ProfileList
            navigation={this.props.navigation}
            list={this.state.group.memberObjects.filter(
              g => g.userHandle != this.props.screenProps.user.userHandle
            )}
            showStatus={false}
          />
        </Card>
      </Screen>
    );
  }
}
