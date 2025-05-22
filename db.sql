-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : jeu. 22 mai 2025 à 16:58
-- Version du serveur : 10.11.11-MariaDB-0ubuntu0.24.04.2
-- Version de PHP : 8.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `acr`
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

--
-- Déchargement des données de la table `Account`
--

INSERT INTO `Account` (`Account_Id`, `username`, `password`, `is_admin`) VALUES
    (1, 'admin', '$2b$10$AobFC/EUx1VHp1mzc0Db8OYzeLr2Bh3rdiZtu9RHpoJV5YfBSDJ16', 1);

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

--
-- Déchargement des données de la table `Game`
--

INSERT INTO `Game` (`Game_Id`, `start_time`, `Team1_Id`, `Team2_Id`, `Team1_Score`, `Team2_Score`, `is_completed`, `Referee_Id`, `Pool_Id`, `Field_Id`, `Tournament_Id`) VALUES
    (1, NULL, 10, 4, 0, 0, 0, 2, 1, NULL, 1);

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

--
-- Déchargement des données de la table `Phase`
--

INSERT INTO `Phase` (`Phase_Id`, `name`, `Tournament_Id`) VALUES
    (1, 'Phase 1', 1);

-- --------------------------------------------------------

--
-- Structure de la table `Pool`
--

CREATE TABLE `Pool` (
                        `Pool_Id` int(11) NOT NULL,
                        `name` varchar(50) DEFAULT NULL,
                        `Phase_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Déchargement des données de la table `Pool`
--

INSERT INTO `Pool` (`Pool_Id`, `name`, `Phase_Id`) VALUES
                                                       (1, 'Poule A', 1),
                                                       (2, 'Poule B', 1),
                                                       (3, 'Poule C', 1);

-- --------------------------------------------------------

--
-- Structure de la table `PoolTeam`
--

CREATE TABLE `PoolTeam` (
                            `PoolTeam_Id` int(11) NOT NULL,
                            `Pool_Id` int(11) NOT NULL,
                            `Team_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Déchargement des données de la table `PoolTeam`
--

INSERT INTO `PoolTeam` (`PoolTeam_Id`, `Pool_Id`, `Team_Id`) VALUES
                                                                 (1, 1, 4),
                                                                 (2, 1, 5),
                                                                 (3, 1, 6),
                                                                 (4, 1, 7),
                                                                 (5, 1, 8),
                                                                 (6, 2, 9),
                                                                 (7, 2, 10),
                                                                 (8, 2, 11),
                                                                 (9, 2, 12);

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

--
-- Déchargement des données de la table `Referee`
--

INSERT INTO `Referee` (`Referee_Id`, `last_name`, `first_name`, `loginUUID`, `password`, `Tournament_Id`) VALUES
                                                                                                              (1, 'RARCHAERT', 'Alexis', 'admin', '', 1),
                                                                                                              (2, 'VERNHET', 'Ludwig', 'ludwig', '', 1);

-- --------------------------------------------------------

--
-- Structure de la table `Team`
--

CREATE TABLE `Team` (
                        `Team_Id` int(11) NOT NULL,
                        `name` varchar(50) DEFAULT NULL,
                        `logo` text DEFAULT NULL,
                        `age_category` varchar(50) DEFAULT NULL,
                        `Tournament_Id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Déchargement des données de la table `Team`
--

INSERT INTO `Team` (`Team_Id`, `name`, `logo`, `age_category`, `Tournament_Id`) VALUES
                                                                                    (4, 'CASTRES OLYMPIQUE', NULL, 'U6', 1),
                                                                                    (5, 'RC QUINT FONSEGRIVE', NULL, 'U6', 1),
                                                                                    (6, 'SOR AGOUT XV', NULL, 'U6', 1),
                                                                                    (7, 'CBMR-SOR', NULL, 'U6', 1),
                                                                                    (8, 'USV', NULL, 'U6', 1),
                                                                                    (9, 'SOR AGOUT XV 2', NULL, 'U6', 1),
                                                                                    (10, 'AVIRON CASTRAIS', NULL, 'U6', 1),
                                                                                    (11, 'OLYMPIQUE MONTREDONNAIS', NULL, 'U6', 1),
                                                                                    (12, 'PUYLAURENS AC', NULL, 'U6', 1);

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
                              `game_duration` tinyint(4) DEFAULT NULL,
                              `break_time` tinyint(4) DEFAULT NULL,
                              `Referee_Id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Déchargement des données de la table `Tournament`
--

INSERT INTO `Tournament` (`Tournament_Id`, `name`, `description`, `image`, `start_date`, `location`, `game_duration`, `break_time`, `Referee_Id`) VALUES
    (1, 'Coupe de France', 'Bienvenue sur le tournoi de l’Aviron Castrais !\n
Retrouvez ici toutes les informations essentielles : répartition des équipes, matchs, horaires, résultats en temps réel et bien plus. Suivez le déroulement de la journée, catégorie par catégorie, pour ne rien manquer du spectacle !', 'https://static01.nyt.com/images/2023/09/06/multimedia/06sp-rugby-pools-inyt-01-wcgp/06sp-rugby-pools-inyt-01-wcgp-videoSixteenByNine3000.jpg', '2025-06-07 10:00:00', 'Borde Basse, Castres, Tarn', 10, 5, 1);

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
-- Index pour la table `Pool`
--
ALTER TABLE `Pool`
    ADD PRIMARY KEY (`Pool_Id`),
  ADD KEY `Phase_Id` (`Phase_Id`);

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
    MODIFY `Account_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `Field`
--
ALTER TABLE `Field`
    MODIFY `Field_Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Game`
--
ALTER TABLE `Game`
    MODIFY `Game_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `LockerRoom`
--
ALTER TABLE `LockerRoom`
    MODIFY `LockerRoom_Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Phase`
--
ALTER TABLE `Phase`
    MODIFY `Phase_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `Pool`
--
ALTER TABLE `Pool`
    MODIFY `Pool_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `PoolTeam`
--
ALTER TABLE `PoolTeam`
    MODIFY `PoolTeam_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `Referee`
--
ALTER TABLE `Referee`
    MODIFY `Referee_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `Team`
--
ALTER TABLE `Team`
    MODIFY `Team_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `Tournament`
--
ALTER TABLE `Tournament`
    MODIFY `Tournament_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Contraintes pour les tables déchargées
--

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
-- Contraintes pour la table `Pool`
--
ALTER TABLE `Pool`
    ADD CONSTRAINT `Pool_ibfk_1` FOREIGN KEY (`Phase_Id`) REFERENCES `Phase` (`Phase_Id`);

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
