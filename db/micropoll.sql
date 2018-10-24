-- phpMyAdmin SQL Dump
-- version 4.8.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 10, 2018 at 05:50 PM
-- Server version: 10.1.32-MariaDB
-- PHP Version: 7.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `micropoll`
--

-- --------------------------------------------------------

--
-- Table structure for table `polls`
--

CREATE TABLE `polls` (
  `poll_id` int(11) NOT NULL,
  `question` text NOT NULL,
  `ans1` text NOT NULL,
  `ans2` text NOT NULL,
  `ans3` text NOT NULL,
  `ans4` text NOT NULL,
  `ans5` text NOT NULL,
  `ans6` text NOT NULL,
  `vote1` int(11) NOT NULL,
  `vote2` int(11) NOT NULL,
  `vote3` int(11) NOT NULL,
  `vote4` int(11) NOT NULL,
  `vote5` int(11) NOT NULL,
  `vote6` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `polls`
--

INSERT INTO `polls` (`poll_id`, `question`, `ans1`, `ans2`, `ans3`, `ans4`, `ans5`, `ans6`, `vote1`, `vote2`, `vote3`, `vote4`, `vote5`, `vote6`) VALUES
(1, 'Test Poll', 'Answer 1', 'Answer 2', '', '', '', '', 2, 1, 0, 0, 0, 0),
(2, 'Favorite Starcraft Race', 'Terran', 'Protoss', 'Zerg', '', '', '', 1, 0, 0, 0, 0, 0),
(3, 'Second Test Poll 6 Options', 'Answer 1', 'Answer 2', 'Answer 3', 'Answer 4', 'Answer 5', 'Answer 6', 37, 42, 109, 57, 10, 25),
(4, 'Test Poll 3 Options', 'Answer 1', 'Answer 2', 'Answer 3', '', '', '', 1, 1, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `identity` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `identity`) VALUES
(1, 'cb546c0815127659a2fd9fb707abc2247d8619be'),
(2, 'b7f10da85256bf66ebf23ab28efb24acdd561f61'),
(3, '22768391271cfd1f9f7157b59b2880015911de8a'),
(4, '514e1e2ae27c20e3b1e0ad128dd881287426ff23');

-- --------------------------------------------------------

--
-- Table structure for table `votes`
--

CREATE TABLE `votes` (
  `poll_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `choice` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `votes`
--

INSERT INTO `votes` (`poll_id`, `user_id`, `choice`) VALUES
(1, 1, 1),
(1, 2, 1),
(1, 3, 2),
(2, 1, 1),
(3, 1, 1),
(4, 1, 1),
(4, 4, 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `polls`
--
ALTER TABLE `polls`
  ADD PRIMARY KEY (`poll_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `votes`
--
ALTER TABLE `votes`
  ADD KEY `poll_id` (`poll_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `polls`
--
ALTER TABLE `polls`
  MODIFY `poll_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `votes`
--
ALTER TABLE `votes`
  ADD CONSTRAINT `votes_ibfk_1` FOREIGN KEY (`poll_id`) REFERENCES `polls` (`poll_id`),
  ADD CONSTRAINT `votes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
