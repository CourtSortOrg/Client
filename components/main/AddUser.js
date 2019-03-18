import React from "react";
import Text from "../components/Text";
import Screen from "../Nav/Screen";

export default class AddUser extends React.Component {
  render() {
    return (
      <Screen
        navigation={{ ...this.props.navigation }}
        title={"Add a Friend"}
        showNavigation={false}
        backButton={true}
      >
        <Text>Hello World</Text>
      </Screen>
    );
  }
}
