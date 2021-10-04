import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

// Components 
import Navbar from './Navbar';

const Header = () => {
    return (
        <header className="main-header">
            <h1 className="main-navigation__title">
                <Link to="/">Vacations</Link>
            </h1>
            <nav>
                <Navbar />
            </nav>
        </header>
    );
};

export default Header;