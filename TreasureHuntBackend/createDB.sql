DROP DATABASE IF EXISTS TreasureHunt;

CREATE DATABASE TreasureHunt;

USE TreasureHunt;

CREATE TABLE SecurityQuestions
(
    Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Question VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO SecurityQuestions(Question) VALUES
    ("What city were you born in?"),
    ("What is your oldest sibling's middle name?"),
    ("What was the first concert you attended?"),
    ("What was the make and model of your first car?"),
    ("In what city or town did your parents meet?"),
    ("What was the first exam you failed?"),
    ("What was the name of your first stuffed animal?"),
    ("What is the middle name of your youngest child?"),
    ("Where were you when you had your first kiss?"),
    ("In what city or town did you meet your spouse/significant other?");

CREATE TABLE Users
(
    Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(255) UNIQUE NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    GuessesAllowed Numeric,
    Boxes Numeric,
    SecurityQuestionOne INT NOT NULL,
    SecurityQuestionTwo INT NOT NULL,
    SecurityAnswerHashOne VARCHAR(255) NOT NULL,
    SecurityAnswerHashTwo VARCHAR(255) NOT NULL,
    FOREIGN KEY (SecurityQuestionOne) REFERENCES SecurityQuestions(Id),
    FOREIGN KEY (SecurityQuestionTwo) REFERENCES SecurityQuestions(Id)
);

CREATE TABLE Stats
(
    Id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    UserId INT NOT NULL,
    TotalGuesses NUMERIC,
    GuessesAllowed NUMERIC,
    Boxes Numeric,
    WinLose VARCHAR(1),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);