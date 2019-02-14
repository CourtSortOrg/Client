import React from "react";
import * as firebase from 'firebase';
import {
  Alert,
  Button,
  FlatList,
  Image,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Switch,
  View
} from "react-native";

export default class CreateAccount extends React.Component {
  constructor(props) {
    super(props);
    var allergenData = require("../../allergenInformation.json");
  }

  state = {
    name: "",
    email: "",
    password: "",
    isVegan: false,
    isVegetarian: false
  };

  createAccount = () => {
    Alert.alert(
      "Name: " +
        this.state.name +
        "\nEmail: " +
        this.state.email +
        "\nPassword: " +
        this.state.password
    );
    Keyboard.dismiss();
    var email = this.state.email;
    var password = this.state.password;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        var user = firebase.auth().currentUser;
        user
          .updateProfile({
            displayName: this.state.name
          })
          .then(function() {
            alert(user.displayName);
          })
          .catch(function(error) {
            alert(error.message);
          });
          this.props.navigation.navigate("Home");
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == "auth/weak-password") {
          Alert.alert("the password is too weak");
        } else {
          Alert.alert("Error", error.message);
        }
      });
  };

  renderItem = data => {
    <TouchableOpacity
      onPress={ () => this.selectItem(data)}
    >
    <Text></Text>
    </TouchableOpacity>
    }

  selectItem  = data => {
    data.item.isSelect = !data.item.isSelect;
    data.item.selectedClass = data.item.isSelect ? styles.selected: styles.list;

    const index = this.state.dataSource.findIndex(
      item => data.item.id === item.id
    );

    this.state.dataSource[index] = data.item;
    this.setState({
      dataSource: this.state.dataSource
    });
  };

  FlatListItemSeparator = () => <View style={styles.line} />;


  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={Keyboard.dismiss}
      >
        {/* Wrapped in a TouchableOpacity so the keyboard can dismiss upon clicking outside of the TextInputs */}

        {/* Hide the StatusBar for the CreateAccount Screen */}
        <StatusBar hidden />

        {/* The header for the CreateAccount Screen (purely visual) */}
        <View style={styles.header}>
          <Image style={styles.logo} source={require("../../assets/logo.png")} />
          <Text style={styles.greeting}>Create a new account!</Text>
        </View>

        {/* The body of the CreateAcoount Screen (user interactable) */}
        <View style={styles.body}>
          {/* TextInput asking for the user's name */}
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              this.email.focus();
            }}
            placeholder="Name"
            placeholderTextColor="#999"
            onChangeText={text => this.setState({ name: text })}
            returnKeyType={"next"}
            underlineColorAndroid="transparent"
          />

          {/* TextInput for the email */}
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              this.password.focus();
            }}
            placeholder="Email"
            placeholderTextColor="#999"
            ref={input => {
              this.email = input;
            }}
            onChangeText={text => this.setState({ email: text })}
            returnKeyType={"next"}
            underlineColorAndroid="transparent"
          />

          {/* TextInput for the password */}
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            blurOnSubmit={false}
            placeholder="Password"
            placeholderTextColor="#999"
            ref={input => {
              this.password = input;
            }}
            onChangeText={text => this.setState({ password: text })}
            secureTextEntry={true}
            underlineColorAndroid="transparent"
          />

          {/* Ask the user if they are vegan and or vegetarian */}
          <Text>Are you vegan?</Text>
          <Switch
            onValueChange={value => this.setState({ isVegan: value })}
            value={this.state.isVegan}
          />

          <Text>Are you vegetarian?</Text>
          <Switch
            onValueChange={value => this.setState({ isVegetarian: value })}
            value={this.state.isVegetarian}
          />
          {/* Ask the user about any dietary restrictions */}
          {/* Allergens: Eggs, Fish, Gluten, Milk, Peanuts, Shellfish, Soy, Tree Nuts, Wheat*/}
          <FlatList
            style={styles.allergenList}
            ItemSeparatorcomponent={this.FlatListItemSeparator}
            data={props.allergenInformation}
            renderItem={item =>  this.renderItem(item)}
            keyExtractor={item => item.id.toString()}
          />
          {/* The Button to create the account */}
          <Button
            color="#e9650d"
            onPress={this.createAccount}
            title="Create Account"
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end"
  },
  header: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end"
  },
  logo: {
    aspectRatio: 1,
    height: "55%"
  },
  greeting: {
    fontSize: 20,
    marginVertical: 15
  },
  body: {
    flex: 2,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  input: {
    marginBottom: 10,
    padding: 5,
    height: 40,
    width: "75%",
    borderColor: "#e9650d",
    backgroundColor: "#eee",
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 15
  },
  invalid_input: {
    marginBottom: 10,
    padding: 5,
    height: 40,
    width: "75%",
    borderColor: "#00FF00",
    backgroundColor: "#eee",
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 15
  },
  allergenList:  {
    width: "100%"
  },
  image: {
  }
});
