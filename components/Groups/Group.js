import React from "react";
import { View, TouchableOpacity } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import Screen from "../Nav/Screen";
import Card from "../components/Card";
import Text from "../components/Text";
import List from "../components/List";
import ListElement from "../components/ListElement";
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
      this.props.screenProps.functions.updateGroup(
        this.state.groupID,
        true,
        () =>
          this.setState(
            {
              group: this.props.screenProps.user.groups.find(
                g => g.groupID === this.state.groupID
              )
            },
          )
      );
    });
  };

  renderEvent = item => {
    let d = new Date(item.props.timeOptions[0]);

    return (
      <View style={{ padding: 8 }}>
        <TouchableOpacity
          style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
          onPress={() => {
            item.props.navigation.navigate("GroupResults", {
              ID: item.props.groupID,
              MESSAGEID: item.props.messageID
            });
          }}
        >
          <View style={{ flex: 1, paddingLeft: 8 }}>
            <Text type="header" style={{ padding: 0 }}>
              {`Upcoming Event`}
            </Text>
            <Text type="bold">
              {`${item.props.meal} on ${
                this.props.screenProps.globals.dayNames[d.getDay()]
              }`}
            </Text>
          </View>
          <MaterialIcons
            size={32}
            name="keyboard-arrow-right"
            color="#E86515"
          />
        </TouchableOpacity>
      </View>
    );
  };

  renderVote = item => {
    let d = new Date(item.props.timeOptions[0]);

    return (
      <View style={{ padding: 8 }}>
        <TouchableOpacity
          style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
          onPress={() => {
            item.props.navigation.navigate("GroupPoll", {
              ID: item.props.groupID,
              MESSAGEID: item.props.messageID
            });
          }}
        >
          <View style={{ flex: 1, paddingLeft: 8 }}>
            <Text type="header" style={{ padding: 0 }}>
              {`Vote on a time`}
            </Text>
            <Text type="bold">
              {`${item.props.meal} on ${
                this.props.screenProps.globals.dayNames[d.getDay()]
              }`}
            </Text>
          </View>
          <MaterialIcons
            size={32}
            name="keyboard-arrow-right"
            color="#E86515"
          />
        </TouchableOpacity>
      </View>
    );
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
          {this.state.group.messages.length > 0 ? (
            <List
              navigation={this.props.navigation}
              list={this.state.group.messages}
              renderElement={this.renderEvent}
              type="element"
            />
          ) : (
            <ListElement Name="No Events" type="expandable" />
          )}
          <Separator />
          {this.state.group.messages.length > 0 ? (
            <List
              navigation={this.props.navigation}
              list={this.state.group.messages}
              renderElement={this.renderVote}
              type="element"
            />
          ) : (
            <ListElement Name="No Active Polls" type="expandable" />
          )}
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
