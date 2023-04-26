import DatabaseDiagram from "../components/visualisation/DatabaseDiagram";
import SideMenu from "../components/UI/SideMenu/SideMenu";

const Tables = () => {

    return (
        <div>
            <div className="tableContainer">
                <DatabaseDiagram/>
                <SideMenu/>
            </div>
        </div>

    );
};

export default Tables;
