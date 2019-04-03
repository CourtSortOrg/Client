import React from "react";
import { TouchableOpacity } from "react-native";
import { ListItem } from "react-native-elements";
import { ImagePicker } from "expo";
import DialogInput from "react-native-dialog-input";

import AllergenIcon from "../main/AllergenIcon";

import Card from "../components/Card";
import VariableGrid from "../components/VariableGrid";
import Screen from "../Nav/Screen";

import firebase from "firebase";

const allRestrictions = [
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
      allRestrictions: allRestrictions,
      showNameInput: false,
      updatedUsername: this.props.screenProps.user.userName,
      image: null
    };

    // Loop through the user's restrictions and update the restriction grid
    let userRestrictions = this.props.screenProps.user.dietaryRestrictions;
    for (let i = 0; i < allRestrictions.length; i++) {
      allRestrictions[i].enabled = userRestrictions.includes(
        allRestrictions[i].name
      );
    }
  }

  displayNameInput = display => {
    this.setState({ showNameInput: display });
  };

  submitNameInput = name => {
    // TODO: Any preprocessing with the users name
    this.setState({ updatedUsername: name });
    this.displayNameInput(false);
  };

  pickProfilePicture = async () => {
    // TODO: Update Profile Picture

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 4]
    });
    console.log(result);
     if (!result.cancelled) {
       let downloadURL = this.uploadImage(result.uri);
       this.setState({ image: downloadURL });

       //TODO make a call setProfilePic firebase function
     }
  };

  uploadImage = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const ref = firebase.storage().ref().child('ProfilePics/' + this.props.screenProps.user.userHandle);
    const snapshot = await ref.put(blob);
    const downloadURL = await ref.getDownloadURL();
    return downloadURL;
    blob.close();
  }

  updateUserInformation = () => {
    // TODO: Update username and profile picture

    // Loop through selected restrictions and update the users restrictions
    var newRestrictions = [];
    for (let i = 0; i < allRestrictions.length; i++) {
      if (allRestrictions[i].enabled) {
        newRestrictions.push(allRestrictions[i].name);
      }
    }
    this.props.screenProps.functions.updateDietaryRestrictions(newRestrictions);

    this.props.navigation.goBack();
  };

  renderRestriction = (data, index) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          let item = this.state.allRestrictions[index];
          item.enabled = !item.enabled;
          this.setState({ allRestrictions: this.state.allRestrictions });
        }}
      >
        <AllergenIcon name={data.name} enabled={data.enabled} />
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <Screen
        title="Edit Profile"
        screenProps={this.props.screenProps}
        showNavigation={false}
        navigation={{ ...this.props.navigation }}
        backButton={true}
        backButtonCallback={this.updateUserInformation}
      >
        {/* A Card to render and change general user information */}
        <Card header={"Your Information"}>
          {/* A ListItem that when triggered shows a TextInput to edit the username */}
          <ListItem
            title={`Profile Name: ${this.state.updatedUsername}`}
            onPress={() => {
              this.displayNameInput(true);
            }}
            bottomDivider
            chevron
          />

          {/* A DialogInput that displays a TextInput to edit the username */}
          <DialogInput
            isDialogVisible={this.state.showNameInput}
            title={"Edit Username"}
            hintInput={"Username"}
            submitInput={inputText => {
              this.submitNameInput(inputText);
            }}
            closeDialog={() => {
              this.displayNameInput(false);
            }}
          />

          {/* A ListItem that when triggered shows triggers a picker to select a profile picture */}
          <ListItem
            title={`Profile Picture`}
            onPress={this.pickProfilePicture}
            chevron
          />
        </Card>

        {/* An interactable Card to render and change user dietary restrictions */}
        <Card header={"Your Dietary Restrictions"}>
          <VariableGrid
            colPattern={[3]}
            data={this.state.allRestrictions}
            renderItem={this.renderRestriction}
          />
        </Card>
      </Screen>
    );
  }
}
