-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : jeu. 05 juin 2025 à 19:59
-- Version du serveur : 10.11.13-MariaDB-0ubuntu0.24.04.1
-- Version de PHP : 8.4.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `avironcastrais`
--

-- --------------------------------------------------------

--
-- Structure de la table `Account`
--

CREATE TABLE `Account` (
  `Account_Id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Category`
--

CREATE TABLE `Category` (
  `Category_Id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `age_min` int(11) DEFAULT NULL,
  `age_max` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `Tournament_Id` int(11) NOT NULL,
  `game_duration` tinyint(4) DEFAULT 10
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Field`
--

CREATE TABLE `Field` (
  `Field_Id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `Tournament_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Game`
--

CREATE TABLE `Game` (
  `Game_Id` int(11) NOT NULL,
  `start_time` datetime DEFAULT NULL,
  `Team1_Id` int(11) NOT NULL,
  `Team2_Id` int(11) NOT NULL,
  `Team1_Score` int(11) DEFAULT 0,
  `Team2_Score` int(11) DEFAULT 0,
  `is_completed` tinyint(1) DEFAULT 0,
  `Referee_Id` int(11) NOT NULL,
  `Pool_Id` int(11) NOT NULL,
  `Field_Id` int(11) DEFAULT NULL,
  `Tournament_Id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `LockerRoom`
--

CREATE TABLE `LockerRoom` (
  `LockerRoom_Id` int(11) NOT NULL,
  `number` varchar(50) DEFAULT NULL,
  `Team_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Phase`
--

CREATE TABLE `Phase` (
  `Phase_Id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `Tournament_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Player`
--

CREATE TABLE `Player` (
  `Player_Id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `number` int(11) DEFAULT NULL,
  `position` varchar(50) DEFAULT NULL,
  `Team_Id` int(11) NOT NULL,
  `present` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Pool`
--

CREATE TABLE `Pool` (
  `Pool_Id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `Phase_Id` int(11) NOT NULL,
  `Category_Id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `PoolTeam`
--

CREATE TABLE `PoolTeam` (
  `PoolTeam_Id` int(11) NOT NULL,
  `Pool_Id` int(11) NOT NULL,
  `Team_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Referee`
--

CREATE TABLE `Referee` (
  `Referee_Id` int(11) NOT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `loginUUID` varchar(36) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `Tournament_Id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Team`
--

CREATE TABLE `Team` (
  `Team_Id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `logo` text DEFAULT NULL,
  `age_category` varchar(50) DEFAULT NULL,
  `Tournament_Id` int(11) NOT NULL,
  `paid` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Tournament`
--

CREATE TABLE `Tournament` (
  `Tournament_Id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` text DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `location` varchar(50) DEFAULT NULL,
  `break_time` tinyint(4) DEFAULT 5,
  `Referee_Id` int(11) DEFAULT NULL,
  `points_win` int(11) DEFAULT 3,
  `points_draw` int(11) DEFAULT 1,
  `points_loss` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Account`
--
ALTER TABLE `Account`
  ADD PRIMARY KEY (`Account_Id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Index pour la table `Category`
--
ALTER TABLE `Category`
  ADD PRIMARY KEY (`Category_Id`),
  ADD KEY `Tournament_Id` (`Tournament_Id`);

--
-- Index pour la table `Field`
--
ALTER TABLE `Field`
  ADD PRIMARY KEY (`Field_Id`),
  ADD KEY `Tournament_Id` (`Tournament_Id`);

--
-- Index pour la table `Game`
--
ALTER TABLE `Game`
  ADD PRIMARY KEY (`Game_Id`),
  ADD KEY `Team1_Id` (`Team1_Id`),
  ADD KEY `Team2_Id` (`Team2_Id`),
  ADD KEY `Referee_Id` (`Referee_Id`),
  ADD KEY `Pool_Id` (`Pool_Id`),
  ADD KEY `Field_Id` (`Field_Id`),
  ADD KEY `fk_tournament_game` (`Tournament_Id`);

--
-- Index pour la table `LockerRoom`
--
ALTER TABLE `LockerRoom`
  ADD PRIMARY KEY (`LockerRoom_Id`),
  ADD UNIQUE KEY `Team_Id` (`Team_Id`);

--
-- Index pour la table `Phase`
--
ALTER TABLE `Phase`
  ADD PRIMARY KEY (`Phase_Id`),
  ADD KEY `Tournament_Id` (`Tournament_Id`);

--
-- Index pour la table `Player`
--
ALTER TABLE `Player`
  ADD PRIMARY KEY (`Player_Id`),
  ADD KEY `Team_Id` (`Team_Id`);

--
-- Index pour la table `Pool`
--
ALTER TABLE `Pool`
  ADD PRIMARY KEY (`Pool_Id`),
  ADD KEY `Phase_Id` (`Phase_Id`),
  ADD KEY `Pool_ibfk_2` (`Category_Id`);

--
-- Index pour la table `PoolTeam`
--
ALTER TABLE `PoolTeam`
  ADD PRIMARY KEY (`PoolTeam_Id`),
  ADD UNIQUE KEY `Pool_Id` (`Pool_Id`,`Team_Id`),
  ADD KEY `Team_Id` (`Team_Id`);

--
-- Index pour la table `Referee`
--
ALTER TABLE `Referee`
  ADD PRIMARY KEY (`Referee_Id`),
  ADD UNIQUE KEY `loginUUID` (`loginUUID`),
  ADD KEY `fk_referee_tournament` (`Tournament_Id`);

--
-- Index pour la table `Team`
--
ALTER TABLE `Team`
  ADD PRIMARY KEY (`Team_Id`),
  ADD KEY `Tournament_Id` (`Tournament_Id`);

--
-- Index pour la table `Tournament`
--
ALTER TABLE `Tournament`
  ADD PRIMARY KEY (`Tournament_Id`),
  ADD KEY `Referee_Id` (`Referee_Id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `Account`
--
ALTER TABLE `Account`
  MODIFY `Account_Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Category`
--
ALTER TABLE `Category`
  MODIFY `Category_Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Field`
--
ALTER TABLE `Field`
  MODIFY `Field_Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Game`
--
ALTER TABLE `Game`
  MODIFY `Game_Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `LockerRoom`
--
ALTER TABLE `LockerRoom`
  MODIFY `LockerRoom_Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Phase`
--
ALTER TABLE `Phase`
  MODIFY `Phase_Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Player`
--
ALTER TABLE `Player`
  MODIFY `Player_Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Pool`
--
ALTER TABLE `Pool`
  MODIFY `Pool_Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `PoolTeam`
--
ALTER TABLE `PoolTeam`
  MODIFY `PoolTeam_Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Referee`
--
ALTER TABLE `Referee`
  MODIFY `Referee_Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Team`
--
ALTER TABLE `Team`
  MODIFY `Team_Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Tournament`
--
ALTER TABLE `Tournament`
  MODIFY `Tournament_Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `Category`
--
ALTER TABLE `Category`
  ADD CONSTRAINT `Category_ibfk_1` FOREIGN KEY (`Tournament_Id`) REFERENCES `Tournament` (`Tournament_Id`);

--
-- Contraintes pour la table `Field`
--
ALTER TABLE `Field`
  ADD CONSTRAINT `Field_ibfk_1` FOREIGN KEY (`Tournament_Id`) REFERENCES `Tournament` (`Tournament_Id`);

--
-- Contraintes pour la table `Game`
--
ALTER TABLE `Game`
  ADD CONSTRAINT `Game_ibfk_1` FOREIGN KEY (`Team1_Id`) REFERENCES `Team` (`Team_Id`),
  ADD CONSTRAINT `Game_ibfk_2` FOREIGN KEY (`Team2_Id`) REFERENCES `Team` (`Team_Id`),
  ADD CONSTRAINT `Game_ibfk_3` FOREIGN KEY (`Referee_Id`) REFERENCES `Referee` (`Referee_Id`),
  ADD CONSTRAINT `Game_ibfk_4` FOREIGN KEY (`Pool_Id`) REFERENCES `Pool` (`Pool_Id`),
  ADD CONSTRAINT `Game_ibfk_5` FOREIGN KEY (`Field_Id`) REFERENCES `Field` (`Field_Id`),
  ADD CONSTRAINT `fk_tournament_game` FOREIGN KEY (`Tournament_Id`) REFERENCES `Tournament` (`Tournament_Id`);

--
-- Contraintes pour la table `LockerRoom`
--
ALTER TABLE `LockerRoom`
  ADD CONSTRAINT `LockerRoom_ibfk_1` FOREIGN KEY (`Team_Id`) REFERENCES `Team` (`Team_Id`);

--
-- Contraintes pour la table `Phase`
--
ALTER TABLE `Phase`
  ADD CONSTRAINT `Phase_ibfk_1` FOREIGN KEY (`Tournament_Id`) REFERENCES `Tournament` (`Tournament_Id`);

--
-- Contraintes pour la table `Player`
--
ALTER TABLE `Player`
  ADD CONSTRAINT `Player_ibfk_1` FOREIGN KEY (`Team_Id`) REFERENCES `Team` (`Team_Id`);

--
-- Contraintes pour la table `Pool`
--
ALTER TABLE `Pool`
  ADD CONSTRAINT `Pool_ibfk_1` FOREIGN KEY (`Phase_Id`) REFERENCES `Phase` (`Phase_Id`),
  ADD CONSTRAINT `Pool_ibfk_2` FOREIGN KEY (`Category_Id`) REFERENCES `Category` (`Category_Id`);

--
-- Contraintes pour la table `PoolTeam`
--
ALTER TABLE `PoolTeam`
  ADD CONSTRAINT `PoolTeam_ibfk_1` FOREIGN KEY (`Pool_Id`) REFERENCES `Pool` (`Pool_Id`),
  ADD CONSTRAINT `PoolTeam_ibfk_2` FOREIGN KEY (`Team_Id`) REFERENCES `Team` (`Team_Id`);

--
-- Contraintes pour la table `Referee`
--
ALTER TABLE `Referee`
  ADD CONSTRAINT `fk_referee_tournament` FOREIGN KEY (`Tournament_Id`) REFERENCES `Tournament` (`Tournament_Id`);

--
-- Contraintes pour la table `Team`
--
ALTER TABLE `Team`
  ADD CONSTRAINT `Team_ibfk_2` FOREIGN KEY (`Tournament_Id`) REFERENCES `Tournament` (`Tournament_Id`);

--
-- Contraintes pour la table `Tournament`
--
ALTER TABLE `Tournament`
  ADD CONSTRAINT `Tournament_ibfk_1` FOREIGN KEY (`Referee_Id`) REFERENCES `Referee` (`Referee_Id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
