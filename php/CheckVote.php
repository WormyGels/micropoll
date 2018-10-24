<?php
/*
* Jeremy Wells - CS 396 - Project 2
* CheckVote.php
* PHP File that is responsible for seeing if a user has already voted on the poll
* there are protections in place to prevent vote manipulation inside CastVote.php as well
* this one is just for the sake of the front end, the security does not rely on it
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
    if($stmt = $conn->prepare("SELECT user_id FROM votes WHERE poll_id=? AND user_id=?")) {
      //bind the variables
      $stmt->bind_param("ss", $pollId, $userId) ;

      if($stmt->execute()) {
        if ($stmt->bind_result($userId)) {
          if ($stmt->fetch()) {
            echo -1 ; //does exist
          }
          else {
            echo 1 ; //doesn't exist
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
  return 0 ;
}


?>
