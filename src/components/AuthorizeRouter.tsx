//import React from 'react';
//import {Button} from "@material-ui/core";
//import ErrorPage from "./ErrorPage";
//import MainPage from "./MainPage";
//import {getNewClient} from "../utils/clientUtils";
//
//interface IAuthorizeRouterState {
//    isAuthNeeded: boolean;
//    client: any;
//    error: string | undefined;
//}
//
//class AuthorizeRouter extends React.Component<any, IAuthorizeRouterState>{
//    constructor(props: any) {
//        super(props);
//        const isAuthNeeded = !window.location.search;
//        const client = undefined;
//        const error = undefined;
//        this.state = {isAuthNeeded, client, error};
//    }
//
//    componentDidMount(): void {
//        console.log("CPM")
//        if (this.state.isAuthNeeded) {
//            return;
//        }
//        console.log("CPM2")
//        const url = new URL(window.location.href);
//        const code = url.searchParams.get("code");
//        console.log("code", code);
//        if (!code) {
//            this.setState({isAuthNeeded: false, error: "No code in answer from google", client: undefined});
//            return;
//        }
//        //CLIENT.getToken(code, (err, tokens) => {
//        //    if (err || !tokens) {
//        //        console.log("NO TOKENS");
//        //        this.setState({isAuthNeeded: false, error: "No token provided from google", client: undefined});
//        //    } else {
//        //        console.log("TOKENS", tokens);
//        //        CLIENT.credentials = tokens;
//        //        this.setState({isAuthNeeded: false, error: undefined, client: CLIENT})
//        //    }
//        //});
//    }
//
//    render() {
//        //if (this.state.isAuthNeeded) {
//        //    return (
//        //        <div>
//        //            Authorization needed. Click here:
//        //            <Button onClick={() => window.location.replace(AUTHORIZE_URL)}>
//        //                GIVE AUTH LOL
//        //            </Button>
//        //        </div>
//        //    );
//        //}
//        if (this.state.error) {
//            return <ErrorPage message={this.state.error}/>
//        } else {
//            console.log(typeof this.state.client);
//            return <MainPage client={this.state.client}/>
//        }
//    }
//}
//
//export default AuthorizeRouter;
export function truc() {};
