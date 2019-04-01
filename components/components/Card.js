import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import Text from "./Text";

/*
 Card expects:
 header: string
 expand: start the card expanded or collapsed.
 buttonList: array of button objects { text, onPress }
 footer: string || array of button objects: { text, onPress }
 nested elements
 */

export default class Card extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expand: this.props.expand != undefined ? this.props.expand : true
    };
  }

  render() {
    return (
      <View
        style={{
          ...styles.card,
          ...this.props.style
        }}
      >
        {this.props.header != undefined && (
          <View
            style={
              this.state.expand
                ? styles.header
                : { ...styles.header, borderBottomWidth: 0 }
            }
          >
            <TouchableOpacity
              onPress={() => this.setState({ expand: !this.state.expand })}
              style={styles.buttonHeader}
            >
              <Text type="header">{this.props.header}</Text>
              {this.state.expand ? (
                <MaterialIcons
                  size={32}
                  name="keyboard-arrow-down"
                  color="black"
                />
              ) : (
                <MaterialIcons
                  size={32}
                  name="keyboard-arrow-right"
                  color="black"
                />
              )}
            </TouchableOpacity>
          </View>
        )}
        {this.state.expand && (
          <View>
            {this.props.buttonList != undefined &&
              this.props.buttonList.map((button, index) => (
                <View style={styles.header}>
                  <TouchableOpacity
                    key={index}
                    onPress={button.onPress}
                    style={styles.buttonHeader}
                  >
                    <Text type="header">{button.text}</Text>
                    <MaterialIcons
                      size={32}
                      name="keyboard-arrow-right"
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            {this.props.children}
            {this.props.footer != undefined &&
            Array.isArray(this.props.footer) ? (
              <View
                style={
                  this.props.header == undefined
                    ? styles.buttonList
                    : styles.footer
                }
              >
                {this.props.footer.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={button.onPress}
                    style={styles.buttonFooter}
                  >
                    <Text type="header">{button.text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={{ height: 0 }} />
            )}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#E86515",
    padding: 8,
    paddingLeft: 16,
    borderBottomWidth: 3,
    borderColor: "black"
  },
  buttonHeader: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  buttonList: {
    backgroundColor: "#E86515",
    flex: 1,
    flexDirection: "row"
  },
  footer: {
    backgroundColor: "#E86515",
    borderTopWidth: 3,
    borderColor: "black",
    flex: 1,
    flexDirection: "row"
  },
  buttonFooter: {
    flex: 1,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    alignItems: "center",
    padding: 8
  },
  card: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 3,
    margin: 10,
    borderRadius: 10
  }
});
