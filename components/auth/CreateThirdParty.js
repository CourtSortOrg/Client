import React from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import Text from "../components/Text";

export default class CreateAccount extends React.Component {
  createAccount = () => {
    console.log("CREATE ACCOunt");
  };

  render() {
    return (
      <View>
        <Text>Almost there!</Text>
        <Text>Please provide a handle so friends can easily add you</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          blurOnSubmit={false}
          onSubmitEditing={() => {
            this.password.focus();
          }}
          placeholder="Email"
          placeholderTextColor="#999"
          returnKeyType={"next"}
          onChangeText={email => this.setState({ email: email })}
          underlineColorAndroid="transparent"
        />
        <Button
          color="#e9650d"
          onPress={this.createAccount}
          title="Create Account"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#eee",
    borderColor: "#e9650d",
    borderRadius: 5,
    borderWidth: 2,
    height: 40,
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    width: "70%"
  }
});
