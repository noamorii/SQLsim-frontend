import "./DataCircle.css"
import {useState} from "react";
import PopupCircleTable from "../../UI/Table/Popup/PopupCircleTable";

/**
 * DataCircle is a React component that renders a circle containing text with a popup data table on mouse enter.
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.valueObject - The data object to be displayed in the popup table.
 * @param {string} props.text - The text to be displayed inside the circle.
 * @param {number} props.top - The top position of the circle in pixels.
 * @param {number} props.left - The left position of the circle in pixels.
 * @returns {JSX.Element} A JSX element representing the circle with text and a popup table.
 */
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
