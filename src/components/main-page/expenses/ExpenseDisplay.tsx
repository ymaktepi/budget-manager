import React from "react";
import {Grid} from "@material-ui/core";
import {ICategoryFrame} from "../../../utils/types";
import Paper from "@material-ui/core/Paper";
import { Typography } from '@material-ui/core';

interface IExpenseDisplayProps {
    categoryFrame: ICategoryFrame;
}

interface IExpenseDisplayState {
    amountUsed: number;
}

class ExpenseDisplay extends React.Component<IExpenseDisplayProps, IExpenseDisplayState> {

    constructor(props: IExpenseDisplayProps) {
        super(props);
        const amountUsed = this.props.categoryFrame.expenses.reduce((sum, current) => sum + current.amount, 0);
        this.state = {amountUsed};
    }

    render = () => {
        const frame = this.props.categoryFrame;
        const {amountUsed} = this.state;
        return <Grid item xs={12} sm={6} md={4}>
            <Paper>
                <Typography variant={"h5"}>
                    {frame.category.name}
                </Typography>
                <Typography>
                    {amountUsed}/{frame.category.amount}
                </Typography>
            </Paper>
        </Grid>
    }
}

export default ExpenseDisplay;