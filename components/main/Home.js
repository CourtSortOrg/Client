import React from "react";
import {View, Text} from "react-native";
import { Button } from "react-native-elements";


export default class Home extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Home",
      headerLeft: (
        <Button
        title="Profile"
        onPress={() => navigation.push("Profile")}
        />
      ),
      headerRight: (
        <Button
        title="Notifications"
        onPress={() => navigation.push("Notifications")}
        />
      )
    }
  }

  render() {
    return (
      <View>
      <Text>Home</Text>
      <Button
      title="Dining Court"
      onPress={() => this.props.navigation.push("DiningCourt")}
      />
      <Button
      title="MealItem"
      onPress={() => this.props.navigation.push("MealItem")}
      />
      </View>
    )
  }
}
