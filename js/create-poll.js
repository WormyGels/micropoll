/*
* Jeremy Wells - CS 396 - Project 2
* create-poll.js
* JavaScript file associated with the create poll page, responsible for all functions on that page
*/

//the number of "answers" displayed on screen
var noAnswers = 2 ;

//because we have to instantiate the button's click upon the click of the button
//it is necessary to declare this function ahead of time
var removeBtn = function() {

  //only relevant when the number of answers is greater than 2
  if (noAnswers > 2) {
    noAnswers-- ;
    //remove the button from the DOM
    $("#ans-"+(noAnswers+1)).remove() ;
    //if we have just hit 2 then we do not need the - button anymore
    if (noAnswers > 2) {
      $("#ans-"+(noAnswers)+"-cont").addClass("col-sm-9").removeClass("col-sm-10") ;
      var remBtn = '<div id="rem-cont" class="col-sm-1"><button type="submit" class="btn btn-primary" id="rem-ans">-</button></div>' ;
      $("#ans-"+(noAnswers)).append(remBtn) ;
      $('#rem-ans').click(removeBtn) ;
    }
    //disable the new answer button since we are capped
    if (noAnswers < 6) {
      $('#new-ans').removeAttr("disabled") ;
    }
  }
} ;

//when jquery loads
$(function() {
  //when the user clicks the button
  $('#create-poll').click(function() {

    //first we want to notify the user that we are in the process of submitting the poll
    //show a loadwheel and disable the createpoll button
    $('#submit-wheel').removeClass("invisible") ;
    $('#create-poll').attr("disabled", "1") ;

    //need to make sure that the question box is filled out, as well as at least
    //two responses
    //question input
    console.log($.trim($('#inputQuestion').val()) == '') ;
    if ($.trim($('#inputQuestion').val()) == '') {
      popup("Missing Required Information", "Please enter the question.") ;
      $('#inputQuestion').focus() ;
    }
    else if ($.trim($('#inputAnswer1').val()) == '') {
      popup("Missing Required Information", "Please fill out at least two answers.") ;
      $('#inputAnswer1').focus() ;
    }
    else if ($.trim($('#inputAnswer2').val()) == '') {
      popup("Missing Required Information", "Please fill out at least two answers.") ;
      $('#inputAnswer2').focus() ;
    }
    //good to go
    else {
      //collect the information from the boxes
      var q = $('#inputQuestion').val() ;
      var a1 = $('#inputAnswer1').val() ;
      var a2 = $('#inputAnswer2').val() ;
      var a3 = $('#inputAnswer3').val() ;
      var a4 = $('#inputAnswer4').val() ;
      var a5 = $('#inputAnswer5').val() ;
      var a6 = $('#inputAnswer6').val() ;

      //if a3-a6 aren't on screen, we need to just send empty strings
      //and if its just whitespace, do the same
      if ($.trim(q) == '') {
        q = "" ;
      }
      if ((a1 == undefined) || ($.trim(a1) == '')) {
        a1 = "" ;
      }
      if ((a2 == undefined) || ($.trim(a2) == '')) {
        a2 = "" ;
      }
      if ((a3 == undefined) || ($.trim(a3) == '')) {
        a3 = "" ;
      }
      if ((a4 == undefined) || ($.trim(a4) == '')) {
        a4 = "" ;
      }
      if ((a5 == undefined) || ($.trim(a5) == '')) {
        a5 = "" ;
      }
      if ((a6 == undefined) || ($.trim(a6) == '')) {
        a6 = "" ;
      }


      var httpRequest = $.ajax("php/CreatePoll.php?question="+q+"&ans1="+a1+"&ans2="+a2+"&ans3="+a3+"&ans4="+a4+"&ans5="+a5+"&ans6="+a6).done(function(response) {
        //anon function called upon success
        //we were successful in creating the poll
        if (response != 0) {
          //redirect the user to the poll they have just created
          $(location).attr('href','poll.html?pollId='+response) ;
        }
        else {
          //have to display some sort of error to the user
          popup("Error", "There was a problem creating the poll.") ;
          //hide the load wheel and bring back the button
          $('#submit-wheel').addClass("invisible") ;
          $('#create-poll').removeAttr("disabled") ;
        }
      }).fail(function () {
        //have to display some sort of error to the user
        popup("Error", "There was a problem creating the poll.") ;
        //hide the load wheel and bring back the button
        $('#submit-wheel').addClass("invisible") ;
        $('#create-poll').removeAttr("disabled") ;
        popup("Error", "There was a problem creating the poll.") ;
      }).always(function() {
        //anon function called always
      }) ;

    }


  }) ;
  //when the user clicks the button to give a new answer
  $('#new-ans').click(function() {
    //we only allow up to 6 answers
    if (noAnswers < 6) {

      noAnswers++ ;
      //we only want the remove button on the latest answer on the list
      //so we set the previous one to have a column width of 10
      if (noAnswers > 3) {
        $("#ans-"+(noAnswers-1)+"-cont").removeClass("col-sm-9").addClass("col-sm-10") ;
        $("#rem-cont").remove() ;
      }
      var content = '<div id="ans-'+noAnswers+'" class="form-group row"><label for="inputAnswer'+noAnswers+'" class="col-sm-2 col-form-label">Answer '+noAnswers+'</label><div id="ans-'+noAnswers+'-cont" class="col-sm-9"><input type="input" class="form-control" id="inputAnswer'+noAnswers+'" placeholder="Answer '+noAnswers+'"></div></div>' ;
      $('#answers').append(content) ;
      //put the button to remove the answer here as well
      var remBtn = '<div id="rem-cont" class="col-sm-1"><button type="submit" class="btn btn-primary" id="rem-ans">-</button></div>' ;
      $("#ans-"+noAnswers).append(remBtn) ;
      //when the user clicks the button to remove an answer
      $('#rem-ans').click(removeBtn) ;
      //if we've reached 6 then we need to disable the + button
      if (noAnswers > 5) {
        $('#new-ans').attr("disabled", "1") ;
      }
    }
  }) ;


}) ;
