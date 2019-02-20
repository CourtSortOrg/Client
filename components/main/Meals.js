import React from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import { Button, SearchBar } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";

import Screen from "../Nav/Screen";
import List from "./List";
import ListElement from "./ListElement";
import Text from "../Nav/Text";
import SearchList from "../Nav/SearchList";

export default class Meals extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: 0,
      meals: [
        {
          Courts: [
            {
              Meals: [
                {
                  Name: "Lunch",
                  Stations: [
                    {
                      Items: [
                        {
                          Name: "Super Beef Hot Dog",
                          ID: "60d9accc-195f-4514-9530-7da1c08b7d82"
                        },
                        {
                          Name: "Thincut Fries",
                          ID: "5befb4c1-9fe2-4d58-aead-4721a7df022b"
                        },
                        {
                          Name: "MYO Pho Noodle Bowl",
                          ID: "82b81d99-dfe1-409c-9f51-89587498ea14"
                        }
                      ],
                      Name: "Creation Station"
                    },
                    {
                      Name: "3rd Street Grill",
                      Items: [
                        {
                          Name: "Spaghetti",
                          ID: "df2a1b10-5e66-4d1e-8daa-b46263737dfe"
                        },
                        {
                          Name: "Meatballs with Spaghetti Sauce",
                          ID: "cf7f6476-98d2-4a56-b649-1588be5b67c7"
                        },
                        {
                          Name: "Alfredo Sauce",
                          ID: "3549cf95-1698-49df-98a8-8fce25289c17"
                        },
                        {
                          Name: "Marinara Sauce",
                          ID: "36c564ab-649b-48e7-afd4-db4f506f964a"
                        },
                        {
                          Name: "Garlic Cheese Breadsticks",
                          ID: "14be4eb7-0acb-47f0-9ed0-04e37c174815"
                        }
                      ]
                    },
                    {
                      Name: "Heartland Classics",
                      Items: [
                        {
                          Name: "Corn and Crab Chowder",
                          ID: "92d3c1c3-8c0e-4952-bbff-ec06476aa3a5"
                        },
                        {
                          Name: "Chicken Teriyaki with Pineapple Ring",
                          ID: "b0c8329f-772a-4f09-a9f3-04a721592e1f"
                        },
                        {
                          Name: "Mini Spring Rolls",
                          ID: "8250ca53-98cb-4ba9-9699-c760e1375c3d"
                        },
                        {
                          Name: "Tilapia with Fresh Ginger and Scallions",
                          ID: "b086f50d-5e72-4deb-9d8c-fe95fd76873d"
                        },
                        {
                          Name: "Eggplant Tofu Stir Fry",
                          ID: "eb9fd98b-1cb2-43cd-8542-0e8c7128a7d4"
                        },
                        {
                          Name: "Fried Rice",
                          ID: "923de590-b346-44f9-962d-dbec39f26ab5"
                        },
                        {
                          Name: "Roasted Broccoli",
                          ID: "dd9f6dd6-ba33-4381-841d-af01d912588e"
                        },
                        {
                          Name: "Stir Fry Vegetables",
                          ID: "e71289c0-7454-4848-8353-2f154cd92c69"
                        }
                      ]
                    },
                    {
                      Name: "Chef Choice",
                      Items: [
                        {
                          Name: "Wings Your Way",
                          ID: "5ecfa09e-9cdc-4ba6-945e-83b050ec255c"
                        },
                        {
                          Name: "Thincut Fries",
                          ID: "5befb4c1-9fe2-4d58-aead-4721a7df022b"
                        },
                        {
                          Name: "Rub Asian Dry",
                          ID: "85b194ed-c516-49b1-956c-2d39a3fa3ce4"
                        },
                        {
                          Name: "Chinese BBQ Wing Sauce",
                          ID: "124ae039-832a-4598-b513-524e337b1d6a"
                        }
                      ]
                    },
                    {
                      Name: "Stack It Up Deli",
                      Items: [
                        {
                          Name: "Deli Subs",
                          ID: "0c721f3d-972c-4a55-b32d-4ee7ac90157d"
                        }
                      ]
                    },
                    {
                      Name: "Daily Feature",
                      Items: [
                        {
                          Name: "Fresh Hamburger Patty",
                          ID: "abe08eda-0053-4020-8bd2-5e369368d107"
                        },
                        {
                          Name: "Brioche Bun ",
                          ID: "6ad7c947-a887-4639-9583-66bf1ba23e4c"
                        },
                        {
                          Name: "Fresh Potato Chips",
                          ID: "fca6f6a1-c881-478b-bf95-2b5c8b09706e"
                        },
                        {
                          Name: "Grilled Jalapeno",
                          ID: "a1837f35-a8e6-4406-9601-40ceca2f80eb"
                        },
                        {
                          Name: "Grilled Pineapple",
                          ID: "9f4ee70a-dac2-46b1-a9c1-97110a64564f"
                        },
                        {
                          Name: "Samurai Burger Line Toppers",
                          ID: "ab1ca9fa-ffda-4276-9779-72b3f4306008"
                        }
                      ]
                    },
                    {
                      Name: "Leaf n Ladle",
                      Items: [
                        {
                          Name: "Mediterranean Salad Bar",
                          ID: "e458ae4d-8053-4461-bac5-9e691d32ccdc"
                        },
                        {
                          Name: "Yogurt Bar",
                          ID: "ccf7c02d-5ac6-4814-8695-29d6f89b0ab1"
                        },
                        {
                          Name: "Marion Blackberries",
                          ID: "96268381-2b4d-49cc-88bb-4f09aecca9d7"
                        },
                        {
                          Name: "Red Grapes",
                          ID: "6c4fcb26-84d8-4036-ad33-44d754781daf"
                        },
                        {
                          Name: "White Grapes",
                          ID: "512f31b3-2637-475e-8d87-3107f442638c"
                        },
                        {
                          Name: "Orange Sections",
                          ID: "159f39dd-0562-4d9d-a1da-0daaab3fcbb7"
                        },
                        {
                          Name: "Cobb Salad",
                          ID: "8bd98f31-4cd0-4f0f-b1af-023540b738be"
                        },
                        {
                          Name: "Sliced Peaches",
                          ID: "7ef8eceb-c868-4841-bcd7-9bcf1748b4bd"
                        }
                      ]
                    },
                    {
                      Items: [
                        {
                          Name: "Carnival Cookie",
                          ID: "08b0e608-89e7-475a-b206-384a66025b92"
                        },
                        {
                          Name: "Chocolate Rice Krispies Bar",
                          ID: "2ef8d5f7-b32f-47a2-a1ed-4ffc54b982cd"
                        },
                        {
                          Name: "Lemon Meringue Pie",
                          ID: "6abcfd45-711d-41ed-97a1-9de4cc74e9c3"
                        },
                        {
                          Name: "Sugar Cookie",
                          ID: "e6f64b96-5602-4649-a2ac-6ee0165afd4f"
                        }
                      ],
                      Name: "Temptations"
                    }
                  ],
                  Order: 2
                },
                {
                  Name: "Late Lunch",
                  Stations: [
                    {
                      Name: "Creation Station",
                      Items: [
                        {
                          Name: "Super Beef Hot Dog",
                          ID: "60d9accc-195f-4514-9530-7da1c08b7d82"
                        },
                        {
                          Name: "Thincut Fries",
                          ID: "5befb4c1-9fe2-4d58-aead-4721a7df022b"
                        },
                        {
                          Name: "MYO Pho Noodle Bowl",
                          ID: "82b81d99-dfe1-409c-9f51-89587498ea14"
                        }
                      ]
                    },
                    {
                      Name: "3rd Street Grill",
                      Items: [
                        {
                          Name: "Spaghetti",
                          ID: "df2a1b10-5e66-4d1e-8daa-b46263737dfe"
                        },
                        {
                          Name: "Meatballs with Spaghetti Sauce",
                          ID: "cf7f6476-98d2-4a56-b649-1588be5b67c7"
                        },
                        {
                          Name: "Alfredo Sauce",
                          ID: "3549cf95-1698-49df-98a8-8fce25289c17"
                        },
                        {
                          Name: "Marinara Sauce",
                          ID: "36c564ab-649b-48e7-afd4-db4f506f964a"
                        },
                        {
                          Name: "Garlic Cheese Breadsticks",
                          ID: "14be4eb7-0acb-47f0-9ed0-04e37c174815"
                        }
                      ]
                    },
                    {
                      Name: "Heartland Classics",
                      Items: [
                        {
                          Name: "Corn and Crab Chowder",
                          ID: "92d3c1c3-8c0e-4952-bbff-ec06476aa3a5"
                        },
                        {
                          Name: "Bacon Corn Chowder",
                          ID: "b52db1ea-5886-41e8-a518-c765e0fde69d"
                        },
                        {
                          Name: "Chicken Teriyaki with Pineapple Ring",
                          ID: "b0c8329f-772a-4f09-a9f3-04a721592e1f"
                        },
                        {
                          Name: "Mini Spring Rolls",
                          ID: "8250ca53-98cb-4ba9-9699-c760e1375c3d"
                        },
                        {
                          Name: "Tilapia with Fresh Ginger and Scallions",
                          ID: "b086f50d-5e72-4deb-9d8c-fe95fd76873d"
                        },
                        {
                          Name: "Eggplant Tofu Stir Fry",
                          ID: "eb9fd98b-1cb2-43cd-8542-0e8c7128a7d4"
                        },
                        {
                          Name: "Fried Rice",
                          ID: "923de590-b346-44f9-962d-dbec39f26ab5"
                        },
                        {
                          Name: "Roasted Broccoli",
                          ID: "dd9f6dd6-ba33-4381-841d-af01d912588e"
                        },
                        {
                          Name: "Stir Fry Vegetables",
                          ID: "e71289c0-7454-4848-8353-2f154cd92c69"
                        }
                      ]
                    },
                    {
                      Name: "Chef Choice",
                      Items: [
                        {
                          Name: "Wings Your Way",
                          ID: "5ecfa09e-9cdc-4ba6-945e-83b050ec255c"
                        },
                        {
                          Name: "Thincut Fries",
                          ID: "5befb4c1-9fe2-4d58-aead-4721a7df022b"
                        },
                        {
                          Name: "Rub Asian Dry",
                          ID: "85b194ed-c516-49b1-956c-2d39a3fa3ce4"
                        },
                        {
                          Name: "Chinese BBQ Wing Sauce",
                          ID: "124ae039-832a-4598-b513-524e337b1d6a"
                        }
                      ]
                    },
                    {
                      Name: "Stack It Up Deli",
                      Items: [
                        {
                          Name: "Deli Subs",
                          ID: "0c721f3d-972c-4a55-b32d-4ee7ac90157d"
                        }
                      ]
                    },
                    {
                      Name: "Daily Feature",
                      Items: [
                        {
                          Name: "Fresh Hamburger Patty",
                          ID: "abe08eda-0053-4020-8bd2-5e369368d107"
                        },
                        {
                          Name: 'Bun Brioche Golden Sliced 4"',
                          ID: "6ad7c947-a887-4639-9583-66bf1ba23e4c"
                        },
                        {
                          Name: "Fresh Potato Chips",
                          ID: "fca6f6a1-c881-478b-bf95-2b5c8b09706e"
                        },
                        {
                          Name: "Grilled Jalapeno",
                          ID: "a1837f35-a8e6-4406-9601-40ceca2f80eb"
                        },
                        {
                          Name: "Grilled Pineapple",
                          ID: "9f4ee70a-dac2-46b1-a9c1-97110a64564f"
                        },
                        {
                          Name: "Samurai Burger Line Toppers",
                          ID: "ab1ca9fa-ffda-4276-9779-72b3f4306008"
                        }
                      ]
                    },
                    {
                      Name: "Leaf n Ladle",
                      Items: [
                        {
                          Name: "Mediterranean Salad Bar",
                          ID: "e458ae4d-8053-4461-bac5-9e691d32ccdc"
                        },
                        {
                          Name: "Yogurt Bar",
                          ID: "ccf7c02d-5ac6-4814-8695-29d6f89b0ab1"
                        },
                        {
                          Name: "Marion Blackberries",
                          ID: "96268381-2b4d-49cc-88bb-4f09aecca9d7"
                        },
                        {
                          Name: "Red Grapes",
                          ID: "6c4fcb26-84d8-4036-ad33-44d754781daf"
                        },
                        {
                          Name: "White Grapes",
                          ID: "512f31b3-2637-475e-8d87-3107f442638c"
                        },
                        {
                          Name: "Orange Sections",
                          ID: "159f39dd-0562-4d9d-a1da-0daaab3fcbb7"
                        },
                        {
                          Name: "Fresh Fruit Bar",
                          ID: "3f2ffe26-14b2-462d-903f-3f4977159399"
                        },
                        {
                          Name: "Cobb Salad",
                          ID: "8bd98f31-4cd0-4f0f-b1af-023540b738be"
                        },
                        {
                          Name: "Sliced Peaches",
                          ID: "7ef8eceb-c868-4841-bcd7-9bcf1748b4bd"
                        }
                      ]
                    },
                    {
                      Name: "Temptations",
                      Items: [
                        {
                          Name: "Carnival Cookie",
                          ID: "08b0e608-89e7-475a-b206-384a66025b92"
                        },
                        {
                          Name: "Chocolate Rice Krispies Bar",
                          ID: "2ef8d5f7-b32f-47a2-a1ed-4ffc54b982cd"
                        },
                        {
                          Name: "Lemon Meringue Pie",
                          ID: "6abcfd45-711d-41ed-97a1-9de4cc74e9c3"
                        },
                        {
                          Name: "Sugar Cookie",
                          ID: "e6f64b96-5602-4649-a2ac-6ee0165afd4f"
                        }
                      ]
                    }
                  ],
                  Order: 3
                },
                {
                  Order: 4,
                  Name: "Dinner",
                  Stations: [
                    {
                      Name: "Creation Station",
                      Items: [
                        {
                          Name: "Irish Nacho Bar Toppers",
                          ID: "1a2f5a4a-db20-4122-aa1e-2a9da2d5520b"
                        },
                        {
                          Name: "Corned Beef Brisket",
                          ID: "4fc2bede-5ca9-477b-8820-c4fa515564b6"
                        },
                        {
                          Name: "Beef Tacos",
                          ID: "98abb8cd-0016-4587-ba1b-e98df19242e0"
                        },
                        {
                          Name: "Homestyle Sausage Gravy",
                          ID: "3891b961-abf7-41b6-aa9d-c9fa93a68273"
                        },
                        {
                          Name: "Sausage Gravy Gluten Free",
                          ID: "f195bfd0-c58d-4cb7-9091-8052c785e124"
                        },
                        {
                          Name: "Southern Style Biscuits",
                          ID: "20710ffb-8999-40a6-acfd-d47d361aba57"
                        },
                        {
                          Name: "Scrambled Eggs",
                          ID: "6c883ba0-e283-4086-ab01-e181a6615435"
                        },
                        {
                          Name: "Smokey Links",
                          ID: "c63a2a32-09d2-4d60-a8fc-4005e1a738d5"
                        },
                        {
                          Name: "Fried Potatoes",
                          ID: "a6539bc1-a5b9-43da-83c1-924fe7d73e25"
                        }
                      ]
                    },
                    {
                      Name: "3rd Street Grill",
                      Items: [
                        {
                          Name: "Corned Beef Brisket",
                          ID: "4fc2bede-5ca9-477b-8820-c4fa515564b6"
                        },
                        {
                          Name: "Beef Tacos",
                          ID: "98abb8cd-0016-4587-ba1b-e98df19242e0"
                        },
                        {
                          Name: "Fried Potatoes",
                          ID: "a6539bc1-a5b9-43da-83c1-924fe7d73e25"
                        },
                        {
                          Name: "Irish Nacho Bar Toppers",
                          ID: "1a2f5a4a-db20-4122-aa1e-2a9da2d5520b"
                        }
                      ]
                    },
                    {
                      Items: [
                        {
                          Name: "Corn and Crab Chowder",
                          ID: "92d3c1c3-8c0e-4952-bbff-ec06476aa3a5"
                        },
                        {
                          Name: "Corned Beef Brisket",
                          ID: "4fc2bede-5ca9-477b-8820-c4fa515564b6"
                        },
                        {
                          Name: "Vegetable Lasagna",
                          ID: "15138747-87d9-404d-9b60-7e9a3c48622d"
                        },
                        {
                          Name: "Chicken Huli Huli",
                          ID: "f9fa67d2-a7df-4899-826b-fce0593ff79e"
                        },
                        {
                          Name: "Garlic Smashed Yukon  Potatoes",
                          ID: "bf5a89fd-52d9-4816-8846-488040dfa282"
                        },
                        {
                          Name: "Sauteed Cabbage",
                          ID: "62560346-720d-4d93-b03d-add6087ad4d1"
                        },
                        {
                          Name: "Baby Dilled Carrots",
                          ID: "f77a5a16-6489-4e09-a9cf-0c1b9e463c3e"
                        }
                      ],
                      Name: "Heartland Classics"
                    },
                    {
                      Name: "Chef Choice",
                      Items: [
                        {
                          Name: "Panko Breaded Fish",
                          ID: "2ca93ba6-3fcb-4379-bf48-b07d1a364dc8"
                        },
                        {
                          Name: "Original Sidewinders French Fry",
                          ID: "69353c58-6166-48d9-9573-6e80b403f27f"
                        }
                      ]
                    },
                    {
                      Items: [
                        {
                          Name: "Deli Subs",
                          ID: "0c721f3d-972c-4a55-b32d-4ee7ac90157d"
                        }
                      ],
                      Name: "Stack It Up Deli"
                    },
                    {
                      Name: "Daily Feature",
                      Items: [
                        {
                          Name: "Top Your Own Pretzel",
                          ID: "e4ef358c-c812-467f-9415-4d7e3e966e21"
                        }
                      ]
                    },
                    {
                      Name: "Leaf n Ladle",
                      Items: [
                        {
                          Name: "Mediterranean Salad Bar",
                          ID: "e458ae4d-8053-4461-bac5-9e691d32ccdc"
                        },
                        {
                          Name: "Yogurt Bar",
                          ID: "ccf7c02d-5ac6-4814-8695-29d6f89b0ab1"
                        },
                        {
                          Name: "Cobb Salad",
                          ID: "8bd98f31-4cd0-4f0f-b1af-023540b738be"
                        },
                        {
                          Name: "Marion Blackberries",
                          ID: "96268381-2b4d-49cc-88bb-4f09aecca9d7"
                        },
                        {
                          Name: "Red Grapes",
                          ID: "6c4fcb26-84d8-4036-ad33-44d754781daf"
                        },
                        {
                          Name: "White Grapes",
                          ID: "512f31b3-2637-475e-8d87-3107f442638c"
                        },
                        {
                          Name: "Orange Sections",
                          ID: "159f39dd-0562-4d9d-a1da-0daaab3fcbb7"
                        },
                        {
                          Name: "Sliced Peaches",
                          ID: "7ef8eceb-c868-4841-bcd7-9bcf1748b4bd"
                        }
                      ]
                    },
                    {
                      Name: "Temptations",
                      Items: [
                        {
                          Name: "French Cream Cheesecake",
                          ID: "b9936680-a5c3-416d-9f95-75a69ffa44ab"
                        },
                        {
                          Name: "Carnival Cookie",
                          ID: "08b0e608-89e7-475a-b206-384a66025b92"
                        },
                        {
                          Name: "Chocolate Rice Krispies Bar",
                          ID: "2ef8d5f7-b32f-47a2-a1ed-4ffc54b982cd"
                        },
                        {
                          Name: "Sugar Cookie",
                          ID: "e6f64b96-5602-4649-a2ac-6ee0165afd4f"
                        }
                      ]
                    }
                  ]
                }
              ],
              Name: "Hillenbrand"
            },
            {
              Meals: [
                {
                  Order: 1,
                  Name: "Breakfast",
                  Stations: [
                    {
                      Name: "BoilerQ",
                      Items: [
                        {
                          Name: "Scrambled Eggs",
                          ID: "6c883ba0-e283-4086-ab01-e181a6615435"
                        },
                        {
                          Name: "Egg Whites Scrambled",
                          ID: "d3569e97-5c1a-462c-8b76-6bd56bca06d0"
                        },
                        {
                          Name: "French Toast Sticks",
                          ID: "b92e7ae2-c9de-435a-b62e-4c278e90fa8f"
                        },
                        {
                          Name: "Bacon",
                          ID: "49589c3c-4068-4057-af54-f771d2ffab56"
                        },
                        {
                          Name: "Crispy Seasoned Potato Cubes",
                          ID: "05ef89df-d9d3-4d6e-ab9e-39b3e908b5f7"
                        }
                      ]
                    },
                    {
                      Name: "Potāto, Potäto",
                      Items: [
                        {
                          Name: "Top Your Own Oatmeal",
                          ID: "8f1b2528-b224-47a5-85d3-38eaa380100c"
                        }
                      ]
                    },
                    {
                      Items: [
                        {
                          Name: "Assorted Donuts",
                          ID: "279d40f1-a8cd-4f2b-825c-a70fe3f8237d"
                        },
                        {
                          Name: "Double Chocolate Muffin ",
                          ID: "bbcdb2e5-6d0e-4809-a38f-f963f6b95109"
                        }
                      ],
                      Name: "Sugar Hill"
                    }
                  ]
                },
                {
                  Order: 2,
                  Name: "Lunch",
                  Stations: [
                    {
                      Name: "BoilerQ",
                      Items: [
                        {
                          Name: "BoilerQ Barbeque Sauces",
                          ID: "5b633084-3b80-41db-b096-544bdd58d313"
                        },
                        {
                          Name: "Hamburgers",
                          ID: "a373aa41-1bd3-40ed-bbaa-112e7353abf7"
                        },
                        {
                          Name: "Austin Blues Pulled Pork",
                          ID: "4cd4e545-78be-4640-9d23-790d82ce943b"
                        },
                        {
                          Name: "Breaded Onion Rings",
                          ID: "2cc64a9e-d980-4f4c-a730-3e21d71435ba"
                        },
                        {
                          Name: "Maple Baked Beans",
                          ID: "68f1dccc-121b-4c6f-9a70-ed0c66a4c7b1"
                        }
                      ]
                    },
                    {
                      Name: "Potāto, Potäto",
                      Items: [
                        {
                          Name: "Breaded Chicken Tenders",
                          ID: "62d235f3-b998-40dd-a529-9b083c896ecc"
                        },
                        {
                          Name: "Grilled Hot Dog",
                          ID: "49884e4e-1f3e-4214-b381-49c6083e7e0e"
                        },
                        {
                          Name: "Ranch Wedge Fry",
                          ID: "7c07b178-1591-461c-bfac-abf7b3fda59e"
                        },
                        {
                          Name: "Honey Mustard Dressing",
                          ID: "e4b82473-5b1e-40ca-a863-17abcce2ad76"
                        },
                        {
                          Name: "Multi Colored Cauliflower",
                          ID: "e532f322-3691-4a8a-92da-0f4549a32ca8"
                        },
                        {
                          Name: "Roasted Seasoned Broccoli",
                          ID: "6e947c4b-31e8-4fca-a830-5a1f4be136ad"
                        }
                      ]
                    },
                    {
                      Name: "International Market",
                      Items: [
                        {
                          Name: "Hunan Shrimp",
                          ID: "b06f9d7b-1645-49ec-852d-a4e4911c75a2"
                        },
                        {
                          Name: "Brown Rice with Mushrooms",
                          ID: "dcd0871e-630a-4de8-a423-d8022b960846"
                        },
                        {
                          Name: "Stir Fry Cauliflower",
                          ID: "02bbfaf9-6a7f-4c36-b0c3-ef7eaf7407bb"
                        },
                        {
                          Name: "Tempura Batter Broccoli",
                          ID: "6a7925d8-841a-4472-a6a0-52c6ee759800"
                        }
                      ]
                    },
                    {
                      Name: "Parmesan Tomato",
                      Items: [
                        {
                          Name: "Stadium Club Pizza",
                          ID: "8bdfdba4-fbb8-40bd-a870-aeb6aa53f4e0"
                        },
                        {
                          Name: "Sausage Pizza",
                          ID: "98676547-45a9-46ae-8da8-e6a8b7ad88ab"
                        },
                        {
                          Name: "Cheese Pizza",
                          ID: "97b265cb-e4a6-4c4d-957c-ff9ff69c3d61"
                        }
                      ]
                    },
                    {
                      Items: [
                        {
                          Name: "Deli & Fresh Baked Breads",
                          ID: "d6fe5d39-bd46-4478-bb94-afdcfab7c3d3"
                        },
                        {
                          Name: "Chunky Chicken Nut & Grape Salad",
                          ID: "28a8eefd-1f0e-4cfd-95fe-040760f83935"
                        },
                        {
                          Name: "Butter Croissant",
                          ID: "12504bf0-77d6-438c-847d-42a9fe7cb323"
                        },
                        {
                          Name: "Minted Garden Couscous Salad",
                          ID: "2e5ec93f-9f1e-481a-818e-8cb27a59bcc1"
                        },
                        {
                          Name: "Beef Noodle Soup",
                          ID: "70c4e9cf-3737-4854-a403-005e99ced697"
                        }
                      ],
                      Name: "Salami and Swiss"
                    },
                    {
                      Name: "Sugar Hill",
                      Items: [
                        {
                          Name: "Chocolate Chip Cookie",
                          ID: "6f6ef6dc-a4ac-47d1-8295-e82c302dba20"
                        },
                        {
                          Name: "Carnival Cookie",
                          ID: "08b0e608-89e7-475a-b206-384a66025b92"
                        },
                        {
                          Name: "Key Lime Bar",
                          ID: "06106eb1-0097-4377-812f-29be80e7ea16"
                        },
                        {
                          Name: "Oreo Brownie",
                          ID: "db4f89ca-b143-4faa-ac8f-afb0edaef494"
                        }
                      ]
                    }
                  ]
                },
                {
                  Order: 3,
                  Name: "Late Lunch",
                  Stations: [
                    {
                      Name: "BoilerQ",
                      Items: [
                        {
                          Name: "Hamburgers",
                          ID: "a373aa41-1bd3-40ed-bbaa-112e7353abf7"
                        },
                        {
                          Name: "Austin Blues Pulled Pork",
                          ID: "4cd4e545-78be-4640-9d23-790d82ce943b"
                        },
                        {
                          Name: "Breaded Onion Rings",
                          ID: "2cc64a9e-d980-4f4c-a730-3e21d71435ba"
                        }
                      ]
                    },
                    {
                      Name: "Potāto, Potäto",
                      Items: [
                        {
                          Name: "Breaded Chicken Tenders",
                          ID: "62d235f3-b998-40dd-a529-9b083c896ecc"
                        },
                        {
                          Name: "Grilled Hot Dog",
                          ID: "49884e4e-1f3e-4214-b381-49c6083e7e0e"
                        },
                        {
                          Name: "Roasted Seasoned Broccoli",
                          ID: "6e947c4b-31e8-4fca-a830-5a1f4be136ad"
                        },
                        {
                          Name: "Multi Colored Cauliflower",
                          ID: "e532f322-3691-4a8a-92da-0f4549a32ca8"
                        },
                        {
                          Name: "Ranch Wedge Fry",
                          ID: "7c07b178-1591-461c-bfac-abf7b3fda59e"
                        }
                      ]
                    },
                    {
                      Name: "International Market",
                      Items: [
                        {
                          Name: "Hunan Shrimp",
                          ID: "b06f9d7b-1645-49ec-852d-a4e4911c75a2"
                        },
                        {
                          Name: "Brown Rice with Mushrooms",
                          ID: "dcd0871e-630a-4de8-a423-d8022b960846"
                        },
                        {
                          Name: "Stir Fry Cauliflower",
                          ID: "02bbfaf9-6a7f-4c36-b0c3-ef7eaf7407bb"
                        },
                        {
                          Name: "Tempura Batter Broccoli",
                          ID: "6a7925d8-841a-4472-a6a0-52c6ee759800"
                        }
                      ]
                    },
                    {
                      Name: "Parmesan Tomato",
                      Items: [
                        {
                          Name: "Sausage Pizza",
                          ID: "98676547-45a9-46ae-8da8-e6a8b7ad88ab"
                        },
                        {
                          Name: "Cheese Pizza",
                          ID: "97b265cb-e4a6-4c4d-957c-ff9ff69c3d61"
                        },
                        {
                          Name: "Marinara Sauce",
                          ID: "36c564ab-649b-48e7-afd4-db4f506f964a"
                        },
                        {
                          Name: "Cheddar Cheese Sauce",
                          ID: "e82aa466-bfe9-4cb4-b02c-25d5bf30c183"
                        },
                        {
                          Name: "Breadsticks",
                          ID: "54205343-ee6b-481f-8260-7b6792f7263e"
                        }
                      ]
                    },
                    {
                      Name: "Salami and Swiss",
                      Items: [
                        {
                          Name: "Deli & Fresh Baked Breads",
                          ID: "d6fe5d39-bd46-4478-bb94-afdcfab7c3d3"
                        },
                        {
                          Name: "Chunky Chicken Nut & Grape Salad",
                          ID: "28a8eefd-1f0e-4cfd-95fe-040760f83935"
                        },
                        {
                          Name: "Butter Croissant",
                          ID: "12504bf0-77d6-438c-847d-42a9fe7cb323"
                        },
                        {
                          Name: "Minted Garden Couscous Salad",
                          ID: "2e5ec93f-9f1e-481a-818e-8cb27a59bcc1"
                        },
                        {
                          Name: "Beef Noodle Soup",
                          ID: "70c4e9cf-3737-4854-a403-005e99ced697"
                        }
                      ]
                    },
                    {
                      Name: "Sugar Hill",
                      Items: [
                        {
                          Name: "Chocolate Chip Cookie",
                          ID: "6f6ef6dc-a4ac-47d1-8295-e82c302dba20"
                        },
                        {
                          Name: "Carnival Cookie",
                          ID: "08b0e608-89e7-475a-b206-384a66025b92"
                        },
                        {
                          Name: "Iced Coffee",
                          ID: "7a41d7fd-4674-4fb3-af0b-334e2e2010ae"
                        },
                        {
                          Name: "Key Lime Bar",
                          ID: "06106eb1-0097-4377-812f-29be80e7ea16"
                        },
                        {
                          Name: "Oreo Brownie",
                          ID: "db4f89ca-b143-4faa-ac8f-afb0edaef494"
                        }
                      ]
                    }
                  ]
                },
                {
                  Order: 4,
                  Name: "Dinner",
                  Stations: [
                    {
                      Items: [
                        {
                          Name: "Hamburgers",
                          ID: "a373aa41-1bd3-40ed-bbaa-112e7353abf7"
                        },
                        {
                          Name: "BoilerQ Grilled Bologna",
                          ID: "f697b5c0-c021-4b93-a280-95f71980d816"
                        },
                        {
                          Name: "Maple Baked Beans",
                          ID: "68f1dccc-121b-4c6f-9a70-ed0c66a4c7b1"
                        },
                        {
                          Name: "Breaded Onion Rings",
                          ID: "2cc64a9e-d980-4f4c-a730-3e21d71435ba"
                        }
                      ],
                      Name: "BoilerQ"
                    },
                    {
                      Name: "Potāto, Potäto",
                      Items: [
                        {
                          Name: "Barbecue Pork Loin",
                          ID: "f0df9656-4750-4d8d-a4c9-08f3386f5f33"
                        },
                        {
                          Name: "Baked Chicken Breast",
                          ID: "70cbeadd-0c22-4bd6-a695-ae860f99b68c"
                        },
                        {
                          Name: "Spinach Casserole",
                          ID: "beb7fc4b-ed1f-48b8-b412-d85b6d5d6010"
                        },
                        {
                          Name: "Multi Colored Cauliflower",
                          ID: "e532f322-3691-4a8a-92da-0f4549a32ca8"
                        },
                        {
                          Name: "Sweet Yeasty Rolls",
                          ID: "553c5d21-4ddf-4805-8c92-7808d11d4f96"
                        },
                        {
                          Name: "Baked Potato",
                          ID: "5dcf50a4-cac2-4969-8ea9-5a4a079be685"
                        }
                      ]
                    },
                    {
                      Name: "International Market",
                      Items: [
                        {
                          Name: "Chinese Szechuan Beef Stir Fry",
                          ID: "bfbc0788-792e-4f8c-ada9-05aa0660b26d"
                        },
                        {
                          Name: "Brown Rice with Mushrooms",
                          ID: "dcd0871e-630a-4de8-a423-d8022b960846"
                        },
                        {
                          Name: "Stir Fry Cauliflower",
                          ID: "02bbfaf9-6a7f-4c36-b0c3-ef7eaf7407bb"
                        },
                        {
                          Name: "Tempura Batter Broccoli",
                          ID: "6a7925d8-841a-4472-a6a0-52c6ee759800"
                        }
                      ]
                    },
                    {
                      Name: "Parmesan Tomato",
                      Items: [
                        {
                          Name: "Stadium Club Pizza",
                          ID: "8bdfdba4-fbb8-40bd-a870-aeb6aa53f4e0"
                        },
                        {
                          Name: "Pepperoni Pizza",
                          ID: "76c520c3-ad2b-4e67-8614-fb8721fb4ac2"
                        },
                        {
                          Name: "Garlic Cheese Pizza",
                          ID: "5963cabb-0f45-41c8-9604-16aa637f1a5b"
                        }
                      ]
                    },
                    {
                      Name: "Salami and Swiss",
                      Items: [
                        {
                          Name: "Deli & Fresh Baked Breads",
                          ID: "d6fe5d39-bd46-4478-bb94-afdcfab7c3d3"
                        },
                        {
                          Name: "Chunky Chicken Nut & Grape Salad",
                          ID: "28a8eefd-1f0e-4cfd-95fe-040760f83935"
                        },
                        {
                          Name: "Butter Croissant",
                          ID: "12504bf0-77d6-438c-847d-42a9fe7cb323"
                        },
                        {
                          Name: "Minted Garden Couscous Salad",
                          ID: "2e5ec93f-9f1e-481a-818e-8cb27a59bcc1"
                        },
                        {
                          Name: "Beef Noodle Soup",
                          ID: "70c4e9cf-3737-4854-a403-005e99ced697"
                        }
                      ]
                    },
                    {
                      Name: "Sugar Hill",
                      Items: [
                        {
                          Name: "Chocolate Chip Cookie",
                          ID: "6f6ef6dc-a4ac-47d1-8295-e82c302dba20"
                        },
                        {
                          Name: "Carnival Cookie",
                          ID: "08b0e608-89e7-475a-b206-384a66025b92"
                        },
                        {
                          Name: "Dutch Apple Pie",
                          ID: "33a69247-d0a9-4637-ab45-d876bd0d2009"
                        },
                        {
                          Name: "Oreo Brownie",
                          ID: "db4f89ca-b143-4faa-ac8f-afb0edaef494"
                        }
                      ]
                    }
                  ]
                }
              ],
              Name: "Ford"
            },
            {
              Meals: [
                {
                  Order: 1,
                  Name: "Breakfast",
                  Stations: [
                    {
                      Name: "Romeo & Parmesan",
                      Items: [
                        {
                          Name: "Omelet or Breakfast Skillet",
                          ID: "0aed244f-8bae-4e7f-94ee-505c86aecc3e"
                        }
                      ]
                    },
                    {
                      Name: "Classic Flavors",
                      Items: [
                        {
                          Name: "Scrambled Eggs",
                          ID: "6c883ba0-e283-4086-ab01-e181a6615435"
                        },
                        {
                          Name: "Homestyle Sausage Gravy",
                          ID: "3891b961-abf7-41b6-aa9d-c9fa93a68273"
                        },
                        {
                          Name: "Biscuits",
                          ID: "ce7afeb2-773d-4c70-b1f1-2413d383399e"
                        },
                        {
                          Name: "Sausage Links",
                          ID: "c175e6a0-5ce1-44b9-92bf-0df9b8efba68"
                        },
                        {
                          Name: "Breakfast Red Potatoes",
                          ID: "9ae04007-d231-4a73-98fb-b6ddc3a436c2"
                        },
                        {
                          Name: "Grits",
                          ID: "92eeab53-369a-40be-b96e-0a38714f98e9"
                        },
                        {
                          Name: "Pancakes",
                          ID: "287e6ce2-7e52-400c-acc4-8775edb5ce37"
                        }
                      ]
                    },
                    {
                      Items: [
                        {
                          Name: "Pineapple Tidbits",
                          ID: "1932ea90-fa2c-4793-84ce-278e92023a56"
                        },
                        {
                          Name: "Mixed Fresh Grapes",
                          ID: "a32b7925-0f30-4de6-a0fc-1fde018e929a"
                        }
                      ],
                      Name: "Fresh Tastes"
                    },
                    {
                      Name: "Delectables",
                      Items: [
                        {
                          Name: "Assorted Donuts",
                          ID: "279d40f1-a8cd-4f2b-825c-a70fe3f8237d"
                        },
                        {
                          Name: "Pumpkin Muffin",
                          ID: "dc0c0251-58c5-48f7-b078-3443b0e93ee9"
                        }
                      ]
                    }
                  ]
                },
                {
                  Order: 2,
                  Name: "Lunch",
                  Stations: [
                    {
                      Name: "Open Flame",
                      Items: [
                        {
                          Name: "Hamburger",
                          ID: "b82a53af-81b4-4ea0-a5b2-c0eec2a6c1bb"
                        },
                        {
                          Name: "Fish Square",
                          ID: "b427e217-0017-4034-97d9-9a6a451f2f87"
                        },
                        {
                          Name: "Grilled Onions",
                          ID: "165c0cb3-a856-45bb-bb96-3d129a66e787"
                        },
                        {
                          Name: "Thincut Fries",
                          ID: "5befb4c1-9fe2-4d58-aead-4721a7df022b"
                        }
                      ]
                    },
                    {
                      Items: [
                        {
                          Name: "Made to Order Lazio Pasta Bar",
                          ID: "53583ff5-f4b4-4952-a7e0-cfbb057d7b28"
                        },
                        {
                          Name: "French Baguette",
                          ID: "22842cd5-5b90-472c-af1a-a2e645cacf2c"
                        },
                        {
                          Name: "Whole Grain Dinner Roll",
                          ID: "842f59d5-54e5-4c32-8b2c-c09d20303d5f"
                        }
                      ],
                      Name: "Romeo & Parmesan"
                    },
                    {
                      Items: [
                        {
                          Name: "Fried Chicken",
                          ID: "3b204972-7e59-48b2-ac31-4c8280115648"
                        },
                        {
                          Name: "Roast Beef",
                          ID: "c4abf573-5647-4fab-a31b-59a03e0f7cba"
                        },
                        {
                          Name: "Texas Toast",
                          ID: "01b792a9-7fb3-4b31-9bd3-5b13a3d533f6"
                        },
                        {
                          Name: "Southern Style Biscuits",
                          ID: "20710ffb-8999-40a6-acfd-d47d361aba57"
                        },
                        {
                          Name: "Whipped Potatoes",
                          ID: "0a0d1e53-9365-48bc-b449-6d37ce0f3ed5"
                        },
                        {
                          Name: "Garlic Roasted Green Beans",
                          ID: "cc4fb58c-3b5f-4438-b665-53ba083530a8"
                        },
                        {
                          Name: "Beef Vegetable Soup",
                          ID: "bcea33ae-8c25-41f3-a8e8-8f034385ef92"
                        },
                        {
                          Name: "Honey Orange Glazed Carrots",
                          ID: "30b6bcc8-ca87-4238-ac32-fe39534e3899"
                        }
                      ],
                      Name: "Classic Flavors"
                    },
                    {
                      Name: "Churrascaria",
                      Items: [
                        {
                          Name: "Antipasto Bar",
                          ID: "577fec9f-0c1b-47b2-8127-332d5203a738"
                        },
                        {
                          Name: "BBQ Chicken Wings",
                          ID: "5bbf8cd9-d2d7-4539-8fa8-ac90a7b6a16f"
                        },
                        {
                          Name: "Maple Chipotle BBQ Sauce",
                          ID: "34a6ea2e-759c-4ada-a223-87ca23ebbe05"
                        },
                        {
                          Name: "Creamy and Cheesy Grits",
                          ID: "1414b310-0a18-4e7a-bd4f-e39777abb726"
                        },
                        {
                          Name: "Cauliflower Salad",
                          ID: "0ea22e7b-7364-4fa3-8d9a-72755996ffa8"
                        },
                        {
                          Name: "Fresh Mozzarella Slices",
                          ID: "30cf1bb8-8fa2-43ce-a9bc-6466bcb80d07"
                        },
                        {
                          Name: "Sliced Tomatoes with Basil",
                          ID: "5194cc48-947e-48f7-9d80-2adaf77846bf"
                        }
                      ]
                    },
                    {
                      Name: "Mozzarella Fresca",
                      Items: [
                        {
                          Name: "Breadsticks",
                          ID: "8f544d1b-764d-438d-ad40-c8b735c5e159"
                        },
                        {
                          Name: "Crispy Jalapeno Popper Pizza",
                          ID: "5b580066-0dd4-407d-82a9-854d2866bdff"
                        },
                        {
                          Name: "Crispy BBQ Chicken Pineapple Pizza",
                          ID: "8f79c197-27c8-4683-ab3a-41db71210591"
                        }
                      ]
                    },
                    {
                      Name: "Fresh Tastes",
                      Items: [
                        {
                          Name: "Salad Bar",
                          ID: "fe0568bf-8cbe-40c7-909c-45cdb9a487bf"
                        },
                        {
                          Name: "Pineapple Tidbits",
                          ID: "1932ea90-fa2c-4793-84ce-278e92023a56"
                        },
                        {
                          Name: "Mixed Fresh Grapes",
                          ID: "a32b7925-0f30-4de6-a0fc-1fde018e929a"
                        },
                        {
                          Name: "Fresh Tastes Deli",
                          ID: "09eb08bc-b8b7-4216-9309-b9988302ca39"
                        }
                      ]
                    },
                    {
                      Name: "Delectables",
                      Items: [
                        {
                          Name: "Snickers Ground Topping",
                          ID: "a632830c-1a53-40c8-966f-e677e22aa413"
                        },
                        {
                          Name: "Homemade Chocolate Chip Cookie",
                          ID: "b634b40d-ee1a-4e77-9c1d-c0844c618567"
                        },
                        {
                          Name: "Carnival Cookie",
                          ID: "08b0e608-89e7-475a-b206-384a66025b92"
                        },
                        {
                          Name: "Banana Nut Cake",
                          ID: "fe3a628c-1dce-463f-938b-700fea19c5be"
                        },
                        {
                          Name: "Vanilla Pudding",
                          ID: "7a93b605-a6d0-49ab-9dd1-c50a4832c3bc"
                        }
                      ]
                    },
                    {
                      Items: [
                        {
                          Name: "Vegetable Pot Pie",
                          ID: "2652108e-c82f-4c48-9489-e6fda1c5a940"
                        },
                        {
                          Name: "Garlic Roasted Green Beans",
                          ID: "cc4fb58c-3b5f-4438-b665-53ba083530a8"
                        },
                        {
                          Name: "Whipped Potatoes",
                          ID: "0a0d1e53-9365-48bc-b449-6d37ce0f3ed5"
                        }
                      ],
                      Name: "Vegetarian"
                    }
                  ]
                },
                {
                  Order: 4,
                  Name: "Dinner",
                  Stations: [
                    {
                      Name: "Open Flame",
                      Items: [
                        {
                          Name: "Bratwurst",
                          ID: "1c385fc5-1500-4d49-9f71-8d59f07f30d0"
                        },
                        {
                          Name: "Hot Dog Bar",
                          ID: "4e54f6da-1e9c-470c-9d8a-6376d69b93fa"
                        },
                        {
                          Name: "Smoked Peruvian Chicken Thigh",
                          ID: "563f6d1f-b91f-4264-ae0f-ba37a48c6887"
                        },
                        {
                          Name: "Spicy Brown Mustard",
                          ID: "86000878-f11f-49de-ba70-a3696db8e70e"
                        },
                        {
                          Name: "Garlic Aioli",
                          ID: "453c523a-2584-4de5-b3a9-837aac4457e9"
                        },
                        {
                          Name: "Thincut Fries",
                          ID: "5befb4c1-9fe2-4d58-aead-4721a7df022b"
                        }
                      ]
                    },
                    {
                      Items: [
                        {
                          Name: "Made to Order Lazio Pasta Bar",
                          ID: "53583ff5-f4b4-4952-a7e0-cfbb057d7b28"
                        },
                        {
                          Name: "French Baguette",
                          ID: "22842cd5-5b90-472c-af1a-a2e645cacf2c"
                        },
                        {
                          Name: "Whole Grain Dinner Roll",
                          ID: "842f59d5-54e5-4c32-8b2c-c09d20303d5f"
                        },
                        {
                          Name: "Made to Order Venetian Pasta Bar",
                          ID: "4104e908-c654-4d77-bba5-73c4492a51d4"
                        }
                      ],
                      Name: "Romeo & Parmesan"
                    },
                    {
                      Name: "Classic Flavors",
                      Items: [
                        {
                          Name: "PubHouse Battered Cod",
                          ID: "61a99150-1a7b-4781-9219-42621c7f1da1"
                        },
                        {
                          Name: "Malt Vinegar",
                          ID: "d2cbf4e5-c35b-4e84-978e-a4d1a62f3377"
                        },
                        {
                          Name: "Swiss Steak",
                          ID: "4bb873d3-758c-443f-8324-cf8129739bd2"
                        },
                        {
                          Name: "Whipped Potatoes",
                          ID: "0a0d1e53-9365-48bc-b449-6d37ce0f3ed5"
                        },
                        {
                          Name: "French Fried Okra",
                          ID: "2de920ed-0448-4f93-a46c-c99050632daf"
                        },
                        {
                          Name: "Beef Vegetable Soup",
                          ID: "bcea33ae-8c25-41f3-a8e8-8f034385ef92"
                        },
                        {
                          Name: "Southern Style Biscuits",
                          ID: "20710ffb-8999-40a6-acfd-d47d361aba57"
                        },
                        {
                          Name: "Honey Orange Glazed Carrots",
                          ID: "30b6bcc8-ca87-4238-ac32-fe39534e3899"
                        }
                      ]
                    },
                    {
                      Name: "Churrascaria",
                      Items: [
                        {
                          Name: "Antipasto Bar",
                          ID: "577fec9f-0c1b-47b2-8127-332d5203a738"
                        },
                        {
                          Name: "Maple Chipotle BBQ Sauce",
                          ID: "34a6ea2e-759c-4ada-a223-87ca23ebbe05"
                        },
                        {
                          Name: "BBQ Chicken Wings",
                          ID: "5bbf8cd9-d2d7-4539-8fa8-ac90a7b6a16f"
                        },
                        {
                          Name: "Creamy and Cheesy Grits",
                          ID: "1414b310-0a18-4e7a-bd4f-e39777abb726"
                        },
                        {
                          Name: "Cauliflower Salad",
                          ID: "0ea22e7b-7364-4fa3-8d9a-72755996ffa8"
                        },
                        {
                          Name: "Fresh Mozzarella Slices",
                          ID: "30cf1bb8-8fa2-43ce-a9bc-6466bcb80d07"
                        },
                        {
                          Name: "Sliced Tomatoes with Basil",
                          ID: "5194cc48-947e-48f7-9d80-2adaf77846bf"
                        }
                      ]
                    },
                    {
                      Name: "Mozzarella Fresca",
                      Items: [
                        {
                          Name: "Garlic Bread",
                          ID: "c7a374b7-8e93-4272-a244-c7c8cc4840c3"
                        },
                        {
                          Name: "Crispy Jalapeno Popper Pizza",
                          ID: "5b580066-0dd4-407d-82a9-854d2866bdff"
                        },
                        {
                          Name: "Crispy BBQ Chicken Pineapple Pizza",
                          ID: "8f79c197-27c8-4683-ab3a-41db71210591"
                        }
                      ]
                    },
                    {
                      Items: [
                        {
                          Name: "Salad Bar ",
                          ID: "fe0568bf-8cbe-40c7-909c-45cdb9a487bf"
                        },
                        {
                          Name: "Mixed Fresh Grapes",
                          ID: "a32b7925-0f30-4de6-a0fc-1fde018e929a"
                        },
                        {
                          Name: "Pineapple Tidbits",
                          ID: "1932ea90-fa2c-4793-84ce-278e92023a56"
                        },
                        {
                          Name: "Fresh Tastes Deli",
                          ID: "09eb08bc-b8b7-4216-9309-b9988302ca39"
                        }
                      ],
                      Name: "Fresh Tastes"
                    },
                    {
                      Items: [
                        {
                          Name: "Homemade Chocolate Chip Cookie",
                          ID: "b634b40d-ee1a-4e77-9c1d-c0844c618567"
                        },
                        {
                          Name: "Carnival Cookie",
                          ID: "08b0e608-89e7-475a-b206-384a66025b92"
                        },
                        {
                          Name: "Dutch Apple Pie",
                          ID: "33a69247-d0a9-4637-ab45-d876bd0d2009"
                        },
                        {
                          Name: "Vanilla Pudding",
                          ID: "7a93b605-a6d0-49ab-9dd1-c50a4832c3bc"
                        }
                      ],
                      Name: "Delectables"
                    },
                    {
                      Items: [
                        {
                          Name: "Vegetable Pot Pie",
                          ID: "2652108e-c82f-4c48-9489-e6fda1c5a940"
                        },
                        {
                          Name: "Garlic Roasted Green Beans",
                          ID: "cc4fb58c-3b5f-4438-b665-53ba083530a8"
                        },
                        {
                          Name: "Whipped Potatoes",
                          ID: "0a0d1e53-9365-48bc-b449-6d37ce0f3ed5"
                        }
                      ],
                      Name: "Vegetarian"
                    }
                  ]
                }
              ],
              Name: "Wiley"
            },
            {
              Meals: [
                {
                  Name: "Lunch",
                  Stations: [
                    {
                      Items: [
                        {
                          Name: "Pretzel Bread Stick",
                          ID: "b090e75b-9ada-4a56-913e-ecf60ba90b4c"
                        },
                        {
                          Name: "Cheese Sauce",
                          ID: "0285358d-fc26-435b-9e52-cd5bb4a8f32a"
                        },
                        {
                          Name: "Vegan Grainy Mustard Sauce",
                          ID: "699581b8-352c-497a-b75c-5e9220036c4b"
                        },
                        {
                          Name: "Fried Spicy Battered Cauliflower",
                          ID: "ab4a2022-a2f6-466b-8c8f-a3f16f9cd7a1"
                        },
                        {
                          Name: "Hidden Valley Ranch Dressing",
                          ID: "d8447f28-4d9f-4971-8db1-27bcd7a97ca0"
                        },
                        {
                          Name: "Broccoli Florets",
                          ID: "c62ecaca-9154-4361-bd12-5ca6fd914567"
                        },
                        {
                          Name: "Vegan Grainy Mustard Sauce",
                          ID: "699581b8-352c-497a-b75c-5e9220036c4b"
                        }
                      ],
                      Name: "Portobello Road - Vegetarian"
                    },
                    {
                      Items: [
                        {
                          Name: "Tempura Sweet & Sour Chicken",
                          ID: "2df43973-afa7-4833-9a32-3f34f04c70cc"
                        },
                        {
                          Name: "Jasmine Rice",
                          ID: "cbb3d1ad-e2d0-4b9d-a9a5-5d6bf865a7f1"
                        },
                        {
                          Name: "Roasted Snow Peas",
                          ID: "1b95dfdc-7591-4d1a-9384-21e485191817"
                        },
                        {
                          Name: "Tempura Batter Broccoli",
                          ID: "6a7925d8-841a-4472-a6a0-52c6ee759800"
                        }
                      ],
                      Name: "Regent Grill"
                    },
                    {
                      Name: "Abby Road Deli",
                      Items: [
                        {
                          Name: "Deli & Fresh Baked Breads",
                          ID: "5c8c4492-ca54-4c9b-a1bf-e2f4d71e13ec"
                        },
                        {
                          Name: "Hearty Vegetarian Chili",
                          ID: "518c1246-52ad-4ff2-a8f9-a3ef95859e02"
                        },
                        {
                          Name: "French Bread",
                          ID: "1ac9eaf8-8bd6-4b04-9d6b-30f2465a2fba"
                        }
                      ]
                    },
                    {
                      Items: [
                        {
                          Name: "Jambalaya",
                          ID: "abafead4-cc7e-4dea-a124-4f8434c44578"
                        },
                        {
                          Name: "Spicy Red Beans and Rice",
                          ID: "5020be85-be5a-4377-b32d-2f008d58cfcc"
                        },
                        {
                          Name: "Cornbread",
                          ID: "7dc112ca-2bdb-43e4-b9f1-bab2773deb6b"
                        },
                        {
                          Name: "Collard Greens",
                          ID: "5197ab5c-4751-4312-b447-931764742955"
                        }
                      ],
                      Name: "SoHo International Market"
                    },
                    {
                      Items: [
                        {
                          Name: "Pineapple Wedges",
                          ID: "02c6e364-af57-49d6-80c4-722d4df5c264"
                        },
                        {
                          Name: "Kiwi",
                          ID: "662aadf1-953c-4f7f-84e1-d433c6d7fb2a"
                        },
                        {
                          Name: "Blueberries",
                          ID: "16c699f3-c01d-48c7-bfde-5d8e68a530bb"
                        },
                        {
                          Name: "Mandarin Oranges",
                          ID: "42965e57-f502-400f-875a-5bfed6fe3195"
                        }
                      ],
                      Name: "Chelsea Garden"
                    },
                    {
                      Items: [
                        {
                          Name: "Chicken Carnita",
                          ID: "3b5620c2-7943-4ad1-a533-a80d3a9f714a"
                        },
                        {
                          Name: "Sofritas",
                          ID: "afdb327f-4af7-413b-80db-6af401ce94d3"
                        },
                        {
                          Name: "Burritos Your Way",
                          ID: "0168839e-3b2d-4ebd-be9d-98ad02253e51"
                        }
                      ],
                      Name: "Burrito Bar"
                    },
                    {
                      Items: [
                        {
                          Name: "Devilsfood Cake Rocky Road Nut Frosting",
                          ID: "46e0e1c0-a37d-41e6-a463-4b09dcd7fe7b"
                        },
                        {
                          Name: "Dirt Pudding",
                          ID: "ecde42b0-e792-4e6b-bcbb-764c792e72e1"
                        },
                        {
                          Name: "Shortbread Cookie",
                          ID: "06603ddf-6b62-4dc9-9f6f-5e7bd07b2962"
                        },
                        {
                          Name: "Snickerdoodle Cookie",
                          ID: "2a5d0029-3aa0-4c94-9e4f-52b2fbf2b01b"
                        }
                      ],
                      Name: "Devonshire Way"
                    }
                  ],
                  Order: 2
                },
                {
                  Order: 3,
                  Name: "Late Lunch",
                  Stations: [
                    {
                      Name: "Portobello Road - Vegetarian",
                      Items: [
                        {
                          Name: "Mexican Fiesta Rice",
                          ID: "7dd21049-7305-4e13-b9cc-9682132beb28"
                        },
                        {
                          Name: "Fiesta Quesadilla",
                          ID: "895c16ab-ee3c-4f3e-a37a-3363ac586b06"
                        },
                        {
                          Name: "Peas",
                          ID: "91dfe1f5-91e4-4c50-b30d-ffa7ac1d1cb4"
                        }
                      ]
                    },
                    {
                      Name: "Regent Grill",
                      Items: [
                        {
                          Name: "Tempura Sweet & Sour Chicken",
                          ID: "2df43973-afa7-4833-9a32-3f34f04c70cc"
                        },
                        {
                          Name: "Jasmine Rice",
                          ID: "cbb3d1ad-e2d0-4b9d-a9a5-5d6bf865a7f1"
                        },
                        {
                          Name: "Tempura Batter Broccoli",
                          ID: "6a7925d8-841a-4472-a6a0-52c6ee759800"
                        }
                      ]
                    },
                    {
                      Name: "Abby Road Deli",
                      Items: [
                        {
                          Name: "Hearty Vegetarian Chili",
                          ID: "518c1246-52ad-4ff2-a8f9-a3ef95859e02"
                        },
                        {
                          Name: "French Bread",
                          ID: "1ac9eaf8-8bd6-4b04-9d6b-30f2465a2fba"
                        },
                        {
                          Name: "Deli & Fresh Baked Breads",
                          ID: "5c8c4492-ca54-4c9b-a1bf-e2f4d71e13ec"
                        }
                      ]
                    },
                    {
                      Name: "Chelsea Garden",
                      Items: [
                        {
                          Name: "Pineapple Wedges",
                          ID: "02c6e364-af57-49d6-80c4-722d4df5c264"
                        },
                        {
                          Name: "Kiwi",
                          ID: "662aadf1-953c-4f7f-84e1-d433c6d7fb2a"
                        },
                        {
                          Name: "Blueberries",
                          ID: "16c699f3-c01d-48c7-bfde-5d8e68a530bb"
                        },
                        {
                          Name: "Mandarin Oranges",
                          ID: "42965e57-f502-400f-875a-5bfed6fe3195"
                        }
                      ]
                    },
                    {
                      Name: "Burrito Bar",
                      Items: [
                        {
                          Name: "Chicken Carnita",
                          ID: "3b5620c2-7943-4ad1-a533-a80d3a9f714a"
                        },
                        {
                          Name: "Sofritas",
                          ID: "afdb327f-4af7-413b-80db-6af401ce94d3"
                        },
                        {
                          Name: "Burritos Your Way",
                          ID: "0168839e-3b2d-4ebd-be9d-98ad02253e51"
                        }
                      ]
                    },
                    {
                      Name: "Devonshire Way",
                      Items: [
                        {
                          Name: "Devilsfood Cake with Rocky Road Nut Frosting",
                          ID: "46e0e1c0-a37d-41e6-a463-4b09dcd7fe7b"
                        },
                        {
                          Name: "Dirt Pudding",
                          ID: "ecde42b0-e792-4e6b-bcbb-764c792e72e1"
                        },
                        {
                          Name: "Snickerdoodle Cookie",
                          ID: "2a5d0029-3aa0-4c94-9e4f-52b2fbf2b01b"
                        },
                        {
                          Name: "Shortbread Cookie",
                          ID: "06603ddf-6b62-4dc9-9f6f-5e7bd07b2962"
                        }
                      ]
                    }
                  ]
                },
                {
                  Name: "Dinner",
                  Stations: [
                    {
                      Name: "Portobello Road - Vegetarian",
                      Items: [
                        {
                          Name: "Fiesta Quesadilla",
                          ID: "895c16ab-ee3c-4f3e-a37a-3363ac586b06"
                        },
                        {
                          Name: "Mexican Fiesta Rice",
                          ID: "7dd21049-7305-4e13-b9cc-9682132beb28"
                        },
                        {
                          Name: "Pintos & Corn",
                          ID: "19293d54-0125-41f5-9c41-49e6f8ad12f1"
                        },
                        {
                          Name: "Quinoa and Black Beans",
                          ID: "590dfefb-a0a4-44d9-b131-0a652b808bd2"
                        },
                        {
                          Name: "Peas",
                          ID: "91dfe1f5-91e4-4c50-b30d-ffa7ac1d1cb4"
                        }
                      ]
                    },
                    {
                      Name: "Regent Grill",
                      Items: [
                        {
                          Name: "Hamburger",
                          ID: "b82a53af-81b4-4ea0-a5b2-c0eec2a6c1bb"
                        },
                        {
                          Name: "Bacon",
                          ID: "4c114514-2748-485c-aac0-8f0843a4a551"
                        },
                        {
                          Name: "Cheese Sauce",
                          ID: "0285358d-fc26-435b-9e52-cd5bb4a8f32a"
                        },
                        {
                          Name: "Thincut Fries",
                          ID: "5befb4c1-9fe2-4d58-aead-4721a7df022b"
                        },
                        {
                          Name: "Sandwich Toppers",
                          ID: "4fce70df-9332-460a-825f-46da9ee0a54f"
                        }
                      ]
                    },
                    {
                      Name: "Abby Road Deli",
                      Items: [
                        {
                          Name: "Hearty Vegetarian Chili",
                          ID: "518c1246-52ad-4ff2-a8f9-a3ef95859e02"
                        },
                        {
                          Name: "French Bread",
                          ID: "1ac9eaf8-8bd6-4b04-9d6b-30f2465a2fba"
                        },
                        {
                          Name: "Deli & Fresh Baked Breads",
                          ID: "5c8c4492-ca54-4c9b-a1bf-e2f4d71e13ec"
                        }
                      ]
                    },
                    {
                      Items: [
                        {
                          Name: "Cheesy Chicken with Mushrooms",
                          ID: "bc3e3821-4158-4cc3-874a-1f5d13aa0a37"
                        },
                        {
                          Name: "Long Grain Rice",
                          ID: "9e6eb50a-0778-49fd-a84e-d9d476f1a297"
                        },
                        {
                          Name: "Whole Green Beans",
                          ID: "4803d385-361f-4870-a7c5-be9fba3781bd"
                        }
                      ],
                      Name: "SoHo International Market"
                    },
                    {
                      Name: "Chelsea Garden",
                      Items: [
                        {
                          Name: "Pineapple Wedges",
                          ID: "02c6e364-af57-49d6-80c4-722d4df5c264"
                        },
                        {
                          Name: "Kiwi",
                          ID: "662aadf1-953c-4f7f-84e1-d433c6d7fb2a"
                        },
                        {
                          Name: "Blueberries",
                          ID: "16c699f3-c01d-48c7-bfde-5d8e68a530bb"
                        },
                        {
                          Name: "Mandarin Oranges",
                          ID: "42965e57-f502-400f-875a-5bfed6fe3195"
                        }
                      ]
                    },
                    {
                      Name: "Burrito Bar",
                      Items: [
                        {
                          Name: "Chicken Carnita",
                          ID: "3b5620c2-7943-4ad1-a533-a80d3a9f714a"
                        },
                        {
                          Name: "Sofritas",
                          ID: "afdb327f-4af7-413b-80db-6af401ce94d3"
                        },
                        {
                          Name: "Burritos Your Way",
                          ID: "0168839e-3b2d-4ebd-be9d-98ad02253e51"
                        }
                      ]
                    },
                    {
                      Name: "Devonshire Way",
                      Items: [
                        {
                          Name: "Snickerdoodle Cookie",
                          ID: "2a5d0029-3aa0-4c94-9e4f-52b2fbf2b01b"
                        },
                        {
                          Name: "Devilsfood Cake with Rocky Road Nut Frosting",
                          ID: "46e0e1c0-a37d-41e6-a463-4b09dcd7fe7b"
                        },
                        {
                          Name: "Cherry Cobbler",
                          ID: "1e560683-917f-4d9f-add1-8ffa3a68f62c"
                        },
                        {
                          Name: "Shortbread Cookie",
                          ID: "06603ddf-6b62-4dc9-9f6f-5e7bd07b2962"
                        }
                      ]
                    }
                  ],
                  Order: 4
                }
              ],
              Name: "Windsor"
            },
            {
              Meals: [
                {
                  Order: 1,
                  Name: "Breakfast",
                  Stations: [
                    {
                      Name: "Granite Grill",
                      Items: [
                        {
                          Name: "Chili Rellenos Casserole",
                          ID: "a51dab14-78ae-4225-b31f-6a8cfdb8eea8"
                        },
                        {
                          Name: "Maple Sausage Links",
                          ID: "56e3e50d-fd79-4a8c-8005-2e2a1dfa2378"
                        },
                        {
                          Name: "Seasoned Fried Potatoes",
                          ID: "19963588-4653-4ff8-8975-92f4739b2df9"
                        }
                      ]
                    },
                    {
                      Name: "The Gallery",
                      Items: [
                        {
                          Name: "MYO Breakfast Sandwich",
                          ID: "7fd8c8d0-602d-4fa5-be15-07dbfe33c5a7"
                        },
                        {
                          Name: "Steel Cut Oatmeal Bar",
                          ID: "9d5d7a22-c421-4345-81ee-765841015735"
                        },
                        {
                          Name: "Sausage Gravy and Biscuits",
                          ID: "675af9da-0d0d-4255-8ef4-ad3683f2df42"
                        }
                      ]
                    },
                    {
                      Name: "The Pastry Shop",
                      Items: [
                        {
                          Name: "Cranberry Orange Muffin",
                          ID: "e2844386-05c0-494a-bb77-22310c387c98"
                        },
                        {
                          Name: "Vanilla Yogurt",
                          ID: "daa10a62-6836-4035-9707-1090624cfa18"
                        },
                        {
                          Name: "Strawberry Yogurt Pouch ",
                          ID: "1df0c1d1-8339-4f7e-abcb-e59873c05c0e"
                        },
                        {
                          Name: "Blueberries",
                          ID: "16c699f3-c01d-48c7-bfde-5d8e68a530bb"
                        },
                        {
                          Name: "Crunchy Granola",
                          ID: "82480571-ef8d-4817-b0e1-994edc000d9e"
                        },
                        {
                          Name: "Pink Grapefruit Half",
                          ID: "f676dec5-b342-4daa-90d7-c854a1f19848"
                        },
                        {
                          Name: "Assorted Donuts",
                          ID: "279d40f1-a8cd-4f2b-825c-a70fe3f8237d"
                        },
                        {
                          Name: "Breads and Spreads",
                          ID: "3904eaf5-62a2-4d0f-a71b-a01d9344e05b"
                        }
                      ]
                    }
                  ]
                },
                {
                  Order: 2,
                  Name: "Lunch",
                  Stations: [
                    {
                      Name: "Granite Grill",
                      Items: [
                        {
                          Name: "Flame Grilled Chicken Burger",
                          ID: "2261f530-0401-49ec-8f60-ae8fab0f030a"
                        },
                        {
                          Name: "Sweet Potato Fries",
                          ID: "18eeeecd-7e2a-4d16-a4e5-59765f0d500b"
                        },
                        {
                          Name: "Hamburgers",
                          ID: "9ff9ec48-c3df-4fcb-9755-8ef82c94eeed"
                        }
                      ]
                    },
                    {
                      Name: "Heartland Classics",
                      Items: [
                        {
                          Name: "Buffalo Lime Chicken Thighs",
                          ID: "a1adbb75-183c-419a-9277-3b0740d989f6"
                        },
                        {
                          Name: "Meatballs with Spaghetti Sauce",
                          ID: "cf7f6476-98d2-4a56-b649-1588be5b67c7"
                        },
                        {
                          Name: "Spaghetti",
                          ID: "df2a1b10-5e66-4d1e-8daa-b46263737dfe"
                        },
                        {
                          Name: "Indian Spicy Curried Potatoes",
                          ID: "83c96788-9a1d-43ca-846b-379b27285a68"
                        },
                        {
                          Name: "Garlic Cheese Breadsticks",
                          ID: "14be4eb7-0acb-47f0-9ed0-04e37c174815"
                        },
                        {
                          Name: "Bok Choy Roasted",
                          ID: "fa95d296-55b6-4f87-b949-c2ed684b1c31"
                        }
                      ]
                    },
                    {
                      Items: [
                        {
                          Name: "Minestrone Soup",
                          ID: "fb7c819f-58fb-4292-87d0-4838a04c859a"
                        },
                        {
                          Name: "Deli w/Fresh Baked Breads",
                          ID: "246b82d4-d646-4c4c-80e7-35a679a46535"
                        }
                      ],
                      Name: "Souper Deli"
                    },
                    {
                      Name: "The Gallery",
                      Items: [
                        {
                          Name: "Ocho Rios Roll",
                          ID: "9c7eb236-e6be-43c9-81d3-47b1e549bf3a"
                        },
                        {
                          Name: "Veggie D-Lite Roll",
                          ID: "22141650-7335-45a5-b5e8-cc68c041ac5c"
                        },
                        {
                          Name: "Red Curry Chicken with Potatoes",
                          ID: "0feae0ae-6e15-4d8b-8eb3-3c94bb9d21ed"
                        },
                        {
                          Name: "Make Your Own Stir Fry",
                          ID: "59d509f3-09cd-4972-9bd5-75e5329628f2"
                        }
                      ]
                    },
                    {
                      Name: "Totally Italian",
                      Items: [
                        {
                          Name: "Make Your Own Pizza",
                          ID: "2f405e91-c765-48f1-a4d1-761436fe5cf7"
                        }
                      ]
                    },
                    {
                      Name: "The Pastry Shop",
                      Items: [
                        {
                          Name: "Carnival Cookie",
                          ID: "08b0e608-89e7-475a-b206-384a66025b92"
                        },
                        {
                          Name: "Sugar Cookie",
                          ID: "e6f64b96-5602-4649-a2ac-6ee0165afd4f"
                        },
                        {
                          Name: "Raspberry Swirl Cheesecake Squares",
                          ID: "362e01c8-39e2-4846-a04b-7124c13db324"
                        },
                        {
                          Name: "Rocky Road Swirl Brownie with Peanuts",
                          ID: "4a6d8eff-fb68-4d09-95ff-76b8b7a528d5"
                        }
                      ]
                    },
                    {
                      Name: "No Wheat No Meat",
                      Items: [
                        {
                          Name: "Tofu Pepper Scramble",
                          ID: "eeb19721-5691-44cf-8340-0c1a27c6f382"
                        },
                        {
                          Name: "Bok Choy Roasted",
                          ID: "fa95d296-55b6-4f87-b949-c2ed684b1c31"
                        }
                      ]
                    }
                  ]
                },
                {
                  Name: "Dinner",
                  Stations: [
                    {
                      Name: "Granite Grill",
                      Items: [
                        {
                          Name: "Flame Grilled Chicken Burger",
                          ID: "2261f530-0401-49ec-8f60-ae8fab0f030a"
                        },
                        {
                          Name: "Sweet Potato Fries",
                          ID: "18eeeecd-7e2a-4d16-a4e5-59765f0d500b"
                        },
                        {
                          Name: "Hamburgers",
                          ID: "9ff9ec48-c3df-4fcb-9755-8ef82c94eeed"
                        }
                      ]
                    },
                    {
                      Name: "Heartland Classics",
                      Items: [
                        {
                          Name: "Roast Turkey",
                          ID: "245e93c7-f826-46ee-b97a-4588d4e95b32"
                        },
                        {
                          Name: "Cheesy Chicken with Mushrooms",
                          ID: "bc3e3821-4158-4cc3-874a-1f5d13aa0a37"
                        },
                        {
                          Name: "Pasta Vegetable Bake",
                          ID: "d5810cdc-6638-48b2-8340-cadfaf103e4f"
                        },
                        {
                          Name: "Roasted Sweet Potatoes",
                          ID: "f094bbcb-f1a1-4517-b804-c4861d719976"
                        },
                        {
                          Name: "Roasted Ratatouille",
                          ID: "40bddf58-87c6-42c7-b277-6dd0502e2c3d"
                        },
                        {
                          Name: "Broccolini",
                          ID: "ca1f91e0-23cc-42f3-a0b8-2d3d9e2051b8"
                        }
                      ]
                    },
                    {
                      Name: "Souper Deli",
                      Items: [
                        {
                          Name: "Minestrone Soup",
                          ID: "fb7c819f-58fb-4292-87d0-4838a04c859a"
                        },
                        {
                          Name: "Deli w/Fresh Baked Breads",
                          ID: "246b82d4-d646-4c4c-80e7-35a679a46535"
                        }
                      ]
                    },
                    {
                      Name: "The Gallery",
                      Items: [
                        {
                          Name: "Ocho Rios Roll",
                          ID: "9c7eb236-e6be-43c9-81d3-47b1e549bf3a"
                        },
                        {
                          Name: "Veggie D-Lite Roll",
                          ID: "22141650-7335-45a5-b5e8-cc68c041ac5c"
                        },
                        {
                          Name: "Red Curry Chicken with Potatoes",
                          ID: "0feae0ae-6e15-4d8b-8eb3-3c94bb9d21ed"
                        },
                        {
                          Name: "Make Your Own Stir Fry",
                          ID: "59d509f3-09cd-4972-9bd5-75e5329628f2"
                        }
                      ]
                    },
                    {
                      Name: "Totally Italian",
                      Items: [
                        {
                          Name: "Make Your Own Pizza",
                          ID: "2f405e91-c765-48f1-a4d1-761436fe5cf7"
                        }
                      ]
                    },
                    {
                      Items: [
                        {
                          Name: "Carnival Cookie",
                          ID: "08b0e608-89e7-475a-b206-384a66025b92"
                        },
                        {
                          Name: "Sugar Cookie",
                          ID: "e6f64b96-5602-4649-a2ac-6ee0165afd4f"
                        },
                        {
                          Name: "Pound Cake With Strawberries",
                          ID: "e725922d-cc5d-4ccf-9f7d-2452ffe8c29d"
                        },
                        {
                          Name: "Rocky Road Swirl Brownie with Peanuts",
                          ID: "4a6d8eff-fb68-4d09-95ff-76b8b7a528d5"
                        }
                      ],
                      Name: "The Pastry Shop"
                    },
                    {
                      Items: [
                        {
                          Name: "Tofu Pepper Scramble",
                          ID: "eeb19721-5691-44cf-8340-0c1a27c6f382"
                        },
                        {
                          Name: "Broccolini",
                          ID: "ca1f91e0-23cc-42f3-a0b8-2d3d9e2051b8"
                        }
                      ],
                      Name: "No Wheat No Meat"
                    }
                  ],

                  Name: "Earhart",
                  Order: 4
                }
              ],
              Name: "Earhart"
            }
          ]
        }
      ],
      times: [
        { Order: 1, Name: "Breakfast" },
        { Order: 2, Name: "Lunch" },
        { Order: 3, Name: "Late Lunch" },
        { Order: 4, Name: "Dinner" }
      ],
      dateFilteredMeals: [],
      currentMeal: 0,
      resetSearch: false
    };

    this.state.dateFilteredMeals = this.state.meals[this.state.date].Courts.map(
      court => {
        return {
          Name: court.Name,
          Meals: court.Meals.filter(
            meal => meal.Order == this.state.times[this.state.currentMeal].Order
          )
        };
      }
    );
    this.state.dateFilteredMeals = this.state.dateFilteredMeals.filter(
      obj => obj.Meals.length != 0
    );
  }

  componentDidMount() {
    const date = new Date();
    for (let i = 8; i < 7; i++) {
      console.log(
        `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      );
      fetch(
        "https://us-central1-courtsort-e1100.cloudfunctions.net/fetchDishes",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            date: `${date.getFullYear()}-${date.getMonth() +
              1}-${date.getDate()}`
          })
        }
      ).then(data => {
        this.setState(
          {
            meals: this.state.meals.push({
              ...JSON.parse(data._bodyText)
            })
          },
          () => this.updateMeals()
        );
      });
      date.setDate(date.getDate() + 1);
    }
  }

  previousDate() {
    this.setState(
      {
        date: this.state.date - 1 < 0 ? 0 : this.state.date - 1
      },
      this.updateMeals(0)
    );
  }

  nextDate() {
    this.setState(
      {
        date: this.state.date + 1 >= this.state.meals.length ? this.state.meals.length - 1 : this.state.date + 1
      },
      this.updateMeals(0)
    );
  }

  updateMeals(index) {
    let dateFilteredMeals = this.state.meals[this.state.date].Courts.map(
      court => {
        return {
          Name: court.Name,
          Meals: court.Meals.filter(
            meal => meal.Order == this.state.times[index].Order
          )
        };
      }
    );
    dateFilteredMeals = dateFilteredMeals.filter(
      obj => obj.Meals.length != 0
    );

    this.setState({
      dateFilteredMeals,
      currentMeal: index,
      resetSearch: !this.state.resetSearch
    });
  }

  filterMeals(meals, text) {
    if (text.length != 0) {
      for (let i = 0; i < meals.length; i++) {
        meals[i].Items = meals[i].Items.filter(item =>
          item.Name.includes(text)
        );
      }
      meals = meals.filter(station => station.Items.length != 0);
    }
    return meals;
  }

  render() {
    /*if (true)
      return (
        <View>
          <Text>Loading</Text>
        </View>
      );*/
    //console.log(this.state.dateFilteredMeals);
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
              <Text>{this.state.date}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
              {this.state.times.map((meal, index) => (
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
        {console.log(this.state.dateFilteredMeals)}
        {this.state.dateFilteredMeals[0].length != 0 ? (
          <SearchList
            navigation={this.props.navigation}
            filterFunction={this.filterMeals}
            reset={this.state.resetSearch}
            list={{
              list: this.state.dateFilteredMeals,
              type: "expandable",
              subList: {
                list: "Meals",
                extend: "Stations",
                type: "dropDown",
                subList: {
                  list: "Items",
                  type: "element",
                  subList: false,
                  viewMore: {
                    page: "MealItem",
                    item: "ID"
                  }
                }
              }
            }}
          />
        ) : (
          <ListElement
            type="expandable"
            Name="No meals found"
            subList="false"
          />
        )}
      </Screen>
    );
  }
}
