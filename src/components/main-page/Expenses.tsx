import React from "react";
import {Grid} from "@material-ui/core";
import {ICategoryFrame, IExpenseLog} from "../../utils/types";
import ExpenseDisplay from "./expenses/ExpenseDisplay";

interface IExpensesProps {
    expensesData: Map<string, ICategoryFrame>;
    addExpense: (expense: IExpenseLog) => void;
}

class Expenses extends React.Component<IExpensesProps, {}> {

    public render = () => {
        const listExpensesDisplays =
            Array.from(this.props.expensesData.keys())
                .sort()
                .map(sortedName => this.props.expensesData.get(sortedName))
                .filter(frame => frame !== undefined)
                // @ts-ignore does not recognise that frame cannot be undefined due to previous filter
                .map(frame => <ExpenseDisplay categoryFrame={frame} key={frame.category.name} />);
        return (
            <Grid container spacing={3}>
                {listExpensesDisplays}
            </Grid>
        );
    }
}

export default Expenses;