import React from "react";
import {Grid, Input, Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";

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
        this.state = {value: ""}
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
        if (this.state.value !== "") {
            this.props.onIdChange(this.state.value);
        }
    };

    render = () => {
        return (
            <Grid container spacing={3} alignItems={"baseline"} direction={"row"}>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper className={"tile"}>
                        <Typography variant={"h5"}>
                            Create a new spreadsheet
                        </Typography>
                        <Typography variant={"body1"}>
                            If you've never used this application, the first thing you need to do is to create a
                            spreadsheet.<br/>
                            This spreadsheet will be all yours, saved as a private Google Sheet on your account.
                        </Typography>
                        <Button onClick={this.props.createSpreadsheet} variant={"outlined"} fullWidth>
                            Create spreadsheet
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper className={"tile"}>
                        <Typography variant={"h5"}>
                            Use an existing spreadsheet
                        </Typography>
                        <Typography variant={"body1"}>
                            If you've already used this application but are using it from a new device, you can use an
                            existing
                            spreadsheet. Insert your spreadsheet ID in the following form.
                        </Typography>
                        <Input placeholder={"Spreadsheet ID"}
                               value={this.state.value}
                               onKeyPress={this.handleKeyPress}
                               onChange={this.handleChange}
                               fullWidth
                        />
                        <Button onClick={this.updateId} variant={"outlined"} fullWidth>
                            Update spreadsheet ID
                        </Button>
                        <Typography variant={"body1"}>
                            Current spreadsheetID: <br/>
                            {this.props.id}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        );
    };
}

export default Settings;