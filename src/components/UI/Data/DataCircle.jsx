import "./DataCircle.css"
import {useState} from "react";
import PopupTable from "../Table/PopupTable";

const DataCircle = ({ valueObject, text, top, left }) => {
    const [showPopup, setShowPopup] = useState(false);
    return (
        <div>
            {showPopup && <PopupTable data={valueObject} />}
            <div onMouseEnter={() => setShowPopup(true)}
                 onMouseLeave={() => setShowPopup(false)}
                 id={`circle-${text}`}
                 style={{top, left}}>
                <p>{text}</p>
            </div>
        </div>

    );
};

export default DataCircle;
