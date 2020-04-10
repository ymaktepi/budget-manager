import React from "react";
import {getClientFromStorageOrRedirect} from "../utils/clientUtils";
import {google, sheets_v4} from "googleapis";
import {OAuth2Client} from "google-auth-library";
import {addCategory, addExpense, getAllData} from "../utils/sheetsUtils";
import {ICategoryFrame, ICategoryLog, IExpenseLog} from "../utils/types";
import {warn} from "../utils/simpleLogger";
import Expenses from "./main-page/expenses/Expenses";
import {SPREADSHEET_ID} from "./constants";
import {IUIUtils} from "./RootPage";

interface IMainPageProps extends IUIUtils {
}

interface IMainPageState {
    client: OAuth2Client;
    spreadsheetId: string | null;
    sheets: sheets_v4.Sheets;
    data: Map<string, ICategoryFrame>;
}

class MainPage extends React.Component<IMainPageProps, IMainPageState> {
    constructor(props: IMainPageProps) {
        super(props);
        const client = getClientFromStorageOrRedirect();
        const spreadsheetId = localStorage.getItem(SPREADSHEET_ID);
        const sheets = google.sheets({version: "v4", auth: client});
        const data = new Map();

        this.state = {client, spreadsheetId, sheets, data};
    }

    componentDidMount = async () => {
        this.resetId();
    };

    private resetId = async () => {
        if (this.state.spreadsheetId !== null) {
            this.props.setLoading(true);
            const data = await getAllData(this.state.sheets, this.state.spreadsheetId);
            if (data) {
                this.setState({data});
            } else {
                this.props.showWarningToast("Could not get data from spreadsheet, probably a network issue");
            }
            this.props.setLoading(false);
        }
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
            const message = "Category already exists";
            warn(message);
            this.props.showWarningToast(message);
            return;
        }

        if (this.state.spreadsheetId !== null) {
            this.props.setLoading(true);
            if (await addCategory(this.state.sheets, this.state.spreadsheetId, category)) {
                let categories = this.state.data;
                categories.set(category.name, {category, expenses: []});
                this.setState({data: categories});
            } else {
                this.props.showWarningToast("Could not add category, probably a network issue.");
            }
            this.props.setLoading(false);
        } else {
            this.props.showWarningToast("Spreadsheet ID not set in settings.");
        }
    };

    private addExpense = async (expenseLog: IExpenseLog) => {
        if (this.state.spreadsheetId !== null) {
            this.props.setLoading(true);
            if (await addExpense(this.state.sheets, this.state.spreadsheetId, expenseLog)) {
                let data = this.state.data;
                if (data.has(expenseLog.category)) {
                    // @ts-ignore
                    data.get(expenseLog.category).expenses.push(expenseLog);
                    this.setState({data});
                }
            } else {
                this.props.showWarningToast("Could not add expense, probably a network issue.");
            }
            this.props.setLoading(false);
        } else {
            this.props.showWarningToast("Spreadsheet ID not set in settings.");
        }
    };

    render() {
        return (
            <Expenses expensesData={this.state.data} addExpense={this.addExpense}
                      addCategory={this.addCategory}/>
        );
    }

}

export default MainPage;
