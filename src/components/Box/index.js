import React from 'react';
import './index.css'

export default function Box({children, style, onClick, className}) {
    return (
        <div className={`box ${className}`} style={style} onClick={onClick ? () => onClick() : null}>
            {children}
        </div>
    )
}