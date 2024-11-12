import React from "react";
import { Button } from "@mui/material";

interface Props {
    width?: string | number;
    height?: string | number;
    padding?: string | number;
    title?: string;
    onClick?: () => void;
    children?: React.ReactNode;
}

const ButtonOutlined: React.FC<Props> = ({
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

export default ButtonOutlined;