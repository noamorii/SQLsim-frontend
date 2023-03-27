import style from "./PopupTable.module.css"

const PopupTable = ({data, top, left}) => {
    const columnNames = Object.keys(data);
    const columnValues = Object.values(data);

    return (
        <div className={style.popupTableContainer} style={{top: top - 50, left: left + 30}}>
            <table>
                <thead>
                <tr>
                    {columnNames.map((columnName, index) =>
                        <th key={`${columnName}-${index}`}>{columnName}</th>
                    )}
                </tr>
                </thead>
                <tbody>
                <tr>
                    {columnValues.map((columnValue, index) =>
                        <td key={`${columnValue}-${index}`}>{columnValue}</td>
                    )}
                </tr>
                </tbody>
            </table>
        </div>);
};

export default PopupTable;
