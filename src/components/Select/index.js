import React from 'react';
import './index.css';

export default function Select({options, value, setValue}) {
    return (
        <select className="app-select" value={value} onChange={({target}) => setValue(target.value)} >
            {
                options.map(option => (
                    <option value={option.code} >{option.name}</option>
                ))
            }
        </select>
    )
}