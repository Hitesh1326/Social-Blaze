import React from 'react'
import ToolTip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

export default  ({children, onClick,btnClassName,tipClassName,tip}) =>  (
    <ToolTip title={tip} className={tipClassName}>
        <IconButton onClick={onClick} className={btnClassName}>
            {children}
        </IconButton>
    </ToolTip>
)
