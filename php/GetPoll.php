<?php
/*
* Jeremy Wells - CS 396 - Project 2
* GetPoll.php
* PHP File that gets a particular poll and returns it as a JSON object
*/

//start the session for the user variable
session_start() ;

//make sure we have the pollId sent to us
if (isset($_GET["pollId"])) {

  $pollId = $_GET["pollId"] ;

  include "db.php" ;

  $conn = new mysqli($dbHost, $dbUser, $dbPass, $db) ;

  // If there's no connection error
  if (!$conn->connect_error) {
    //If we can prepare the mysql statement
    if($stmt = $conn->prepare("SELECT question, ans1, ans2, ans3, ans4, ans5, ans6 FROM polls WHERE poll_id=?")) {
      //bind the variables
      $stmt->bind_param("s", $pollId) ;

      if($stmt->execute()) {
        if ($stmt->bind_result($question, $ans1, $ans2, $ans3, $ans4, $ans5, $ans6)) {
          if ($stmt->fetch()) {
            //going to store these in an object, then encode them with json
            $jsonObj = new \stdClass() ; //this is necessary to supress a warning
            $jsonObj->question = $question ;
            $jsonObj->ans1 = $ans1 ;
            $jsonObj->ans2 = $ans2 ;
            $jsonObj->ans3 = $ans3 ;
            $jsonObj->ans4 = $ans4 ;
            $jsonObj->ans5 = $ans5 ;
            $jsonObj->ans6 = $ans6 ;

            //encode with json then echo it (javascript can interpret this really nicely)
            $json = json_encode($jsonObj) ;
            echo $json ;
          }
          else {
            echo 0 ;
          }
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
}
else {
  return 0 ; //javascript messed up
}



?>
