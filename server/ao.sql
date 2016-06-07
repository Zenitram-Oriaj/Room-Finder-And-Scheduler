-- MySQL dump 10.13  Distrib 5.6.19, for osx10.7 (i386)
--
-- Host: 127.0.0.1    Database: agileoffice-gateway
-- ------------------------------------------------------
-- Server version	5.6.21

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
-- Table structure for table `analytics`
--

DROP TABLE IF EXISTS `analytics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `analytics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `controllerEvents`
--

DROP TABLE IF EXISTS `controllerEvents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `controllerEvents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(45) DEFAULT '0',
  `event` varchar(45) DEFAULT 'WAITING',
  `state` varchar(45) DEFAULT 'unknown',
  `duration` varchar(45) DEFAULT '00:00:00',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `controllers`
--

DROP TABLE IF EXISTS `controllers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `controllers` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(128) DEFAULT NULL,
  `workspaceUuid` varchar(45) DEFAULT NULL,
  `workspaceName` varchar(100) DEFAULT NULL,
  `floorId` varchar(45) DEFAULT NULL,
  `locationId` varchar(45) DEFAULT NULL,
  `regionId` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `ip` varchar(32) DEFAULT NULL,
  `port` int(11) DEFAULT '0',
  `firmware` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT 'OFFLINE',
  `uptime` varchar(45) DEFAULT '0',
  `prevUptime` varchar(45) DEFAULT '0',
  `lapseCount` int(11) DEFAULT '0',
  `rebootCount` int(11) DEFAULT '0',
  `autoReboot` int(11) DEFAULT NULL,
  `rebootAt` datetime DEFAULT NULL,
  `state` int(11) DEFAULT '0',
  `prevState` int(11) DEFAULT '0',
  `timeout` int(11) DEFAULT '30',
  `password` varchar(45) DEFAULT 'BOI',
  `mode` varchar(45) DEFAULT 'A',
  `gw` varchar(45) DEFAULT NULL,
  `subnet` varchar(45) DEFAULT NULL,
  `dns` varchar(45) DEFAULT NULL,
  `heartbeat` int(11) DEFAULT '0',
  `heartbeatAt` datetime DEFAULT NULL,
  `prevHeartbeatAt` datetime DEFAULT NULL,
  `eventAt` datetime DEFAULT NULL,
  `prevEventAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `discovers`
--

DROP TABLE IF EXISTS `discovers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `discovers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(45) DEFAULT 'undefined',
  `host` varchar(100) DEFAULT 'undefined',
  `fullName` varchar(255) DEFAULT 'undefined',
  `typeName` varchar(45) DEFAULT 'undefined',
  `typeProtocol` varchar(45) DEFAULT 'undefined',
  `typeDev` varchar(45) DEFAULT 'IPS',
  `port` int(11) DEFAULT '0',
  `addresses` varchar(100) DEFAULT '0.0.0.0',
  `status` varchar(45) DEFAULT 'undefined',
  `configured` varchar(45) DEFAULT 'undefined',
  `configuredAt` datetime DEFAULT NULL,
  `added` varchar(45) DEFAULT 'undefined',
  `addedAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `floors`
--

DROP TABLE IF EXISTS `floors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `floors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(45) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `floorId` varchar(45) DEFAULT NULL,
  `locationId` varchar(45) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(45) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `latitude` varchar(45) DEFAULT NULL,
  `longitude` varchar(45) DEFAULT NULL,
  `regionId` varchar(45) DEFAULT NULL,
  `timeZoneId` varchar(45) DEFAULT NULL,
  `tzOffset` int(11) DEFAULT NULL,
  `dst` int(11) DEFAULT '1',
  `floors` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `to` varchar(45) DEFAULT NULL,
  `from` varchar(45) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `subject` varchar(100) DEFAULT NULL,
  `body` varchar(2048) DEFAULT NULL,
  `attachment` varchar(2048) DEFAULT NULL,
  `read` int(11) DEFAULT '0',
  `reply` int(11) DEFAULT '0',
  `delete` int(11) DEFAULT '0',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pcmonitors`
--

