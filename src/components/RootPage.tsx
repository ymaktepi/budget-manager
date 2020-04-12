import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from "react-router-dom";
import AuthorizationPage from "./secondary/AuthorizationPage";
import CallbackPage from "./secondary/CallbackPage";
import MainPage from "./main-page/MainPage";
import {LinearProgress, Snackbar, Tab, Tabs} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Settings from "./settings/Settings";
import {a11yProps, TabPanel} from "./tabUtils";
import {Settings as SettingsIcon} from "@material-ui/icons";
import {Alert as MuiAlert} from "@material-ui/lab";


const CONSTANTS = {
    TABS: ["/", "/settings", "/auth", "/callback"],
    TAB_INDEXES: {
        EXPENSES: 0,
        SETTINGS: 1,
        AUTH: 2,
        CALLBACK: 3,
    },
};

export interface IUIUtils {
    setLoading: (loading: boolean) => void;
    showWarningToast: (message: string) => void;
    showSuccessToast: (message: string) => void;
}

function Alert(props: any) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface IToastState {
    open: boolean;
    message: string;
    severity: string;
}

interface IRootPageState {
    toastState: IToastState;
    loading: boolean;
}

class RootPage extends React.Component<{}, IRootPageState> {
    constructor(props: {}) {
        super(props);
        const toastState: IToastState = {
            open: false,
            message: "",
            severity: "error",
        };
        this.state = {toastState, loading: false};
    }

    private handleSnackbarClose = (_: any, reason: string) => {
        if (reason === 'clickaway') {
            return;
        }
        let {toastState} = this.state;
        toastState.open = false;

        this.setState({toastState});
    };

    private showWarningToast = (message: string) => {
        const toastState = {
            open: true,
            message,
            severity: "warning",
        };

        this.setState({toastState});
    };

    private showSuccessToast = (message: string) => {
        const toastState = {
            open: true,
            message,
            severity: "success",
        };

        this.setState({toastState});
    };

    private setLoading = (loading: boolean) => {
        this.setState({loading});
    };

    render = () => {
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
                                {this.state.loading &&
                                <LinearProgress/>
                                }
                                <Snackbar open={this.state.toastState.open} autoHideDuration={5000}
                                          onClose={this.handleSnackbarClose}>
                                    <Alert onClose={this.handleSnackbarClose} severity={this.state.toastState.severity}>
                                        {this.state.toastState.message}
                                    </Alert>
                                </Snackbar>
                                <Switch>
                                    <Route exact path={"/"}>
                                        <TabPanel index={CONSTANTS.TAB_INDEXES.EXPENSES}
                                                  value={selectedTab}>
                                            <MainPage setLoading={this.setLoading}
                                                      showSuccessToast={this.showSuccessToast}
                                                      showWarningToast={this.showWarningToast}/>
                                        </TabPanel>
                                    </Route>
                                    <Route path={"/settings"}>
                                        <TabPanel index={CONSTANTS.TAB_INDEXES.SETTINGS}
                                                  value={selectedTab}>
                                            <Settings setLoading={this.setLoading}
                                                      showSuccessToast={this.showSuccessToast}
                                                      showWarningToast={this.showWarningToast}/>
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
    };
}

export default RootPage;
