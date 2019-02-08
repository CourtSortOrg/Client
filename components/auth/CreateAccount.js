import React from "react";
import {
    Alert,
    Button,
    Image,
    Keyboard,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    View
} from "react-native";

export default class CreateAccount extends React.Component {

    render() {
        return (
            <TouchableOpacity
                style={styles.container}
                activeOpacity={1}
                onPress={Keyboard.dismiss}>
                {/* Wrapped in a TouchableOpacity so the keyboard can dismiss upon clicking outside of the TextInputs */}

                {/* Hide the StatusBar for the CreateAccount Screen */}
                <StatusBar hidden></StatusBar>

                {/* The header for the CreateAccount Screen (purely visual) */}
                <View style={styles.header}>
                    <Image style={styles.logo} source={require('/assets/logo.png')}/>
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
                        this
                            .email
                            .focus();
                        }}
                        placeholder="Name"
                        placeholderTextColor="#999"

                        ref={(input) => {this.name = input;}}
                        returnKeyType={"next"}
                        underlineColorAndroid="transparent">
                    </TextInput>

                    {/* TextInput for the email */}
                    <TextInput
                        style={styles.input}
                        autoCapitalize="none"
                        blurOnSubmit={false}
                        onSubmitEditing={() => {
                        this
                            .password
                            .focus();
                        }}
                        placeholder="Email"
                        placeholderTextColor="#999"

                        ref={(input) => {this.email = input;}}
                        returnKeyType={"next"}
                        underlineColorAndroid="transparent">
                    </TextInput>

                    {/* TextInput for the password */}
                    <TextInput 
                        style={styles.input}
                        autoCapitalize="none"
                        blurOnSubmit={false}
                        onSubmitEditing={() => {
                            .allergens
                            .focus();
                        }}
                        placeholder="Password"
                        placeholderTextColor="#999"

                        ref={(input) => {this.password = input;}}
                        secureTextEntry={true}
                        underlineColorAndroid="transparent">
                    </TextInput>


                    {/* Ask the user if they are vegan and or vegetarian */}

                    {/* Ask the user about any dietary restrictions */}
                    {/* Allergens: Eggs, Fish, Gluten, Milk, Peanuts, Shellfish, Soy, Tree Nuts, Wheat*/}



                    {/* The Button to create the account */}
                    < Button color="#e9650d" onPress={this.createAccount} title="Create Account"></Button>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end'
    },
    header: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end'
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
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    input: {
        marginBottom: 10,
        padding: 5,
        height: 40,
        width: '75%',
        borderColor: '#e9650d',
        backgroundColor: '#eee',
        borderWidth: 2,
        borderRadius: 5,
        paddingHorizontal: 15
    },
    .invalid: {
        borderColor: "#00FF00"
        borderRadius: 8;
    }
})
