import React from "react";
import {Input} from "@material-ui/core";
import Button from "@material-ui/core/Button";

interface ISettingsProps {
    id: string | null;
    onIdChange: (id: string) => void;
    createSpreadsheet: () => void;
}

interface ISettingsState {
    value: string;
}

class Settings extends React.Component<ISettingsProps, ISettingsState> {

    constructor(props: ISettingsProps) {
        super(props);
        this.state = {value: this.props.id ?? ""}
    }

    private handleChange = (event: any) => {
        this.setState({value: event.target.value});
    };

    private handleKeyPress = (event: any) => {
        if (event.key === "Enter") {
            this.updateId();
        }
    };

    private updateId = () => {
        this.props.onIdChange(this.state.value);
    };

    render = () => {
        return (
            <>
                <Input placeholder={"Spreadsheet ID"}
                       value={this.state.value}
                       onKeyPress={this.handleKeyPress}
                       onChange={this.handleChange}
                />
                <Button onClick={this.props.createSpreadsheet}>Create spreadsheet</Button>
            </>
        );
    };
}

export default Settings;