CREATE TABLE `User` (
  `User_ID` int(10) AUTO_INCREMENT NOT NULL,
  `First_Name` varchar(20) NOT NULL,
  `Last_Name` varchar(20) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `Phone` VARCHAR(15) DEFAULT NULL,
  `Balance` decimal(10,2) DEFAULT 0,
  PRIMARY KEY (`User_ID`),
  UNIQUE KEY `Email`(`Email`)
) ENGINE=InnoDB AUTO_INCREMENT= 1 DEFAULT CHARSET=latin1;

CREATE TABLE `Event` (
  `Event_ID` int(10) AUTO_INCREMENT NOT NULL,
  `Name` varchar(20) NOT NULL,
  `Category` varchar(20) NOT NULL,
  `Location` varchar(10) NOT NULL,
  `Participants` int(10) DEFAULT 1,
  `Total_Expense` decimal(10,2) DEFAULT 0,
  `Event_Share` decimal(10,2) DEFAULT 0,
  `Status_Open` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`Event_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE `User_Event` (
  `User_ID` int(10) NOT NULL,
  `Event_ID` int(10) NOT NULL,
  PRIMARY KEY(`User_ID`,`Event_ID`),
  CONSTRAINT `User_Event_ibfk_1` FOREIGN KEY (`Event_ID`) REFERENCES Event(`Event_ID`) ON DELETE CASCADE, 
  CONSTRAINT `User_Event_ibfk_2` FOREIGN KEY (`User_ID`) REFERENCES User(`User_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Item` (
  `Item_ID` int(10) AUTO_INCREMENT NOT NULL,
  `Description` varchar(15) NOT NULL,
  `Event_ID` int(10) NULL,
  `Payer_ID` int(10) NOT NULL,
  `Quantity` int(10) DEFAULT 0,
  `Invoice_Amount` decimal(10,2) DEFAULT 0,
  PRIMARY KEY (`Item_ID`),
  CONSTRAINT `Item_ibfk_1` FOREIGN KEY (`Event_ID`) REFERENCES Event(`Event_ID`) ON DELETE CASCADE,
  CONSTRAINT `Item_ibfk_2` FOREIGN KEY (`Payer_ID`) REFERENCES User(`User_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

CREATE TABLE `Statement` (
  `Statement_ID` int(10) AUTO_INCREMENT NOT NULL,
  `User_ID` int(10) NOT NULL,
  `Event_ID` int(10) NOT NULL,
  `Event_Paid` decimal(10,2) DEFAULT 0,
  `Event_Balance` decimal(10,2) DEFAULT 0,
  PRIMARY KEY(`Statement_ID`),
  CONSTRAINT `Statement_ibfk_1` FOREIGN KEY (`Event_ID`) REFERENCES Event(`Event_ID`) ON DELETE CASCADE,
  CONSTRAINT `Statement_ibfk_2` FOREIGN KEY (`User_ID`) REFERENCES User(`User_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;