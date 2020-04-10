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
                    Authorization needed. Click here:
                    <Button onClick={() => generateToken()}>
                        GIVE AUTH LOL
                    </Button>
                </CardWithTitle>
            </MainContainer>
        );
    };
}

export default AuthorizationPage;