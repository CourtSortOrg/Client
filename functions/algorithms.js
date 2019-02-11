//A collection of functions that will getting dining court menu information from the API much easier

/*
FUNCTION: get_menu_url()
ARGS: dining_court, day, month, year
RETURN: the url to the menu of that dining court at that specific day
*/
export function get_menu_url(dining_court, day, month, year) {
  var url = 'https://api.hfs.purdue.edu/menus/v2/locations/' + dining_court + '/' + year + '-' + month + '-' + day;
  return url;
}

/*
FUNCTION: get_menus_url()
ARGS: dining_court, day, month, year, offset
RETURN: an array of urls to the menus of the dining court at that specific day plus offset - 1 additional days
*/
export function get_menus_url(dining_court, day, month, year, offset) {
  var urls = new Array(offset);
  var currDay = day;
  var currMonth = month;
  var currYear = year;
  for (i = 0; i < offset; i++) {
    urls[i] = get_menu_url(dining_court, currDay, currMonth, currYear);
    currDay++;
    //leap year
    if (currDay == 30 && currMonth == 2 && ((currYear % 4 == 0 && currYear % 100 != 0) || currYear % 400 == 0)) {
      currDay = 1;
      currMonth++;
    }
    //account for february when it is not a leap year
    else if (currDay == 29 && currMonth == 2) {
      currDay = 1;
      currMonth++;
    }
    //account for months with 30 days
    else if (currDay == 31 && (currMonth == 4 || currMonth == 6 || currMonth == 9 || currMonth == 11)) {
      currDay = 1;
      currMonth++;
    }
    //account for months with 31 days
    else if (currDay == 32 && (currMonth == 1 || currMonth == 3 || currMonth == 5 || currMonth == 7 || currMonth == 8 || currMonth == 10 || currMonth == 12)) {
      //account for the new year
      if (currMonth == 12) {
        currDay = 1;
        currMonth = 1;
        currYear++;
      }
      else {
        currDay = 1;
        currMonth++;
      }
    }
  }
}
