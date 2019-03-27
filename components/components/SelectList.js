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

  toggleSelected = (item, id, nextSelectedState) => {
    // if selected
    if (nextSelectedState) {
      let arr = [];
      if (!this.props.radio) arr = this.state.selected.slice();
      arr.push({ item, id });

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
      <View style={{ flex: 1 }}>
        {this.state.list.length != 0 ? (
          <List
            navigation={this.props.navigation}
            {...this.props.list}
            list={this.state.list}
            expand={this.state.text.length != 0}
            selectFunction={this.toggleSelected}
          />
        ) : this.props.noElementFound ? (
          this.props.noElementFound
        ) : (
          <ListElement
            type={this.props.list.type}
            rank={1}
            Name="No item found"
          />
        )}
      </View>
    );
  }
}
