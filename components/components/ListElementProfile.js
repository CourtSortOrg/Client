import React from "react";
import { View, TouchableOpacity } from "react-native";
import { ListItem } from "react-native-elements";

export default class ListElementProfile extends React.Component {
  render() {
    return (
      <ListItem
        chevron
        bottomDivider
        // leftAvatar={{
        //   source: { uri: item.image },
        //   containerStyle: styles.friendPicture
        // }}
        // subtitle={`@${item.username}`}
        title={this.props.Name}
        onPress={() =>
          this.props.navigation.navigate("Friend", {
            ID: item.props.Name
          })
        }
        topDivider
      />
    );
  }
}
