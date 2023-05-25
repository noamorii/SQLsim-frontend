import style from "./PopupTable.module.css";

/**
 * PopupCircleTable is a React functional component that renders a small popup table with a single row of data next to DataCircle.
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.data - An object containing column names and their corresponding values for the single row of data.
 * @param {number} props.top - The vertical position (in pixels) where the popup table should be displayed based on circle position.
 * @param {number} props.left - The horizontal position (in pixels) where the popup table should be displayed based on circle position.
 * @returns {JSX.Element} A JSX element representing the popup table element.
 */
const PopupCircleTable = ({data, top, left}) => {
    const columnNames = Object.keys(data);
    const columnValues = Object.values(data);

    return (
        <div className={style.popupTableContainer} style={{top: top - 50, left: left + 30}} data-testid="popup-table-container">
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

export default PopupCircleTable;
