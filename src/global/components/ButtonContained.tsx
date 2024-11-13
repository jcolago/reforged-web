import React from "react";
import { Button } from "@mui/material";

interface Props {
    width?: string | number;
    height?: string | number;
    padding?: string | number;
    marginTop?: string | number;
    marginLeft?: string |number;
    title?: string;
    onClick?: () => void;
    children?: React.ReactNode;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    className?: string;
}

const ButtonContained: React.FC<Props> = ({
    width,
    height,
    padding,
    marginLeft,
    marginTop,
    title,
    onClick,
    children,
    disabled,
    type = "button",
    className
}) => {
    return (
        <Button 
            variant="contained" 
            onClick={onClick}
            type={type}
            disabled={disabled}
            className={className}
            style={{
                width: width,
                height: height,
                padding: padding,
                marginTop: marginTop,
                marginLeft: marginLeft
            }}
        >
            {children || title}
        </Button>
    );
};

export default ButtonContained;