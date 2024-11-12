import React from "react";
import { Button } from "@mui/material";

interface Props {
    width?: string | number;
    height?: string | number;
    padding?: string | number;
    title?: string;
    onClick?: () => void;  // Added onClick handler
    children?: React.ReactNode;  // Added children prop
}

const ButtonContained: React.FC<Props> = ({
    width,
    height,
    padding,
    title,
    onClick,
    children
}) => {
    return (
        <Button 
            variant="contained" 
            onClick={onClick}
            style={{
                width: width,
                height: height,
                padding: padding,
            }}
        >
            {children || title}
        </Button>
    );
};

export default ButtonContained;