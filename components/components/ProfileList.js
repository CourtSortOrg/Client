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

export default class ProfileList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: props.list
    };

    if (this.props.selectable) {
      this.state.list = this.props.list.map(item => {
        return { ...item, Name: item.userHandle };
      });
    }
  }

  filter(list, text) {
    return list.filter(item => {
      try {
        return item.userName.includes(text) || item.userHandle.includes(text);
      } catch (error) {
        console.error("filterProfile: Ill defined item:");
        console.error(item);
      }
    });
  }

  renderElement(item) {
    const statusMessage = ["Not Eating", "Available", "Busy"];
    return (
      <View style={{ padding: 8 }}>
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
              {item.props.userName}
            </Text>
            <Text type="bold">
              {`@${item.props.userHandle} | Status: `}
              <Text>{statusMessage[item.props.status]}</Text>
            </Text>
          </View>
          <TouchableOpacity
            style={{ padding: 0 }}
            onPress={() => {
              item.props.navigation.navigate("Friend", {
                ID: item.props.userHandle
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
    return (
      <SearchList
        navigation={this.props.navigation}
        filterFunction={this.filter}
        extendedSearch={this.props.extendedSearch}
        updateSelectedList={this.props.updateSelectedList}
        noElementFound={
          <ListElement
            type={"expandable"}
            Name="No friends found"
          />
        }
        list={{
          list: this.state.list,
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
