import React from "react";
import { Text, View } from "react-native";
import { Button, Avatar } from "react-native-elements";

export default class Header extends React.Component {
  render() {
    return (
      <View style={{flex: 0.15, flexDirection: "column", justifyContent: "flex-end"}}>
        <View style={{flex: 0.4}}/>
        <View style={{flexDirection: "row", flex: 0.6, alignItems: "space"}}>
          <View style={{flex: 1, flexDirection: "row"}}>
          {
            this.props.backButton &&
            <Button
              title="Back"
              onPress={() => this.props.navigation.goBack()}
            />
          }
          <Avatar
            small
            rounded
            title="IN"
            onPress={() => this.props.navigation.navigate("Profile")}
          />
      </View>
      <View style={{flex: 2}}>
      <Text style={{
        textAlign: "center"
      }}
      >{this.props.title}</Text>
      </View>
      <View style={{flex: 1, justifyContent:"flex-end"}}>
      <Button
      style={{
        width: 50
      }}
      icon={{name: 'notifications'}}
      onPress={() => this.props.navigation.navigate("Notifications")}
      />
      </View>
      </View>
      </View>
    )
  }
}
