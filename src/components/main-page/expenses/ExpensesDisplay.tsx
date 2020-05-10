import React from "react";
import {Grid, LinearProgress} from "@material-ui/core";
import {ICategoryFrame, IExpenseLog} from "../../../utils/types";
import EntryAdder from "../../common/EntryAdder";
import moment from "moment";
import "./expenses.css";
import {Card} from "../../common/Card";
import {SingleExpenseDisplay} from "../../common/SingleExpenseDisplay";
import {RatioHeader} from "../../common/RatioHeader";


interface IExpenseDisplayProps {
    categoryFrame: ICategoryFrame;
    onNewExpense: (expense: IExpenseLog) => void;
}

class ExpensesDisplay extends React.Component<IExpenseDisplayProps, {}> {

    private handleNewEntry = (name: string, value: number) => {
        if (value && name && name !== "") {
            const expense: IExpenseLog = {
                name: name,
                amount: value,
                date: moment(),
                category: this.props.categoryFrame.category.name,
            };

            this.props.onNewExpense(expense);
        }
    };

    render = () => {
        const frame = this.props.categoryFrame;
        const amountUsed = frame.expenses.reduce((sum, current) => sum + Number(current.amount), 0);
        const listItems = frame.expenses.map(expense => (
            <SingleExpenseDisplay name={expense.name} amount={expense.amount.toFixed(0)}
                                  key={expense.amount + expense.name + expense.date}/>
        ));
        const percentUsed = Math.round(Math.min(100, amountUsed / frame.category.amount * 100));
        const color = percentUsed >= 99 ? "secondary" : "primary";
        return (
            <Card>
                <RatioHeader title={frame.category.name} totalAmount={frame.category.amount} usedAmount={amountUsed}
                             showIcon={frame.category.fixed}/>
                <LinearProgress variant={"determinate"} value={percentUsed} color={color}/>
                <div className={"bottom-margin"}/>
                <Grid container>
                    {listItems}
                </Grid>
                <div className={"bottom-margin"}/>
                <EntryAdder placeholder={"Expense Name"} onNewEntry={this.handleNewEntry}/>
            </Card>
        );
    }
}

export default ExpensesDisplay;