DROP TABLE IF EXISTS `pcmonitors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pcmonitors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dateTime` datetime NOT NULL,
  `uptime` varchar(45) DEFAULT NULL,
  `hddinfo` varchar(45) DEFAULT NULL,
  `hddlevel` varchar(45) DEFAULT NULL,
  `hddpcnt` int(11) DEFAULT NULL,
  `meminfo` varchar(45) DEFAULT NULL,
  `memlevel` varchar(45) DEFAULT NULL,
  `mempcnt` int(11) DEFAULT NULL,
  `cpuinfo` varchar(45) DEFAULT NULL,
  `cpulevel` varchar(45) DEFAULT NULL,
  `cpupcnt` int(11) DEFAULT NULL,
  `swpinfo` varchar(45) DEFAULT NULL,
  `swplevel` varchar(45) DEFAULT NULL,
  `swppcnt` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `regions`
--

DROP TABLE IF EXISTS `regions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `regions` (
  `id` int(11) NOT NULL,
  `uuid` varchar(45) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reservations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reservationId` int(11) NOT NULL,
  `resourceId` int(11) NOT NULL,
  `description` varchar(100) DEFAULT 'Not Avaialble',
  `notes` varchar(100) DEFAULT 'Not Avaialble',
  `startTime` varchar(45) DEFAULT NULL,
  `stopTime` varchar(45) DEFAULT NULL,
  `duration` bigint(20) DEFAULT NULL,
  `createdById` int(11) DEFAULT NULL,
  `createdByName` varchar(100) DEFAULT 'Not Avaialble',
  `createdForId` int(11) DEFAULT '0',
  `createdForName` varchar(100) DEFAULT 'Not Available',
  `numOfAttendees` int(11) DEFAULT '0',
  `attendeeList` varchar(2048) DEFAULT NULL,
  `timeZoneId` varchar(45) DEFAULT NULL,
  `tzOffset` int(11) DEFAULT '0',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rsusers`
--

DROP TABLE IF EXISTS `rsusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rsusers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT '0',
  `fullName` varchar(45) DEFAULT 'undefined',
  `email` varchar(100) DEFAULT 'undefined',
  `phone` varchar(45) DEFAULT 'undefined',
  `department` varchar(100) DEFAULT 'undefined',
  `alias` varchar(45) DEFAULT 'undefined',
  `defaultGroupId` int(11) DEFAULT '0',
  `defaultLocationId` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `systemlogs`
--

DROP TABLE IF EXISTS `systemlogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `systemlogs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dateTime` datetime DEFAULT NULL,
  `level` varchar(45) DEFAULT 'error',
  `lblLevel` varchar(45) DEFAULT 'danger',
  `event` varchar(45) DEFAULT 'unknown',
  `lblEvent` varchar(45) DEFAULT 'default',
  `message` varchar(128) DEFAULT '...',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tokens`
--

DROP TABLE IF EXISTS `tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) DEFAULT NULL,
  `token` varchar(255) NOT NULL,
  `status` varchar(45) DEFAULT 'inactive',
  `expiresAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `touchpanels`
--

DROP TABLE IF EXISTS `touchpanels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `touchpanels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(45) DEFAULT NULL,
  `description` varchar(45) DEFAULT NULL,
  `config` varchar(2048) DEFAULT NULL,
  `reserveId` int(11) DEFAULT '0',
  `floorId` varchar(45) DEFAULT NULL,
  `locationId` varchar(45) DEFAULT NULL,
  `regionId` varchar(45) DEFAULT NULL,
  `os` varchar(255) DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `ssh` varchar(45) DEFAULT 'OFFLINE',
  `sshPort` int(11) DEFAULT '9922',
  `status` varchar(45) DEFAULT 'OFFLINE',
  `uptime` varchar(45) DEFAULT NULL,
  `prevUptime` varchar(45) DEFAULT NULL,
  `rebootCount` int(11) DEFAULT NULL,
  `rebootAt` datetime DEFAULT NULL,
  `heartbeatAt` datetime DEFAULT NULL,
  `prevHeartbeatAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userTypes`
--

