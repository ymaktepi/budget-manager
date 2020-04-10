import {Grid} from "@material-ui/core";
import React from "react";
import Paper from "@material-ui/core/Paper";
import "./main-layout.css";

export const MainItem = (props: any) => {
    const {children} = props;
    return (
        <Grid item xs={12} sm={6} md={4}>
            <Paper className={"tile"}>
                {children}
            </Paper>
        </Grid>
    );
};
