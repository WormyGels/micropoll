<?php
/*
* Jeremy Wells - CS 396 - Project 2
* CastVote.php
* PHP File that is responsible for the casting of a vote
*/

//start the php session to gain access to the user
session_start() ;

//get the user id and store it in a more convenient variable
$userId = $_SESSION["userId"] ;

//make sure we have the relevant information
if (isset($_GET["pollId"]) && isset($_GET["choice"]) && (checkifVoted($_GET["pollId"], $userId) == 1)) {

  //this gets the associated column based on user choice
  //this is not ideal, but it has to be this way because the change was last minute
  $pollId = $_GET["pollId"] ;
  $choice = $_GET["choice"] ;
  switch ($choice) {
    case 1:
      $vote = "vote1" ;
      break ;
    case 2:
      $vote = "vote2" ;
      break ;
    case 3:
      $vote = "vote3" ;
      break ;
    case 4:
      $vote = "vote4" ;
      break ;
    case 5:
      $vote = "vote5" ;
      break ;
    case 6:
      $vote = "vote6" ;
      break ;
    default:
      $vote = "error" ;
      break ;
  }

  include "db.php" ;

  $conn = new mysqli($dbHost, $dbUser, $dbPass, $db) ;

  // If there's no connection error
  if (!$conn->connect_error) {
    //If we can prepare the mysql statement
    if($stmt = $conn->prepare("INSERT INTO votes (poll_id, user_id, choice) VALUES (?, ?, ?)")) {
      //Bind the variables
      $stmt->bind_param("sss", $pollId, $userId, $choice) ;

      if ($stmt2 = $conn->prepare("UPDATE polls SET $vote = $vote+1 WHERE poll_id=?")) {
        $stmt2->bind_param("s", $pollId) ;

        //if we can execute both of those queries
        if($stmt->execute() && $stmt2->execute()) {
          //echo a 1 upon success
          echo 1 ;
        }
        else {
          //echo a 0 upon failure, the js will interpret both of these conditions
          echo 0 ;
        }

      }
      else {
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
  echo 0 ; // the javascript must have made a mistake (or an evil hacker man)
}
//this is a function that checks to see if the user has voted already on the passed poll
function checkIfVoted($pollId, $userId) {

  include "db.php" ;

  $conn = new mysqli($dbHost, $dbUser, $dbPass, $db) ;

  // If there's no connection error
  if (!$conn->connect_error) {
    //If we can prepare the mysql statement
    if($stmt = $conn->prepare("SELECT user_id FROM votes WHERE poll_id=? AND user_id=?")) {
      //bind the variables
      $stmt->bind_param("ss", $pollId, $userId) ;

      if($stmt->execute()) {
        if ($stmt->bind_result($userId)) {
          if ($stmt->fetch()) {
            return -1 ; //does exist
          }
          else {
            return 1 ; //doesn't exist
          }
        }
        else {
          return 0 ;
        }
      }
      else {
        //return a 0 upon failure, the js will interpret both of these conditions
        return 0 ;
      }

    }
    //shouldnt happen, but failure to prepare the query
    else {
      return 0 ;
    }

  }

}

?>
