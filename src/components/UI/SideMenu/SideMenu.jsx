import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {AiOutlineClose} from "react-icons/ai";
import './SideMenu.css';
import PopupUpload from "../Popup/PopupUpload";
import FromQueryForm from "./Form/FromQueryForm";
import JoinsMenu from "./Form/JoinsMenu";

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
                        <FromQueryForm/>
                        <JoinsMenu/>
                    </div>
                    <PopupUpload sideMenuStatus={sideMenu}/>
                </div>
            </div>
        </div>
    );
};

export default SideMenu;
