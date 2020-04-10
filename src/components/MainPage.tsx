import React from "react";
import {getClientFromStorageOrRedirect} from "../utils/clientUtils";
import {google, sheets_v4} from "googleapis";
import {LinearProgress, Tab} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import AppBar from "@material-ui/core/AppBar";
import {a11yProps, TabPanel} from "./tabUtils";
import {OAuth2Client} from "google-auth-library";
import Settings from "./main-page/Settings";
import SettingsIcon from '@material-ui/icons/Settings';
import {addCategory, addExpense,getAllData} from "../utils/sheetsUtils";
import {ICategoryFrame, ICategoryLog, IExpenseLog} from "../utils/types";
import {warn} from "../utils/simpleLogger";
import Expenses from "./main-page/expenses/Expenses";
import {Snackbar} from '@material-ui/core';
import {Alert as MuiAlert} from '@material-ui/lab';
import {SPREADSHEET_ID} from "./constants";

const CONSTANTS = {
    TAB_INDEXES: {
        EXPENSES: 0,
        SETTINGS: 1,
    },
};

function Alert(props: any) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface IToastState {
    open: boolean;
    message: string;
    severity: string;
}

interface IMainPageState {
    tabIndex: number;
    client: OAuth2Client;
    spreadsheetId: string | null;
    sheets: sheets_v4.Sheets;
    data: Map<string, ICategoryFrame>;
    toastState: IToastState;
    loading: boolean;
}


class MainPage extends React.Component<{}, IMainPageState> {
    constructor(props: {}) {
        super(props);
        const client = getClientFromStorageOrRedirect();
        const spreadsheetId = localStorage.getItem(SPREADSHEET_ID);
        const sheets = google.sheets({version: "v4", auth: client});
        const data = new Map();
        const tabIndex = spreadsheetId ? CONSTANTS.TAB_INDEXES.EXPENSES : CONSTANTS.TAB_INDEXES.SETTINGS;
        const toastState: IToastState = {
            open: false,
            message: "",
            severity: "error",
        };
        this.state = {tabIndex, client, spreadsheetId, sheets, data, toastState, loading: false};
    }

    componentDidMount = async () => {
        this.resetId();
    };

    private resetId = async () => {
        if (this.state.spreadsheetId !== null) {
            this.setLoading(true);
            const data = await getAllData(this.state.sheets, this.state.spreadsheetId);
            if (data) {
                this.setState({data});
            } else {
                this.showWarningToast("Could not get data from spreadsheet, probably a network issue");
            }
            this.setLoading(false);
        }
    };

    private handleTabChange = (_: any, newValue: any) => {
        this.setState({tabIndex: newValue});
    };

    private handleSnackbarClose = (_: any, reason: string) => {
        if (reason === 'clickaway') {
            return;
        }
        let {toastState} = this.state;
        toastState.open = false;

        this.setState({toastState});
    };

    private showWarningToast = (message: string) => {
        const toastState = {
            open: true,
            message,
            severity: "warning",
        };

        this.setState({toastState});
    };

    private setLoading = (loading: boolean) => {
        this.setState({loading});
    };


    private addCategory = async (category: ICategoryLog) => {
        if (category.name === "") {
            const message = "Category empty";
            warn(message);
            return;
        }
        const categories = Array.from(this.state.data.keys());
        const index = categories.indexOf(category.name);
        if (index >= 0) {
            const message = "Category already present";
            warn(message);
            this.showWarningToast(message);
            return;
        }

        if (this.state.spreadsheetId !== null) {
            this.setLoading(true);
            if (await addCategory(this.state.sheets, this.state.spreadsheetId, category)) {
                let categories = this.state.data;
                categories.set(category.name, {category, expenses: []});
                this.setState({data: categories});
            } else {
                this.showWarningToast("Could not add category, probably a network issue.");
            }
            this.setLoading(false);
        } else {
            this.showWarningToast("Spreadsheet ID not set in settings.");
        }
    };

    private addExpense = async (expenseLog: IExpenseLog) => {
        if (this.state.spreadsheetId !== null) {
            this.setLoading(true);
            if (await addExpense(this.state.sheets, this.state.spreadsheetId, expenseLog)) {
                let data = this.state.data;
                if (data.has(expenseLog.category)) {
                    // @ts-ignore
                    data.get(expenseLog.category).expenses.push(expenseLog);
                    this.setState({data});
                }
            } else {
                this.showWarningToast("Could not add expense, probably a network issue.");
            }
            this.setLoading(false);
        } else {
            this.showWarningToast("Spreadsheet ID not set in settings.");
        }
    };

    render() {
        return (
            <div>
                <AppBar position="static">
                    <Tabs value={this.state.tabIndex} onChange={this.handleTabChange} aria-label="simple tabs example">
                        <Tab label="Expenses"
                             disabled={!this.state.spreadsheetId} {...a11yProps(CONSTANTS.TAB_INDEXES.EXPENSES)} />
                        <Tab icon={<SettingsIcon/>} {...a11yProps(CONSTANTS.TAB_INDEXES.SETTINGS)} />
                    </Tabs>
                </AppBar>
                {this.state.loading &&
                <LinearProgress/>
                }
                <Snackbar open={this.state.toastState.open} autoHideDuration={5000} onClose={this.handleSnackbarClose}>
                    <Alert onClose={this.handleSnackbarClose} severity={this.state.toastState.severity}>
                        {this.state.toastState.message}
                    </Alert>
                </Snackbar>
                <TabPanel value={this.state.tabIndex} index={CONSTANTS.TAB_INDEXES.EXPENSES}>
                    <Expenses expensesData={this.state.data} addExpense={this.addExpense}
                              addCategory={this.addCategory}/>
                </TabPanel>
                <TabPanel value={this.state.tabIndex} index={CONSTANTS.TAB_INDEXES.SETTINGS}>
                    <Settings/>
                </TabPanel>
            </div>
        );
    }

}

export default MainPage;
