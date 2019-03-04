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
        subtitle={`@${this.props.userHandle}`}
        title={this.props.name}
        onPress={() => {
          if (this.props.onPress) this.props.onPress();
          else
            this.props.navigation.navigate("Friend", {
              ID: this.props.userHandle
            });
        }}
        topDivider
      />
    );
  }
}
