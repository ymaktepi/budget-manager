import React from "react";
import {Typography} from "@material-ui/core";
import {ICategoryFrame, ICategoryLog, IExpenseLog} from "../../../utils/types";
import ExpenseDisplay from "./ExpenseDisplay";
import EntryAdder from "../../common/EntryAdder";
import './expenses.css';
import {MainContainer} from "../../common/MainContainer";
import {MainItem} from "../../common/MainItem";

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
        const listExpensesDisplays =
            Array.from(this.props.expensesData.keys())
                .sort()
                .map(sortedName => this.props.expensesData.get(sortedName))
                .filter(frame => frame !== undefined)
                // @ts-ignore does not recognise that frame cannot be undefined due to previous filter
                .map(frame => <ExpenseDisplay categoryFrame={frame} key={frame.category.name}
                                              onNewExpense={this.props.addExpense}/>);
        return (
            <MainContainer>
                {listExpensesDisplays}
                <MainItem>
                    <div className={"bottom-margin"}>
                        <Typography variant={"h5"}>
                            Add new category
                        </Typography>
                    </div>
                    <EntryAdder placeholder={"Category Name"} onNewEntry={this.handleNewCategory}/>
                </MainItem>
            </MainContainer>
        );
    }
}

export default Expenses;