import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default class ListElement extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expand: false
    };
  }

  toggleExpansion = () => {
    this.setState({ expand: !this.state.expand });
  };

  expandable = () => {
    return (
      <View style={{ ...styles.listElement, ...styles.expandable }}>
        <View style={styles.expandableHeader}>
          <TouchableOpacity onPress={() => this.toggleExpansion()}>
            <Text style={{ fontSize: 24 /*fontFamily: "Lobster"*/ }}>
              {this.props.Name}
            </Text>
            {this.viewMore()}
          </TouchableOpacity>
        </View>
        {this.subList()}
      </View>
    );
  };

  dropDown = () => {
    return (
      <View style={{ ...styles.listElement, ...styles.dropDown }}>
        <TouchableOpacity
          style={styles.dropDownHeader}
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
          <Text style={{ fontSize: 16 }}>{this.props.Name}</Text>
        </TouchableOpacity>
        {this.viewMore()}
        {this.subList()}
      </View>
    );
  };

  subList = () => {
    // Uncomment if what to reset when enclosing elements are closed.
    //if (this.state.expand) {
    return (
      //Remove conditional if
      <View style={this.state.expand ? styles.subList : { display: "none" }}>
        {this.props[this.props.subList.list].map((element, index) => (
          <ListElement
            key={index}
            id={index}
            {...element}
            {...this.props.subList}
          />
        ))}
      </View>
    );
    //}
  };

  viewMore = () => {
    if (this.props.viewMore) {
      return (
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate(
              this.props.viewMore.page,
              this.props.viewMore.item
            )
          }
        >
          <MaterialIcons
            size={32}
            name="keyboard-arrow-right"
            color="#E86515"
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
                ...styles.listElement,
                ...styles.element,
                ...styles.elementShaded
              }
            : { ...styles.listElement, ...styles.element }
        }
      >
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate(
              this.props.viewMore.page,
              this.props.viewMore.item
            )
          }
        >
          <Text style={{ fontSize: 16 }}>{this.props.Name}</Text>
        </TouchableOpacity>
        {this.viewMore()}
      </View>
    );
  };

  render() {
    switch (this.props.type) {
      case "expandable":
        return this.expandable();
      case "dropDown":
        return this.dropDown();
      case "element":
        return this.element();
    }
    return (
      <View>
        <Text>Error: not a valid list type</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listElement: {
    flex: 1
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
    alignItems: "center",
    paddingLeft: 8
  },
  elementShaded: {
    backgroundColor: "#ddd"
  },
  subList: {
    marginLeft: 20
  }
});