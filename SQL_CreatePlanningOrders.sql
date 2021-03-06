CREATE TABLE `PLANNING_ORDERS` (
  `O_NR` bigint NOT NULL,
  `OI_NR` int NOT NULL,
  `PO_CODE` char(1) NOT NULL,
  `PO_COUNTER` int NOT NULL,
  `O_DATE` datetime DEFAULT NULL,
  `CUSTOMER_TYPE` char(1) DEFAULT NULL,
  `QUANTITY` int DEFAULT NULL,
  `PROD_STATUS` int DEFAULT NULL,
  `MAT_NR` int DEFAULT NULL,
  `C` double DEFAULT NULL,
  `M` double DEFAULT NULL,
  `Y` double DEFAULT NULL,
  `K` double DEFAULT NULL,
  `HEXCOLOR` varchar(20) DEFAULT NULL,
  `PROD_PRIO` int DEFAULT NULL,
  `IMAGE` varchar(150) DEFAULT NULL,
  `END_DATE` datetime DEFAULT NULL,
  `p_nr` int NOT NULL,
  `DELTA_E` float DEFAULT NULL,
  PRIMARY KEY (`O_NR`,`OI_NR`,`PO_CODE`,`PO_COUNTER`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci