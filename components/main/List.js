import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";

import ListElement from "./ListElement";

export default class List extends React.Component {
  /*
    List:
      type: type of list: expandable, dropdown, element.
      list: array of listElement objects.
      subList: false || List
    */

  /*
    listElement:
      type: {expandable, dropDown, element}
      subList: [array of listElements] //Only if header or dropdown is chosen.
      text: "element text to show"
      viewMore: false || { page: stack navigator page, item: props to set page }
    */

  render() {
    return (
      <View>
        {this.props.list.map((element, index) => (
          <ListElement
            key={index}
            {...element}
            type={this.props.type}
            subList={{ ...this.props.subList }}
          />
        ))}
      </View>
    );
  }
}
