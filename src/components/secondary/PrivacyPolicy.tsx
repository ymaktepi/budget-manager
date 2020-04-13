import React from "react";
import {MainContainer} from "../common/MainContainer";
import {CardWithTitle} from "../common/Card";
import {Link} from "@material-ui/core";

class PrivacyPage extends React.Component<any, any> {
    render = () => {
        return (
            <MainContainer>
                <CardWithTitle title={"Privacy Policy"}>
                    This page explains what kind of data data is collected and what we do with it.<br/>
                    The code is open-source and can be reviewed <Link
                    href={"https://github.com/ymaktepi/budget-manager"}>here</Link>.
                </CardWithTitle>
                <CardWithTitle title={"What data is collected"}>
                    No personal data is collected. This page is merely a visualisation tool for a private Google
                    Spreadsheet. <br/>
                    We only log the following data:
                    <ul>
                        <li>Time and date of access to the website;</li>
                        <li>Browser name and version;</li>
                        <li>Page that is being accessed.</li>
                    </ul>
                </CardWithTitle>
                <CardWithTitle title={"What we do with this data"}>
                    The logging is there to eventually debug when users encounter errors. We probably
                    won't bother looking at it though.
                </CardWithTitle>
                <CardWithTitle title={"Why does this application need to be authorized?"}>
                    This application needs to be enabled on your Google account because it uses Google Sheets as a
                    database.
                    What this application can do is basically create spreadsheets and then edit and delete them. It
                    cannot
                    edit or delete spreadsheets that were not created by this application.
                    What does this application will do with data:
                    <ul>
                        <li>Create a spreadsheet to store your expenses;</li>
                        <li>Add expenses and categories to it;</li>
                        <li>When "Archiving" expenses, it will duplicate two sheets inside the spreadsheet (current
                            categories and expenses) and then clear the current expenses.
                        </li>
                    </ul>
                    Your expenses are only stored in a private Google Spreadsheet, and they only transit between
                    Google's servers and your browser, using HTTPS.
                </CardWithTitle>
            </MainContainer>
        );
    };
}

export default PrivacyPage;