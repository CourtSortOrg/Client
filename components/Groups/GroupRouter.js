import React from "react";
import { View } from "react-native";

import Text from "../components/Text";
import Splash from "../auth/Splash";

export default class GroupRouter extends React.Component {
  componentDidMount() {
    let id = this.props.navigation.getParam("ID", "NO-ID");
    let create = this.props.navigation.getParam("create", false);
    if (create || id === "NO-ID")
      this.props.navigation.navigate("GroupCreate", {
        ID: id === "NO-ID" ? "" : id
      });
    else {
      this.props.navigation.navigate("Group", {
        ID: id
      });
    }
  }

  render() {
    return <Splash />;
  }
}
