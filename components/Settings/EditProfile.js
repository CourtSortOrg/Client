import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Input } from "react-native-elements";
import { Col, Row, Grid } from "react-native-easy-grid";

import Card from "../components/Card";
import Screen from "../Nav/Screen";
import Text from "../components/Text";
import { ListItem } from "react-native-elements";

const restrictions = [
  {
    name: "Eggs",
    image: require("../../assets/images/Eggs.png"),
    enabled: false
  },
  {
    name: "Fish",
    image: require("../../assets/images/Fish.png"),
    enabled: false
  },
  {
    name: "Gluten",
    image: require("../../assets/images/Gluten.png"),
    enabled: false
  },
  {
    name: "Milk",
    image: require("../../assets/images/Milk.png"),
    enabled: false
  },
  {
    name: "Peanuts",
    image: require("../../assets/images/Peanuts.png"),
    enabled: false
  },
  {
    name: "Shellfish",
    image: require("../../assets/images/Shellfish.png"),
    enabled: false
  },
  {
    name: "Soy",
    image: require("../../assets/images/Soy.png"),
    enabled: false
  },
  {
    name: "Tree Nuts",
    image: require("../../assets/images/TreeNuts.png"),
    enabled: false
  },
  {
    name: "Wheat",
    image: require("../../assets/images/Wheat.png"),
    enabled: false
  },
  {
    name: "Vegan",
    image: require("../../assets/images/Vegan.png"),
    enabled: false
  },
  {
    name: "Vegetarian",
    image: require("../../assets/images/Vegetarian.png"),
    enabled: false
  }
];

export default class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { restrictions: restrictions };
  }


  renderRestriction(data, index) {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        style={{ alignItems: "center", marginVertical: 5 }}
        onPress={() => {
          this.state.restrictions[index].enabled = !this.state.restrictions[
            index
          ].enabled;
          this.setState({ restrictions: this.state.restrictions });
        }}
      >
        {data.enabled ? (
          <Image
            source={data.image}
            style={{
              width: 50,
              height: 50,
              resizeMode: "contain"
            }}
          />
        ) : (
          <View>
            <Image
              source={data.image}
              style={{
                width: 50,
                height: 50,
                resizeMode: "contain",
                tintColor: "gray"
              }}
            />
            <Image
              source={data.image}
              style={{
                opacity: 0.3,
                position: "absolute",
                width: 50,
                height: 50,
                resizeMode: "contain"
              }}
            />
          </View>
        )}
        {data.enabled ? (
          <Text>{data.name}</Text>
        ) : (
          <Text style={{ color: "gray" }}>{data.name}</Text>
        )}
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <Screen
        title="Edit Profile"
        navigation={{ ...this.props.navigation }}
        backButton={true}
      >
        <Card header={"User Information"}>

          <ListItem title={`Profile Name: ${this.props.screenProps.user.displayName}`} chevron/>
          <ListItem title={`Profile Picture:`} chevron/>

        </Card>
        <Card header={"Dietary Restrictions"}>
          <RestrictionGrid
            data={this.state.restrictions}
            colPattern={[3, 3, 3, 2]}
            renderItem={this.renderRestriction}
          />
        </Card>
      </Screen>
    );
  }
}

function RestrictionGrid(props) {
  //Check if data exists as a prop
  let data = props.data;
  if (!data || data.constructor !== Array) {
    console.error("Restriction Grid Prop 'data' must be of type Array");
  }
  //Check if colPattern exists as a prop
  let colPattern = props.colPattern;
  //Check if data exists as a prop
  if (!colPattern || colPattern.constructor !== Array) {
    console.error("Restriction Grid Prop 'data' must be of type Array");
  }
  //Check if renderItem exists as a prop
  let renderItem = props.renderItem;
  if (!renderItem || renderItem.constructor !== Function) {
    console.error(
      "Restriction Grid Prop 'renderItem' must be of type Function"
    );
  }

  let colPatternIndex = 0,
    num = 0;
  let cols = [],
    rows = [];

  for (let i = 0; i < data.length; i++) {
    cols.push(<Col key={i}>{renderItem(data[i], i)}</Col>);
    num++;
    if (num == colPattern[colPatternIndex]) {
      num = 0;
      colPatternIndex++;
      colPatternIndex %= colPattern.length;
      rows.push(<Row key={i}>{cols}</Row>);
      cols = [];
    } else if (i == data.length - 1) {
      rows.push(<Row key={i}>{cols}</Row>);
    }
  }
  return <Grid>{rows}</Grid>;
}
