import React, { MouseEventHandler } from "react";
import { Button } from "@mui/material";

interface Props {
    width?: string | number;
    height?: string | number;
    padding?: string | number;
    title?: string;
    onClick?: MouseEventHandler | undefined;
}

const ButtonContained: React.FC<Props> = ({
    width: width,
    height: height,
    padding: padding,
    title: title,
    onClick: onClick
}) => {
    return(
        <Button onClick={onClick} variant="contained" style={{
            width: width,
            height: height,
            padding: padding,
        }}>
        {title}
    </Button>
    );
};

export default ButtonContained;