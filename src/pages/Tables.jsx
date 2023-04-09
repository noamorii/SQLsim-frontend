import DatabaseDiagram from "../components/visualisation/DatabaseDiagram";
import PopupUpload from "../components/UI/Popup/PopupUpload";
import SideMenu from "../components/UI/SideMenu/SideMenu";
import './Tables.css'

const Tables = () => {

    return (
        <div>
            <div className="tableContainer">
                <DatabaseDiagram/>
                <SideMenu/>
            </div>
            <PopupUpload/>
        </div>

    );
};

export default Tables;
