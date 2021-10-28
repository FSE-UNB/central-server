import React from 'react';
import './index.css';

export default function Modal({children, show, modalClose}) {
    return show ? (
        <div className="modal-area">
            <div onClick={modalClose} className="backdrop"/>
            <div className="modal">
                {children}
            </div>
        </div>
    ) : (
        <></>
    )
}