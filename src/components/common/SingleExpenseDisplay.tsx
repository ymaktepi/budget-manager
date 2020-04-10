import PropTypes from "prop-types";
import React from "react";
import {Grid} from "@material-ui/core";

export const SingleExpenseDisplay = (props: any) => {
    const {name, amount} = props;
    return (
        <React.Fragment >
            <Grid item xs={3} style={{textAlign: "right"}}>{amount}</Grid>
            <Grid item xs={1}/>
            <Grid item xs={8}>{name}</Grid>
        </React.Fragment>
    );

};

SingleExpenseDisplay.propTypes = {
    name: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    //key: PropTypes.any.isRequired,
};