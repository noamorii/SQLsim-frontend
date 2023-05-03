import "./DataCircle.css"
import {useState} from "react";
import PopupTable from "../../UI/Table/Popup/PopupTable";

const DataCircle = ({valueObject, text, top, left}) => {
    const [showPopup, setShowPopup] = useState(false);
    return (
        <div onMouseLeave={() => setShowPopup(false)}>
            {showPopup && <PopupTable data={valueObject} top={top} left={left}/>}
            <div onMouseEnter={() => setShowPopup(true)}
                 id={`circle-${text}`}
                 style={{top, left}}>
                <p>{text}</p>
            </div>
        </div>
    );
};

export default DataCircle;
