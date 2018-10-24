/*
* Jeremy Wells - CS 396 - Project 2
* poll.js
* JavaScript file associated with the page that both displays poll results, and lets users vote on the poll
*/

//this variable corresponds to the currently selected choice on the poll
var curActive = 1 ;
var canvasWidth = 450 ;
var canvasHeight = 450 ;
var circleRadius = 200 ;

//TODO need to give some "loading" indication when they submit the vote and are waiting on
//the server, because on the slower web servers it is noticable
//goes pretty much for all pages actually

console.log("poll.js loaded") ;

//function must be called by another function in the initialize file (callback)
function loadPoll() {
  //check to see if the user has already voted on the poll
  //if they have, then just show them the results
  //if not show them the poll so they can take it
  var httpRequest1 = $.ajax("php/CheckVote.php?pollId="+getUrlParameter("pollId")).done(function(response) {
    //this means we DO NOT exist
    if (response == 1) {
      //the user has not taken the poll yet,
      //fill out the information for the question
      var httpRequest2 = $.ajax("php/GetPoll.php?pollId="+getUrlParameter("pollId")).done(function(response) {
        //anon function called upon success
        if (response != 0) {

          //parse our response as a JSON (because it is)
          var jsonResp = JSON.parse(response) ;

          changeWindowTitle(jsonResp.question) ;

          //these three are guarenteed
          $("#poll-title").text(jsonResp.question) ;
          $("#btnAns1").text(jsonResp.ans1) ;
          $("#btnAns2").text(jsonResp.ans2) ;

          //for the other answers, we are not sure the poll uses them or not so we must check
          if (jsonResp.ans3 != "") {
            //create the button
            var btn = '<button id="btnAns3" type="button" class="btn btn-light col-sm-12 ans-btn">'+ jsonResp.ans3 +'</button>' ;
            $("#rowAns").append(btn) ;
          }
          if (jsonResp.ans4 != "") {
            //create the button
            var btn = '<button id="btnAns4" type="button" class="btn btn-light col-sm-12 ans-btn">'+ jsonResp.ans4 +'</button>' ;
            $("#rowAns").append(btn) ;
          }
          if (jsonResp.ans5 != "") {
            //create the button
            var btn = '<button id="btnAns5" type="button" class="btn btn-light col-sm-12 ans-btn">'+ jsonResp.ans5 +'</button>' ;
            $("#rowAns").append(btn) ;
          }
          if (jsonResp.ans6 != "") {
            //create the button
            var btn = '<button id="btnAns6" type="button" class="btn btn-light col-sm-12 ans-btn">'+ jsonResp.ans6 +'</button>' ;
            $("#rowAns").append(btn) ;
          }

          //call the activate buttons function now that we use all of them
          activateButtons() ;

          //make the vote button submit the current selected option
          $("#vote").click(function () {

            //show a loading bar for the user
            $('#submit-wheel').removeClass("invisible") ;
            $('#vote').attr("disabled", "1") ;

            var httpRequest3 = $.ajax("php/CastVote.php?pollId="+getUrlParameter("pollId")+"&choice="+curActive).done(function(response) {
              //successfully voted
              if (response == 1) {
                popup("Success", "You have successfuly voted.") ;
                //change the content underneath them to the poll results
                showResults() ;

              }
              else {
                popup("Error", "There was an error during the voting process. Please try again later.") ;
                //hide the load wheel and bring back the button
                $('#submit-wheel').addClass("invisible") ;
                $('#vote').removeAttr("disabled") ;
              }
            }).fail(function() {
              popup("Error", "There was an error during the voting process. Please try again later.") ;
              //hide the load wheel and bring back the button
              $('#submit-wheel').addClass("invisible") ;
              $('#vote').removeAttr("disabled") ;

            }).always() ;
          }) ;

          //display the containers
          $("#content-container").removeClass("invisible") ;
          $("#title-container").removeClass("invisible") ;

        }
        else {
          //have to display some sort of error to the user
          popup("Error", "There was a problem voting. Please try again later.") ;
        }
      }).fail(function () {
        //anon function called upon fail

      }).always(function() {
        //anon function called always
      }) ;

    }
    //this means we DO exist
    else if (response == -1) {
      //need to display results
      popup("Already Voted", "You have already voted on this poll. You may only view the results.") ;
      showResults() ;
    }
    //This means there was some other problem
    else {
      popup("Error", "There was an error connecting to the servers. Please try again.") ;
    }

  }).fail(function () {console.log("Failed to check if the user voted.")}).always(function () {}) ;

} ;
//function that makes the buttons interactive, making the selected one highlighted
//NOTE (i really like the implementation of that for loop, that is a neat way of doing it)
function activateButtons() {
  //apply the active function to the buttons
  var actFun = function(event) {
    //remove old active
    $(".ans-btn.active").removeClass("active") ;
    //set new active
    $("#btnAns"+event.data.button).addClass("active") ;
    curActive = event.data.button ;
  }
  //must pass as an event due to weird scoping issue
  for (var i = 1 ; i <= 6 ; i++) {
    $("#btnAns"+i).click({button: i}, actFun) ;
  }
}
//show the results for the poll as opposed to display the question
//since this is called in a few areas, a function is more appropriate
function showResults() {

  //still need the title :(
  var httpRequest = $.ajax("php/GetPoll.php?pollId="+getUrlParameter("pollId")).done(function(response) {
    //parse our response as a JSON (because it is)
    var jsonResp = JSON.parse(response) ;

    changeWindowTitle(jsonResp.question) ;

    $("#poll-title").text(jsonResp.question) ;
    $("#content-container").empty() ;

    //retrieve information on the results
    var httpRequest = $.ajax("php/GetResults.php?pollId="+getUrlParameter("pollId")).done(function(response2) {
      var voteJsonResp = JSON.parse(response2) ;
      //find the total number of votes
      var totalVotes = 0 ;
      for (var i = 0 ; i < voteJsonResp.length ; i++) {
        totalVotes += voteJsonResp[i].votes ;
      }

      //create the pie chart canvas/div
      $("#content-container").append("<div id='results-chart' class='col-sm-6'></div>") ;
      //if we are on a small screen we may need to make the chart smaller
      //get the width/height for the pie chart
      canvasWidth = $("#results-chart").width() ;
      canvasHeight = $("#results-chart").width()*3/4 ;
      circleRadius = canvasHeight/2 - 10 ;
      $("#results-chart").append("<canvas id='canvas-chart' width="+canvasWidth+" height="+canvasHeight+"></canvas>") ;

      //get the canvas instance and begin drawing
      var c = document.getElementById("canvas-chart") ;
      var ctx = c.getContext("2d") ;
      //center is 300, 225

      //begin filling in the circle with the appropriate information
      var theta = 0 ;
      var colorArray = ["#a80000", "#438eff", "#fff074", "#ff9000", "#006205", "#58009c"] ;
      for (var i = 0 ; i < voteJsonResp.length ; i++) {
        theta = drawPieSection(ctx, colorArray[voteJsonResp[i].answer-1], voteJsonResp[i].votes, totalVotes, theta) ;
      }


      //draw the circle to enclose it (looks better on top)
      ctx.beginPath() ;
      ctx.lineWidth= 3 ;
      ctx.strokeStyle = "black" ;
      ctx.arc((canvasWidth/2), (canvasHeight/2), circleRadius, 0, 2 * Math.PI) ; //usage: ctx.arc(x, y, start (radians), stop (radians)) ;
      ctx.stroke() ;
      ctx.closePath() ;
      ctx.lineWidth= 1 ;

      //begin popualting the textual information about the graph
      $("#content-container").append("<div id='results-textual' class='col-sm-6'></div>")

      if (jsonResp.ans1 != "") {
        $("#results-textual").append("<p class='result-label' id='result1'><div id='key1' class='color-key'></div>"+jsonResp.ans1+" - <span id='result1-data'>0</span></p>") ;
      }
      if (jsonResp.ans2 != "") {
        $("#results-textual").append("<p class='result-label' id='result2'><div id='key2' class='color-key'></div>"+jsonResp.ans2+" - <span id='result2-data'>0</span></p>") ;
      }
      if (jsonResp.ans3 != "") {
        $("#results-textual").append("<p class='result-label' id='result3'><div id='key3' class='color-key'></div>"+jsonResp.ans3+" - <span id='result3-data'>0</span></p>") ;
      }
      if (jsonResp.ans4 != "") {
        $("#results-textual").append("<p class='result-label' id='result4'><div id='key4' class='color-key'></div>"+jsonResp.ans4+" - <span id='result4-data'>0</span></p>") ;
      }
      if (jsonResp.ans5 != "") {
        $("#results-textual").append("<p class='result-label' id='result5'><div id='key5' class='color-key'></div>"+jsonResp.ans5+" - <span id='result5-data'>0</span></p>") ;
      }
      if (jsonResp.ans6 != "") {
        $("#results-textual").append("<p class='result-label' id='result6'><div id='key6' class='color-key'></div>"+jsonResp.ans6+" - <span id='result6-data'>0</span></p>") ;
      }
      $("#results-textual").append("<p class='result-label' id='result6'>Total Votes - <span id='total-data'>"+totalVotes+"</span></p>") ;

      for (var i = 0 ; i < voteJsonResp.length ; i++) {
        $('#result'+voteJsonResp[i].answer+'-data').text(Math.round((voteJsonResp[i].votes/totalVotes)*100) + "% - " + voteJsonResp[i].votes) ;
      }
      for (var i = 0 ; i < voteJsonResp.length ; i++) {
        $('#key'+voteJsonResp[i].answer).css('background-color', colorArray[voteJsonResp[i].answer-1]) ;
      }

    }) ;

    //display the containers
    $("#content-container").removeClass("invisible") ;
    $("#title-container").removeClass("invisible") ;

  }).fail(function () {
    popup("Error", "There was a problem showing the results.") ;
  }) ;
}
function drawPieSection(ctx, color, votes, totalVotes, startTheta) {
  //usage: ctx.arc(x, y, radius, start (radians), stop (radians)) ;

  //calculate where we will stop the arc
  var stopTheta = startTheta + votes*2*Math.PI/totalVotes ;

  //set the color and radius
  ctx.strokeStyle = color ;
  //the width will span the whole radius
  ctx.lineWidth= circleRadius ;
  ctx.beginPath() ;
  //place the radius as half the radius because we want it to go in the middle
  ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius/2, startTheta, stopTheta) ;
  ctx.stroke() ;
  ctx.closePath() ;
  //set the linewidth bath to 1 (so we do not modify our ctx if it was needed for some reason)
  ctx.lineWidth= 1 ;
  //return back our stop theta
  return stopTheta ;
}
