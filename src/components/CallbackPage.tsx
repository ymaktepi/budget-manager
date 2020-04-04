import React from 'react';
import {getNewClient, saveTokens} from "../utils/clientUtils";
import {log, warn} from "../utils/simpleLogger";


class CallbackPage extends React.Component{
    componentDidMount(): void {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        if (!code) {
            warn("Did not receive any code from google auth.");
            return;
        }
        getNewClient().getToken(code, (err, tokens) => {
            if (err || !tokens) {
                warn("No tokens");
            } else {
                log("GOT THEM TOKENS", tokens);
                saveTokens(tokens);
                window.location.replace("/");
            }
        });
    }

    render() {
        return (<p>Authenticating, please wait.</p>)
    }
}

export default CallbackPage;
