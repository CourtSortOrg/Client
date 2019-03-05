import React from "react";
import { View } from "react-native";

import Text from "../components/Text";
import Screen from "../Nav/Screen";
import SearchList from "../components/SearchList";
import Card from "../components/Card";
import ListElementProfile from "../components/ListElementProfile";

export default class GroupInvite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: []
    };
  }

  componentDidMount = () => {
    let friends = this.props.friends.filter(friend => {
      this.props.members.forEach(member => {
        if (member.userHandle === friend.userHandle) return false;
      });
      return true;
    });

    this.setState({
      friends
    });
  };

  filterFriends(list, text) {
    return list.filter(item => item.Name.includes(text));
  }

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
        <SearchList
          navigation={this.props.navigation}
          filterFunction={this.filterFriends}
          updateSelectedList={this.props.updateSelectedList}
          list={{
            list: this.state.friends,
            type: "element",
            subList: false,
            selectable: true,
            rank: 1,
            renderElement: item => <ListElementProfile {...item} />,
            viewMore: {
              page: "Message",
              item: "ID"
            }
          }}
        />
      </Card>
    );
  }
}
