import React from 'react';
import {getNewClient, saveTokens} from "../utils/clientUtils";


class CallbackPage extends React.Component{
    componentDidMount(): void {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        console.log("code", code);
        if (!code) {
            console.log("Did not receive any code from google auth.");
            return;
        }
        getNewClient().getToken(code, (err, tokens) => {
            if (err || !tokens) {
                console.log("NO TOKENS");
            } else {
                console.log("GOT THEM TOKENS", tokens);
                saveTokens(tokens);
                window.location.replace("/");
            }
        });
    }

    render() {
        return (<p>Authenticating</p>)
    }
}

export default CallbackPage;
