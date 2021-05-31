CREATE TABLE `MATERIAL_PROD` (
  `prodmat_id` int NOT NULL AUTO_INCREMENT,
  `m_id_materialstype` varchar(1) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `ppml` int DEFAULT NULL,
  `whitness` float DEFAULT NULL,
  `viscosity` float DEFAULT NULL,
  `absorbency` float DEFAULT NULL,
  `chargen_nr` int DEFAULT NULL,
  `RES_QTY` int DEFAULT NULL,
  `hexcolor` varchar(20) DEFAULT NULL,
  `delta_e` float DEFAULT NULL,
  `status` int DEFAULT NULL,
  PRIMARY KEY (`prodmat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci