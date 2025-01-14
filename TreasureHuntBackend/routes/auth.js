const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const Users = require("../models/user");
const authController = require("../controllers/auth");

router.post(
    "/register",
    [
        body("username").trim().not().isEmpty().withMessage("Please enter a Username.")
        .custom(async (username) => {
            const user = await Users.findUsername(username);
            if(user[0].length > 0 ) {
                return Promise.reject("Username already exists!");
            }
        }),
        body("email").isEmail().withMessage("Please enter a valid email.")
        .custom(async (email) => {
            const user = await Users.findEmail(email);
            if(user[0].length > 0 ) {
                return Promise.reject("Email address already exists!");
            }
        })
        .normalizeEmail(),
        body("password").trim().isLength({ min: 6}),
        body("securityQuestions.securityQuestionOne").not().isEmpty().withMessage("Please choose security question 1"),
        body("securityQuestions.securityQuestionTwo").not().isEmpty().withMessage("Please choose security question 2"),
        body("securityQuestions.securityAnswerOne").trim().toLowerCase().not().isEmpty().withMessage("Please answer security question 1"),
        body("securityQuestions.securityAnswerTwo").trim().toLowerCase().not().isEmpty().withMessage("Please answer security question 2"),
    ],
    authController.register,
);

router.get("/getSecurityQuestions", authController.getSecurityQuestions);

router.post(
    "/getUserSecurityQuestions",
    [
        body("email").isEmail().withMessage("Please enter a valid email.")
        .custom(async (email) => {
            const user = await Users.findEmail(email);
            if(user[0].length < 1 ) {
                return Promise.reject("A user with this email could not be found!");
            }
        })
        .normalizeEmail(),
    ],
    authController.getUserSecurityQuestions
);

router.post("/login",
    [
        body("email").isEmail().withMessage("Please enter a valid email.")
        .custom(async (email) => {
            const user = await Users.findEmail(email);
            if(user[0].length < 1 ) {
                return Promise.reject("A user with this email could not be found!");
            }
        })
        .normalizeEmail(),
    ], authController.login);

router.post(
    "/resetPassword",
    [
        body("email").isEmail().withMessage("Please enter a valid email.")
        .custom(async (email) => {
            const user = await Users.findEmail(email);
            if(user[0].length < 1 ) {
                return Promise.reject("A user with this email could not be found!");
            }
        })
        .normalizeEmail(),
        body("password").trim().isLength({ min: 6}),
        body("securityAnswerOne").trim().toLowerCase().not().isEmpty(),
        body("securityAnswerTwo").trim().toLowerCase().not().isEmpty().withMessage("Please answer security question 2"),
    ],
    authController.resetPassword
);

module.exports = router;
