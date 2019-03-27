import React from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View
} from "react-native";
import { ListItem } from "react-native-elements";

import Screen from "../Nav/Screen";

import Text from "../components/Text";

export default class BlockedUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = { refreshing: false };
  }

  refreshBlockedUsers = () => {
    this.setState({ refreshing: true });
    this.props.screenProps.functions.updateBlockedUsers(
      this.setState({ refreshing: false })
    );
  };

  displayUnblockUser = user => {
    let buttons = [
      { text: "Cancel" },
      {
        text: "Confirm",
        onPress: () => {
          this.unblockUser(user);
        }
      }
    ];

    Alert.alert(
      `Unblock ${user.blockedName}?`,
      `Do you want unblock ${
        user.blockedName
      }? They will not be added to your friends list`,
      buttons
    );
  };

  unblockUser = user => {
    this.props.screenProps.functions.unblockUser(
      user.blockedHandle,
      this.props.screenProps.functions.updateBlockedUsers
    );
  };

  blockedKeyExtractor = user => user.blockedHandle;

  renderBlockedUser = ({ item }) => {
    return (
      <ListItem
        title={item.blockedName}
        subtitle={item.blockedHandle}
        onPress={() => {
          this.displayUnblockUser(item);
        }}
        bottomDivider
        topDivider
      />
    );
  };

  renderBlockedUserList = blockedUsers => {
    if (blockedUsers.length > 0) {
      return (
        <FlatList
          keyExtractor={this.blockedKeyExtractor}
          data={blockedUsers}
          renderItem={this.renderBlockedUser}
        />
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No blocked users found!</Text>
      </View>
    );
  };

  render() {
    let { blockedUsers } = this.props.screenProps.user;
    let refreshController = (
      <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={this.refreshBlockedUsers}
      />
    );
    return (
      <Screen
        title="Blocked Users"
        screenProps={this.props.screenProps}
        showNavigation={false}
        navigation={{ ...this.props.navigation }}
        backButton={true}
        refreshControl={refreshController}
      >
        {this.renderBlockedUserList(blockedUsers)}
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: "center",
    marginTop: 15
  },
  emptyText: {
    fontSize: 18
  }
});
