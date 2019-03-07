import React from "react";
import { View } from "react-native";

import Text from "../components/Text";
import Screen from "../Nav/Screen";
import SearchList from "../components/SearchList";
import Card from "../components/Card";
import ProfileList from "../components/ProfileList";

export default class GroupInvite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: this.props.friends
    };
  }

  componentDidMount = () => {
    if (this.props.groupID !== "NO-ID") {
      let friends = this.state.friends.filter(friend => {
        this.props.members.forEach(member => {
          if (member.userHandle === friend.userHandle) return false;
        });
        return true;
      });

      this.setState({
        friends
      });
    }
  };

  render() {
    const obj = {};
    if (this.props.groupID && this.props.groupID !== "NO-ID")
      obj.footer = [
        {
          text: "Invite",
          onPress: this.props.handleInvites
        }
      ];

    return (
      <Card header="Invite Friends" footer={obj.footer}>
        <ProfileList
          navigation={this.props.navigation}
          list={this.state.friends}
          selectable={true}
          updateSelectedList={this.props.updateSelectedList}
        />
      </Card>
    );
  }
}
