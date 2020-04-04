import React from "react";
import {getClientFromStorage, redirectToAuth} from "../utils/clientUtils";
import {google, sheets_v4} from "googleapis";
import {Tab} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import AppBar from "@material-ui/core/AppBar";
import {a11yProps, TabPanel} from "./tabUtils";
import {OAuth2Client} from "google-auth-library";
import Settings from "./main-page/Settings";
import SettingsIcon from '@material-ui/icons/Settings';
import {addCategory, addExpense, createSpreadsheet, getAllData} from "../utils/sheetsUtils";
import {ICategoryFrame, ICategoryLog, IExpenseLog} from "../utils/types";
import {warn} from "../utils/simpleLogger";
import Expenses from "./main-page/expenses/Expenses";

const CONSTANTS = {
    TAB_INDEXES: {
        EXPENSES: 0,
        SETTINGS: 1,
    },
};

interface IMainPageState {
    tabIndex: number;
    client: OAuth2Client;
    spreadsheetId: string | null;
    sheets: sheets_v4.Sheets;
    data: Map<string, ICategoryFrame>;
}

const SPREADSHEET_ID = "spreadsheetId";

class MainPage extends React.Component<{}, IMainPageState>{
    constructor(props: {}) {
        super(props);
        const client = getClientFromStorage();
        if (client === undefined) {
            redirectToAuth();
            return;
        }
        const spreadsheetId = localStorage.getItem(SPREADSHEET_ID);
        const sheets = google.sheets({version: "v4", auth: client});
        const data = new Map();
        const tabIndex = spreadsheetId ? CONSTANTS.TAB_INDEXES.EXPENSES : CONSTANTS.TAB_INDEXES.SETTINGS;
        this.state = {tabIndex: tabIndex, client, spreadsheetId, sheets, data};
    }

    async componentDidMount() {
        this.resetId();
    }

    private resetId = async () => {
        if(this.state.spreadsheetId !== null) {
            const data = await getAllData(this.state.sheets, this.state.spreadsheetId);
            if (data) {
                this.setState({data});
            }
        }
    };

    private handleTabChange = (_: any, newValue: any) => {
        this.setState({tabIndex: newValue});
    };

    private handleIdChange = async (id: string) => {
        localStorage.setItem(SPREADSHEET_ID, id);
        this.setState({spreadsheetId: id});
        this.resetId();
    };

    private createSpreadsheet = async () => {
        const id = await createSpreadsheet(this.state.sheets);
        if (id) {
            this.setState({spreadsheetId: id});
        }
    };

    private addCategory = async (category: ICategoryLog) => {
        if (category.name === "") {
            warn("Category already present");
            return;
        }
        const categories = Array.from(this.state.data.keys());
        const index = categories.indexOf(category.name);
        if (index >= 0) {
            warn("Category already present");
            return;
        }

        if(this.state.spreadsheetId !== null) {
            if (await addCategory(this.state.sheets, this.state.spreadsheetId, category)) {
                let categories = this.state.data;
                categories.set(category.name, {category, expenses: []});
                this.setState({data: categories});
            }
        }
    };

    private addExpense = async (expenseLog: IExpenseLog) => {
        if(this.state.spreadsheetId !== null) {
            if(await addExpense(this.state.sheets, this.state.spreadsheetId, expenseLog)) {
                let data = this.state.data;
                if(data.has(expenseLog.category)) {
                    // @ts-ignore
                    data.get(expenseLog.category).expenses.push(expenseLog);
                    this.setState({data});
                }
            }
        }
    };

    render() {
        return (
            <div >
                <AppBar position="static">
                    <Tabs value={this.state.tabIndex} onChange={this.handleTabChange} aria-label="simple tabs example">
                        <Tab label="Expenses" disabled={!this.state.spreadsheetId} {...a11yProps(CONSTANTS.TAB_INDEXES.EXPENSES)} />
                        <Tab icon={<SettingsIcon/>} {...a11yProps(CONSTANTS.TAB_INDEXES.SETTINGS)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={this.state.tabIndex} index={CONSTANTS.TAB_INDEXES.EXPENSES}>
                    <Expenses expensesData={this.state.data} addExpense={this.addExpense} addCategory={this.addCategory}/>
                </TabPanel>
                <TabPanel value={this.state.tabIndex} index={CONSTANTS.TAB_INDEXES.SETTINGS}>
                    <Settings id={this.state.spreadsheetId} onIdChange={this.handleIdChange} createSpreadsheet={this.createSpreadsheet}/>
                </TabPanel>
            </div>
        );
    }

}

export default MainPage;
