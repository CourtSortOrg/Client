import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from "react-native";

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
      Name: "element text to show"
      viewMore: false || { page: stack navigator page, item: props to set page }
    */

  render() {
    return (
      <View style={{flex: 1}}>
        {this.props.list.map((element, index) => (
          <ListElement
            key={index}
            id={index}
            {...element}

            type={this.props.type}
            subList={this.props.subList}

            viewMore={this.props.viewMore}
            rank={this.props.rank ? this.props.rank : 0}
            expand={this.props.expand}
            navigation={this.props.navigation}
            renderElement={this.props.renderElement}
            onPress={this.props.onPress}
            selectable={this.props.selectable}
            radio={this.props.radio}
            selectFunction={this.props.selectFunction}
          />
        ))}
      </View>
    );
  }
}
