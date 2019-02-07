import React from "react";
import {View, Text} from "react-native";
import { Button } from "react-native-elements"


export default class Meals extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Meals",
      headerLeft: (
        <Button
          title="Profile"
          onPress={() => navigation.navigate("Profile")}
        />
      ),
      headerRight: (
        <View style={{
          width:100,
          flex:1,
          flexDirection: "row"
        }}>
        <Button
        style={{
          width: 50
        }}
        icon={{name: 'map'}}
        onPress={() => navigation.navigate("Map")}
        />
        <Button
        style={{
          width: 50
        }}
        icon={{name: 'notifications'}}
        onPress={() => navigation.navigate("Notifications")}
        />
        </View>
      )
    }
  }

  render() {
    return (
      <View>
      <Text>Meals</Text>
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
