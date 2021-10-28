import React from 'react';
import './index.css';

export default function Checkbox({label, isSelected, setSelected}) {
    return (
        <div className="app-checkbox">
            <div className={`checkbox-box ${isSelected ? 'checkbox-selected' : ''}`} onClick={setSelected} />
            <label className="checkbox-label" >{label}</label>
        </div>
    )
}