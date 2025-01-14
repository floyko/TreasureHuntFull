import { RankedStats, Stats } from "../models/Stats";

export const HISTORY_DATA: Stats[] = [
    {id: -1, userId: -1, username: "test1", totalGuesses: -1, guessesAllowed: -1, boxes: -1, winLose: ""},
    {id: -2, userId: -2, username: "test2", totalGuesses: -2, guessesAllowed: -2, boxes: -2, winLose: ""},
];

export const RANKED_DATA: RankedStats[] = [
    {username: "test1", totalWins: -1, totalLosses: -1},
    {username: "test2", totalWins: -2, totalLosses: -2},
];

export const ALL_USER_COLUMNS: string[] = ["au-id", "au-username", "au-total-guesses", "au-guesses-allowed", "au-boxes", "au-win-lose"];
export const RANKED_COLUMNS: string[] = ["r-username", "r-total-wins", "r-total-losses"];
export const YOUR_STATS_COLUMNS: string[] = ["ys-id", "ys-total-guesses", "ys-guesses-allowed", "ys-boxes", "ys-win-lose"];