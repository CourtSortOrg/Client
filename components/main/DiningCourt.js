import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-elements";

import Screen from "../Nav/Screen";

export default class DiningCourt extends React.Component {
  constructor(props) {
    super(props);

    this.state={
            "LocationId": "ERHT",
            "Name": "Earhart",
            "FormalName": "Earhart Dining Court",
            "Address": {
                "Street": "1275 First Street",
                "City": "West Lafayette",
                "State": "IN",
                "ZipCode": "47906-4231",
                "Country": "United States",
                "CountryCode": "US"
            },
            "PhoneNumber": "(765) 494-2410",
            "Latitude": 40.425797,
            "Longitude": -86.924944,
            "Images": [
                "02c6a8ea-4f3a-446b-a6d6-a593118758c9"
            ],
            "ImageUrls": [
                "https://api.hfs.purdue.edu/Menus/v2/file/02c6a8ea-4f3a-446b-a6d6-a593118758c9"
            ],
            "LogoUrl": "https://api.hfs.purdue.edu/Menus/v2/file/2a70c68f-560b-49f7-8838-c695f92bd9bc",
            "NormalHours": [
                {
                    "Id": "aeeeb5c8-0195-4f6e-8453-f71f087f5440",
                    "Name": "2018/19 Academic Year",
                    "EffectiveDate": "2018-08-20T00:00:00",
                    "Days": [
                        {
                            "Meals": [
                                {
                                    "Name": "Dinner",
                                    "Order": 4,
                                    "Status": "Open",
                                    "Type": "Dinner",
                                    "Hours": {
                                        "StartTime": "17:00:00",
                                        "EndTime": "22:00:00"
                                    }
                                },
                                {
                                    "Name": "Breakfast",
                                    "Order": 1,
                                    "Status": "Open",
                                    "Type": "Breakfast",
                                    "Hours": {
                                        "StartTime": "06:30:00",
                                        "EndTime": "10:00:00"
                                    }
                                },
                                {
                                    "Name": "Lunch",
                                    "Order": 2,
                                    "Status": "Open",
                                    "Type": "Lunch",
                                    "Hours": {
                                        "StartTime": "11:00:00",
                                        "EndTime": "14:00:00"
                                    }
                                }
                            ],
                            "Name": "Monday",
                            "DayOfWeek": 1
                        },
                        {
                            "Meals": [
                                {
                                    "Name": "Breakfast",
                                    "Order": 1,
                                    "Status": "Open",
                                    "Type": "Breakfast",
                                    "Hours": {
                                        "StartTime": "06:30:00",
                                        "EndTime": "10:00:00"
                                    }
                                },
                                {
                                    "Name": "Lunch",
                                    "Order": 2,
                                    "Status": "Open",
                                    "Type": "Lunch",
                                    "Hours": {
                                        "StartTime": "11:00:00",
                                        "EndTime": "14:00:00"
                                    }
                                },
                                {
                                    "Name": "Dinner",
                                    "Order": 4,
                                    "Status": "Open",
                                    "Type": "Dinner",
                                    "Hours": {
                                        "StartTime": "17:00:00",
                                        "EndTime": "22:00:00"
                                    }
                                }
                            ],
                            "Name": "Tuesday",
                            "DayOfWeek": 2
                        },
                        {
                            "Meals": [
                                {
                                    "Name": "Breakfast",
                                    "Order": 1,
                                    "Status": "Open",
                                    "Type": "Breakfast",
                                    "Hours": {
                                        "StartTime": "06:30:00",
                                        "EndTime": "10:00:00"
                                    }
                                },
                                {
                                    "Name": "Lunch",
                                    "Order": 2,
                                    "Status": "Open",
                                    "Type": "Lunch",
                                    "Hours": {
                                        "StartTime": "11:00:00",
                                        "EndTime": "14:00:00"
                                    }
                                },
                                {
                                    "Name": "Dinner",
                                    "Order": 4,
                                    "Status": "Open",
                                    "Type": "Dinner",
                                    "Hours": {
                                        "StartTime": "17:00:00",
                                        "EndTime": "21:00:00"
                                    }
                                }
                            ],
                            "Name": "Friday",
                            "DayOfWeek": 5
                        },
                        {
                            "Meals": [
                                {
                                    "Name": "Lunch",
                                    "Order": 2,
                                    "Status": "Open",
                                    "Type": "Lunch",
                                    "Hours": {
                                        "StartTime": "11:00:00",
                                        "EndTime": "14:00:00"
                                    }
                                },
                                {
                                    "Name": "Dinner",
                                    "Order": 4,
                                    "Status": "Open",
                                    "Type": "Dinner",
                                    "Hours": {
                                        "StartTime": "17:00:00",
                                        "EndTime": "22:00:00"
                                    }
                                },
                                {
                                    "Name": "Breakfast",
                                    "Order": 1,
                                    "Status": "Open",
                                    "Type": "Breakfast",
                                    "Hours": {
                                        "StartTime": "06:30:00",
                                        "EndTime": "10:00:00"
                                    }
                                }
                            ],
                            "Name": "Wednesday",
                            "DayOfWeek": 3
                        },
                        {
                            "Meals": [
                                {
                                    "Name": "Lunch",
                                    "Order": 2,
                                    "Status": "Open",
                                    "Type": "Lunch",
                                    "Hours": {
                                        "StartTime": "10:00:00",
                                        "EndTime": "14:00:00"
                                    }
                                },
                                {
                                    "Name": "Dinner",
                                    "Order": 4,
                                    "Status": "Open",
                                    "Type": "Dinner",
                                    "Hours": {
                                        "StartTime": "17:00:00",
                                        "EndTime": "20:00:00"
                                    }
                                }
                            ],
                            "Name": "Saturday",
                            "DayOfWeek": 6
                        },
                        {
                            "Meals": [
                                {
                                    "Name": "Breakfast",
                                    "Order": 1,
                                    "Status": "Open",
                                    "Type": "Breakfast",
                                    "Hours": {
                                        "StartTime": "06:30:00",
                                        "EndTime": "10:00:00"
                                    }
                                },
                                {
                                    "Name": "Dinner",
                                    "Order": 4,
                                    "Status": "Open",
                                    "Type": "Dinner",
                                    "Hours": {
                                        "StartTime": "17:00:00",
                                        "EndTime": "22:00:00"
                                    }
                                },
                                {
                                    "Name": "Lunch",
                                    "Order": 2,
                                    "Status": "Open",
                                    "Type": "Lunch",
                                    "Hours": {
                                        "StartTime": "11:00:00",
                                        "EndTime": "14:00:00"
                                    }
                                }
                            ],
                            "Name": "Thursday",
                            "DayOfWeek": 4
                        },
                        {
                            "Meals": [
                                {
                                    "Name": "Lunch",
                                    "Order": 2,
                                    "Status": "Open",
                                    "Type": "Lunch",
                                    "Hours": {
                                        "StartTime": "10:00:00",
                                        "EndTime": "14:00:00"
                                    }
                                }
                            ],
                            "Name": "Sunday",
                            "DayOfWeek": 0
                        }
                    ]
                }
            ],
            "UpcomingMeals": [
                {
                    "ID": "a320e169-fe33-4bce-92ff-d2705b884285",
                    "Name": "Dinner",
                    "Type": "Dinner",
                    "StartTime": "2019-02-12T17:00:00-05:00",
                    "EndTime": "2019-02-12T22:00:00-05:00"
                },
                {
                    "ID": "cb1d37fb-2ce2-4a77-bca8-edfd57925782",
                    "Name": "Breakfast",
                    "Type": "Breakfast",
                    "StartTime": "2019-02-13T06:30:00-05:00",
                    "EndTime": "2019-02-13T10:00:00-05:00"
                },
                {
                    "ID": "0f19127a-a3a9-4fd0-9999-163dc1c78998",
                    "Name": "Lunch",
                    "Type": "Lunch",
                    "StartTime": "2019-02-13T11:00:00-05:00",
                    "EndTime": "2019-02-13T14:00:00-05:00"
                },
                {
                    "ID": "cf3a93d2-e004-4301-93ef-cacc9ad23321",
                    "Name": "Dinner",
                    "Type": "Dinner",
                    "StartTime": "2019-02-13T17:00:00-05:00",
                    "EndTime": "2019-02-13T22:00:00-05:00"
                },
                {
                    "ID": "de5fabf9-1d0f-4d11-bb00-aafb6237db95",
                    "Name": "Breakfast",
                    "Type": "Breakfast",
                    "StartTime": "2019-02-14T06:30:00-05:00",
                    "EndTime": "2019-02-14T10:00:00-05:00"
                },
                {
                    "ID": "b6fd8398-99ed-4c2d-9075-01e02e170672",
                    "Name": "Lunch",
                    "Type": "Lunch",
                    "StartTime": "2019-02-14T11:00:00-05:00",
                    "EndTime": "2019-02-14T14:00:00-05:00"
                }
            ],
            "LineLengthCrowdsourcingEnabled": true,
            "ShortName": "ERHT",
            "Url": "https://dining.purdue.edu/ResidentialDining/locations/earhart.html",
            "StreetViewUrl": "https://www.google.com/maps/@40.4253282,-86.9250632,3a,90y,348.2h,75.9t/data=!3m6!1e1!3m4!1stmwT21l-dU9F5ptKZb5M2g!2e0!7i3328!8i1664",
            "OnTheGoLocationId": "7821758c-d602-4139-9764-7f60245c8276",
            "GooglePlaceId": "ChIJfWj9ecniEogRGmgFHapQT6A"
        }
      }

  render() {
    return (
      <Screen
        title="Dining Court"
        navigation={{ ...this.props.navigation }}
        backButton={true}
      >
        {
          // NormalHours. Selector of some sort.
          // Line length.
          // Upcoming Meal times.
          // React-native-maps
        }
        <Button
          title="Go to meal item"
          onPress={() => this.props.navigation.push("MealItem")}
        />
      </Screen>
    );
  }
}
