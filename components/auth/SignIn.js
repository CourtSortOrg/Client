import React from "react";
import {
    Alert,
    Button,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View
} from "react-native";

export default class SignIn extends React.Component {
    signInUserNative = () => {
        Alert.alert('You tapped the button!');
    }
    createAccount = () => {
        Alert.alert('Should now navigate to creating account screen');
    }
    render() {
        return (
            <View style={styles.container}>

                <StatusBar hidden/>

                <View style={styles.header}>
                    <Image source={require('/assets/logo.png')} style={styles.logo}/>
                    <Text style={styles.greeting}>Sign in and get started!</Text>
                </View>

                <View style={styles.body}>
                    <TextInput
                        style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder="Email"
                        placeholderTextColor="#999"
                        autoCapitalize="none"/>

                    <TextInput
                        style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder="Password"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        secureTextEntry={true}/>

                    <Button
                        onPress={() => {
                        this.signInUserNative();
                    }}
                        title="Sign In"
                        color="#e9650d"/>

                    <View style={styles.dividerContainer}>
                        <View style={styles.divider}/>
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.divider}/>
                    </View>

                    <TouchableHighlight
                        onPress={this.createAccount}
                        activeOpacity={.65}
                        underlayColor="#FFF">
                        <Text
                            style={{
                            textDecorationLine: "underline",
                            color: "#AAA"
                        }}>Create an Account</Text>
                    </TouchableHighlight>
                </View>
            </View>
        // Add Component for Google Sign-in Add Componenet for Facebook Sign-in
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
    }
})
