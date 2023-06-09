-- MySQL dump 10.13  Distrib 5.7.40, for Win64 (x86_64)
--
-- Host: localhost    Database: second_hand_market
-- ------------------------------------------------------
-- Server version	5.7.40-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `buy_data`
--

DROP TABLE IF EXISTS `buy_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buy_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Purchasers` varchar(255) NOT NULL,
  `item_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buy_data`
--

LOCK TABLES `buy_data` WRITE;
/*!40000 ALTER TABLE `buy_data` DISABLE KEYS */;
INSERT INTO `buy_data` VALUES (7,'3114287158@qq.com',1001),(8,'3114287158@qq.com',1004),(10,'3114287158@qq.com',1000);
/*!40000 ALTER TABLE `buy_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_data`
--

DROP TABLE IF EXISTS `chat_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chat_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Sender` varchar(255) NOT NULL,
  `Receiver` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `time` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_data`
--

LOCK TABLES `chat_data` WRITE;
/*!40000 ALTER TABLE `chat_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `chat_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `collection_data`
--

DROP TABLE IF EXISTS `collection_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `collection_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Collectors` varchar(255) NOT NULL,
  `item_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `collection_data`
--

LOCK TABLES `collection_data` WRITE;
/*!40000 ALTER TABLE `collection_data` DISABLE KEYS */;
INSERT INTO `collection_data` VALUES (4,'3114287158@qq.com',1001),(22,'jin.zhou@students.plymouth.ac.uk',1002),(24,'3114287158@qq.com',1010),(25,'3114287158@qq.com',1011),(26,'jin.zhou@students.plymouth.ac.uk',1005),(27,'3114287157@qq.com',1010);
/*!40000 ALTER TABLE `collection_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_data`
--

DROP TABLE IF EXISTS `item_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `item_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `seller` varchar(255) NOT NULL,
  `item_description` text NOT NULL,
  `item_price` int(11) NOT NULL,
  `date_purchase` varchar(255) NOT NULL,
  `item_status` varchar(255) NOT NULL,
  `item_product` varchar(255) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `sale_status` varchar(255) NOT NULL,
  `item_image` varchar(255) NOT NULL,
  `item_score` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1017 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_data`
--

LOCK TABLES `item_data` WRITE;
/*!40000 ALTER TABLE `item_data` DISABLE KEYS */;
INSERT INTO `item_data` VALUES (1000,'3114287157@qq.com','new',20,'2023-04-26','no','no','po','finish','item_3114287157@qq.com','1'),(1001,'3114287157@qq.com','this is two item',999,'2022.2.1','100%','sugle','101','finish','item_3114287158@qq.com','5'),(1002,'3114287158@qq.com','item 2',111,'2023-05-19','100%','two ','222','selling','item_3114287158@qq.com',NULL),(1004,'3114287157@qq.com','ne',212,'2022-02-02','99%','tree','tree','finish','item_1003','1'),(1005,'3114287158@qq.com','213123',12312,'2023-03-31','3123','123','123123','selling','item_1004',NULL),(1008,'jin.zhou@students.plymouth.ac.uk','item 3',123,'2023-05-03','99%','TREE','TREE','selling','item_1005',NULL),(1010,'jin.zhou@students.plymouth.ac.uk','COMPUTER',123,'2023-05-19','99%','COMPUTER','COMPUTER','selling','item_1009',NULL),(1011,'jin.zhou@students.plymouth.ac.uk','PHONE',1221,'2023-05-12','99%','PHONE','PHONE','selling','item_1010',NULL),(1012,'jin.zhou@students.plymouth.ac.uk','WATER',1,'2023-05-04','99%','WATER','WATER','selling','item_1011',NULL),(1013,'jin.zhou@students.plymouth.ac.uk','MOUSE',2,'2023-05-11','99%','MOUSE','MOUSE','selling','item_1012',NULL),(1014,'jin.zhou@students.plymouth.ac.uk','camera',220,'2023-05-04','79%','camera','camera','selling','item_1013',NULL),(1015,'jin.zhou@students.plymouth.ac.uk','this is Mountain',1,'2023-05-04','20%','Mountain','Mountain','selling','item_1014',NULL),(1016,'jin.zhou@students.plymouth.ac.uk','e',3,'2023-05-12','2','3','3','selling','item_1015',NULL);
/*!40000 ALTER TABLE `item_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_data`
--

DROP TABLE IF EXISTS `user_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `User_name` varchar(255) NOT NULL,
  `User_password` varchar(255) NOT NULL,
  `User_email` varchar(255) NOT NULL,
  `User_phone` varchar(255) NOT NULL,
  `User_address` varchar(255) NOT NULL,
  `User_image` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10012 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_data`
--

LOCK TABLES `user_data` WRITE;
/*!40000 ALTER TABLE `user_data` DISABLE KEYS */;
INSERT INTO `user_data` VALUES (10000,'Jin Zhou','572938','3114287158@qq.com','07536248516','Flat 158, Floor 08, Beckley Point, 39 Cobourg Street,Plymouth, Devon, Plymouth, United Kingdom, PL1 1SP','3114287158@qq.com'),(10001,'haojun huang','1234567890','996711203@qq.com','','','996711203@qq.com'),(10002,'Jerry','572938','3114287157@qq.com','07536248516','Flat 158, Floor 08, Beckley Point, 39 Cobourg Street,Plymouth, Devon, Plymouth, United Kingdom, PL1 1SP','3114287157@qq.com'),(10004,'shuxuan chen','222222','3114287156@qq.com','13128764683','8B Haiyuege, Blcok 4, Jinyuhaoting, Fuyong Road, B','3114287156@qq.com'),(10005,'jin zhou','546681714','13128764683@163.com','','','13128764683@163.com'),(10010,'Jin Zhou','572938','jin.zhou@students.plymouth.ac.uk','07536248516','Flat 158, Floor 08, Beckley Point, 39 Cobourg Street,Plymouth, Devon, Plymouth, United Kingdom, PL1 1SP','jin.zhou@students.plymouth.ac.uk'),(10011,'zixiang zhao','(Nidhogger2002)','zixiang.zhao@students.plymouth.ac.uk','0','0','image');
/*!40000 ALTER TABLE `user_data` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-07 15:38:36
