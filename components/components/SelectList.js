import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { SearchBar } from "react-native-elements";

import Text from "./Text";
import List from "./List";
import ListElement from "./ListElement";

export default class SearchList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: JSON.parse(JSON.stringify(props.list.list)),
      selected: []
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.list.list != this.props.list.list) {
      this.setState({
        list: JSON.parse(JSON.stringify(this.props.list.list)),
        selected: []
      });
    }
  }

  toggleSelected = (item, id, nextSelectedState, deselect) => {
    // if selected
    if (nextSelectedState) {
      let arr = [];
      if (!item.radio) {
        arr = this.state.selected.slice();
      } else {
        this.state.selected.forEach(item => item.deselect());
      }

      arr.push({ item, id, deselect });

      this.setState(
        {
          selected: arr
        },
        () => this.props.updateSelectedList(this.state.selected)
      );
    } else {
      const arr = this.state.selected.filter(i => i.id !== id);

      this.setState(
        {
          selected: arr
        },
        () => this.props.updateSelectedList(this.state.selected)
      );
    }
  };

  render() {
    return (
      <List
        navigation={this.props.navigation}
        {...this.props.list}
        list={this.state.list}
        selectFunction={this.toggleSelected}
      />
    );
  }
}
