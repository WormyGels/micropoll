/*
* Jeremy Wells - CS 396 - Project 2
* initialize.js
* JavaScript file that is loaded on all pages
* initializes the user, making sure that regardless of where they are on the website
* the php session variable of their session_id is available server side
*/

console.log("initialize.js loaded") ;
$(function() {

  var httpRequest = $.ajax("php/InitializeUser.php").done(function(response) {
    //anon function called upon success
    //we were successful in
    if (response == 1) {
      //don't really have to do anything in this case
      console.log("The user was successfully identified.") ;
      //check to see if we're on loadPage
      if (typeof loadPoll === "function") {
        loadPoll() ;
      }
    }
    else {
      //have to display some sort of error to the user
      $('body').html("<div class='container'><h1>A problem has occured contacting the Micropoll servers. Sorry about that!</h1></div>") ;
    }
  }).fail(function () {
    //anon function called upon fail
  }).always(function() {
    //anon function called always
  }) ;


}) ;
