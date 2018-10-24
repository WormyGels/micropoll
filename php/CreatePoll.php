<?php
/*
* Jeremy Wells - CS 396 - Project 2
* CreatePoll.php
* PHP File that is responsible for the creation of a poll
*/

//start the php session so we have access to the userId session variable
session_start() ;

//get the user id and store it in a more convenient variable
$userId = $_SESSION["userId"] ;

//if we have all of our questions and answers sent to this file, then we are good to try
if (isset($_GET["question"]) && isset($_GET["ans1"]) && isset($_GET["ans2"]) &&
isset($_GET["ans3"]) && isset($_GET["ans4"]) && isset($_GET["ans5"]) &&
isset($_GET["ans6"])) {

  $question = $_GET["question"] ;
  $ans1 = $_GET["ans1"] ;
  $ans2 = $_GET["ans2"] ;
  $ans3 = $_GET["ans3"] ;
  $ans4 = $_GET["ans4"] ;
  $ans5 = $_GET["ans5"] ;
  $ans6 = $_GET["ans6"] ;

  include "db.php" ;

  $conn = new mysqli($dbHost, $dbUser, $dbPass, $db) ;

  // If there's no connection error
  if (!$conn->connect_error) {
    //If we can prepare the mysql statement
    if($stmt = $conn->prepare("INSERT INTO polls (question, ans1, ans2, ans3, ans4, ans5, ans6) VALUES (?, ?, ?, ?, ?, ?, ?)")) {
      //Bind the variables
      $stmt->bind_param("sssssss", $question, $ans1, $ans2, $ans3, $ans4, $ans5, $ans6) ;
      if($stmt->execute()) {
        //echo a 1 upon success
        echo getId($conn) ;
      }
      else {
        //echo a 0 upon failure, the js will interpret both of these conditions
        echo 0 ;
      }

    }
    //shouldnt happen, but failure to prepare the query
    else {
      echo 0 ;
    }

  }
  else {
    //connection error
    echo 0 ;
  }


}
else {
  //if not tell the javascript that it has made a mistake
  echo 0 ;
}

//this function returns the id that the user just inserted so that javacript can redirect them to appropriate poll
function getId($conn) {

  include "db.php" ;

  // If there's no connection error
  if (!$conn->connect_error) {
    //If we can prepare the mysql statement
    if($stmt = $conn->prepare("SELECT LAST_INSERT_ID()")) {
      if($stmt->execute()) {
        if ($stmt->bind_result($pollId)) {
          if ($stmt->fetch()) {
            return $pollId ;
          }
          else {
            return 0 ;
          }
        }
        else {
          return 0 ;
        }
      }
      else {
        //echo a 0 upon failure, the js will interpret both of these conditions
        return 0 ;
      }

    }
    //shouldnt happen, but failure to prepare the query
    else {
      return 0 ;
    }

  }
  else {
    //connection error
    return 0 ;
  }

}

?>
