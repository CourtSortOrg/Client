import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { SearchBar } from "react-native-elements";

import Text from "./Text";
import List from "../main/List";
import ListElement from "../main/ListElement";

export default class SearchList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      reset: this.props.reset,
      list: JSON.parse(JSON.stringify(props.list.list))
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
      reset: this.props.reset,
      list: JSON.parse(JSON.stringify(this.props.list.list))
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reset != this.props.reset)
      this.setState({
        text: "",
        reset: this.props.reset,
        list: JSON.parse(JSON.stringify(this.props.list.list))
      });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <SearchBar
            style={{ flex: 1, flexGrow: 1 }}
            lightTheme
            onChangeText={text => this.onChangeText(text)}
            onClearText={() => this.onClearText()}
            icon={{ type: "font-awesome", name: "search" }}
            placeholder="Filter"
            value={this.state.text}
          />
          {this.props.extendedSearch && (
            <TouchableOpacity onPress={() => this.props.ButtonPress()}>
              <AntDesign name="adduser" size={32} />
            </TouchableOpacity>
          )}
        </View>
        {this.state.list.length != 0 ? (
          <List
            navigation={this.props.navigation}
            expand={this.state.text.length != 0}
            list={this.state.list}
            type={this.props.list.type}
            subList={this.props.list.subList}
          />
        ) : (
          <ListElement type={this.props.list.type} Name="No item found" />
        )}
      </View>
    );
  }
}
