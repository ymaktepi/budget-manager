
export interface ICategoryLog {
    name: string;
    amount: number;
}

export interface IExpenseLog {
    date: Date;
    category: string;
    name: string;
    amount: number;
}

export interface ICategoryFrame {
    category: ICategoryLog;
    expenses: IExpenseLog[];
}