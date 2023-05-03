import "./DataCircle.css"
import {useState} from "react";
import PopupCircleTable from "../../UI/Table/Popup/PopupCircleTable";

const DataCircle = ({valueObject, text, top, left}) => {
    const [showPopup, setShowPopup] = useState(false);
    return (
        <div onMouseLeave={() => setShowPopup(false)}>
            {showPopup && <PopupCircleTable data={valueObject} top={top} left={left}/>}
            <div onMouseEnter={() => setShowPopup(true)}
                 id={`circle-${text}`}
                 style={{top, left}}>
                <p>{text}</p>
            </div>
        </div>
    );
};

export default DataCircle;
