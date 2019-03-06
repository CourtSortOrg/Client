import React from "react";
import { View, Text } from "react-native";

import Screen from "../Nav/Screen";
import Card from "../components/Card";

export default class Group extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      groupID: this.props.navigation.getParam("ID", "NO-ID"),
      group: {
        name: "",
        members: []
      },

      ...this.props.screenProps.user
    };
  }

  componentDidMount() {
    this.props.screenProps.functions.fetchGroup(this.state.groupID, data =>
      this.setState({
        group: { ...data }
      })
    );
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
          footer={[
            {
              text: "Edit Group",
              onPress: () => this.props.navigation.navigate("GroupSettings")
            }
          ]}
        >
          {/*Upcoming events. Make new event*/}
          /*
          <Text type="subHeader" style={{ padding: 8 }}>
            Status: {this.state.otherUser.status}
          </Text>
          */
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
