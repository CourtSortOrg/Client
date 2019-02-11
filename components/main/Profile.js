import React from 'react';
import {
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import { Avatar, Divider } from 'react-native-elements';
import { EvilIcons } from '@expo/vector-icons';

import Screen from '../Nav/Screen';

export default class Profile extends React.Component {
  openFriends = () => {
    Alert.alert('Clicked Friends', 'Navigate to friends page');
    //this.props.navigation.navigate("Friend")
  };

  openGroups = () => {
    Alert.alert('Clicked Groups', 'Navigate to groups page');
    //this.props.navigation.navigate("Group")
  };

  openRatings = () => {
    Alert.alert('Clicked Ratings', 'Navigate to ratings page');
  };

  render() {
    return (
      <Screen
        title="Profile"
        navigation={{ ...this.props.navigation }}
        backButton={false}>
        <ScrollView>
          <View style={styles.profileInformation}>
            <Avatar
              title="DK"
              containerStyle={styles.profilePicture}
              rounded
              source={{
                uri:
                  'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
              }}
              size={100}
            />
            <Text style={styles.profileName}>Sample User</Text>
            <EvilIcons
              name="pencil"
              size={35}
              color="gray"
              style={{ position: 'absolute', top: 4, right: 4 }}
            />
          </View>

          <Divider style={{ backgroundColor: 'lightgray', height: 1 }}/>
          <View style={{backgroundColor:'white'}}><Text>Allergens</Text></View>
          <Divider style={{ backgroundColor: 'lightgray', height: 1 }}/>


          <View style={styles.profileActions}>
            <TouchableHighlight
              style={styles.actionButton}
              underlayColor="#d2d5d8"
              onPress={this.openRatings}>
              <Text style={styles.actionButtonText}>Ratings</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.actionButton}
              underlayColor="#d2d5d8"
              onPress={this.openFriends}>
              <Text style={styles.actionButtonText}>Friends</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.actionButton}
              underlayColor="#d2d5d8"
              onPress={this.openGroups}>
              <Text style={styles.actionButtonText}>Groups</Text>
            </TouchableHighlight>
          </View>
          <View styles={{backgroundColor:"white", height:"100%"}}/>
        </ScrollView>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  profileInformation: {
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePicture: {
    borderColor: '#e9650d',
    borderWidth: 4,
    marginVertical: 10,
  },
  profileName: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: 20,
  },
  profileActions: {
    flexDirection: 'row',
    height: 45,
  },
  actionButton: {
    backgroundColor: '#e8ebef',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontWeight: 'bold',
  },
});
