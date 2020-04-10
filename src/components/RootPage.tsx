import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from "react-router-dom";
import AuthorizationPage from "./AuthorizationPage";
import CallbackPage from "./CallbackPage";
import MainPage from "./MainPage";
import {Tab, Tabs} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Settings from "./main-page/Settings";
import {a11yProps, TabPanel} from "./tabUtils";
import {Settings as SettingsIcon} from "@material-ui/icons";


const CONSTANTS = {
    TABS: ["/", "/settings", "/auth", "/callback"],
    TAB_INDEXES: {
        EXPENSES: 0,
        SETTINGS: 1,
        AUTH: 2,
        CALLBACK: 3,
    },
};

class RootPage extends React.Component {
    render() {
        return (
            <Router>
                <Route
                    path="/"
                    render={({location}) => {
                        const selectedTab = CONSTANTS.TABS.indexOf(location.pathname);
                        const hideLeftmostTabs = selectedTab < CONSTANTS.TAB_INDEXES.AUTH;
                        return (
                            <>
                                <AppBar position="static">
                                    <Tabs value={selectedTab}>
                                        <Tab label="Expenses" component={Link}
                                             to={"/"} {...a11yProps(CONSTANTS.TAB_INDEXES.EXPENSES)}/>
                                        <Tab icon={<SettingsIcon/>} component={Link}
                                             to={"/settings"}{...a11yProps(CONSTANTS.TAB_INDEXES.SETTINGS)}/>
                                        <Tab label={hideLeftmostTabs ? undefined : "Auth"}
                                             hidden={hideLeftmostTabs} {...a11yProps(CONSTANTS.TAB_INDEXES.AUTH)}/>
                                        <Tab label={hideLeftmostTabs ? undefined : "Loading"}
                                             hidden={hideLeftmostTabs} {...a11yProps(CONSTANTS.TAB_INDEXES.CALLBACK)}/>
                                    </Tabs>
                                </AppBar>
                                <Switch>
                                    <Route exact path={"/"}>
                                        <TabPanel index={CONSTANTS.TAB_INDEXES.EXPENSES}
                                                  value={selectedTab}>
                                            <MainPage/>
                                        </TabPanel>
                                    </Route>
                                    <Route path={"/settings"}>
                                        <TabPanel index={CONSTANTS.TAB_INDEXES.SETTINGS}
                                                  value={selectedTab}>
                                            <Settings/>
                                        </TabPanel>
                                    </Route>
                                    <Route path={"/auth"}>
                                        <TabPanel index={CONSTANTS.TAB_INDEXES.AUTH}
                                                  value={selectedTab}>
                                            <AuthorizationPage/>
                                        </TabPanel>
                                    </Route>
                                    <Route path={"/callback"}>
                                        <TabPanel index={CONSTANTS.TAB_INDEXES.CALLBACK}
                                                  value={selectedTab}>
                                            <CallbackPage/>
                                        </TabPanel>
                                    </Route>
                                </Switch>
                            </>
                        );
                    }}
                />
            </Router>
        );
    }

}

export default RootPage;
