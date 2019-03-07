import React from "react";
import { View, TouchableOpacity } from "react-native";

import Card from "../components/Card";
import Separator from "../components/Separator";
import Text from "../components/Text";
import ProfileList from "../components/ProfileList";

export default class RatingCard extends React.Component {
  render() {
    return (
      <Card
        header="Ratings"
        footer={[
          {
            text: "Rate dining court",
            onPress: () => console.log("rate dining court")
          },
          {
            text: "Rate dishes",
            onPress: () => console.log("rate dish")
          },
          {
            text: "Report",
            onPress: () => console.log("report")
          }
        ]}
      >
        <View>
          <ProfileList
            navigation={this.props.navigation}
            list={this.props.screenProps.user.friends}
          />
        </View>
      </Card>
    );
  }
}
