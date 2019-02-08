import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-elements";

export default class Footer extends React.Component {
  render() {
    return (
      <View style={{flex: 0.1, flexDirection: "row"}}>
      <View style={{flex: 1}}>
      <Button
      icon=
      {
        this.props.active == "Home" ?
        {name: 'home'} :
        {name: 'home-outline'}
      }
      onPress={() => this.props.navigation.navigate("Home")}
      />
      </View>
      <View style={{flex: 1}}>
      <Button
      icon={{name: 'fastFood'}}
      onPress={() => this.props.navigation.navigate("Meals")}
      />
      </View>
      <View style={{flex: 1}}>
      <Button
      icon={
        this.props.active == "Messages" ?
        {name: 'chat-bubble'} :
        {name: 'chat-bubble-outline'}
      }
      onPress={() => this.props.navigation.navigate("Messages")}
      />
      </View>
      </View>
    )
  }
}
