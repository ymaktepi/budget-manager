import React from "react";
import {Input, Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {OAuth2Client} from "google-auth-library";
import {google, sheets_v4} from "googleapis";
import {getClientFromStorageOrRedirect} from "../../utils/clientUtils";
import {archive, createSpreadsheet, getLinkToSpreadsheet} from "../../utils/sheetsUtils";
import {SPREADSHEET_ID} from "../../utils/constants";
import {MainContainer} from "../common/MainContainer";
import {CardWithTitle} from "../common/Card";
import {IUIUtils} from "../RootPage";

interface ISettingsProps extends IUIUtils {
}

interface ISettingsState {
    valueInputSpreadsheet: string;
    valueInputArchive: string;
    spreadsheetId: string | null;
    client: OAuth2Client;
    sheets: sheets_v4.Sheets;
}

class Settings extends React.Component<ISettingsProps, ISettingsState> {

    constructor(props: ISettingsProps) {
        super(props);
        const spreadsheetId = localStorage.getItem(SPREADSHEET_ID);
        const client = getClientFromStorageOrRedirect();
        const sheets = google.sheets({version: "v4", auth: client});
        this.state = {valueInputSpreadsheet: "", client, sheets, spreadsheetId, valueInputArchive: ""};
    }

    private handleChangeSheet = (event: any) => {
        this.setState({valueInputSpreadsheet: event.target.value});
    };

    private handleChangeArchive = (event: any) => {
        this.setState({valueInputArchive: event.target.value});
    };

    private handleKeyPressSheet = (event: any) => {
        if (event.key === "Enter") {
            this.updateId();
        }
    };

    private handleKeyPressArchive = async (event: any) => {
        if (event.key === "Enter") {
            this.archive();
        }
    };

    private updateId = () => {
        if (this.state.valueInputSpreadsheet !== "") {
            localStorage.setItem(SPREADSHEET_ID, this.state.valueInputSpreadsheet);
            this.setState({spreadsheetId: this.state.valueInputSpreadsheet});
        }
    };

    private archive = async () => {
        if (this.state.valueInputArchive === "" || this.state.spreadsheetId === null) {
            return;
        }
        this.props.setLoading(true);
        if (await archive(this.state.sheets, this.state.spreadsheetId, this.state.valueInputArchive)) {
            this.props.showSuccessToast("Archiving succeeded");
        } else {
            this.props.showWarningToast("Could not archive spreadsheet, probably a network issue.");
        }
        this.props.setLoading(false);
    };

    private createSpreadsheet = async () => {
        this.props.setLoading(true);
        const id = await createSpreadsheet(this.state.sheets);
        if (id) {
            this.setState({spreadsheetId: id});
        } else {
            this.props.showWarningToast("Could not create spreadsheet, probably a network issue.");
        }
        this.props.setLoading(false);
    };

    private goToSpreadsheet = async () => {
        this.props.setLoading(true);
        if (this.state.spreadsheetId) {
            const link = await getLinkToSpreadsheet(this.state.sheets, this.state.spreadsheetId);
            if (link) {
                window.open(link);
            } else {
                this.props.showWarningToast("Could not go to spreadsheet, probably a network issue.");
            }
        } else {
            this.props.showWarningToast("Could not go to spreadsheet, you need to create one first.");
        }
        this.props.setLoading(false);
    };

    render = () => {
        return (
            <MainContainer>
                <CardWithTitle title={"Create a new spreadsheet"}>
                    <Typography variant={"body1"}>
                        If you've never used this application, the first thing you need to do is to create a
                        spreadsheet.<br/>
                        This spreadsheet will be all yours, saved as a private Google Sheet on your account.
                    </Typography>
                    <Button onClick={this.createSpreadsheet} variant={"outlined"} fullWidth>
                        Create spreadsheet
                    </Button>
                </CardWithTitle>
                <CardWithTitle title={"Use an existing spreadsheet"}>
                    <Typography variant={"body1"}>
                        If you've already used this application but are using it from a new device, you can use an
                        existing
                        spreadsheet. Insert your spreadsheet ID in the following form.
                    </Typography>
                    <Input placeholder={"Spreadsheet ID"}
                           value={this.state.valueInputSpreadsheet}
                           onKeyPress={this.handleKeyPressSheet}
                           onChange={this.handleChangeSheet}
                           fullWidth
                    />
                    <Button onClick={this.updateId} variant={"outlined"} fullWidth>
                        Update spreadsheet ID
                    </Button>
                    <Typography variant={"body1"}>
                        Current spreadsheetID: <br/>
                        {this.state.spreadsheetId}
                    </Typography>
                    <Button onClick={this.goToSpreadsheet} variant={"outlined"} fullWidth>
                        View Spreadsheet
                    </Button>
                </CardWithTitle>
                <CardWithTitle title={"Archive current expenses"}>
                    <Typography variant={"body1"}>
                        This will copy the current expenses in a new sheet on your spreadsheet, and reset them.
                        The categories will be kept.
                    </Typography>
                    <Input placeholder={"Archive Name"}
                           value={this.state.valueInputArchive}
                           onKeyPress={this.handleKeyPressArchive}
                           onChange={this.handleChangeArchive}
                           fullWidth
                    />
                    <Button onClick={this.archive} variant={"outlined"} fullWidth>
                        Archive Sheet
                    </Button>
                </CardWithTitle>
            </MainContainer>
        );
    };
}

export default Settings;