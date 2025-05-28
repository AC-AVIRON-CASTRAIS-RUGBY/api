-- Création de la table Category
CREATE TABLE `Category` (
  `Category_Id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `age_min` int(11) DEFAULT NULL,
  `age_max` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `Tournament_Id` int(11) NOT NULL,
  PRIMARY KEY (`Category_Id`),
  KEY `Tournament_Id` (`Tournament_Id`),
  CONSTRAINT `Category_ibfk_1` FOREIGN KEY (`Tournament_Id`) REFERENCES `Tournament` (`Tournament_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Ajout de la colonne Category_Id à la table Pool
ALTER TABLE `Pool` ADD COLUMN `Category_Id` int(11) DEFAULT NULL;

-- Ajout de la contrainte de clé étrangère
ALTER TABLE `Pool` ADD CONSTRAINT `Pool_ibfk_2` FOREIGN KEY (`Category_Id`) REFERENCES `Category` (`Category_Id`);

-- Insertion des catégories de base pour le tournoi existant
INSERT INTO `Category` (`name`, `age_min`, `age_max`, `description`, `Tournament_Id`) VALUES
('U6', 5, 6, 'Catégorie des moins de 6 ans', 1),
('U8', 7, 8, 'Catégorie des moins de 8 ans', 1),
('U10', 9, 10, 'Catégorie des moins de 10 ans', 1),
('U12', 11, 12, 'Catégorie des moins de 12 ans', 1),
('U14', 13, 14, 'Catégorie des moins de 14 ans', 1),
('U16', 15, 16, 'Catégorie des moins de 16 ans', 1),
('U18', 17, 18, 'Catégorie des moins de 18 ans', 1);

-- Mise à jour des poules existantes avec la catégorie U6
UPDATE `Pool` SET `Category_Id` = 1 WHERE `Pool_Id` IN (1, 2, 3);
