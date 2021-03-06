import React from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import Text from "../components/Text";
import Card from "../components/Card";
import Screen from "../Nav/Screen";
import SearchList from "../components/SearchList";
import ListElement from "../components/ListElement";

export default class GroupList extends React.Component {
  filter(list, text) {
    return list.filter(item => {
      try {
        return item.groupName.includes(text);
      } catch (error) {
        console.error("filterGroup: Ill defined item:");
        console.error(item);
      }
    });
  }

  renderElement(item) {
    return (
      <View style={{ padding: 8 }}>
        <TouchableOpacity
          style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
          onPress={() => {
            if (item.props.selectable == true) {
              item.toggleSelect();
            } else {
              item.props.navigation.navigate("Group", {
                ID: item.props.groupID
              });
            }
          }}
        >
          {item.props.selectable == true && (
            <View style={{ padding: 0 }}>
              {item.state.selected == false ? (
                <MaterialIcons
                  size={32}
                  name="check-box-outline-blank"
                  color="#E86515"
                />
              ) : (
                <MaterialIcons size={32} name="check-box" color="#E86515" />
              )}
            </View>
          )}
          <View style={{ flex: 1, paddingLeft: 8 }}>
            <Text type="header" style={{ padding: 0 }}>
              {item.props.groupName}
            </Text>
          </View>
          <TouchableOpacity
            style={{ padding: 0 }}
            onPress={() => {
              item.props.navigation.navigate("Group", {
                ID: item.props.groupID
              });
            }}
          >
            <MaterialIcons
              size={32}
              name="keyboard-arrow-right"
              color="#E86515"
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    let list = this.props.list;
    if (this.props.selectable) {
      list = this.props.list.map(item => {
        return { ...item, selectable: true };
      });
    }

    list = list.sort((a, b) => {
      const A = a.groupName.toUpperCase();
      const B = b.groupName.toUpperCase();
      if (A < B) {
        return -1;
      }
      if (A > B) {
        return 1;
      }
      return 0;
    });

    return (
      <SearchList
        navigation={this.props.navigation}
        filterFunction={this.filter}
        extendedSearch={this.props.extendedSearch}
        updateSelectedList={this.props.updateSelectedList}
        noElementFound={
          <ListElement type={"expandable"} Name="No groups found" />
        }
        list={{
          list: list,
          type: "element",
          subList: false,
          rank: 1,
          selectable: this.props.selectable,
          renderElement: this.renderElement
        }}
      />
    );
  }
}
