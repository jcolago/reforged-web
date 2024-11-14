import React, { FormEventHandler } from "react";

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
            
                {children}
            

        </form>
    )
};

export default FormWrapper;