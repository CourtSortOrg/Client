import React from "react";
import { View, TextInput, Keyboard } from "react-native";

import Text from "../components/Text";
import Card from "../components/Card";

export default class GroupCreate extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const obj = {};
    if (this.props.groupID && this.props.groupID !== "NO-ID") {
      obj.header = "Group Information";
      obj.footer = [
        {
          text: "Update",
          onPress: this.props.setGroupName
        }
      ];
    } else {
      obj.header = "Set Group Name";
    }

    return (
      <Card header={obj.header} footer={obj.footer}>
        <View style={{ paddingLeft: 16 }}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <Text type="sectionName">Group Name: </Text>
            <TextInput
              autoCapitalize="none"
              blurOnSubmit={false}
              placeholder="set group name"
              placeholderTextColor="#999"
              onSubmitEditing={() => Keyboard.dismiss()}
              onChangeText={this.props.updateGroupName}
              underlineColorAndroid="transparent"
              style={{ padding: 8 }}
            />
          </View>

          {this.props.groupID !== "NO-ID" && (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <Text type="sectionName">Group ID: </Text>
              <Text style={{ padding: 8 }}>{this.props.groupID}</Text>
            </View>
          )}
        </View>
      </Card>
    );
  }
}
