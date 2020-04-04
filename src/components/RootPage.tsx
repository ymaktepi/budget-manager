import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import AuthorizationPage from "./AuthorizationPage";
import CallbackPage from "./CallbackPage";
import MainPage from "./MainPage";

class RootPage extends React.Component {

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path={"/"}>
                        <MainPage/>
                    </Route>
                    <Route path={"/auth"}>
                        <AuthorizationPage/>
                    </Route>
                    <Route path={"/callback"}>
                        <CallbackPage/>
                    </Route>
                </Switch>
            </Router>
        );
    }

}

export default RootPage;
