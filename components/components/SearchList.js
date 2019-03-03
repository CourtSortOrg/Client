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
      text: "",
      reset: this.props.reset || false,
      list: JSON.parse(JSON.stringify(props.list.list)),
      selected: []
    };
  }

  onChangeText(text) {
    this.setState({
      text: text,
      reset: !this.props.reset,
      list: this.props.filterFunction(
        JSON.parse(JSON.stringify(this.props.list.list)),
        text
      )
    });
  }

  onClearText(text) {
    this.setState({
      text: "",
      reset: this.props.reset || false,
      list: JSON.parse(JSON.stringify(this.props.list.list))
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reset != undefined && prevProps.reset != this.props.reset)
      this.setState({
        text: "",
        reset: this.props.reset,
        list: JSON.parse(JSON.stringify(this.props.list.list)),
        selected: []
      });
  }

  toggleSelected = (item, id, nextSelectedState) => {
    // if selected
    if (nextSelectedState) {
      const arr = this.state.selected.slice();
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
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <View style={{ flex: 1, flexGrow: 1 }}>
            <SearchBar
              lightTheme
              onChangeText={text => this.onChangeText(text)}
              onClearText={() => this.onClearText()}
              icon={{ type: "font-awesome", name: "search" }}
              placeholder="Filter"
              value={this.state.text}
            />
          </View>
          {this.props.extendedSearch != undefined && (
            <TouchableOpacity
              style={{ padding: 8 }}
              onPress={() => this.props.extendedSearch(this.state.text)}
            >
              <AntDesign name="plussquareo" size={32} />
            </TouchableOpacity>
          )}
        </View>
        {this.state.list.length != 0 ? (
          <List
            navigation={this.props.navigation}
            {...this.props.list}
            list={this.state.list}
            expand={this.state.text.length != 0}
            selectFunction={this.toggleSelected}
          />
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
