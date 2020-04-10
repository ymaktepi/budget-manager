import React from "react";
import {Button} from "@material-ui/core";
import {generateToken, getClientFromStorage} from "../../utils/clientUtils";
import {MainContainer} from "../common/MainContainer";
import {MainItem} from "../common/MainItem";

class AuthorizationPage extends React.Component<any, any> {
    render = () => {
        const client = getClientFromStorage();
        if (client !== undefined) {
            window.location.replace("/");
        }
        return (
            <MainContainer>
                <MainItem title={"Authorize this app"}>
                    Authorization needed. Click here:
                    <Button onClick={() => generateToken()}>
                        GIVE AUTH LOL
                    </Button>
                </MainItem>
            </MainContainer>
        );
    };
}

export default AuthorizationPage;