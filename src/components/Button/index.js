import React from 'react'
import './index.css'

export default function Button({children, isSelected = false, onClick, style}) {
    return (
        <button onClick={onClick} style={style} className={`app-button ${isSelected ? 'button-selected' : ''}`}>
            {children}
        </button>
    )
}