import React, { FormEventHandler } from "react";
import { FormControl } from "@mui/material";

interface Props {
    children: React.ReactNode;
    width?: string | number;
    height?: string | number;
    padding?: string | number;
    onSubmit?: FormEventHandler | undefined
}
const FormWrapper: React.FC<Props> = ({
    children: children,
    width: width,
    height: height,
    padding: padding,
    onSubmit: onSubmit
}) => {
    return(
        // Will need to add the onSubmit function
        <form onSubmit={onSubmit} style={{
            width: width,
            height: height,
            padding: padding,
        }}>
            <FormControl>
                {children}
            </FormControl>

        </form>
    )
};

export default FormWrapper;