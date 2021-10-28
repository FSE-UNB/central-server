import React from 'react';
import './index.css';

export default function Input({placeholder, value, setValue}) {
    return (
        <input className="app-input" placeholder={placeholder} value={value} onChange={({target}) => setValue(target.value)} />
    )
}