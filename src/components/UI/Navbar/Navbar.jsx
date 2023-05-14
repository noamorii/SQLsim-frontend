import React from 'react';
import {Link} from "react-router-dom";
import style from "./Navbar.module.css"

/**
 * Navbar is a component that renders the navigation bar with links to different routes.
 *
 * @component
 * @returns {JSX.Element} A JSX element representing the navigation bar.
 */
const Navbar = () => {
    return (
        <div className={style.navbar}>
            <div className={style.logo}>
                <Link to="/">SQL Simulator</Link>
            </div>
            <div className={style.navbar_links}>
                <Link to="/">Home</Link>
                <Link to="/tables">Tables</Link>
                <Link to="/editor">SQL Editor</Link>
            </div>
        </div>
    );
};

export default Navbar;
