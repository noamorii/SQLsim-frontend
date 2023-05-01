import {AGGREGATE_FUNCTIONS, BASIC_OPERATIONS, CONDITIONS, OUTPUT_MODIFICATIONS} from "../../context/DbQueryConsts";
import {MdDragHandle} from "react-icons/md";
import "./OptionsMenu.css";

const OptionsMenu = ({handleDragging}) => {

    const onDrag = (e) => {
        handleDragging(e, true);
    };

    const onDragEnd = (e) => {
        handleDragging(e, false);
    };

    const onDragStart = (e, operationType) => {
        e.dataTransfer.setData("operation", operationType);
        onDrag(e)
    };

    const renderOperationList = (label, operations) => (
        <div className="optionsContainer">
            <label>{label}:</label>
            <ul>
                {operations.map((operationType, index) => (
                    <li
                        key={index}
                        draggable={true}
                        onDragStart={(e) => onDragStart(e, operationType)}
                        onDragEnd={(e) => onDragEnd(e)}
                    >
                        <MdDragHandle />
                        {operationType}
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="menu">
            {renderOperationList('Basic operations', BASIC_OPERATIONS)}
            {renderOperationList('Output modifications', OUTPUT_MODIFICATIONS)}
            {renderOperationList('Conditions', CONDITIONS)}
            {renderOperationList('Aggregation functions', AGGREGATE_FUNCTIONS)}
        </div>
    );
};

export default OptionsMenu;