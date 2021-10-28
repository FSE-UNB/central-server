import React from 'react';
import './index.css'

export default function Box({children, style}) {
    return (
        <div className="box" style={style}>
            {children}
        </div>
    )
}