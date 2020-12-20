import React from "react";
import {ICategoryFrame} from "../../../utils/types";
import {RatioHeader} from "../../common/RatioHeader";
import {Card} from "../../common/Card";
import {SingleCategoryDisplay} from "../../common/SingleCategoryDisplay";
import {Grid, LinearProgress} from "@material-ui/core";

interface IExpensesSummaryProps {
    categoryFrames: ICategoryFrame[];
    title: string;
    showIcon: boolean;
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
            <SingleCategoryDisplay name={category.name} amount={category.amountUsed + "/" + category.amount}
                                   key={category.name}/>
        ));
        const percentUsed = Math.round(Math.min(100, usedAmount / totalAmount * 100));
        const color = percentUsed >= 99 ? "secondary" : "primary";

        return (
            <Card>
                <RatioHeader title={this.props.title} totalAmount={totalAmount} usedAmount={usedAmount}
                             showIcon={this.props.showIcon}/>
                <LinearProgress variant={"determinate"} value={percentUsed} color={color}/>
                <div className={"bottom-margin"}/>
                <Grid container>
                    {listItems}
                </Grid>
            </Card>
        );
    };
}

export default ExpensesSummary;