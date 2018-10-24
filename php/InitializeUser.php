<?php
/*
* Jeremy Wells - CS 396 - Project 2
* InitializeUser.php
* PHP File that initiilizes the user, creates the cookies, checks to see if their cookie
* exists in the database, etc.
*/

//start the php session so we can have the session variable for the user's ip
session_start() ;

//this gets the user's cookie if it exists for unique identity
if(isset($_COOKIE["identity"])) {
  $cookie = $_COOKIE["identity"] ;

}
else {
  $cookie = randomString() ;
  setCookie("identity", $cookie, time() + (86400 * 365), "/") ; //86400 is equal to one day, so 1 year

}

//make an initial attempt to see if the user has been to the site before (from that cookie)
$retrieveAttempt = retrieveUser($cookie) ;

//if that returned 0, then they have not and we must make a new
if ($retrieveAttempt == 0) {
  //try to create a new
  $newAttempt = newUser($cookie) ;
  //successfully created a new
  if ($newAttempt == 1) {
    //set the user id to the new one (call retrieve again)
    $retrieveAttempt = retrieveUser($cookie) ;
    //echo "New User ID: ".$retrieveAttempt ;
    //this echo statement tells javascript that everything is okay
    echo 1 ;
    //set the session variable for the userid
    $_SESSION["userId"] = $retrieveAttempt ;
  }
  //failure
  else {
    echo 0 ;
  }
}
//they do exist in the database
else {
  //echo "User ID: ".$retrieveAttempt ;
  //this echo statement also tells javascript that its okay to proceed (dont display error)
  echo 1 ;
  $_SESSION["userId"] = $retrieveAttempt ;
}


//function that retrieves user from the database if they already have an identity
function retrieveUser($cookie) {

  //we hash the cookie before putting it into the database
  $hashCookie = hash('ripemd160', $cookie) ;


  include "db.php" ;

  $conn = new mysqli($dbHost, $dbUser, $dbPass, $db) ;

  // If there's no connection error
  if (!$conn->connect_error) {
    //If we can prepare the mysql statement
    if($stmt = $conn->prepare("SELECT user_id FROM users WHERE identity=?")) {
      //bind the variables
      $stmt->bind_param("s", $hashCookie) ;

      if($stmt->execute()) {
        if ($stmt->bind_result($userId)) {
          if ($stmt->fetch()) {
            //return the user id
            return $userId ;
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
        //return a 0 upon failure, the js will interpret both of these conditions
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
//function that is called when we want to create a new user
function newUser($cookie) {

  $hashCookie = hash('ripemd160', $cookie) ;

  include "db.php" ;

  $conn = new mysqli($dbHost, $dbUser, $dbPass, $db) ;

  // If there's no connection error
  if (!$conn->connect_error) {
    //If we can prepare the mysql statement
    if($stmt = $conn->prepare("INSERT INTO users (identity) VALUES (?)")) {
      //Bind the variables
      $stmt->bind_param("s", $hashCookie);

      if($stmt->execute()) {
        //echo a 1 upon success
        return 1 ;
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
function randomString($length = 20) {
  $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' ;
  $charactersLength = strlen($characters) ;
  $randomString = '' ;
  for ($i = 0; $i < $length; $i++) {
    $randomString .= $characters[rand(0, $charactersLength - 1)] ;
  }
  return $randomString;
}
?>
