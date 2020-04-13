import React from "react";
import {MainContainer} from "../common/MainContainer";
import {CardWithTitle} from "../common/Card";
import {Link} from "@material-ui/core";

class PrivacyPage extends React.Component<any, any> {
    render = () => {
        return (
            <MainContainer>
                <CardWithTitle title={"Privacy Policy"}>
                    This page explains what kind of data data is collected and what we do with it.
                    The code is open-source and can be reviewed <Link href={"https://github.com/ymaktepi/budget-manager"}>here</Link>.
                </CardWithTitle>
                <CardWithTitle title={"What data is collected"}>
                    No personal data is collected. This page is merely a visualisation tool for a Google Spreadsheet. <br/>
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
            </MainContainer>
        );
    };
}

export default PrivacyPage;