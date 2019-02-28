import React from "react";
import { View } from "react-native";

import Text from "../components/Text";
import Screen from "../Nav/Screen";

export default class GroupSettings extends React.Componet {
  render() {
    return <Screen
        title="Invite Friends"
        navigation={{ ...this.props.navigation }}
        showNavigation={false}
      >
        <Text>GroupSettings</Text>
      </Screen>
  }
}
