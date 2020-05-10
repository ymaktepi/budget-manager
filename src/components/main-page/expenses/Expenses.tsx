import React from "react";
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
    private handleNewCategory = (name: string, value: number, checked: boolean) => {
        if (value && name && name !== "") {
            const category: ICategoryLog = {
                amount: value,
                name,
                fixed: checked,
            };
            this.props.addCategory(category);
        }
    };

    public render = () => {
        // @ts-ignore does not recognise that content cannot be undefined due to filter
        const categoryFrames: ICategoryFrame[] =
            Array.from(this.props.expensesData.keys())
                .map(sortedName => this.props.expensesData.get(sortedName))
                .filter(frame => frame !== undefined);

        const listExpensesDisplays =
            categoryFrames.map(frame => <ExpensesDisplay categoryFrame={frame} key={frame.category.name}
                                                         onNewExpense={this.props.addExpense}/>);
        const nonFixedCategories = categoryFrames.filter(frame => !frame.category.fixed);
        const fixedCategories = categoryFrames.filter(frame => frame.category.fixed);
        return (
            <>
                <MainContainer>
                    <ExpensesSummary title={"Expenses Summary"} categoryFrames={categoryFrames} showIcon={false}/>
                    {fixedCategories.length > 0 &&
                    <ExpensesSummary title={"Fixed Categories"}
                                     categoryFrames={fixedCategories}
                                     showIcon={true}/>
                    }
                    {nonFixedCategories.length > 0 &&
                    <ExpensesSummary title={"Non-fixed Categories"}
                                     categoryFrames={nonFixedCategories}
                                     showIcon={false}/>
                    }
                    <CardWithTitle title={"Add a new category"}>
                        <EntryAdder placeholder={"Category Name"} onNewEntry={this.handleNewCategory}
                                    checkedTitle={"Fixed Category"}/>
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