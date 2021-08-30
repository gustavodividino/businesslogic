import React from "react";
import numeral from 'numeral';

export const FormatNumber = ({ format, children }) =>{

    return (
        <span>
            {
                numeral(children).format(format)
            }
        </span>
    )
}