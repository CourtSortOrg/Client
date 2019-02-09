import React from "react";
import {View, Text} from "react-native";

import Screen from "../Nav/Screen";

export default class Friend extends React.Component {
  render() {
    return (
      <Screen title="Friend" navigation={{...this.props.navigation}} backButton={true}>
        <Text>Friend</Text>
      </Screen>
    )
  }
}
