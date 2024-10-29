import React from "react";
import { Button } from "@mui/material";

interface Props {
    width?: string | number;
    height?: string | number;
    padding?: string | number;
    title?: string;
}

const GlobalButton: React.FC<Props> = ({
    width: width,
    height: height,
    padding: padding,
    title: title
}) => {
    return(
        <Button variant="contained" style={{
            width: width,
            height: height,
            padding: padding,
        }}>
        {title}
    </Button>
    );
};

export default GlobalButton;