import React from "react";
import { Button } from "@mui/material";

interface Props {
    width?: string | number;
    height?: string | number;
    padding?: string | number;
    title?: string;
    onClick?: () => void;
    children?: React.ReactNode;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    className?: string;
}

const ButtonOutlined: React.FC<Props> = ({
    width,
    height,
    padding,
    title,
    onClick,
    children,
    disabled,
    type = "button",
    className
}) => {
    return (
        <Button 
            variant="outlined" 
            onClick={onClick}
            type={type}
            disabled={disabled}
            className={className}
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