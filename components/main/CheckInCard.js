import React from "react";
import { View, TouchableOpacity } from "react-native";

import Card from "../components/Card";
import Separator from "../components/Separator";
import Text from "../components/Text";
import ProfileList from "../components/ProfileList";

export default class CheckIn extends React.Component {
  render() {
    return (
      <Card
        header={`Checked into ${this.props.screenProps.user.location}`}
        footer={[
          {
            text: "Change Status",
            onPress: () => this.props.screenProps.functions.changeStatus()
          },
          {
            text: "Check Out",
            onPress: () => this.props.screenProps.functions.checkOut()
          }
        ]}
      >
        <View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              padding: 8
            }}
          >
            <Text type="sectionName">{"Status: "}</Text>
            <Text>{"profile status"}</Text>
          </View>
          <Card
            footer={[
              {
                text: "Submit Report",
                onPress: () => this.props.screenProps.functions.reportAlert()
              }
            ]}
          />
          <ProfileList
            navigation={this.props.navigation}
            list={this.props.screenProps.user.friends}
          />
        </View>
      </Card>
    );
  }
}
