import React from "react";
import {Typography} from "@material-ui/core";
import {ICategoryFrame, ICategoryLog, IExpenseLog} from "../../../utils/types";
import ExpensesDisplay from "./ExpensesDisplay";
import EntryAdder from "../../common/EntryAdder";
import './expenses.css';
import {MainContainer} from "../../common/MainContainer";
import {CardWithTitle} from "../../common/Card";
import ExpensesSummary from "./ExpensesSummary";

interface IExpensesProps {
    expensesData: Map<string, ICategoryFrame>;
    addExpense: (expense: IExpenseLog) => void;
    addCategory: (category: ICategoryLog) => void;
}

class Expenses extends React.Component<IExpensesProps, {}> {
    private handleNewCategory = (name: string, value: number) => {
        if (value && name && name !== "") {
            const category: ICategoryLog = {
                amount: value,
                name,
            };
            this.props.addCategory(category);
        }
    };

    public render = () => {
        // @ts-ignore does not recognise that content cannot be undefined due to filter
        const categoryFrames: ICategoryFrame[] =
            Array.from(this.props.expensesData.keys())
                .sort()
                .map(sortedName => this.props.expensesData.get(sortedName))
                .filter(frame => frame !== undefined);

        const listExpensesDisplays =
            categoryFrames.map(frame => <ExpensesDisplay categoryFrame={frame} key={frame.category.name}
                                                         onNewExpense={this.props.addExpense}/>);
        return (
            <>
                <MainContainer>
                    <ExpensesSummary categoryFrames={categoryFrames}/>
                    <CardWithTitle title={"Add a new category"}>
                        <EntryAdder placeholder={"Category Name"} onNewEntry={this.handleNewCategory}/>
                    </CardWithTitle>
                </MainContainer>
                <MainContainer>
                    {listExpensesDisplays}
                </MainContainer>
            </>
        );
    }
}

export default Expenses;