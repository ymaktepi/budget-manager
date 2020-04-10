import React from "react";
import {ICategoryFrame} from "../../../utils/types";
import {RatioHeader} from "../../common/RatioHeader";
import {Card} from "../../common/Card";
import {SingleExpenseDisplay} from "../../common/SingleExpenseDisplay";
import {Grid, LinearProgress} from "@material-ui/core";

interface IExpensesSummaryProps {
    categoryFrames: ICategoryFrame[];
}

class ExpensesSummary extends React.Component<IExpensesSummaryProps, {}> {
    render = () => {
        const listCategories = this.props.categoryFrames.map(frame => {
            const amountUsed = frame.expenses.reduce((sum, current) => sum + Number(current.amount), 0);
            return {amountUsed: amountUsed, amount: frame.category.amount, name: frame.category.name}
        });

        const totalAmount = listCategories.reduce((sum, current) => sum + Number(current.amount), 0);
        const usedAmount = listCategories.reduce((sum, current) => sum + Number(current.amountUsed), 0);

        const listItems = listCategories.map(category => (
            <SingleExpenseDisplay name={category.name} amount={category.amountUsed + "/" + category.amount}
                                  key={category.name}/>
        ));
        const percentUsed = Math.round(Math.min(100, usedAmount / totalAmount * 100));
        const color = percentUsed >= 99 ? "secondary" : "primary";

        return (
            <Card>
                <RatioHeader title={"Expenses Summary"} totalAmount={totalAmount} usedAmount={usedAmount}/>
                <LinearProgress variant={"determinate"} value={percentUsed} color={color}/>
                <div className={"bottom-margin"}/>
                <Grid container>
                    {listItems}
                </Grid>
            </Card>
        );

        return <div>et ta meere</div>
    };
}

export default ExpensesSummary;