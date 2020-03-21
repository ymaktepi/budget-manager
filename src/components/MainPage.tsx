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
import {addCategory, createSpreadsheet, getCategories} from "../utils/sheetsUtils";
import {ICategory} from "../utils/types";
import Category from "./main-page/Category";
import {warn} from "../utils/simpleLogger";

interface IMainPageState {
    value: number;
    client: OAuth2Client;
    spreadsheetId: string | null;
    sheets: sheets_v4.Sheets;
    categories: ICategory[];
}

class MainPage extends React.Component<{}, IMainPageState>{
    constructor(props: {}) {
        super(props);
        const client = getClientFromStorage();
        if (client === undefined) {
            redirectToAuth();
            return;
        }
        const spreadsheetId = localStorage.getItem("spreadsheetId");
        const sheets = google.sheets({version: "v4", auth: client});
        const categories: ICategory[] = [];
        this.state = {value: spreadsheetId?1:0, client, spreadsheetId, sheets, categories};
    }

    async componentDidMount() {
        if(this.state.spreadsheetId !== null) {
            const categories = await getCategories(this.state.sheets, this.state.spreadsheetId);
            if (categories) {
                this.setState({categories});
            } else {
                warn("could not get categories");
            }
        }
    }

    private handleTabChange = (_: any, newValue: any) => {
        this.setState({value: newValue});
    };

    private handleIdChange = (id: string) => {
        localStorage.setItem("spreadsheetId", id);
        this.setState({spreadsheetId: id});
    };

    private createSpreadsheet = async () => {
        const id = await createSpreadsheet(this.state.sheets);
        if (id) {
            this.setState({spreadsheetId: id});
        }
    };

    private addCategory = async (category: ICategory) => {
        const index = this.state.categories.map(cat => cat.name).indexOf(category.name);
        // category already exists
        if (index >= 0 || category.name === "") {
            warn("Category already present");
            return;
        }
        if(this.state.spreadsheetId !== null) {
            if (await addCategory(this.state.sheets, this.state.spreadsheetId, category)) {
                let categories = this.state.categories.slice();
                categories.push(category);
                console.log(categories);
                this.setState({categories});
            }
        }
    };

    render() {
       return (
           <div >
               <AppBar position="static">
                   <Tabs value={this.state.value} onChange={this.handleTabChange} aria-label="simple tabs example">
                       <Tab icon={<SettingsIcon/>} {...a11yProps(0)} />
                       {
                           this.state.spreadsheetId && (<Tab label="Expenses" {...a11yProps(1)} />)
                       }
                       {
                           this.state.spreadsheetId && (<Tab label="Categories" {...a11yProps(2)} />)
                       }
                   </Tabs>
               </AppBar>
               <TabPanel value={this.state.value} index={0}>
                   <Settings id={this.state.spreadsheetId} onIdChange={this.handleIdChange} createSpreadsheet={this.createSpreadsheet}/>
               </TabPanel>
               {
                   this.state.spreadsheetId && (
                       <TabPanel value={this.state.value} index={1}>
                           Expenses
                       </TabPanel>
                   )}
               {
                   this.state.spreadsheetId && (
                       <TabPanel value={this.state.value} index={2}>
                           <Category categories={this.state.categories} addCategory={this.addCategory}/>
                       </TabPanel>
                   )
               }
           </div>
       );
    }

}

export default MainPage;
