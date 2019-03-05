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

  renderElement(item) {
    return (
      <View>
        <TouchableOpacity
          style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
          onPress={() => {
            if (item.props.selectable == true) {
              item.toggleSelect();
            } else {
              item.props.navigation.navigate("Friend", {
                ID: item.props.userHandle
              });
            }
          }}
        >
          {item.props.selectable == true && (
            <View style={{padding: 8}}>
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
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              item.props.navigation.navigate("Friend", {
                ID: item.props.userHandle
              });
            }}
          >
            <Text type="header" style={{padding: 0}}>{item.props.name}</Text>
            <Text type="subHeader">{`@${item.props.userHandle}`}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    let list;
    if (this.props.selectable) {
      list = this.props.list.map(item => {
        return { ...item, selectable: true };
      });
    }

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
          renderElement: this.renderElement
        }}
      />
    );
  }
}
