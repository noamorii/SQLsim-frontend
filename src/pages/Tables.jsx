import DatabaseDiagram from "../components/visualisation/diagram/DatabaseDiagram";
import SideMenu from "../components/form/fromQuery/menu/SideMenu";

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
