import React from "react";
import {Input} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {Add as AddIcon} from '@material-ui/icons';
import "./entry-adder.css";

interface IEntryAdderProps {
    onNewEntry: (name: string, value: number) => void;
    placeholder: string;
}

interface IExpenseAdderState {
    name: string;
    value: number;
}

const DEFAULT_STATE = {
    name: "",
    value: 0.0,
};

class EntryAdder extends React.Component<IEntryAdderProps, IExpenseAdderState> {
    constructor(props: IEntryAdderProps) {
        super(props);
        this.state = DEFAULT_STATE;
    }

    private handleChangeName = (event: any) => {
        this.setState({name: event.target.value});
    };

    private handleChangeValue = (event: any) => {
        this.setState({value: event.target.value});
    };

    private handleKeyPress = (event: any) => {
        if (event.key === "Enter") {
            this.addExpense();
            this.setState(DEFAULT_STATE);
        }
    };

    private addExpense = () => {
        if (this.state.value && this.state.name && this.state.name !== "") {
            this.props.onNewEntry(this.state.name, this.state.value);
        }
    };

    render = () => {
        return (
            <>
                <Input
                    type={"text"}
                    placeholder={this.props.placeholder}
                    value={this.state.name}
                    onKeyPress={this.handleKeyPress}
                    onChange={this.handleChangeName}
                    fullWidth={true}
                />
                <Input
                    type={"number"}
                    placeholder={"0.0"}
                    value={this.state.value}
                    onKeyPress={this.handleKeyPress}
                    onChange={this.handleChangeValue}
                    fullWidth={true}
                />
                <div className={"align-center"}>
                    <IconButton aria-label={"Add"} onClick={this.addExpense}
                    >
                        <AddIcon style={{color: "green"}} fontSize={"large"}/>
                    </IconButton>
                </div>
            </>
        );
    };
}

export default EntryAdder;