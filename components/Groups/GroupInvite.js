import React from "react";
import { View } from "react-native";

import Text from "../components/Text";
import Screen from "../Nav/Screen";

export default class GroupInvite extends React.Componet {
  render() {
    return <Screen
        title="Invite Friends"
        navigation={{ ...this.props.navigation }}
        showNavigation={false}
      >
        <Text>GroupInvite</Text>
      </Screen>
  }
}
