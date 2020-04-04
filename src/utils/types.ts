import {Moment} from "moment";

export interface ICategoryLog {
    name: string;
    amount: number;
}

export interface IExpenseLog {
    date: Moment;
    category: string;
    name: string;
    amount: number;
}

export interface ICategoryFrame {
    category: ICategoryLog;
    expenses: IExpenseLog[];
}