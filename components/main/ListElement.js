import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";

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
      <View style={styles.expandable}>
        <View style={styles.expandableHeader}>
          <TouchableOpacity onPress={() => this.toggleExpansion()}>
            <Text>{this.props.Name}</Text>
            {this.viewMore()}
          </TouchableOpacity>
        </View>
        {this.subList()}
      </View>
    );
  };

  dropDown = () => {
    return (
      <View style={styles.dropDown}>
        <View style={styles.dropDownHeader}>
          <TouchableOpacity onPress={() => this.toggleExpansion()}>
            <Text>Dropdown</Text>
          </TouchableOpacity>
          <Text>{this.props.Name}</Text>
          {this.viewMore()}
        </View>
        {this.subList()}
      </View>
    );
  };

  subList = () => {
    if (this.state.expand) {
      return (
        <View>
          {this.props[this.props.subList.list].map((element, index) => (
            <ListElement key={index} {...element} {...this.props.subList} />
          ))}
        </View>
      );
    }
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
          <Text>View More</Text>
        </TouchableOpacity>
      );
    }
  };

  element = () => {
    return (
      <View style={styles.element}>
        <Text>element: {this.props.Name}</Text>
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
  expandable: {
    backgroundColor: "red"
  },
  expandableHeader: {
    flexDirection: "row"
  },
  dropDown: {
    backgroundColor: "green"
  },
  dropDownHeader: {
    flexDirection: "row"
  },
  element: {
    backgroundColor: "blue"
  }
});
