import React from "react";
import { Image, FlatList, Text, View } from "react-native";

import Screen from "../Nav/Screen";

const restrictions = [
  {
    name: "Eggs",
    image: require("../../assets/images/Eggs.png"),
    enabled: true
  },
  {
    name: "Fish",
    image: require("../../assets/images/Fish.png"),
    enabled: true
  },
  {
    name: "Gluten",
    image: require("../../assets/images/Gluten.png"),
    enabled: true
  },
  {
    name: "Milk",
    image: require("../../assets/images/Milk.png"),
    enabled: true
  },
  {
    name: "Peanuts",
    image: require("../../assets/images/Peanuts.png"),
    enabled: true
  },
  {
    name: "Shellfish",
    image: require("../../assets/images/Shellfish.png"),
    enabled: true
  },
  {
    name: "Soy",
    image: require("../../assets/images/Soy.png"),
    enabled: true
  },
  {
    name: "Tree Nuts",
    image: require("../../assets/images/TreeNuts.png"),
    enabled: true
  },
  {
    name: "Vegan",
    image: require("../../assets/images/Vegan.png"),
    enabled: true
  },
  {
    name: "Vegetarian",
    image: require("../../assets/images/Vegetarian.png"),
    enabled: true
  },
  {
    name: "Wheat",
    image: require("../../assets/images/Wheat.png"),
    enabled: true
  }
];

export default class EditProfile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Screen
        title="Edit Profile"
        navigation={{ ...this.props.navigation }}
        backButton={true}
      >
        <View style={{ alignItems: "center" }}>
          <FlatList
            data={restrictions}
            numColumns={4}
            keyExtractor={item => item.name}
            renderItem={obj => {
              console.log(obj);
              return (
                <View style={{ flexDirection: "column", alignItems: "center", paddingHorizontal: 10 }}>
                  <Image
                    style={{
                      flex: 1,
                      width: 50,
                      height: 50,
                      resizeMode: "contain"
                    }}
                    source={obj.item.image}
                  />
                  <Text>{obj.item.name}</Text>
                </View>
              );
            }}
          />
        </View>
      </Screen>
    );
  }
}
