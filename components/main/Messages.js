import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Button } from "react-native-elements";

import { MaterialIcons } from "@expo/vector-icons";

import Screen from "../Nav/Screen";
import List from "../components/List";
import Text from "../components/Text";

export default class Messages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: this.props.screenProps.user.events
    };
  }

  componentDidMount = () => {
    this.props.navigation.addListener("willFocus", () => {
      this.setState({
        events: this.props.screenProps.user.events
      });
    });
  };

  renderEvent = item => {
    let d = new Date(item.props.time);

    return (
      <View
        style={{
          padding: 8,
          backgroundColor: item.props.index % 2 == 0 ? "#ccc" : "white"
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center"
          }}
          onPress={() => {
            item.props.navigation.navigate("GroupResults", {
              ID: item.props.groupID,
              MESSAGEID: item.props.messageID
            });
          }}
        >
          <View style={{ flex: 1, paddingLeft: 8 }}>
            <Text type="header" style={{ padding: 0 }}>
              {`Upcoming Event for ${item.props.groupName}`}
            </Text>
            <Text type="bold">
              {`${item.props.meal} `}
              <Text>on</Text>
              {` ${this.props.screenProps.globals.dayNames[d.getDay()]} `}
              <Text>at</Text>
              {` ${d.getHours() > 12 ? d.getHours() - 12 : d.getHours()}:${
                d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()
              } `}
              <Text>in</Text>
              {` ${item.props.diningCourt}`}
            </Text>
          </View>
          <MaterialIcons
            size={32}
            name="keyboard-arrow-right"
            color="#E86515"
          />
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <Screen
        title="Messages"
        screenProps={this.props.screenProps}
        navigation={{ ...this.props.navigation }}
        backButton={false}
      >
        {this.state.events != undefined &&
        this.state.events.length > 0 ? (
          <List
            navigation={this.props.navigation}
            list={this.state.events}
            renderElement={this.renderEvent}
            type="element"
          />
        ) : (
          <ListElement Name="No Events" type="expandable" />
        )}
      </Screen>
    );
  }
}