DROP TABLE IF EXISTS `userTypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userTypes` (
  `id` int(11) NOT NULL,
  `level` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `level_UNIQUE` (`level`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userTypes`
--

LOCK TABLES `userTypes` WRITE;
/*!40000 ALTER TABLE `userTypes` DISABLE KEYS */;
INSERT INTO `userTypes` VALUES (1,0,'Guest','View Dashboard Only'),(2,1,'User','Can View Only'),(3,2,'Installer','Can Add/Modify Workspaces And Controllers'),(4,3,'Manager','Can Add/Modify/Delete Workspaces And Controllers'),(5,4,'Administrator','Full System Access');
/*!40000 ALTER TABLE `userTypes` ENABLE KEYS */;
UNLOCK TABLES;
--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userName` varchar(45) DEFAULT NULL,
  `accessLevel` int(11) DEFAULT '1',
  `admin` int(11) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `firstName` varchar(45) DEFAULT NULL,
  `lastName` varchar(45) DEFAULT NULL,
  `title` varchar(45) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `agree` int(11) DEFAULT '0',
  `loginCount` int(11) DEFAULT NULL,
  `lastLoginAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin',4,1,'admin@agileoffice.com','$2a$10$7HQI.WJuw6VTfCd5Qn.4Y.HFz9ZoyfVLGctNiw/kiag1p0TGyIAja','Admin','AgileOffice','Administrator','9378593100',1,4,'2015-06-29 09:28:40','2014-10-10 09:26:53','2015-06-29 09:28:40'),(2,'jmartinez',4,0,'jmartinez@boisolutions.com','$2a$10$ns9Plkqv9i0PuEQJ/ekbyuUuSYAkkUSwGyLRO2rwLHN5tilvSBj4S','Jairo','Martinez','Lead Systems Developer','7029971976',0,70,'2015-08-11 13:38:30','2014-12-01 17:41:44','2015-08-11 13:38:30');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wayfinders`
--

DROP TABLE IF EXISTS `wayfinders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wayfinders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(45) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `config` varchar(2048) DEFAULT NULL,
  `reserveId` int(11) DEFAULT '0',
  `floorId` varchar(45) DEFAULT NULL,
  `locationId` varchar(45) DEFAULT NULL,
  `regionId` varchar(45) DEFAULT NULL,
  `os` varchar(255) DEFAULT NULL,
  `ip` varchar(45) DEFAULT NULL,
  `ssh` varchar(45) DEFAULT 'OFFLINE',
  `sshPort` int(11) DEFAULT '9922',
  `status` varchar(45) DEFAULT 'OFFLINE',
  `uptime` varchar(45) DEFAULT NULL,
  `prevUptime` varchar(45) DEFAULT NULL,
  `rebootCount` int(11) DEFAULT NULL,
  `rebootAt` datetime DEFAULT NULL,
  `heartbeatAt` datetime DEFAULT NULL,
  `prevHeartbeatAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `workspaceTypes`
--

DROP TABLE IF EXISTS `workspaceTypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `workspaceTypes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idx` int(11) DEFAULT '0',
  `name` varchar(45) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workspaceTypes`
--

LOCK TABLES `workspaceTypes` WRITE;
/*!40000 ALTER TABLE `workspaceTypes` DISABLE KEYS */;
INSERT INTO `workspaceTypes` VALUES (1,0,'Not Listed','No Room Type Selected'),(2,1,'Conference','Larger Room With More Than 7 Seats'),(3,2,'Huddle','Small Room With 2 to 5 Seats'),(4,3,'Training','Large Room with several seats'),(5,4,'Boardroom','Large Room with 12 or more seats'),(6,5,'Cubicle','temp'),(7,6,'Open Area','Many Workspaces Collected Together'),(8,7,'Executive','Medium Size Room For Executive Meetings');
/*!40000 ALTER TABLE `workspaceTypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workspaces`
--

DROP TABLE IF EXISTS `workspaces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `workspaces` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(12) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `type` int(11) DEFAULT '0',
  `description` varchar(100) DEFAULT NULL,
  `status` int(11) DEFAULT '0',
  `reservable` int(11) DEFAULT '0',
  `reserveId` int(11) DEFAULT '0',
  `scheduled` int(11) DEFAULT '0',
  `allowLocal` int(11) DEFAULT '1',
  `floorId` varchar(45) DEFAULT NULL,
  `locationId` varchar(45) DEFAULT NULL,
  `regionId` varchar(45) DEFAULT NULL,
  `timeZoneId` varchar(45) DEFAULT NULL,
  `tzOffset` int(11) DEFAULT '0',
  `dst` int(11) DEFAULT '1',
  `svgType` varchar(45) DEFAULT 'polygon',
  `points` varchar(512) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid_UNIQUE` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-08-13  6:53:33
