import React from "react";
import { View, Text } from "react-native";

import Screen from "../Nav/Screen";
import Card from "../components/Card";
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
  }

  componentDidMount() {
    console.log(this.state.groupID);
    if (this.state.groupID !== "NO-ID") {
      let groups = this.props.screenProps.user.groups.filter(
        group => group.groupID === this.state.groupID
      );
      if (groups.length === 0) {
        this.props.screenProps.functions.updateGroup(this.state.groupID, true);
        groups = this.props.screenProps.user.groups.filter(
          group => group.groupID === this.state.groupID
        );
      }
      this.setState({
        group: groups[0]
      }, () => console.log(this.state.group));

    }
  }

  render() {
    return (
      <Screen
        title="Group"
        navigation={{ ...this.props.navigation }}
        backButton={true}
      >
        <Card
        header={this.state.group.groupName}
          footer={[
            {
              text: "Edit Group",
              onPress: () => {
                console.log(this.state.groupID);
                this.props.navigation.navigate("GroupSettings", {
                  ID: this.state.groupID
                })
              }
            }
          ]}
        />
        <Card header="Members">
          <ProfileList
            navigation={this.props.navigation}
            list={this.state.group.memberObjects}
          />
        </Card>
      </Screen>
    );
  }
}
