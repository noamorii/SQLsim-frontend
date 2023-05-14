import DatabaseDiagram from "../components/visualisation/diagram/DatabaseDiagram";
import SideMenu from "../components/form/fromQuery/menu/SideMenu";
import style from "./Tables.module.css"

const Tables = () => {

    return (
        <div className={style.tableContainer}>
            <DatabaseDiagram/>
            <SideMenu/>
        </div>
    );
};

export default Tables;
