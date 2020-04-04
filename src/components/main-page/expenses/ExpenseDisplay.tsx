import React from "react";
import {ICategoryFrame} from "../../../utils/types";

interface IExpenseDisplayProps {
    categoryFrame: ICategoryFrame;
}

class ExpenseDisplay extends React.Component<IExpenseDisplayProps, {}> {
    render = () => {
        return <p>{this.props.categoryFrame.category.name}</p>
    }
}

export default ExpenseDisplay;