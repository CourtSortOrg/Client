import React from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import Text from "./Text";

export default class ListElement extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expand: this.props.expand
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.expand != this.props.expand)
      this.setState({
        expand: this.props.expand
      });
  }

  toggleExpansion = () => {
    this.setState({ expand: !this.state.expand });
  };

  expandable = () => {
    return (
      <View style={{ ...this.styles.listElement, ...this.styles.expandable }}>
        <View style={this.styles.expandableHeader}>
          <TouchableOpacity onPress={() => this.toggleExpansion()}>
            <Text type="header">{this.props.Name}</Text>
          </TouchableOpacity>
            {this.viewMore()}
        </View>
        {this.subList()}
      </View>
    );
  };

  dropDown = () => {
    return (
      <View style={{ ...this.styles.listElement, ...this.styles.dropDown }}>
        <TouchableOpacity
          style={this.styles.dropDownHeader}
          onPress={() => this.toggleExpansion()}
        >
          <View style={{ marginLeft: -12 }}>
            {this.state.expand ? (
              <MaterialIcons
                size={32}
                name="keyboard-arrow-down"
                color="#E86515"
              />
            ) : (
              <MaterialIcons
                size={32}
                name="keyboard-arrow-right"
                color="#E86515"
              />
            )}
          </View>
          <Text type="subHeader">{this.props.Name}</Text>
        </TouchableOpacity>
        {this.viewMore()}
        {this.subList()}
      </View>
    );
  };

  subList = () => {
    if (this.props.subList) {
      let list = this.props[this.props.subList.list];
      if (this.props.subList.extend)
        list = list[0][this.props.subList.extend]
      return (
        <View
          style={this.state.expand ? this.styles.subList : { display: "none" }}
        >
          {list.map((element, index) => {
            return (
              <ListElement
                key={index}
                id={index}
                rank={this.props.rank + 1}
                expand={this.props.expand}
                navigation={this.props.navigation}
                renderElement={this.props.renderElement}
                {...element}
                {...this.props.subList}
              />
            );
          })}
        </View>
      );
    }
  };

  navigate() {
    this.props.navigation.navigate(this.props.viewMore.page, {
      ID: this.props[this.props.viewMore.item]
    });
  }

  viewMore = () => {
    if (this.props.viewMore) {
      return (
        <TouchableOpacity onPress={() => this.navigate()}>
          <MaterialIcons
            size={32}
            name="keyboard-arrow-right"
            color={this.props.type == "expandable" ? "black" : "#E86515"}
          />
        </TouchableOpacity>
      );
    }
  };

  element = () => {
    return (
      <View
        style={
          this.props.id % 2 == 0
            ? {
                ...this.styles.listElement,
                ...this.styles.element,
                ...this.styles.elementShaded
              }
            : { ...this.styles.listElement, ...this.styles.element }
        }
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => this.props.viewMore && this.navigate()}
        >
          {this.props.renderElement ? (
            this.props.renderElement(this.props)
          ) : (
            <Text type="subHeader">{this.props.Name}</Text>
          )}
        </TouchableOpacity>
        {this.viewMore()}
      </View>
    );
  };

  render() {
    if (this.props.renderElement) {
      return (
        <View>
          {this.props.renderElement(this.props)}
          {this.subList()}
        </View>
      );
    } else if (this.props.type) {
      switch (this.props.type) {
        case "expandable":
          return this.expandable();
        case "dropDown":
          return this.dropDown();
        case "element":
          return this.element();
      }
    }
    return (
      <View>
        <Text>Error: not a valid list type</Text>
      </View>
    );
  }

  styles = StyleSheet.create({
    listElement: {
      flex: 1,
      paddingLeft: this.props.rank * 20
    },
    expandable: {},
    expandableHeader: {
      backgroundColor: "#E86515",
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: "black",
      borderBottomWidth: 2,
      borderStyle: "solid",
      padding: 16
    },
    dropDown: {
      backgroundColor: "white"
    },
    dropDownHeader: {
      alignItems: "center",
      flexDirection: "row"
    },
    element: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    elementShaded: {
      backgroundColor: "#ddd"
    },
    subList: {}
  });
}
