const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const statsController = require("../controllers/stats");
const auth = require("../middleware/auth");

router.get("/getUserStats", auth, statsController.getUserStats);

router.get("/getAllUserStats", auth, statsController.getAllUserStats);

router.get("/getRankedStats", auth, statsController.getRankedStats);

router.post(
    "/saveStats",
    [
        auth,
        body("totalGuesses").trim().isNumeric().not().isEmpty(),
        body("guessesAllowed").isInt({ min: 1 }).withMessage("GuessesAllowed needs to be at least 1"),
        body("boxes").isInt({ min: 1, max: 21 }).withMessage("Number of boxes must be between 1 and 21"),
        body("winLose").trim().not().isEmpty()
    ],
    statsController.saveStats,
);

router.post("/updateSettings", 
    [
        auth,
        body("guessesAllowed").isInt({ min: 1 }).withMessage("GuessesAllowed needs to be at least 1"),
        body("boxes").isInt({ min: 1, max: 21 }).withMessage("Number of boxes must be between 1 and 21")
    ],
    statsController.updateSettings);

router.get("/getSettings", auth, statsController.getSettings);

module.exports = router;