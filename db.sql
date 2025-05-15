CREATE TABLE Tournament (
    Tournament_Id INT AUTO_INCREMENT,
    name VARCHAR(50),
    description TEXT,
    start_date DATETIME,
    location VARCHAR(50),
    game_duration TINYINT,
    break_time TINYINT,
    PRIMARY KEY (Tournament_Id)
);

CREATE TABLE Referee (
    Referee_Id INT AUTO_INCREMENT,
    last_name VARCHAR(50),
    first_name VARCHAR(50),
    PRIMARY KEY (Referee_Id)
);

CREATE TABLE Phase (
    Phase_Id INT AUTO_INCREMENT,
    name VARCHAR(50),
    Tournament_Id INT NOT NULL,
    PRIMARY KEY (Phase_Id),
    FOREIGN KEY (Tournament_Id) REFERENCES Tournament(Tournament_Id)
);

CREATE TABLE Pool (
    Pool_Id INT AUTO_INCREMENT,
    name VARCHAR(50),
    Phase_Id INT NOT NULL,
    PRIMARY KEY (Pool_Id),
    FOREIGN KEY (Phase_Id) REFERENCES Phase(Phase_Id)
);

CREATE TABLE Team (
    Team_Id INT AUTO_INCREMENT,
    name VARCHAR(50),
    logo TEXT,
    age_category VARCHAR(50),
    Pool_Id INT NOT NULL,
    Tournament_Id INT NOT NULL,
    PRIMARY KEY (Team_Id),
    FOREIGN KEY (Pool_Id) REFERENCES Pool(Pool_Id),
    FOREIGN KEY (Tournament_Id) REFERENCES Tournament(Tournament_Id)
);

CREATE TABLE Game (
    Game_Id INT AUTO_INCREMENT,
    start_time DATETIME,
    wins TINYINT,
    losses TINYINT,
    draws TINYINT,
    Team1_Id INT NOT NULL,
    Team2_Id INT NOT NULL,
    Referee_Id INT NOT NULL,
    Pool_Id INT NOT NULL,
    PRIMARY KEY (Game_Id),
    FOREIGN KEY (Team1_Id) REFERENCES Team(Team_Id),
    FOREIGN KEY (Team2_Id) REFERENCES Team(Team_Id),
    FOREIGN KEY (Referee_Id) REFERENCES Referee(Referee_Id),
    FOREIGN KEY (Pool_Id) REFERENCES Pool(Pool_Id)
);

CREATE TABLE LockerRoom (
    LockerRoom_Id INT AUTO_INCREMENT,
    number VARCHAR(50),
    Team_Id INT NOT NULL,
    PRIMARY KEY (LockerRoom_Id),
    UNIQUE (Team_Id),
    FOREIGN KEY (Team_Id) REFERENCES Team(Team_Id)
);