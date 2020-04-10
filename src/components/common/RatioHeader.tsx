import PropTypes from "prop-types";
import React from "react";
import {Box, Typography} from "@material-ui/core";
import {CardTitle} from "./Card";

export const RatioHeader = (props: any) => {
    const {title, totalAmount, usedAmount} = props;
    return (
        <Box display={"flex"} flexDirection={"row"} className={"bottom-margin"}>
            <Box display={"flex"} flexDirection={"column"} className={"title-ratio"} justifyContent={"center"}>
                <Typography className={"text-centered"}>
                    {Math.round(usedAmount)}
                </Typography>
                <div className={"divider div-transparent"}/>
                <Typography className={"text-centered"}>
                    {Math.round(totalAmount)}
                </Typography>
            </Box>
            <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                <CardTitle title={title}/>
            </Box>
        </Box>
    );
};

RatioHeader.propTypes = {
    title: PropTypes.string.isRequired,
    totalAmount: PropTypes.number.isRequired,
    usedAmount: PropTypes.number.isRequired,
};