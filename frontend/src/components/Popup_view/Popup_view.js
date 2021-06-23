import React from 'react';
import './Popup_view.css';

const Popupc = ({ onClose = () => {} , children}) => {
    return(
        <div className = "modal">
            <div className = "modal-container">
               <button className = "close" onClick = {onClose}>close</button>
               <div className = "content">{children}</div>
            </div>

        </div>
    )
}

export default Popupc
