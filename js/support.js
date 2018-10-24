/*
* Jeremy Wells - CS 396 - Project 2
* support.js
* JavaScript file that contains misc functions that may be of use in other files
*/

console.log("support.js loaded") ;

//function to make the popup box appear
function popup(title, message) {
  $('#dispMsgTitle').text(title) ;
  $('#dispMsg-content').text(message) ;
  $('#dispMsg').modal() ;
}
//this function gets the "get" variable in the URL
function getUrlParameter(param) {
  //get the page url
  var pageURL = decodeURIComponent(window.location.search.substring(1)) ;
  //split the page url by the & sign (how we separate variables)
  var urlVars = pageURL.split('&') ;

  //go through all the paramaeters and split by equal sign to get value
  for (var i = 0; i < urlVars.length; i++) {
    var paramName = urlVars[i].split('=') ;

    //if we find the passed parameter then we are to return the proper value
    if (paramName[0] === param) {
      //just a check to make sure that it is defined (otherwise we can get some wonky stuff)
      return paramName[1] === undefined ? true : paramName[1] ;
    }
  }
}
function changeWindowTitle(string) {
  $(document).prop('title', 'microPoll - ' + string) ;
}
