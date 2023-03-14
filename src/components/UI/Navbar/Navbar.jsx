import React from 'react';
import {Link} from "react-router-dom";
import style from "./Navbar.module.css"

const Navbar = () => {
    return (
        <div className={style.navbar}>
            <div className={style.navbar_links}>
                <Link to="/">Home</Link>
                <Link to="/tables">Tables</Link>
                <Link to="/editor">SQL Editor</Link>
            </div>
        </div>
    );
};

export default Navbar;
