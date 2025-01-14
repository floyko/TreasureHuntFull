const { validationResult } = require("express-validator");
const Stats = require("../models/stats");

exports.getUserStats = async (req, res, next) => {
    const id = req.userId;
    try {
        const [result] = await Stats.getUserStats(id);
        return res.json(result);
    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getAllUserStats = async (req, res, next) => {
    try {
        const [result] = await Stats.getAllUserStats();
        return res.json(result);
    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getRankedStats = async (req, res, next) => {
    try {
        const [result] = await Stats.getRankedStats();
        return res.json(result);
    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.saveStats = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.error(errors);
        return;
    }

    const id = req.userId;
    const totalGuesses = req.body.totalGuesses;
    const guessesAllowed = req.body.guessesAllowed;
    const boxes = req.body.boxes;
    const winLose = req.body.winLose;
    try {
        const stats = {
            userId: id,
            totalGuesses: totalGuesses,
            guessesAllowed: guessesAllowed,
            boxes: boxes,
            winLose: winLose
        };
        const result = await Stats.saveStats(stats);
        res.status(201).json({ message: "Stats saved!" });
    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.updateSettings = async (req, res, next) => {
    const id = req.userId;
    const guessesAllowed = req.body.guessesAllowed;
    const boxes = req.body.boxes;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        console.error(errors);
        return;
    }

    try {
        const result = await Stats.updateSettings(id, guessesAllowed, boxes);
        res.status(200).json({message: "Settings Updated!"});
    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.getSettings = async (req, res, next) => {
    const id = req.userId;
    try {
        const result = await Stats.getSettings(id);
        const settings = {"guessesAllowed": parseInt(result[0][0].GuessesAllowed), "boxes": parseInt(result[0][0].Boxes)};
        return res.json(settings);
    } catch(err) {
        if(!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};