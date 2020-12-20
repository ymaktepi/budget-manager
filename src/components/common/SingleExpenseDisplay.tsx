import PropTypes from "prop-types";
import React from "react";
import {Grid, Tooltip} from "@material-ui/core";

export const SingleExpenseDisplay = (props: any) => {
    const {name, amount, date} = props;
    return (
            <>
                <Grid item xs={3} style={{textAlign: "right"}}>{amount}</Grid>
                <Grid item xs={1}/>
                <Grid item xs={8}>
                    <Tooltip title={date.toLocaleString()}>
                        <span>
                            {name}
                        </span>
                    </Tooltip>
                </Grid>
            </>
    );

};

SingleExpenseDisplay.propTypes = {
    name: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
};