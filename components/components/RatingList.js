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
import Rating from "../components/Rating";

export default class RatingList extends React.Component {
  filter(list, text) {
    return list.filter(item => {
      try {
        return item.Name.includes(text);
      } catch (error) {
        console.error("filterRating: Ill defined item:");
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
              item.props.navigation.navigate("MealItem", {
                ID: item.props.Name
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
          <View
            style={{
              flex: 1,
              paddingLeft: 8,
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <Text type="header" style={{ padding: 0 }}>
              {item.props.Name}
            </Text>
            <Rating
              rating={item.props.rating}
              user={item.props.userRating}
              updateRating={item.props.updateRating}
            />
          </View>
          <TouchableOpacity
            style={{ padding: 0 }}
            onPress={() => {
              item.props.navigation.navigate("MealItem", {
                ID: item.props.Name
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
    let list;
    if (this.props.selectable) {
      list = this.props.list.map(item => {
        return { ...item, selectable: true };
      });
    }

    return (
      <SearchList
        navigation={this.props.navigation}
        filterFunction={this.filter}
        extendedSearch={this.props.extendedSearch}
        updateSelectedList={this.props.updateSelectedList}
        list={{
          list: this.props.list,
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
