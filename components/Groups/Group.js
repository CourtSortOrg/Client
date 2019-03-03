import React from "react";
import { View, Text } from "react-native";

import Screen from "../Nav/Screen";
import Card from "../components/Card";

export default class Group extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      group: {
        id: this.props.navigation.getParam("ID", "NO-ID")
      },

      ...this.props.screenProps.user
    };
  }

  componentDidMount() {
    this.props.screenProps.functions.fetchGroup(this.state.group.id, data =>
      this.setState({
        group: { ...this.state.group.id, ...data }
      })
    );
  }

  leaveGroup() {
    Alert.alert(
      "Leave Group",
      `You are about to leave ${this.state.group.name}. You can always rejoin ${
        this.state.group.name
      }.`,
      [
        {
          text: "Yes",
          onPress: () => this.leaveGroupFirebaseFunction()
        },
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ],
      { cancelable: false }
    );
  }

  leaveGroupFirebaseFunction() {
    fetch("https://us-central1-courtsort-e1100.cloudfunctions.net/leaveGroup", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: this.state.id
      })
    })
      .then(() => {
        this.props.screenProps.functions.updateGroup(
          this.state.group.id,
          false
        );
        this.props.navigation.goBack();
      })
      .catch(error => console.error(`leaveGroupFirebaseFunction: ${error}`));
  }

  render() {
    return (
      <Screen
        title="Friend"
        navigation={{ ...this.props.navigation }}
        backButton={true}
      >
        <Card
          header={this.state.group.name}
          footer={[{ text: "Leave", onPress: () => this.leaveGroup() }]}
        >
          {/*Upcoming events. Make new event*/}
          <Text type="subHeader" style={{ padding: 8 }}>
            Status: {this.state.otherUser.status}
          </Text>
          <Separator />
          {/* Members list.*/}
          <List
            navigation={this.props.navigation}
            list={[]}
            type={"expandable"}
            expand={true}
            rank={0}
            subList={{
              list: "members",
              type: "element",
              subList: false,
              viewMore: { page: "Message", item: "ID" }
            }}
          />
        </Card>
      </Screen>
    );
  }
}
