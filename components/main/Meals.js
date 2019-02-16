import React from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import { Button, SearchBar } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";

import Screen from "../Nav/Screen";
import List from "./List";
import ListElement from "./ListElement";
import Text from "../Nav/Text"

const Ford = {
  Meals: [
    {
      ID: "ffb7d7f5-4492-4366-8d06-fa14bb04b4db",
      Name: "Lunch",
      Order: 2,
      Status: "Open",
      Type: "Lunch",
      Hours: {
        StartTime: "11:00:00",
        EndTime: "14:00:00"
      },
      Stations: [
        {
          Name: "BoilerQ",
          Items: [
            {
              ID: "4f2aff44-1257-4f64-8f8d-e545dabb661b",
              Name: "Chicken Thighs with Princess Rub",
              IsVegetarian: false,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: false
                },
                {
                  Name: "Milk",
                  Value: false
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: false
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: false
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: false
                }
              ]
            },
            {
              ID: "8fcf6b16-8128-4788-a61c-a2ed0ead3905",
              Name: "Scrambled Eggs With Bacon",
              IsVegetarian: false,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: true
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: false
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: false
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: false
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: false
                }
              ]
            },
            {
              ID: "da7c0800-53eb-405b-9cc1-b6d4e1adafff",
              Name: "O'Brien Potatoes",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: false
                },
                {
                  Name: "Milk",
                  Value: false
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: false
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: false
                }
              ]
            },
            {
              ID: "56e3e50d-fd79-4a8c-8005-2e2a1dfa2378",
              Name: "Maple Sausage Links",
              IsVegetarian: false,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: false
                },
                {
                  Name: "Milk",
                  Value: false
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: false
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: false
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: false
                }
              ]
            },
            {
              ID: "0657ffa5-a4ce-42fc-8aa0-30acf4ba1b7f",
              Name: "Grilled Asparagus",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: false
                },
                {
                  Name: "Milk",
                  Value: false
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: false
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: true
                },
                {
                  Name: "Wheat",
                  Value: false
                }
              ]
            }
          ]
        },
        {
          Name: "Potāto, Potäto",
          Items: [
            {
              ID: "6b2c2534-e9e0-49f2-a951-ada5b42e450f",
              Name: "Hungarian Goulash",
              IsVegetarian: false,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: false
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: false
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            },
            {
              ID: "a020587e-2870-4eda-b9cd-b8ce3688cda0",
              Name: "Egg Noodles",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: true
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: false
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: false
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            },
            {
              ID: "4c8220dc-d1e9-4f2b-81a0-ad41229ca7a3",
              Name: "Vegetarian Parmesan Rotini",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            },
            {
              ID: "1c385fc5-1500-4d49-9f71-8d59f07f30d0",
              Name: "Bratwurst",
              IsVegetarian: false,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: false
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: false
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: false
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: false
                }
              ]
            },
            {
              ID: "97d4456d-92a6-47fd-b3ba-a612c5f10b17",
              Name: "Brat Bun",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: false
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: true
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            },
            {
              ID: "129d75eb-ad95-48a2-8c8f-e7961926060b",
              Name: "Bavarian Sauerkraut",
              IsVegetarian: false,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: false
                },
                {
                  Name: "Milk",
                  Value: false
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: false
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: false
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: false
                }
              ]
            },
            {
              ID: "69f2b9ab-8583-4b99-8627-5c3d890376c8",
              Name: "Corn",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: false
                },
                {
                  Name: "Milk",
                  Value: false
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: false
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: true
                },
                {
                  Name: "Wheat",
                  Value: false
                }
              ]
            }
          ]
        },
        {
          Name: "International Market",
          Items: [
            {
              ID: "bfbc0788-792e-4f8c-ada9-05aa0660b26d",
              Name: "Chinese Szechuan Beef Stir Fry",
              IsVegetarian: false,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: false
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: true
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: false
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            },
            {
              ID: "cb389e1f-a2f5-44f1-b538-6f046dccdbb0",
              Name: "Brown Rice",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: false
                },
                {
                  Name: "Milk",
                  Value: false
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: false
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: true
                },
                {
                  Name: "Wheat",
                  Value: false
                }
              ]
            },
            {
              ID: "e97f24ef-5785-4fdc-ab62-55e01fc8fcc8",
              Name: "Yellow Squash",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: false
                },
                {
                  Name: "Milk",
                  Value: false
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: false
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: true
                },
                {
                  Name: "Wheat",
                  Value: false
                }
              ]
            },
            {
              ID: "6a7925d8-841a-4472-a6a0-52c6ee759800",
              Name: "Tempura Batter Broccoli",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            }
          ]
        },
        {
          Name: "Parmesan Tomato",
          Items: [
            {
              ID: "d25b6bbe-3b3b-4e92-af01-b0fb2db906be",
              Name: "Four Cheese Pizza",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: false
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            },
            {
              ID: "d192b0a5-d774-4029-9cc2-7779ddfae5ac",
              Name: "Meat Lover's Pizza",
              IsVegetarian: false,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: false
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            },
            {
              ID: "a5f072ae-8713-4085-8f6d-28e776a02ed1",
              Name: "Walking Taco Pizza",
              IsVegetarian: false,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: false
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: false
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            }
          ]
        },
        {
          Name: "Salami and Swiss",
          Items: [
            {
              ID: "d6fe5d39-bd46-4478-bb94-afdcfab7c3d3",
              Name: "Deli & Fresh Baked Breads",
              IsVegetarian: false
            },
            {
              ID: "05adff76-b3c2-43a8-bd61-f5694297e02f",
              Name: "Gourmet Grilled Cheese",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: true
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            },
            {
              ID: "e4ed0657-cabe-4c22-845b-5c355b6352ed",
              Name: "Loaded Baked Potato Salad ",
              IsVegetarian: false,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: true
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: false
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: false
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: false
                }
              ]
            },
            {
              ID: "d02b2362-4e18-465f-a765-ba0c046c1b4a",
              Name: "Chunky Tomato Basil Soup",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            }
          ]
        },
        {
          Name: "Sugar Hill",
          Items: [
            {
              ID: "6f6ef6dc-a4ac-47d1-8295-e82c302dba20",
              Name: "Chocolate Chip Cookie",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: true
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            },
            {
              ID: "e6f64b96-5602-4649-a2ac-6ee0165afd4f",
              Name: "Sugar Cookie",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: true
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            },
            {
              ID: "20f23ea3-9fce-4def-b671-ff32e00e096c",
              Name: "Chocolate Pudding",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: false
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: false
                }
              ]
            },
            {
              ID: "5be04ef7-50a3-430b-b332-b156680fbca1",
              Name: "Carmelita Nut Bar",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: true
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            },
            {
              ID: "1ca2b1c6-1465-4623-8ca4-a6ae519f7706",
              Name: "Twinkie Cake",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: true
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            }
          ]
        }
      ]
    },
    {
      ID: "18feb9f1-e732-4953-9216-d07d699b7847",
      Name: "Dinner",
      Order: 4,
      Status: "Open",
      Type: "Dinner",
      Hours: {
        StartTime: "17:00:00",
        EndTime: "20:00:00"
      },
      Stations: [
        {
          Name: "BoilerQ",
          Items: [
            {
              ID: "4f2aff44-1257-4f64-8f8d-e545dabb661b",
              Name: "Chicken Thighs with Princess Rub",
              IsVegetarian: false,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: false
                },
                {
                  Name: "Milk",
                  Value: false
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: false
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: false
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: false
                }
              ]
            },
            {
              ID: "ea99bdb7-b3b6-4e13-bfa7-fac3050209e6",
              Name: "Sloppy Joe",
              IsVegetarian: false,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: true
                },
                {
                  Name: "Gluten",
                  Value: false
                },
                {
                  Name: "Milk",
                  Value: false
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: false
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: false
                }
              ]
            },
            {
              ID: "33873014-a29f-4e7a-ba46-00976376c5a7",
              Name: "Cornbread",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: true
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            },
            {
              ID: "2cc64a9e-d980-4f4c-a730-3e21d71435ba",
              Name: "Breaded Onion Rings",
              IsVegetarian: false,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: false
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            }
          ]
        },
        {
          Name: "Potāto, Potäto",
          Items: [
            {
              ID: "9d2e7fc3-6a97-4527-a3cf-0f2d18519fec",
              Name: "Baked Lemon Butter Tilapia",
              IsVegetarian: false,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: true
                },
                {
                  Name: "Gluten",
                  Value: false
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: false
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: false
                }
              ]
            },
            {
              ID: "61d6007e-d136-4d90-a553-c5bb1c8c4ac2",
              Name: "Wild Rice",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: false
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: false
                }
              ]
            },
            {
              ID: "f5e392d8-dfc0-4c39-a9ed-b2968f5da32c",
              Name: "Glazed Ham with Pineapple Mustard Sauce",
              IsVegetarian: false,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: false
                },
                {
                  Name: "Milk",
                  Value: false
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: false
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: false
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: false
                }
              ]
            },
            {
              ID: "4c8220dc-d1e9-4f2b-81a0-ad41229ca7a3",
              Name: "Vegetarian Parmesan Rotini",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            },
            {
              ID: "43c1d0f5-d8cc-4d4c-8959-6e0bd0bf1275",
              Name: "Parmesan Red Potatoes",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: false
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: false
                }
              ]
            },
            {
              ID: "51bdc41d-f534-4bac-afb6-14d762f2ea04",
              Name: "Honey Butter Rolls",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            },
            {
              ID: "2e3c0468-81bd-4726-a9b2-6027681e16a8",
              Name: "Broccolini with Sesame Soy Sauce",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: false
                },
                {
                  Name: "Milk",
                  Value: false
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: true
                },
                {
                  Name: "Wheat",
                  Value: false
                }
              ]
            }
          ]
        },
        {
          Name: "International Market",
          Items: [
            {
              ID: "bfbc0788-792e-4f8c-ada9-05aa0660b26d",
              Name: "Chinese Szechuan Beef Stir Fry",
              IsVegetarian: false,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: false
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: true
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: false
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            },
            {
              ID: "e97f24ef-5785-4fdc-ab62-55e01fc8fcc8",
              Name: "Yellow Squash",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: false
                },
                {
                  Name: "Milk",
                  Value: false
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: false
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: true
                },
                {
                  Name: "Wheat",
                  Value: false
                }
              ]
            },
            {
              ID: "6a7925d8-841a-4472-a6a0-52c6ee759800",
              Name: "Tempura Batter Broccoli",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            },
            {
              ID: "cb389e1f-a2f5-44f1-b538-6f046dccdbb0",
              Name: "Brown Rice",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: false
                },
                {
                  Name: "Milk",
                  Value: false
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: false
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: true
                },
                {
                  Name: "Wheat",
                  Value: false
                }
              ]
            }
          ]
        },
        {
          Name: "Parmesan Tomato",
          Items: [
            {
              ID: "a5f072ae-8713-4085-8f6d-28e776a02ed1",
              Name: "Walking Taco Pizza",
              IsVegetarian: false,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: false
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: false
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            },
            {
              ID: "d192b0a5-d774-4029-9cc2-7779ddfae5ac",
              Name: "Meat Lover's Pizza",
              IsVegetarian: false,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: false
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            },
            {
              ID: "d25b6bbe-3b3b-4e92-af01-b0fb2db906be",
              Name: "Four Cheese Pizza",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: false
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            }
          ]
        },
        {
          Name: "Salami and Swiss",
          Items: [
            {
              ID: "d6fe5d39-bd46-4478-bb94-afdcfab7c3d3",
              Name: "Deli & Fresh Baked Breads",
              IsVegetarian: false
            },
            {
              ID: "05adff76-b3c2-43a8-bd61-f5694297e02f",
              Name: "Gourmet Grilled Cheese",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: true
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            },
            {
              ID: "d02b2362-4e18-465f-a765-ba0c046c1b4a",
              Name: "Chunky Tomato Basil Soup",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            },
            {
              ID: "e4ed0657-cabe-4c22-845b-5c355b6352ed",
              Name: "Loaded Baked Potato Salad ",
              IsVegetarian: false,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: true
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: false
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: false
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: false
                }
              ]
            }
          ]
        },
        {
          Name: "Sugar Hill",
          Items: [
            {
              ID: "6f6ef6dc-a4ac-47d1-8295-e82c302dba20",
              Name: "Chocolate Chip Cookie",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: true
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            },
            {
              ID: "e6f64b96-5602-4649-a2ac-6ee0165afd4f",
              Name: "Sugar Cookie",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: true
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            },
            {
              ID: "5be04ef7-50a3-430b-b332-b156680fbca1",
              Name: "Carmelita Nut Bar",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: true
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            },
            {
              ID: "20f23ea3-9fce-4def-b671-ff32e00e096c",
              Name: "Chocolate Pudding",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: false
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: false
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: false
                }
              ]
            },
            {
              ID: "1ca2b1c6-1465-4623-8ca4-a6ae519f7706",
              Name: "Twinkie Cake",
              IsVegetarian: true,
              Allergens: [
                {
                  Name: "Eggs",
                  Value: true
                },
                {
                  Name: "Fish",
                  Value: false
                },
                {
                  Name: "Gluten",
                  Value: true
                },
                {
                  Name: "Milk",
                  Value: true
                },
                {
                  Name: "Peanuts",
                  Value: false
                },
                {
                  Name: "Shellfish",
                  Value: false
                },
                {
                  Name: "Soy",
                  Value: true
                },
                {
                  Name: "Tree Nuts",
                  Value: false
                },
                {
                  Name: "Vegetarian",
                  Value: true
                },
                {
                  Name: "Vegan",
                  Value: false
                },
                {
                  Name: "Wheat",
                  Value: true
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export default class Meals extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: 0,
      meals: Ford.Meals,
      currentMeal: 0,
      search: "",
      filteredMeals: Ford.Meals[0].Stations
    };
  }

  previousDate() {
    this.setState(
      {
        date: this.state.date - 1,
        currentMeal: 0
      },
      this.onClearText
    );
  }

  nextDate() {
    this.setState(
      {
        date: this.state.date + 1,
        currentMeal: 0
      },
      this.onClearText
    );
  }

  updateMeals(index) {
    this.setState(
      {
        currentMeal: index
      },
      this.filterMeals
    );
  }

  filterMeals() {
    let filteredMeals = JSON.parse(
      JSON.stringify(this.state.meals[this.state.currentMeal].Stations)
    );
    if (this.state.search != "") {
      for (let i = 0; i < filteredMeals.length; i++) {
        filteredMeals[i].Items = filteredMeals[i].Items.filter(item =>
          item.Name.includes(this.state.search)
        );
      }
      filteredMeals = filteredMeals.filter(
        station => station.Items.length != 0
      );
    }
    this.setState({
      filteredMeals
    });
  }

  onChangeText(search) {
    this.setState(
      {
        search
      },
      this.filterMeals
    );
  }

  onClearText() {
    this.setState(
      {
        search: ""
      },
      this.filterMeals
    );
  }

  render() {
    return (
      <Screen
        title="Meals"
        navigation={{ ...this.props.navigation }}
        backButton={false}
      >
        <View style={{ flex: 2, height: 75, flexDirection: "row" }}>
          <TouchableOpacity
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={() => this.previousDate()}
          >
            <MaterialIcons
              size={32}
              name="keyboard-arrow-left"
              color="#E86515"
            />
          </TouchableOpacity>
          <View
            style={{ flex: 4, justifyContent: "center", alignItems: "center" }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text>January 30 {this.state.date}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
              {this.state.meals.map((meal, index) => (
                <TouchableOpacity
                  style={
                    this.state.currentMeal == index
                      ? {
                          borderStyle: "solid",
                          borderColor: "black",
                          borderBottomWidth: 3,
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center"
                        }
                      : {
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center"
                        }
                  }
                  key={index}
                  onPress={event => {
                    this.updateMeals(index);
                  }}
                >
                  <Text>{meal.Name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <TouchableOpacity
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={() => this.nextDate()}
          >
            <MaterialIcons
              size={32}
              name="keyboard-arrow-right"
              color="#E86515"
            />
          </TouchableOpacity>
        </View>
        <SearchBar
          lightTheme
          onChangeText={text => this.onChangeText(text)}
          onClearText={() => this.onClearText()}
          icon={{ type: "font-awesome", name: "search" }}
          placeholder="Filter"
          value={this.state.search}
        />
        {this.state.filteredMeals.length != 0 ? (
          <List
            navigation={this.props.navigation}
            list={this.state.filteredMeals}
            type={"expandable"}
            expand={this.state.search.length != 0}
            subList={{
              list: "Items",
              type: "element",
              subList: false,
              viewMore: {
                page: "MealItem",
                item: "ID"
              }
            }}
          />
        ) : (
          <ListElement type="expandable" Name="No item found" />
        )}
      </Screen>
    );
  }
}
