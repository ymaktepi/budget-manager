import React from "react";

interface IErrorPageProps {
    message: string;
}

class ErrorPage extends React.Component<IErrorPageProps, any> {

    render() {
        return (
            <div>
                Error, could not authorize.
                {this.props.message}
            </div>
        );
    }

}

export default ErrorPage;