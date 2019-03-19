import React from "react";
import { Alert, Image, Platform, TouchableOpacity, View } from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";
import { ImagePicker } from "expo";
import Card from "../components/Card";
import Screen from "../Nav/Screen";
import Text from "../components/Text";
import { ListItem } from "react-native-elements";
import VariableGrid from "../components/VariableGrid";

import AllergenIcon from "../main/AllergenIcon";

const restrictions = [
  {
    name: "Eggs",
    enabled: false
  },
  {
    name: "Fish",
    enabled: false
  },
  {
    name: "Gluten",
    enabled: false
  },
  {
    name: "Milk",
    enabled: false
  },
  {
    name: "Peanuts",
    enabled: false
  },
  {
    name: "Shellfish",
    enabled: false
  },
  {
    name: "Soy",
    enabled: false
  },
  {
    name: "Tree Nuts",
    enabled: false
  },
  {
    name: "Wheat",
    enabled: false
  },
  {
    name: "Vegan",
    enabled: false
  },
  {
    name: "Vegetarian",
    enabled: false
  }
];

export default class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restrictions: restrictions,
      showNameDialog: false,
      userRestrictions: ["Wheat", "Tree Nuts", "Shellfish"]
    };
    //this.props.screenProps.user.dietaryRestrictions

    for (let i = 0; i < restrictions.length; i++) {
      if (this.state.userRestrictions.includes(restrictions[i].name)) {
        console.log(`${restrictions[i].name} is restricted`);
        restrictions[i].enabled = true;
      } else {
        console.log(`${restrictions[i].name} not restricted`);
        restrictions[i].enabled = false;
      }
    }
  }

  renderRestriction = (data, index) => {
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
        <AllergenIcon name={data.name} enabled={data.enabled} />
      </TouchableOpacity>
    );
  };

  pickProfilePicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 4]
    });

    console.log(result);

    // if (!result.cancelled) {
    //   this.setState({ image: result.uri });
    // }
  };

  render() {
    return (
      <Screen
        title="Edit Profile"
        showNavigation={false}
        navigation={{ ...this.props.navigation }}
        backButton={true}
        backButtonCallback={() => {
          console.log("BACK");
          //TODO: Add saving state of restrictions
          //this.props.navigation.goBack();
        }}
      >
        <Card header={"Your Information"}>
          <ListItem
            title={`Profile Name: ${this.props.screenProps.user.userName}`}
            onPress={() => {
              Platform.IOS
                ? AlertIOS.prompt("Enter new profile name", null, text =>
                    console.log("You entered " + text)
                  )
                : Alert.alert("Android TextInput");
            }}
            chevron
          />
          <ListItem
            title={`Profile Picture`}
            onPress={this.pickProfilePicture}
            chevron
          />
        </Card>
        <Card header={"Your Dietary Restrictions"}>
          <VariableGrid
            data={this.state.restrictions}
            colPattern={[3]}
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
