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

/*
FUNCTION: is_open()
ARGS: dining_court  ( Pass in more variables? )
RETURN: a boolean value representing if the dining court is currently open
*/
function is_open(dining_court){
  var date  = today.getDate();
  var currTime = today.getHours() + today.getMinutes() +  today.getSeconds();
  var i;

  var times = get_times(dining_court, date);

  if( times.length == 0 ){
    return false;
  }

  for(i = 0; i < (times.length)/2; i=i+2){
    var startTime = times[i];
    var endTime = times[i+1];
    if( (startTime < currTime) && (currTime < endTime) ){
      return true;
    }
  }

  return false;
}

/*
FUNCTION: get_times()
ARGS: dining_court,  date
RETURN:
    get_times function returns an array of times for a given dining court on a specific day
    The contents will be ordered as such:
      [ Start_Time_1, End_Time_1, Start_Time_2, End_Time_2, ... ]
    The length of the array will be a multiple of 2.
    ( A better solution is use a struct-type data structure to keep the start and end times together )
*/
function is_open(dining_court){
    // @TODO - Tyler
}
