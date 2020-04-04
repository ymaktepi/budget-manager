import React from "react";
import {ICategoryLog} from "../../utils/types";
import {Button, Input} from "@material-ui/core";

interface ICategoryProps {
    categories: ICategoryLog[];
    addCategory: (category: ICategoryLog) => void;
}

interface ICategoryState {
    name: string;
    amount: number;
}

class Category extends React.Component<ICategoryProps , ICategoryState> {
    constructor(props: ICategoryProps) {
        super(props);
        this.state = {name: "", amount: 100};
    }

    render = () => {
        const list = this.props.categories.map(cat => (<CategoryItem key={cat.name} name={cat.name} amount={cat.amount} />));
        return (
            <>
                <ul>{list}</ul>
                <Input
                    type={"text"}
                    placeholder={"New Category"}
                    value={this.state.name}
                    onChange={event => this.setState({name: event.target.value}) }
                />
                <Input
                    type={"number"}
                    placeholder={"100"}
                    value={this.state.amount}
                    onChange={event => this.setState({amount: Number(event.target.value)}) }
                />
                <Button
                    onClick={() => {
                        this.props.addCategory({name: this.state.name, amount: this.state.amount});
                    }}
                >
                    Add Category
                </Button>
            </>
        );
    }
}

const CategoryItem = (props: ICategoryLog) => {
    const name = props.name;
    const amount = props.amount;
    return (
        <li>{name}: {amount}</li>
    );
};

export default Category;