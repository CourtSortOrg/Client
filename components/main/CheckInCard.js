import React from "react";
import { View, TouchableOpacity } from "react-native";

import Card from "../components/Card";
import Separator from "../components/Separator";
import Text from "../components/Text";
import ProfileList from "../components/ProfileList";
import List from "../components/List";
import ListElement from "../components/ListElement";
import { Rating } from "react-native-elements";

export default class CheckIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: undefined,
      renderReport: false,
      renderBusyness: false,
      hasRatedCourt: false,
      userCourtRating: 0
    };
  }

  componentDidMount = () => {
    this.getMalfunctions();
    this.props.navigation.addListener("willFocus", payload => {
      this.getMalfunctions();
    });
  };

  getMalfunctions = () => {
    fetch(
      "https://us-central1-courtsort-e1100.cloudfunctions.net/getMalfunctionReports",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          diningCourt: this.props.screenProps.user.location
        })
      }
    )
      .then(async data => {
        let mal = await JSON.parse(data._bodyText);

        if (mal.length != 0)
          this.setState({
            reports: mal
          });
      })
      .catch(error => console.error(`getMalfunctions: ${error}`));
  };

  render() {
    return (
      <Card
        header={`Checked into ${this.props.screenProps.user.location}`}
        footer={[
          {
            text: "Change Status",
            onPress: () => this.props.screenProps.functions.changeStatus()
          },
          {
            text: "Check Out",
            onPress: () => {
              if (this.state.hasRatedCourt) {
                this.props.screenProps.functions.rateDiningCourt(
                  this.props.screenProps.user.location,
                  this.state.userCourtRating
                );
              }
              this.props.screenProps.functions.checkOut();
            }
          }
        ]}
      >
        <View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              padding: 8
            }}
          >
            <Text type="sectionName">{"Status: "}</Text>
            <Text>
              {
                this.props.screenProps.globals.statusMessage[
                  this.props.screenProps.user.status
                ]
              }
            </Text>
          </View>
          <Card
            header="Reports"
            footer={[
              {
                text: "Submit Report",
                onPress: () => this.setState({ renderReport: true })
              }
            ]}
          >
            {this.state.reports != undefined ? (
              <List
                list={this.state.reports.map(item => {
                  return {
                    Name: `${item.malfunction} with ${
                      item.numOfReports
                    } reports`
                  };
                })}
                type="element"
                rank={1}
              />
            ) : (
              <ListElement Name="No Reports" rank={1} type="element" />
            )}
          </Card>
          <Card
            footer={[
              {
                text: "Submit Busyness Report",
                onPress: () => this.setState({ renderBusyness: true })
              }
            ]}
          />

          <View style={{ marginBottom: 10 }}>
            <Text style={{ textAlign: "center" }}>Rate Your Visit</Text>
            <Rating
              startingValue={this.state.userCourtRating}
              onFinishRating={rating => {
                this.setState({ hasRatedCourt: true, userCourtRating: rating });
              }}
            />
          </View>

          <ProfileList
            navigation={this.props.navigation}
            list={this.props.screenProps.user.friends.filter(
              f =>
                f.location == this.props.screenProps.user.location &&
                f.status == 0
            )}
          />
        </View>
        {this.state.renderReport &&
          this.props.screenProps.functions.reportAlert(() =>
            this.setState({ renderReport: false })
          )}
        {this.state.renderBusyness &&
          this.props.screenProps.functions.busynessAlert(() =>
            this.setState({ renderBusyness: false })
          )}
      </Card>
    );
  }
}
