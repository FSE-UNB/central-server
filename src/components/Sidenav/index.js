import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import './index.css';
import Button from '../Button';
import Box from '../Box';
import places from '../../config/places.json'

export default function Sidenav() {
    const location = useLocation();
    const history = useHistory();

    function checkButton(code) {
        const loc = location.pathname.substring(1);

        return code === loc;
    }

    function goTo(code) {
        history.push(`/${code}`);
    }

    return (
        <Box style={{maxWidth: 240, padding: 16}}>
            <nav className="sidenav">
                {
                    places.map(place => (
                        <Button key={place.code} onClick={() => goTo(place.code)} isSelected={checkButton(place.code)}>{place.name}</Button>
                    ))
                }
            </nav>
        </Box>
    )
}