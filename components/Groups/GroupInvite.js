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
      selectedFriends: []
    };
  }
  filterFriends(list, text) {
    return list.filter(item => item.Name.includes(text));
  }

  updateSelectedList(list) {
    this.setState({
      selectedFriends: list
    });
  }

  render() {
    return (
      <Screen
        title="Invite Friends"
        navigation={{ ...this.props.navigation }}
        showNavigation={false}
        backButton={true}
      >
        <Card
          header="Invite Friends"
          footer={[
            {
              text: "Invite",
              onPress: () => {
                console.log("INVITE TO GROUP");
              }
            }
          ]}
        >
          <SearchList
            navigation={this.props.navigation}
            filterFunction={this.filterFriends}
            updateSelectedList={this.updateSelectedList}
            list={{
              list: this.props.screenProps.user.friends.map(friend => ({
                Name: friend
              })),
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
      </Screen>
    );
  }
}
