import {Grid, Typography} from "@material-ui/core";
import React from "react";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import "./main-layout.css";

export const CardWithTitle = (props: any) => {
    const {children, title} = props;
    return (
        <Card>
            <div className={"bottom-margin"}>
                <CardTitle title={title}/>
            </div>
            {children}
        </Card>
    );
};

CardWithTitle.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string.isRequired,
};

export const Card = (props: any) => {
    const {children} = props;
    return (
        <Grid item xs={12} sm={6} md={4}>
            <Paper className={"tile"}>
                {children}
            </Paper>
        </Grid>
    );
};

Card.propTypes = {
    children: PropTypes.node,
};

export const CardTitle = (props: any) => {
    const {title} = props;
    return (
        <Typography variant={"h5"}>
            {title}
        </Typography>
    );
};

CardTitle.propTypes = {
    title: PropTypes.string.isRequired,
};
