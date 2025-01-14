const database = require("../util/database");

module.exports = class Users {
    constructor(Username, Email, PasswordHash, GuessesAllowed, Boxes, SecurityQuestionOne, SecurityQuestionTwo, SecurityAnswerHashOne, SecurityAnswerHashTwo) {
        this.username = Username;
        this.email = Email;
        this.password = PasswordHash;
        this.guessesAllowed = GuessesAllowed;
        this.boxes = Boxes;
        this.securityQuestionOne = SecurityQuestionOne;
        this.securityQuestionTwo = SecurityQuestionTwo;
        this.securityAnswerOne = SecurityAnswerHashOne;
        this.securityAnswerTwo = SecurityAnswerHashTwo;
    }

    static findEmail(email) {
        let sql = `SELECT * FROM Users WHERE Email = ?;`;
        let args = [email];

        return database.execute(sql, args);
    }

    static findUsername(username) {
        let sql = `SELECT * FROM Users WHERE Username = ?;`;
        let args = [username];

        return database.execute(sql, args);
    }
    
    static getId(email) {
        let sql = `SELECT Id FROM Users WHERE Email = ?;`;
        let args = [email];

        return database.execute(sql, args);
    }

    static register(user) {
        let boxes = 6;
        let guessesAllowed = 1;
        let sql =
        `INSERT INTO Users (Username, Email, PasswordHash, GuessesAllowed, Boxes, SecurityQuestionOne, SecurityQuestionTwo, SecurityAnswerHashOne, SecurityAnswerHashTwo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        
        let args = [user.username, user.email, user.password, guessesAllowed, boxes, user.securityQuestionOne, user.securityQuestionTwo, user.securityAnswerOne, user.securityAnswerTwo];
        return database.execute(sql, args);
    }

    static getUserSecurityQuestions(email) {
        let sql = `SELECT A.Question AS QuestionOne, B.Question AS QuestionTwo FROM Users 
        JOIN SecurityQuestions AS A ON SecurityQuestionOne = A.Id 
        JOIN SecurityQuestions AS B ON SecurityQuestionTwo = B.Id 
        WHERE Users.Email = ?;`;

        let args =[email];

        return database.execute(sql, args);
    }

    static resetPassword(email, newPassword) {
        let sql = `UPDATE Users SET PasswordHash = ? WHERE Email = ?;`;

        let args = [newPassword, email];

        return database.execute(sql, args);
    }
};