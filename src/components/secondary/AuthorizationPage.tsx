import React from "react";
import {Button} from "@material-ui/core";
import {generateToken, getClientFromStorage} from "../../utils/clientUtils";

class AuthorizationPage extends React.Component<any, any> {
    render() {
        const client = getClientFromStorage();
        if (client !== undefined) {
            window.location.replace("/");
        }
        return (
            <div>
                Authorization needed. Click here:
                <Button onClick={() => generateToken()}>
                    GIVE AUTH LOL
                </Button>
            </div>
        );
    }
}

export default AuthorizationPage;