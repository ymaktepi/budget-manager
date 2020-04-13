import React from "react";
import {Button} from "@material-ui/core";
import {generateToken, getClientFromStorage} from "../../utils/clientUtils";
import {MainContainer} from "../common/MainContainer";
import {CardWithTitle} from "../common/Card";

class AuthorizationPage extends React.Component<any, any> {
    render = () => {
        const client = getClientFromStorage();
        if (client !== undefined) {
            window.location.replace("/");
        }
        return (
            <MainContainer>
                <CardWithTitle title={"Authorize this app"}>
                    This application uses Google Sheets to store data. You therefore need to enable this application on
                    your Google account. It will only be able to create new spreadsheets and interact with them.
                    <Button onClick={() => generateToken()} variant={"outlined"} fullWidth>
                        Authorize this application
                    </Button>
                </CardWithTitle>
            </MainContainer>
        );
    };
}

export default AuthorizationPage;