export interface Stats {
    id: number;
    userId: number;
    username: string;
    totalGuesses: number;
    guessesAllowed: number;
    boxes: number;
    winLose: string;
}

export interface RankedStats {
    username: string;
    totalWins: number;
    totalLosses: number;
}