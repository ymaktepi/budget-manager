import {Grid} from "@material-ui/core";
import React from "react";

export const MainContainer = (props: any) => {
    const {children} = props;
    return (
        <Grid container spacing={3} alignItems={"baseline"} direction={"row"}>
            {children}
        </Grid>
    );
};
