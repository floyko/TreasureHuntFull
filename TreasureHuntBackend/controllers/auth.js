const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/user");
const SecurityQuestions = require("../models/securityQuestions");

exports.register = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.error(errors);
        return res.status(401).json(errors.array());
    }

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const securityQuestionOne = req.body.securityQuestions.securityQuestionOne;
    const securityQuestionTwo = req.body.securityQuestions.securityQuestionTwo;
    const securityAnswerOne = req.body.securityQuestions.securityAnswerOne;
    const securityAnswerTwo = req.body.securityQuestions.securityAnswerTwo;
    try {
        const passwordHash = await bcrypt.hash(password, 12);
        const securityAnswerOneHash = await bcrypt.hash(securityAnswerOne, 12);
        const securityAnswerTwoHash = await bcrypt.hash(securityAnswerTwo, 12);
        const userDetails = {
            username: username,
            email: email,
            password: passwordHash,
            securityQuestionOne: securityQuestionOne,
            securityQuestionTwo: securityQuestionTwo,
            securityAnswerOne: securityAnswerOneHash,
            securityAnswerTwo: securityAnswerTwoHash
        };
        const result = await Users.register(userDetails);
        res.status(201).json({ message: "User registered!" });
    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getSecurityQuestions = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.error(errors);
        return res.status(401).json(errors.array());
    }

    try {
        const result = await SecurityQuestions.getSecurityQuestions();
        let questions = [];
        for(let i = 0; i < result[0].length; i++) {
            questions.push({
                "id": result[0][i].Id,
                "question": result[0][i].Question
            });
        }
        return res.status(200).json(questions);
    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.error(errors);
        return res.status(401).json(errors.array());
    }

    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await Users.findEmail(email);
        if(user[0].length !== 1) {
            const error = new Error("A user with this email could not be found.");
            error.statusCode = 401;
            throw error;
        }

        const storedUser = user[0][0];
        const isEqual = await bcrypt.compare(password, storedUser.PasswordHash);
        if(!isEqual) {
            const error = new Error("Wrong Password.");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            {
                email: storedUser.Email,
                userId: storedUser.Id,
                username: storedUser.Username
            },
            "secretfortoken"
        );
        res.status(200).json({ token: token, userId: storedUser.Id});
    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getUserSecurityQuestions = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    const email = req.body.email;
    try {
        const result = await Users.getUserSecurityQuestions(email);
        let questions = {};
        questions.questionOne = result[0][0].QuestionOne;
        questions.questionTwo = result[0][0].QuestionTwo;
        return res.status(200).json(questions);
    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.resetPassword = async (req, res, next) => {
    const validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()) {
        console.log(validationErrors);
        return res.status(400).json(validationErrors.array());
    }

    const errors = [];
    const email = req.body.email;
    const newPassword = req.body.password;
    const securityAnswerOne = req.body.securityAnswerOne;
    const securityAnswerTwo = req.body.securityAnswerTwo;
    
    try {
        const user = await Users.findEmail(email);
        const storedUser = user[0][0];
        const isQuestionOneEqual = await bcrypt.compare(securityAnswerOne, storedUser.SecurityAnswerHashOne);
        const isQuestionTwoEqual = await bcrypt.compare(securityAnswerTwo, storedUser.SecurityAnswerHashTwo);
        const passwordHash = await bcrypt.hash(newPassword, 12);
        if(!isQuestionOneEqual) {
            errors.push({path: "securityQuestionOne", msg: "Incorrect answer!"});
        }
        
        if(!isQuestionTwoEqual) {
            errors.push({path: "securityQuestionTwo", msg: "Incorrect answer!"});
        }

        if(errors.length > 0) {
            res.status(400).json(errors);
        } else {
            const result = await Users.resetPassword(email, passwordHash);
            res.status(200).json({ message: "Password Successfully Updated!"});
        }
    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};