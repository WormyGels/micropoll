/*
* Jeremy Wells - CS 396 - Project 2
* view-poll.js
* JavaScript file associated with the page that displays all polls
* Should be noted that if there were a lot of polls, this page should be changed
* so that there are pages or something, but for the small scale of this project
* this is alright
*/

//When jquery loads
$(function () {

  //for now we'll just load all the questions
  var httpRequest1 = $.ajax("php/GetAllPolls.php").done(function(response) {

    //then we got a response that was valid
    if (response != 0) {

      //parse the json for valid response
      var jsonResp = JSON.parse(response) ;

      //clear the test example from table
      $("#table-body").empty() ;

      for (var i = jsonResp.length-1 ; i >= 0 ; i--) {
        var row = "<tr><th scope='row'>"+(jsonResp[i].id)+"</th>"+"<td><a href='poll.html?pollId="+jsonResp[i].id+"'>"+jsonResp[i].question+"</a></td>"+"<td>"+jsonResp[i].totalVotes+"</td></tr>" ;
        $("#table-body").append(row) ;
      }

      if (jsonResp.length == 0) {
        var row = "<tr><th scope='row'></th><td>There are currently no polls!</td>"+"<td>0</td></tr>" ;
        $("#table-body").append(row) ;
      }


    }
    else {
      popup("Error", "There was a problem connecting to the microPoll servers. Please Try again later.")
    }

  }) ;


}) ;
