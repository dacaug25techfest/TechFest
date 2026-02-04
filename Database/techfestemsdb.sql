-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: techfestemsdb
-- ------------------------------------------------------
-- Server version	8.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attendee`
--

DROP TABLE IF EXISTS `attendee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendee` (
  `att_id` int NOT NULL AUTO_INCREMENT,
  `uid` int NOT NULL,
  `dob` date DEFAULT NULL,
  `degree_id` int DEFAULT NULL,
  `bid` int DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `branch_id` int NOT NULL,
  PRIMARY KEY (`att_id`),
  KEY `fk_attendee_user` (`uid`),
  KEY `fk_attendee_degree` (`degree_id`),
  KEY `fk_attendee_branch` (`bid`),
  CONSTRAINT `fk_attendee_branch` FOREIGN KEY (`bid`) REFERENCES `branch` (`bid`),
  CONSTRAINT `fk_attendee_degree` FOREIGN KEY (`degree_id`) REFERENCES `degree` (`degree_id`),
  CONSTRAINT `fk_attendee_user` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendee`
--

LOCK TABLES `attendee` WRITE;
/*!40000 ALTER TABLE `attendee` DISABLE KEYS */;
INSERT INTO `attendee` VALUES (1,1,'2026-03-15',1,1,'Pandharpur',0),(2,2,'2017-06-14',1,NULL,'pandharpur solapur',1),(3,3,'2019-10-10',1,NULL,'Kothrud Depot pune',1),(4,6,'1998-02-11',1,NULL,'df dfgdf fh fgh fg hfh',1);
/*!40000 ALTER TABLE `attendee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branch`
--

DROP TABLE IF EXISTS `branch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branch` (
  `bid` int NOT NULL AUTO_INCREMENT,
  `bname` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`bid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branch`
--

LOCK TABLES `branch` WRITE;
/*!40000 ALTER TABLE `branch` DISABLE KEYS */;
INSERT INTO `branch` VALUES (1,'Computer Science');
/*!40000 ALTER TABLE `branch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `city`
--

DROP TABLE IF EXISTS `city`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `city` (
  `city_id` int NOT NULL AUTO_INCREMENT,
  `cname` varchar(100) NOT NULL,
  `sid` int NOT NULL,
  PRIMARY KEY (`city_id`),
  KEY `fk_state_id_idx` (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `city`
--

LOCK TABLES `city` WRITE;
/*!40000 ALTER TABLE `city` DISABLE KEYS */;
INSERT INTO `city` VALUES (1,'Mumbai',1),(2,'Pune',1),(3,'Bangalore',2),(4,'Mysore',2),(5,'Chennai',3),(6,'Coimbatore',3),(7,'New Delhi',4),(8,'Ahmedabad',5),(9,'Bengaluru',3),(10,'Mysuru',3),(11,'Chennai',4),(12,'Coimbatore',4),(13,'Kochi',5),(14,'Trivandrum',5),(15,'Jaipur',6),(16,'Udaipur',6),(17,'Bhopal',7),(18,'Indore',7),(19,'Lucknow',8),(20,'Noida',8),(21,'New Delhi',9),(22,'Panaji',10);
/*!40000 ALTER TABLE `city` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `degree`
--

DROP TABLE IF EXISTS `degree`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `degree` (
  `degree_id` int NOT NULL AUTO_INCREMENT,
  `dname` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`degree_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `degree`
--

LOCK TABLES `degree` WRITE;
/*!40000 ALTER TABLE `degree` DISABLE KEYS */;
INSERT INTO `degree` VALUES (1,'BE');
/*!40000 ALTER TABLE `degree` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event` (
  `eid` int NOT NULL AUTO_INCREMENT,
  `ename` varchar(255) DEFAULT NULL,
  `vid` int NOT NULL,
  `time` time NOT NULL,
  `date` date NOT NULL,
  `fair` double NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `uid` int NOT NULL,
  `capacity` int NOT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`eid`),
  KEY `fk_event_venue` (`vid`),
  KEY `fk_user_id_idx` (`uid`),
  CONSTRAINT `fk_event_venue` FOREIGN KEY (`vid`) REFERENCES `venue` (`vid`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
INSERT INTO `event` VALUES (1,'hackthon',1,'00:00:12','2026-03-15',500,'wewew',1,4,NULL),(2,'TechFest 2026',1,'10:00:00','2026-03-15',500,'Annual technical festival',1,9,NULL),(4,'dsfdfsf',3,'07:27:00','2026-02-12',233,'ewr e wr wer wer wer werw erw erwerw rw',3,21,NULL),(5,'omkartechfest',1,'10:55:00','2026-02-26',455,'fdg df gdfg dfg dfg df df gdfg f ',3,44,NULL);
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `fid` int NOT NULL AUTO_INCREMENT,
  `eid` int NOT NULL,
  `att_id` int NOT NULL,
  `rating` int NOT NULL,
  `remark` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`fid`),
  KEY `fk_feedback_event` (`eid`),
  KEY `fk_feedback_attendee` (`att_id`),
  CONSTRAINT `fk_feedback_attendee` FOREIGN KEY (`att_id`) REFERENCES `attendee` (`att_id`),
  CONSTRAINT `fk_feedback_event` FOREIGN KEY (`eid`) REFERENCES `event` (`eid`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback`
--

LOCK TABLES `feedback` WRITE;
/*!40000 ALTER TABLE `feedback` DISABLE KEYS */;
INSERT INTO `feedback` VALUES (1,4,1,1,'rgfdfgd'),(2,2,1,2,'dfgdg'),(3,2,1,1,'dfgdfg'),(4,4,1,1,'sdfsdf');
/*!40000 ALTER TABLE `feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registration`
--

DROP TABLE IF EXISTS `registration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registration` (
  `reg_id` int NOT NULL AUTO_INCREMENT,
  `eid` int NOT NULL,
  `att_id` int NOT NULL,
  `no_of_people` int NOT NULL,
  PRIMARY KEY (`reg_id`),
  KEY `fk_registration_event` (`eid`),
  KEY `fk_registration_attendee` (`att_id`),
  CONSTRAINT `fk_registration_attendee` FOREIGN KEY (`att_id`) REFERENCES `attendee` (`att_id`),
  CONSTRAINT `fk_registration_event` FOREIGN KEY (`eid`) REFERENCES `event` (`eid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registration`
--

LOCK TABLES `registration` WRITE;
/*!40000 ALTER TABLE `registration` DISABLE KEYS */;
INSERT INTO `registration` VALUES (1,1,1,5),(2,1,3,1),(3,2,1,1),(4,4,1,1),(5,4,4,1),(6,5,4,1);
/*!40000 ALTER TABLE `registration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `rid` int NOT NULL AUTO_INCREMENT,
  `rname` varchar(50) NOT NULL,
  PRIMARY KEY (`rid`),
  UNIQUE KEY `rname` (`rname`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (3,'Admin'),(1,'Attendie'),(2,'Organizer');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `state`
--

DROP TABLE IF EXISTS `state`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `state` (
  `state_id` int NOT NULL AUTO_INCREMENT,
  `sname` varchar(100) NOT NULL,
  PRIMARY KEY (`state_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `state`
--

LOCK TABLES `state` WRITE;
/*!40000 ALTER TABLE `state` DISABLE KEYS */;
INSERT INTO `state` VALUES (1,'Maharashtra'),(2,'Karnataka'),(3,'Tamil Nadu'),(4,'Delhi'),(5,'Gujarat'),(6,'Rajasthan'),(7,'Madhya Pradesh'),(8,'Uttar Pradesh'),(9,'Delhi'),(10,'Goa');
/*!40000 ALTER TABLE `state` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket`
--

DROP TABLE IF EXISTS `ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket` (
  `ticket_no` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `ename` varchar(255) DEFAULT NULL,
  `fair` double NOT NULL,
  `no_of_attendee` int NOT NULL,
  `amt` double NOT NULL,
  `att_id` int NOT NULL,
  `eid` int DEFAULT NULL,
  PRIMARY KEY (`ticket_no`),
  KEY `fk_ticket_attendee` (`att_id`),
  CONSTRAINT `fk_ticket_attendee` FOREIGN KEY (`att_id`) REFERENCES `attendee` (`att_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket`
--

LOCK TABLES `ticket` WRITE;
/*!40000 ALTER TABLE `ticket` DISABLE KEYS */;
INSERT INTO `ticket` VALUES (1,'2026-03-15','00:00:12','hackthon',500,1,500,3,1),(2,'2026-03-15','10:00:00','TechFest 2026',500,1,500,1,2),(3,'2026-02-12','07:27:00','dsfdfsf',233,1,233,1,4),(4,'2026-02-12','07:27:00','dsfdfsf',233,1,233,4,4),(5,'2026-02-26','10:55:00','omkartechfest',455,1,455,4,5);
/*!40000 ALTER TABLE `ticket` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `uid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rid` int NOT NULL,
  `state_id` int NOT NULL,
  `city_id` int NOT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`),
  KEY `fk_user_role` (`rid`),
  KEY `fk_user_state` (`state_id`),
  KEY `fk_user_city` (`city_id`),
  CONSTRAINT `fk_user_city` FOREIGN KEY (`city_id`) REFERENCES `city` (`city_id`),
  CONSTRAINT `fk_user_role` FOREIGN KEY (`rid`) REFERENCES `role` (`rid`),
  CONSTRAINT `fk_user_state` FOREIGN KEY (`state_id`) REFERENCES `state` (`state_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Tejas','4637388','tejas@gmail.com','tejas','Tejas@123',1,1,1),(2,'tejas','7350288744','tejasthite2002@gmail.com','tejas@123','Tejas@123',1,1,1),(3,'anshul','7350288755','anshul@gmail.com','anshul@123','Anshul@123',2,1,2),(4,'omkar','3453454456','omkar@gmail.com','omkar@123','Omkar@123',2,1,2),(5,'ankita','2343423434','ankita@gmail.com','ankita@gmail.com','Ankita@123',1,1,1),(6,'neelam','3454353453','neelam@gmail.com','neelam@gmail.com','Neelam@123',1,1,1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venue`
--

DROP TABLE IF EXISTS `venue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venue` (
  `vid` int NOT NULL AUTO_INCREMENT,
  `address` varchar(255) NOT NULL,
  `state_id` int NOT NULL,
  `city_id` int NOT NULL,
  `capacity` int NOT NULL,
  PRIMARY KEY (`vid`),
  KEY `fk_venue_state` (`state_id`),
  KEY `fk_venue_city` (`city_id`),
  CONSTRAINT `fk_venue_city` FOREIGN KEY (`city_id`) REFERENCES `city` (`city_id`),
  CONSTRAINT `fk_venue_state` FOREIGN KEY (`state_id`) REFERENCES `state` (`state_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venue`
--

LOCK TABLES `venue` WRITE;
/*!40000 ALTER TABLE `venue` DISABLE KEYS */;
INSERT INTO `venue` VALUES (1,'123 Tech Park, Andheri',1,1,500),(2,'456 Innovation Hub, Hinjewadi',1,2,300),(3,'789 Startup Center, Whitefield',2,3,400),(4,'321 Conference Hall, MG Road',2,3,200),(5,'654 Event Center, T Nagar',3,5,350);
/*!40000 ALTER TABLE `venue` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-03 11:39:48
