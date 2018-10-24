<?php
/*
* Jeremy Wells - CS 396 - Project 2
* GetAllPolls.php
* PHP File that gets all the polls from the database and returns them in a JSON packed array
*/

//start a php session for the sake of getting user id (not really needed for this one, but why not)
session_start() ;

//we do not take any input on this one, so we can just start the query
include "db.php" ;

$conn = new mysqli($dbHost, $dbUser, $dbPass, $db) ;

// If there's no connection error
if (!$conn->connect_error) {
  //If we can prepare the mysql statement
  if($stmt = $conn->prepare("SELECT poll_id, question, vote1, vote2, vote3, vote4, vote5, vote6 FROM polls")) {

    if($stmt->execute()) {
      if ($stmt->bind_result($pollId, $question, $vote1, $vote2, $vote3, $vote4, $vote5, $vote6)) {
        $i = 0 ;
        //we can loop through all the results and put them into an array
        //then turn that array into json for javascript to interpret
        $jsonObj = [] ;
        while ($stmt->fetch()) {
          //going to store these in an object, then encode them with json
          $jsonObj[$i] = new \stdClass() ;
          $jsonObj[$i]->id = $pollId ;
          $jsonObj[$i]->question = $question ;
          $votes = $vote1+$vote2+$vote3+$vote4+$vote5+$vote6 ;
          $jsonObj[$i]->totalVotes = $votes ;
          $i++ ;
        }
        //encode with json then echo it (javascript can interpret this really nicely)
        $json = json_encode($jsonObj) ;
        echo $json ;

      }
      else {
        echo 0 ;
      }
    }
    else {
      //return a 0 upon failure, the js will interpret both of these conditions
      echo 0 ;
    }

  }
  //shouldnt happen, but failure to prepare the query
  else {
    echo 0 ;
  }

}

?>
