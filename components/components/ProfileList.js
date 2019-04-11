import React from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import Text from "../components/Text";
import Card from "../components/Card";
import Screen from "../Nav/Screen";
import SearchList from "../components/SearchList";
import ListElement from "../components/ListElement";

export default class ProfileList extends React.Component {
  filter(list, text) {
    return list.filter(item => {
      try {
        return item.userName.includes(text) || item.userHandle.includes(text);
      } catch (error) {
        console.error("filterProfile: Ill defined item:");
        console.error(item);
      }
    });
  }

  renderElement = item => {
    const statusMessage = ["Not Eating", "Available", "Busy"];
    return (
      <View
        style={{
          padding: 8,
          backgroundColor: item.props.index % 2 != 0 ? "#ccc" : "white"
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}
          onPress={() => {
            if (item.props.selectable == true) {
              item.toggleSelect();
            } else {
              item.props.navigation.navigate("Friend", {
                ID: item.props.userHandle
              });
            }
          }}
        >
          {item.props.selectable == true && (
            <View>
              {item.state.selected == false ? (
                <MaterialIcons
                  size={32}
                  name="check-box-outline-blank"
                  color="#E86515"
                />
              ) : (
                <MaterialIcons size={32} name="check-box" color="#E86515" />
              )}
            </View>
          )}
          <View style={{ flex: 1, paddingLeft: 8 }}>
            <Text type="header" style={{ padding: 0 }}>
              {item.props.userName}
            </Text>
            <Text type="bold">{`@${item.props.userHandle} `}</Text>
            {this.props.showStatus !== false && (
              <Text type="bold">
                {`Status: `}
                <Text>{statusMessage[item.props.status]}</Text>
              </Text>
            )}
          </View>
          <View>
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              {this.props.noInvite !== true &&
                ((item.props.location === null ||
                  item.props.location === undefined) &&
                this.props.screenProps.user.location !== null ? (
                  <TouchableOpacity
                    onPress={() => {
                      if (this.props.screenProps.user.location == null) {
                        Alert.alert(
                          "Invite Error",
                          "Please check into a dining court!"
                        );
                      } else if (this.props.screenProps.user.status != 1) {
                        Alert.alert(
                          "Status Error",
                          "Would you like to set your status to available to invite?",
                          [
                            {
                              text: "No"
                            },
                            {
                              text: "Yes",
                              onPress: () => {
                                this.props.screenProps.functions.setStatus(1);
                                this.props.screenProps.functions.sendInvitationAlert(
                                  item.props
                                );
                              }
                            }
                          ]
                        );
                      } else {
                        this.props.screenProps.functions.sendInvitationAlert(
                          item.props
                        );
                      }
                    }}
                    style={{
                      backgroundColor: "#E86515",
                      padding: 8,
                      borderWidth: 3,
                      borderColor: "black",
                      borderRadius: 8,
                      margin: 8
                    }}
                  >
                    <Text type="bold">{"Invite"}</Text>
                  </TouchableOpacity>
                ) : (
                  item.props.status === 1 && (
                    <TouchableOpacity
                      onPress={() => {
                        this.props.screenProps.functions.sendRequestToJoinAlert(
                          item.props
                        );
                      }}
                      style={{
                        backgroundColor: "#E86515",
                        padding: 8,
                        borderWidth: 3,
                        borderColor: "black",
                        borderRadius: 8,
                        margin: 8
                      }}
                    >
                      <Text type="bold">{"Join"}</Text>
                    </TouchableOpacity>
                  )
                ))}
              <TouchableOpacity
                style={{ padding: 0 }}
                onPress={() => {
                  item.props.navigation.navigate("Friend", {
                    ID: item.props.userHandle
                  });
                }}
              >
                <MaterialIcons
                  size={48}
                  name="keyboard-arrow-right"
                  color="#E86515"
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    let list = this.props.selectable
      ? this.props.list.map((item, index) => ({
          ...item,
          Name: item.userHandle,
          index
        }))
      : this.props.list.map((item, index) => ({ ...item, index }));
    list = list.sort((a, b) => {
      const A = a.userHandle.toUpperCase();
      const B = b.userHandle.toUpperCase();
      if (A < B) {
        return -1;
      }
      if (A > B) {
        return 1;
      }
      return 0;
    });

    return (
      <SearchList
        navigation={this.props.navigation}
        filterFunction={this.filter}
        extendedSearch={this.props.extendedSearch}
        updateSelectedList={this.props.updateSelectedList}
        noElementFound={
          <ListElement type={"expandable"} Name="No friends found" />
        }
        list={{
          list: list,
          type: "element",
          subList: false,
          rank: 1,
          selectable: this.props.selectable,
          renderElement: this.renderElement
        }}
      />
    );
  }
}
