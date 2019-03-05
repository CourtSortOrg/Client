import React from "react";
import * as firebase from "firebase";
import { Alert, FlatList, StyleSheet, View } from "react-native";

import { ListItem, Rating, Button } from "react-native-elements";
import { Avatar, ButtonGroup, Overlay } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";

import Text from "../components/Text";
import Card from "../components/Card";
import Screen from "../Nav/Screen";
import SearchList from "../components/SearchList";
import ListElementProfile from "../components/ListElementProfile";

export default class ProfileList extends React.Component {
  filterProfile(list, text) {
    return list.filter(item => {
      try {
        return item.name.includes(text) || item.userHandle.includes(text);
      } catch (error) {
        console.error("filterProfile: Ill defined item:");
        console.error(item);
      }
    });
  }

  render() {
    return (
      <SearchList
        navigation={this.props.navigation}
        filterFunction={this.filterProfile}
        extendedSearch={this.props.extendedSearch}
        updateSelectedList={this.props.updateSelectedList}
        list={{
          list: this.props.list,
          subList: false,
          rank: 1,
          selectable: this.props.selectable,
          renderElement: item => (
            <ListElementProfile navigation={this.props.navigation} {...item} />
          )
        }}
      />
    );
  }
}
