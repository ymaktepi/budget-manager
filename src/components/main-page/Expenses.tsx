import React from "react";
import {ICategoryLog, IExpenseLog} from "../../utils/types";

interface IExpensesProps {
    expensesData: Map<ICategoryLog, IExpenseLog[]>;
    addExpense: (expense: IExpenseLog) => void;
}

class Expenses extends React.Component<IExpensesProps, {}> {

    public render = () => {
        return <p>aldkjf</p>
    }
}

export default Expenses;