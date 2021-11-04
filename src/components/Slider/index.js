import React from 'react';
import './index.css';

export default function Slider ({ value, onChange }) {
    return (
        <div className="slider-area">
            <input className="app-slider" type="range" min="0" max="100" value={value} onChange={({target}) => onChange(target.value)} />
            <div className="slider-label">
                <label>0%</label>
                <label>100%</label>
            </div>
        </div>
    )
}