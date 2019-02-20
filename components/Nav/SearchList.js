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
      reset: this.props.reset || false,
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
      reset: this.props.reset || false,
      list: JSON.parse(JSON.stringify(this.props.list.list))
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reset != undefined && prevProps.reset != this.props.reset)
      this.setState({
        text: "",
        reset: this.props.reset,
        list: JSON.parse(JSON.stringify(this.props.list.list))
      });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
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
              style={{padding: 8}}
              onPress={() => this.props.extendedSearch(this.state.text)}
            >
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
            viewMore={this.props.list.viewMore}
            rank={this.props.list.rank}
            renderElement={this.props.list.renderElement}
          />
        ) : (
          <ListElement type={this.props.list.type} Name="No item found" />
        )}
      </View>
    );
  }
}
