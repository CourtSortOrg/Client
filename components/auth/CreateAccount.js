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

import {Google} from "expo";

export default class CreateAccount extends React.Component {

    render() {
        return (
            <TouchableOpacity
                style={styles.container}
                activeOpacity={1}
                onPress={Keyboard.dismiss}>
                {/* Wrapped in a TouchableOpacity so the keyboard can dismiss upon clicking outside of the TextInputs */}

                {/* Hide the StatusBar for the SignIn Screen */}
                <StatusBar hidden></StatusBar>

                {/* The header for the SignIn Screen (purely visual) */}
                <View style={styles.header}>
                    <Image style={styles.logo} source={require('/assets/logo.png')}/>
                    <Text style={styles.greeting}>Sign in and get started!</Text>
                </View>

                {/* The body of the SignIn Screen (user interactable) */}
                <View style={styles.body}>

                    {/* The TextInput for the email, on pressing the return key it focuses to the TextInput for the password */}
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
                        returnKeyType={"next"}
                        underlineColorAndroid="transparent"></TextInput>

                    {/* The TextInput for the password, on pressing the return key it attempts to sign in the user */}
                    <TextInput
                        style={styles.input}
                        autoCapitalize="none"
                        onSubmitEditing={() => {
                            this.signInUserNative();
                        }}

                        placeholder="Password"
                        placeholderTextColor="#999"
                        ref={(input) => {
                            this.password = input;
                        }}

                        secureTextEntry={true}
                        underlineColorAndroid="transparent"></TextInput>

                    {/* The Button to sign in the user */}
                    < Button color="#e9650d" onPress={this.createAccount} title="CreateAccount"></Button>
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
    dividerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 30
    },
    divider: {
        borderBottomColor: '#BBB',
        borderTopColor: '#BBB',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        height: 2,
        width: '40%'
    },
    dividerText: {
        marginHorizontal: 15,
        color: '#BBB'
    },
    authentication: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    }
})
