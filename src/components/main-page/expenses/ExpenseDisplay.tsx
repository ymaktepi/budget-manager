import React from "react";
import {Box, Grid, LinearProgress} from "@material-ui/core";
import {ICategoryFrame, IExpenseLog} from "../../../utils/types";
import Paper from "@material-ui/core/Paper";
import {Typography} from '@material-ui/core';
import EntryAdder from "../../common/EntryAdder";
import moment from "moment";
import "./expenses.css";

interface IExpenseDisplayProps {
    categoryFrame: ICategoryFrame;
    onNewExpense: (expense: IExpenseLog) => void;
}

class ExpenseDisplay extends React.Component<IExpenseDisplayProps, {}> {

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
            <React.Fragment key={expense.name + expense.amount + expense.date.toISOString()}>
                <Grid item xs={3} style={{textAlign: "right"}}>{expense.amount}</Grid>
                <Grid item xs={1}/>
                <Grid item xs={8}>{expense.name}</Grid>
            </React.Fragment>
        ));
        const percentUsed = Math.round(Math.min(100, amountUsed / frame.category.amount * 100));
        const color = percentUsed >= 99 ? "secondary" : "primary";
        return <Grid item xs={12} sm={6} md={4}>
            <Paper className={"tile"}>
                <Box display={"flex"} flexDirection={"row"} className={"bottom-margin"}>
                    <Box display={"flex"} flexDirection={"column"} className={"title-ratio"} justifyContent={"center"}>
                        <Typography className={"text-centered"}>
                            {Math.round(amountUsed)}
                        </Typography>
                        <div className={"divider div-transparent"}/>
                        <Typography className={"text-centered"}>
                            {Math.round(frame.category.amount)}
                        </Typography>
                    </Box>
                    <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                        <Typography variant={"h5"}>
                            {frame.category.name}
                        </Typography>
                    </Box>
                </Box>
                <LinearProgress variant={"determinate"} value={percentUsed} color={color}/>
                <div className={"bottom-margin"}/>
                <Grid container>
                    {listItems}
                </Grid>
                <div className={"bottom-margin"}/>
                <EntryAdder placeholder={"Expense Name"} onNewEntry={this.handleNewEntry}/>
            </Paper>
        </Grid>
    }
}

export default ExpenseDisplay;