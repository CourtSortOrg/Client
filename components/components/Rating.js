import React from "react";
import { View, TouchableOpacity } from "react-native";

import { Rating as RatingNative } from "react-native-elements";

export default class Rating extends React.Component {
  render() {
    return (
      <View>
        <Rating
          imageSize={20}
          ratingColor={!this.props.userRating && "#ccc"}
          startingValue={this.props.rating}
          onFinishRating={this.props.updateRating}
        />
      </View>
    );
  }
}
