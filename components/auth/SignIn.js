import React from 'react';
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
} from 'react-native';

import {Facebook, Google} from 'expo';
import {FontAwesome} from '@expo/vector-icons';
import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyA9icFnK3c3GeJTbrnFA2RkukNo9fxq5lk",
    authDomain: "courtsort-e1100.firebaseapp.com",
    databaseURL: "https://courtsort-e1100.firebaseio.com",
    storageBucket: "courtsort-e1100.appspot.com"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}



export default class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        }
        firebase.auth().onAuthStateChanged(function(user){
          if(user){
            alert("User already signed in");
            props.navigation.navigate("Home");
          }
        })
    }

    signInNative = () => {
        // Alert.alert('Clicked Sign In', 'Attempt to login user, for now will
        // automagically continue to main');
        Keyboard.dismiss();
        //Alert.alert("Credentials", this.state.username+"\n"+this.state.password)

        var username = this.state.username.toString();
        var pass = this.state.username.toString();
        firebase.auth().signInWithEmailAndPassword(username, pass).then(function(){
          //TODO  change panels here. Gives me an error
            //this
                //.props
                //.navigation
                //.navigate("Home");
        }).catch(function(error) {
          alert(error.message);
        });
    }
    createAccount = async() => {
        //Alert.alert('Should now navigate to creating account screen');
        try {
            let response = await fetch('https://us-central1-courtsort-e1100.cloudfunctions.net/test',);
            Alert.alert('Firebase Test Response', response._bodyText);
        } catch (error) {
            console.error(error);
        }
    }

    forgotPassword = () => {
        Alert.alert('Clicked Forgot Password', 'Begin navigation to ResetPassword screen')
    }

    signInGoogleAsync = async() => {
        try {

            const result = await Google.logInAsync({
                androidClientId: '41918470748-ci8cpn0tpcmt26hjtamo4qic8eo1olpf.apps.googleusercontent.com',
                iosClientId: '41918470748-lgi689vhab9g6hnctjfcivfrc1hf329j.apps.googleusercontent.com',
                scopes: ['profile', 'email']
            });

            this
                .props
                .navigation
                .navigate("Home");

            if (result.type === 'success') {
                firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken)).catch(function(error){
                  alert("Error", error.message);
                });
                return result.accessToken;
            } else {
                return {cancelled: true};
            }

            //TODO: Add Android support
            //TODO: Create ability to log back into a google account


        } catch (e) {
            alert('ERROR: ' + e.message)
            return {error: true};
        }
    }

    signInFacebookAsync = async() => {
        // TODO: Maybe need to add Android hashes?? APPID 279514589383224
        try {
            const {type, token, expires, permissions, declinedPermissions} = await Facebook.logInWithReadPermissionsAsync('279514589383224', {permissions: ['public_profile']});
            if (type === 'success') {
                // Get the user's name using Facebook's Graph API
                const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
                Alert.alert('Logged in!', `Hi ${ (await response.json()).name}!`);
                firebase.auth().signInAndRetrieveDataWithCredential(firebase.auth.FacebookAuthProvider.credential(token));
            } else {
                // type === 'cancel'
            }
        } catch ({message}) {
            alert(`Facebook Login Error: ${message}`);
        }
    }

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
                    <Image style={styles.logo} source={require('../../assets/logo.png')}/>
                    <Text style={styles.greeting}>Sign in and get started!</Text>
                </View>

                {/* The body of the SignIn Screen (user interactable) */}
                <View style={styles.body}>

                    {/* The TextInput for the email, on pressing the return key it focuses to the TextInput for the password */}
                    <TextInput
                        style={styles.input}
                        autoCapitalize='none'
                        blurOnSubmit={false}
                        onSubmitEditing={() => {
                        this
                            .password
                            .focus();
                    }}
                        placeholder='Email'
                        placeholderTextColor='#999'
                        returnKeyType={'next'}
                        onChangeText={(username) => this.setState({username})}
                        underlineColorAndroid='transparent'></TextInput>

                    {/* The TextInput for the password, on pressing the return key it attempts to sign in the user */}
                    <TextInput
                        style={styles.input}
                        autoCapitalize='none'
                        onSubmitEditing={() => {
                        this.signInNative();
                    }}
                        placeholder='Password'
                        placeholderTextColor='#999'
                        ref={(input) => {
                        this.password = input;
                    }}
                        secureTextEntry={true}
                        onChangeText={(password) => this.setState({password})}
                        underlineColorAndroid='transparent'></TextInput>

                    {/* The Button to sign in the user */}
                    < Button color='#e9650d' onPress={this.signInNative} title='Sign In'></Button>

                    {/* A visual block to separate native sign in and third part sign in */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.divider}/>
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.divider}/>
                    </View>

                    {/* TODO: Set up Facebook authentication */}
                    <View style={styles.authentication}>

                        {/* The branded Button for Google Authentification */}
                        <TouchableHighlight
                            onPress={this.signInGoogleAsync}
                            underlayColor="white"
                            style={{
                            borderRadius: 5
                        }}>
                            <View
                                style={[
                                styles.brandedButton, {
                                    backgroundColor: '#DB4437'
                                }
                            ]}>
                                <FontAwesome name='google' size={24} color='white'/>
                                <Text style={styles.brandedButtonText}>
                                    Sign In With Google
                                </Text>
                            </View>
                        </TouchableHighlight>

                        {/* The branded Button for Facebook Authentification */}
                        <TouchableHighlight
                            onPress={this.signInFacebookAsync}
                            underlayColor="white"
                            style={{
                            borderRadius: 5
                        }}>
                            <View
                                style={[
                                styles.brandedButton, {
                                    backgroundColor: '#3C5A99',
                                    width: "66%"
                                }
                            ]}>
                                <FontAwesome name='facebook-official' size={24} color='white'/>
                                <Text style={styles.brandedButtonText}>
                                    Sign In With Facebook
                                </Text>
                            </View>
                        </TouchableHighlight>

                        {/* Find icons at https://expo.github.io/vector-icons/ (must import the 'type'/source of icon i.e. FontAwesome, Ionicon, etc.) */}

                        {/* The linked Text that navigates to the CreateAccount screen */}
                        <View
                            styles={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <TouchableHighlight
                                onPress={this.createAccount}
                                activeOpacity={.65}
                                underlayColor='#FFF'>
                                <Text style={styles.linkingText}>Create an Account</Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                onPress={this.forgotPassword}
                                activeOpacity={.65}
                                underlayColor='#FFF'>
                                <Text style={styles.linkingText}>Forgot your password?</Text>
                            </TouchableHighlight>
                        </View>

                    </View>
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
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-end'
    },
    logo: {
        aspectRatio: 1,
        height: '55%'
    },
    greeting: {
        fontSize: 20,
        fontWeight: '500',
        marginVertical: 15
    },
    body: {
        alignItems: 'center',
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    input: {
        backgroundColor: '#eee',
        borderColor: '#e9650d',
        borderRadius: 5,
        borderWidth: 2,
        height: 40,
        marginBottom: 10,
        paddingVertical: 5,
        paddingHorizontal: 15,
        width: '70%'
    },
    dividerContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30
    },
    divider: {
        borderBottomColor: '#BBB',
        borderBottomWidth: 1,
        borderTopColor: '#BBB',
        borderTopWidth: 1,
        height: 2,
        width: '40%'
    },
    dividerText: {
        color: '#BBB',
        marginHorizontal: 15
    },
    authentication: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly'
    },
    brandedButton: {
        alignItems: 'center',
        borderRadius: 5,
        elevation: 2,
        flexDirection: 'row',
        height: 40,
        justifyContent: 'space-around',
        padding: 5,
        width: '65%'
    },
    brandedButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center'
    },
    linkingText: {
        color: '#AAA',
        marginTop: 10,
        textAlign: 'center',
        textDecorationLine: 'underline'
    }
})
