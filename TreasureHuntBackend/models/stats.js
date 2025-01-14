const database = require("../util/database");

module.exports = class Stats {
    constructor(UserId, TotalGuesses, GuessesAllowed, Boxes, WinLose)
    {
        this.userId = UserId;
        this.totalGuesses = TotalGuesses;
        this.guessesAllowed = GuessesAllowed;
        this.boxes = Boxes;
        this.winLose = WinLose;
    }

    static getUserStats(userId) {
        let sql = `SELECT Stats.Id, Stats.UserId, Users.Username, Stats.TotalGuesses, Stats.GuessesAllowed, Stats.Boxes, Stats.WinLose 
        FROM Stats JOIN Users ON Stats.UserId = Users.Id WHERE UserId = ? ORDER BY Stats.Id Desc LIMIT 10;`;

        let args = [userId];

        return database.execute(sql, args);
    }

    static getAllUserStats() {
        let sql = `SELECT Stats.Id, Users.Username, Stats.TotalGuesses, Stats.GuessesAllowed, Stats.Boxes, Stats.WinLose
        FROM Stats JOIN Users ON Stats.UserId = Users.Id ORDER BY Stats.Id Desc LIMIT 10;`;

        return database.execute(sql);
    }

    static getRankedStats() {
        let sql = `SELECT Users.Username, 
        COUNT(CASE WHEN Stats.WinLose = "W" THEN 1 ELSE NULL END) AS TotalWins,
        COUNT(CASE WHEN Stats.WinLose = "L" THEN 1 ELSE NULL END) AS TotalLosses
        FROM Stats JOIN Users ON Stats.UserId = Users.Id GROUP BY Stats.UserId ORDER BY TotalWins Desc LIMIT 10;`;

        return database.execute(sql);
    }

    static saveStats(stats) {
        let sql = `INSERT INTO Stats (UserId, TotalGuesses, GuessesAllowed, Boxes, WinLose)
        VALUES (?, ?, ?, ?, ?);`;

        let args = [stats.userId, stats.totalGuesses, stats.guessesAllowed, stats.boxes, stats.winLose];

        return database.execute(sql, args);
    }

    static updateSettings(userId, guessesAllowed, boxes) {
        let sql = `UPDATE Users SET GuessesAllowed = ?, Boxes = ? WHERE Id = ?;`;

        let args = [guessesAllowed, boxes, userId];

        return database.execute(sql, args);
    }

    static getSettings(userId) {
        let sql = `SELECT GuessesAllowed, Boxes FROM Users
        WHERE Id = ?;`;

        let args = [userId];

        return database.execute(sql, args);
    }
};