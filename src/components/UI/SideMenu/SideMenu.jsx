import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {AiOutlineClose} from "react-icons/all";
import './SideMenu.css';

const SideMenu = () => {
    const [sideMenu, setSideMenu] = useState(true);
    const showSideMenu = () => setSideMenu(!sideMenu);

    return (
        <div className="sideMenu">
            <div className={sideMenu ? "sideContent active" : "sideContent"}>
                <div className="sideMenu-toggle" onClick={showSideMenu}>
                    <Link to='#' className="menu-bars">
                        <AiOutlineClose/>
                    </Link>
                </div>
                <div className="container">
                    <p>Hello some text here:</p>
                    <div className="editor">
                        <div className="queryContainer">
                            <div className="element">FROM</div>
                            <div className="element">ELEWDWDWDLELE</div>
                            <div className="element">+</div>
                            <div className="element">ELELELE</div>
                            <div className="element">ELELELE</div>
                        </div>

                        <div className="jonsMenu">
                            <p>Joins:</p>
                            <ul>
                                <li>Inner Join</li>
                                <li>Left Join</li>
                                <li>Right Join</li>
                                <li>Outer Join</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SideMenu;
