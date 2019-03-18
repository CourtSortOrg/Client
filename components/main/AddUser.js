import React from "react";
import Text from "../components/Text";
import Screen from "../Nav/Screen";

export default class AddUser extends React.Component {
  render() {
    return (
      <Screen showNavigation={false} title={"Add a Friend"} backButton={true}>
        <Text>Hello World</Text>
      </Screen>
    );
  }
}
