import React from 'react';

import './Navbar.css'; // Import the CSS file for styling
import ConnectWallet from '../connectwallet/ConnectWallet';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <a href="/" className="navbar-logo">Numeros</a>
            </div>
            <div className="navbar-right">
             <ConnectWallet/>
            </div>
        </nav>
    );
};

export default Navbar;
