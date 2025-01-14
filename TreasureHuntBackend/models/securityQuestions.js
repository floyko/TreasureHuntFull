const database = require("../util/database");

module.exports = class SecurityQuestions {
    constructor(Question) {
        this.question = Question;
    }

    static getSecurityQuestions() {
        const sql = "SELECT Id, Question FROM SecurityQuestions ORDER BY Id";

        return database.execute(sql);
    }
    
};