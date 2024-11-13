import React from "react";
import { Button } from "@mui/material";

interface Props {
    width?: string | number;
    height?: string | number;
    padding?: string | number;
    margin?: string | number;
    marginTop?: string | number;
    marginRight?: string | number;
    marginLeft?: string | number;
    marginBottom?: string | number;
    color?: string;
    backgroundColor?: string;
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
    margin,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    color,
    backgroundColor,
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
                margin: margin,
                marginTop: marginTop,
                marginRight: marginRight,
                marginLeft: marginLeft,
                marginBottom: marginBottom,
                color: color,
                backgroundColor: backgroundColor
            }}
        >
            {children || title}
        </Button>
    );
};

export default ButtonContained;