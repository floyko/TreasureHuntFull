export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    guessesAllowed: number;
    boxes: number;
    securityQuestionOne: number;
    securityQuestionTwo: number;
    securityAnswerOne: string;
    securityAnswerTwo: string;
}