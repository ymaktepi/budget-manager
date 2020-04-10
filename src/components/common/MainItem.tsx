import {Grid, Typography} from "@material-ui/core";
import React from "react";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import "./main-layout.css";

export const MainItem = (props: any) => {
    const {children, title} = props;
    return (
        <Grid item xs={12} sm={6} md={4}>
            <Paper className={"tile"}>
                <div className={"bottom-margin"}>
                    <Typography variant={"h5"}>
                        {title}
                    </Typography>
                </div>
                {children}
            </Paper>
        </Grid>
    );
};

MainItem.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string.isRequired,
};