import React, { useContext } from 'react';
import './Navbar.css';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../shared/context/auth-context';


const Navbar = () => {
    const auth = useContext(AuthContext);
    return (
        <ul className="nav-links">
            {
                auth.isLoggedIn && 
                <li>
                    <NavLink to={`/vacations/`}>Vacations</NavLink>
                </li>
            }
            {
                auth.isLoggedIn && 
                <li>
                    <NavLink to={`/my-vacations`}>My Vacations</NavLink>
                </li>
            }
            {
                auth.isLoggedIn && 
                <li>
                    <NavLink to="/add-vacation">Add Vacation</NavLink>
                </li>
            }
            {
                !auth.isLoggedIn &&
                <li>
                    <NavLink to="/register">Register</NavLink>
                </li>
            }
            {
                !auth.isLoggedIn &&   
                <li>
                    <NavLink to="/login">Login</NavLink>
                </li>
            }
            {
                auth.isLoggedIn &&
                <li>
                    <button onClick={auth.logout}>Logout</button>
                </li>
            }
        </ul>
    );
};

export default Navbar;
