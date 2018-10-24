<?php
/*
* Jeremy Wells - CS 396 - Project 2
* GetResults.php
* PHP File that gets the results for a poll and returns that data as a JSON Object
*/

session_start() ;

$userId = $_SESSION["userId"] ;

if (isset($_GET["pollId"])) {

  $pollId = $_GET["pollId"] ;

  include "db.php" ;

  $conn = new mysqli($dbHost, $dbUser, $dbPass, $db) ;

  // If there's no connection error
  if (!$conn->connect_error) {
    //If we can prepare the mysql statement
    if($stmt = $conn->prepare("SELECT vote1, vote2, vote3, vote4, vote5, vote6 FROM polls WHERE poll_id=?")) {
      //bind the variables
      $stmt->bind_param("s", $pollId) ;

      if($stmt->execute()) {
        if ($stmt->bind_result($vote1, $vote2, $vote3, $vote4, $vote5, $vote6)) {
          //we can loop through all the results and put them into an array
          //then turn that array into json for javascript to interpret
          if ($stmt->fetch()) {
            //going to store these in an object, then encode them with json
            //NOTE this is pretty awkward because it used to be different when my database was different
            $jsonObj[0] = new \stdClass() ;
            $jsonObj[0]->answer = 1 ;
            $jsonObj[0]->votes = $vote1 ;
            $jsonObj[1] = new \stdClass() ;
            $jsonObj[1]->answer = 2 ;
            $jsonObj[1]->votes = $vote2 ;
            $jsonObj[2] = new \stdClass() ;
            $jsonObj[2]->answer = 3 ;
            $jsonObj[2]->votes = $vote3 ;
            $jsonObj[3] = new \stdClass() ;
            $jsonObj[3]->answer = 4 ;
            $jsonObj[3]->votes = $vote4 ;
            $jsonObj[4] = new \stdClass() ;
            $jsonObj[4]->answer = 5 ;
            $jsonObj[4]->votes = $vote5 ;
            $jsonObj[5] = new \stdClass() ;
            $jsonObj[5]->answer = 6 ;
            $jsonObj[5]->votes = $vote6 ;
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



}
else {
  return 0 ;
}





?>
