import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import Text from "./Text";

/*
 Card expects:
 header: string
 expand: start the card expanded or collapsed.
 buttonList: array of button objects { text, style (optional text styling), onPress }. If single, rendering is different.
 footer: string || array of button objects: { text, onPress }
 nested elements
 */

export default class Card extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expand: this.props.expand != undefined ? this.props.expand : true,
      selected: 0
    };
  }

  render() {
    return (
      <View
        style={
          this.props.overlay === true
            ? { ...styles.card, ...styles.overlay }
            : styles.card
        }
      >
        {this.props.header != undefined && (
          <TouchableOpacity
            onPress={() => this.setState({ expand: !this.state.expand })}
            style={
              this.state.expand
                ? styles.header
                : { ...styles.header, borderBottomWidth: 0 }
            }
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
        )}
        {this.state.expand && (
          <View style={{ flex: 1, ...this.props.style }}>
            {this.props.buttonList != undefined && (
              <View style={{ ...styles.header, ...styles.buttonHeader }}>
                {this.props.buttonList.length == 1 ? (
                  <TouchableOpacity
                    onPress={this.props.buttonList[0].onPress}
                    style={{
                      ...styles.button,
                      borderRightWidth: 0,
                      borderLeftWidth: 0,
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingLeft: 16
                    }}
                  >
                    <Text type="header">{this.props.buttonList[0].text}</Text>
                    <MaterialIcons
                      size={32}
                      name="keyboard-arrow-right"
                      color="black"
                    />
                  </TouchableOpacity>
                ) : (
                  this.props.buttonList.map((button, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        this.setState({ selected: index });
                        button.onPress(index);
                      }}
                      style={
                        this.state.selected == index
                          ? { ...styles.button, ...styles.buttonActive }
                          : styles.button
                      }
                    >
                      <Text
                        type="header"
                        style={
                          this.state.selected == index
                            ? { ...button.style, color: "white" }
                            : button.style
                        }
                      >
                        {button.text}
                      </Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            )}
            {this.props.children}
            {this.props.footer != undefined &&
              Array.isArray(this.props.footer) && (
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
                      style={styles.button}
                    >
                      <Text type="header">{button.text}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
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
    borderColor: "black",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  buttonHeader: {
    padding: 0,
    paddingLeft: 0
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
  button: {
    flex: 1,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    alignItems: "center",
    padding: 8
  },
  buttonActive: {
    backgroundColor: "#000"
  },
  card: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 3,
    margin: 10,
    borderRadius: 10
  },
  overlay: {
    margin: -20,
    borderRadius: 0
  }
});
